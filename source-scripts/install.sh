# Get root privileges
sudo -i

# TODO: run ping and if not output, then output error message

# Install node, hostapd, dnsmasq
apt-get -y update
apt-get -y install nodejs
apt-get -y install npm
apt-get -y install hostapd
apt-get -y install dnsmasq

# TODO: Update node and npm -- why are the latest versions not being installed above?

# Distribute configuration files
# TODO: this should not require password - need public release
git clone https://github.com/sourcewifi/source-router
cp source-router/source-config/dnsmasq.conf /etc/dnsmasq.conf
cp source-router/source-config/hosts /etc/hosts
cp source-router/source-config/hostapd.conf /etc/hostapd/hostapd.conf
cp source-router/source-config/interfaces /etc/network/interfaces

# Project dependencies; run a subprocesses
# TODO: link needs to be run directly in the directory
cd source-router/source-firewall
npm install
sudo npm link
cd ..
cd ..

cd source-router/source-server
npm link source-firewall
npm install
cd ..
cd ..

# IPv4 packet forwarding
sed -i '/#net.ipv4.ip_forward=1/c\net.ipv4.ip_forward=1' /etc/sysctl.conf

# hostpad daemon
sed -i '/#DAEMON_CONF=""/c\DAEMON_CONF="/etc/hostapd/hostapd.conf"' /etc/default/hostapd

# Bring up hostapd, dnsmasq
service dnsmasq start
service hostapd start
(cd source-router/source-server && npm start)

# Would be nice to find a way around this
ifconfig wlan0 192.168.24.1

# Get node server to start on boot
# echo "sudo node ~/source-firewall/server.js" > rc.local
# Restart and serve portal; TODO: is this necessary?
# reboot