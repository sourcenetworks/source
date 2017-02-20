# !/bin/bash


# @TODO

# Ask for input (or do this before and not include it as part of the setup script)
# (what OS is on the client, what OS on router, what is hardware on the router)

# Check operating system to see if need to install any special stuff
# -> if Linux (execute command)


# ------


# Check if nmap is installed, else install nmap using homebrew.
brew install nmap

# Find local IP Address
IPADDR=$(ifconfig  | grep 'inet '| grep -v '127.0.0.1' | cut -f2 -d' '| awk '{ print $1}')
echo 'Your IP Address:' $IPADDR

# Search Local Subnet
ALLOWED=$(echo $IPADDR | cut -f1-3 -d '.')
LOCALIP_SUBSTRING=.0/24
ALLOWED+=$LOCALIP_SUBSTRING


# Find RPi3's address, assuming name is default 'raspberrypi'
RASPWITH=$(nmap -sn $ALLOWED | grep 'raspberrypi' | cut -f2 -d'(')
echo $RASPWITH
RASP=${RASPWITH%?}
echo 'Your RPi3 IP address:' $RASP


# http://sharadchhetri.com/2010/12/07/how-to-use-expect-in-bash-script/
USER="pi"
PASS="raspberry"
CMD=$@
XYZ=$(expect -c "
spawn ssh $USER@$RASP
expect "password:"
send "$PASS\r"
expect "\$"
send "$CMD\r"
expect "\$"
send "exit"
")

# @TODO
# --> Enter SSH info from the router
# -------> Once SSH'ed in set up rsa dsa key gen
# -------> Correctly cmod stuff (if this stuff has not already been setup before)


# SCP the install file onto the computer
source ./install.sh

source ./gethsetup.sh


# ------

# Assume that Raspberry Pi has SSH enabled -> https://www.raspberrypi.org/documentation/remote-access/ssh/
# Need to add this!!!

# ----------


# --> find whatever the router IP and or raspberry pi IP (need this info for SCP and SSH'ing)
# --> Decide what files are going to be scp'ed and what still needs to be executed thru command line (once files are on router)

# --> geth should be setup thru a script, source-router should be SCP'ed??

# Link to source-router setup (the thing that Joe will create)
# Link to gethsetup.sh (thing that I did)
# Link to git-pull-cron.sh (over the air updates that we implement to update the router software)

echo 'Yay, setup all done'


# ----------
# OpenWRT and DDWRT

# Iterate through the different passwords/admin words for that shit
# Each OS may have a different set up/admin combo

# -> Raspberry Pi: https://www.raspberrypi.org/documentation/remote-access/ssh/
# -> OpenWRT: https://wiki.openwrt.org/doc/howto/firstlogin



