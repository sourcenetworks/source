import Source from '@sourcenetworks/background-lib';
import Promise from 'bluebird';
import Models from './models';
import request from 'https';

const { Client, Provider, Session, TimeSlice} = Models();

var addresses;
var web3;
const BYTES_IN_A_GIG = 1000000000;
const GLOBAL_FEE_USD = 3; // $3 per GB -> what is the 1 price

// Currency constants

module.exports = {

  // Function that sets up their shit
  createAccount(password) {
    Source.generateMnemonic(password).
    then(mnemonic => Source.recoverKeystore(password, mnemonic)).
    then(data => {
      data.keystore.generateNewAddress(data.pwDerivedKey, 5);
      return data.keystore.getAddresses().map(addr => `0x${addr}` );
    });
  }

  connectProvider(password, mnemonic, url) {
    addresses = Source.recoverKeystore(password, mnemonic)).
    then(data => return data.keystore.getAddresses());

    if (!url) {
      url = 'https://ropsten.infura.io/3hH8tgdKIa5RFvXCXRkG';
    }

    const engine = Source.createProvider({
      rpcUrl: url, // We'll have to check for this
      getAccounts: (callback) => {
        return callback(null, addresses);
      },
      approveTransaction: (txData, callback) => {
        return callback(null, true);
      },
      signTransaction: (txData, callback) => {
        return signTransaction(txData, password)
        .then(signedTx => callback(null, signedTx));
      },
    });

    const web3 = new Web3(engine);

    return new Promise((resolve, reject) => {
      web3.net.getListening((err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve({ web3 });
      });
    });
  }

  // Get transactions to current block and return the amount
  getTransactionToRouter(to, from) {
    var to = addresses[0];

    // Scans transactions to the current block
    var txs = Source.scanBlockCallback(web3, web3.eth.blockNumber, to, from, undefined);

    if (txs[0] === undefined) {
      return null;
    } else if (txs.length > 1){
      // @TODO -> I don't really know what to do here
      return txs[0].txn; // The ethereum that was passed
    } else {
      return txs[0].txn; // The ethereum that was passed
    }
  }

  // @NOTE Needs to be expanded to accept arbitrary payments and currencies
  ethToBytes(ethAmount) {
    var eth_ratio = getEthToCurrencyRatio('eth', 'usd');
    var total_usd = ethAmount * eth_ratio;
    return (total_usd/GLOBAL_FEE_USD) * BYTES_IN_A_GIG;;
  }

}

function getTokenToCurrencyRatio(token, fiat) {
  const options = {
    hostname: 'coinmarketcap-nexuist.rhcloud.com',
    port: '443',
    path: '/api/' + token,
    method: 'GET',
  }

  const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    var ethData = JSON.parse(d);
    return ethData.price[fiat];
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.end();
}
