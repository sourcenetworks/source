import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

// @Todo: Change to just a UserSchema -> make it some shit

export default ProviderSchema = new Schema({
  name: String,
  email: { type: String, required: true, index: {unique: true } },
  password: { type: String, required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  phone_number: String,
  verified: Boolean,
  mnemonic: String,
  ethereum_addresses: [String],
  ethereum_privatekeys: [String],
  devices: [{
    MACAddress: String,
    model: String,
    type: String,
  }],
});

ProviderSchema.pre('save', function(next) {
  var provider = this;

  if ((!provider.isModified)) then return next();

  bcypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if (err) return next(err);

    bcrypt.hash(provider.password, salt, function(err, hash){
      if (err) return next(err);

      provider.password = hash;
      next();
    });
  });
});

ProviderSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb (null, isMatch);
  });
};

// expose enum on the model
ProviderSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

ProviderSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

ProviderSchema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ email: email }, function(err, provider) {
        if (err) return cb(err);

        // make sure the user exists
        if (!provider) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (provider.isLocked) {
            // just increment login attempts if account is already locked
            return provider.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        provider.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!provider.loginAttempts && !provider.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return provider.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            provider.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};
