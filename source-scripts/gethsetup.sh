#!/bin/bash
# source-pi-geth-setup-script

# Do we want to git clone any repos??


# Assuming we have already SSH'ed into a device

# This is only set up to work on an RPi3 no flow control

wget https://storage.googleapis.com/golang/go1.7.5.linux-armv6l.tar.gz
tar -C /usr/local -xzf go1.7.5.linux-armv6l.tar.gz

# Need to do this http://askubuntu.com/questions/148421/how-to-programmatically-edit-a-file-using-only-terminal

sed -i 'export PATH=$PATH:/usr/local/go/bin' "$HOME/.profile"
sed -i 'export GOPATH=$HOME/work' "$HOME/.profile"

cd GOPATH
mkdir -p src/hello
cd src/hello

sed -i 'package main' "./hello.go"
sed -i 'import \"fmt\"' "./hello.go"
sed -i 'func main() {\"' "./hello.go"
sed -i 'fmt.Printf(\"hello, world\n\")' "./hello.go"
sed -i '}' "./hello.go"

go install src/hello
$GOPATH/bin/hello

# Checking if Go has been properly installed
echo "Output should be -hello, world"

# Installing Geth Light Client
wget https://gethstore.blob.core.windows.net/builds/geth-linux-arm7-1.5.8-f58fb322.tar.gz
tar -xzf geth-linux-arm7-1.5.8-f58fb322.tar.gz

# Create symlink for $HOME/geth-linux-arm7-1.5.8-f58fb322
ln -s $HOME/geth-linux-arm7-1.5.8-f58fb322/ /usr/bin
geth --help
geth --light

# Set default port and open up to a specific set of IP Addresses
# http://stackoverflow.com/questions/18648345/saving-awk-output-to-variable
# https://www.cyberciti.biz/tips/read-unixlinux-system-ip-address-in-a-shell-script.html
# http://www.thegeekstuff.com/2013/06/cut-command-examples
# http://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO-5.html

IPADDR=$(ifconfig  | grep 'inet '| grep -v '127.0.0.1' | cut -f2 -d' '| awk '{ print $1}')
echo 'Your IP Address:' $IPADDR
ALLOWED=$(echo $IPADDR | cut -f1-3 -d '.')
LOCALIP_SUBSTRING=.0/24

# Edit string to Make open to all local
ALLOWED+=$LOCALIP_SUBSTRING

echo 'IP Addresses allowed to use geth node:' $ALLOWED

# Since we want all the IPs on our local domain, we want
geth --rpcaddr $ALLOWED

# Need to create accounts and

