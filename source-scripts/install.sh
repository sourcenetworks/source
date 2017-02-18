# Get root privileges
sudo -i

# Install node, hostapd, dnsmasq
apt-get -y update
apt-get -y install nodejs, npm, hostapd, dnsmasq

# Distribute configuration files
git clone https://github.com/sourcewifi/source-router
cp source-router/source-config/dnsmasq.conf /etc/dnsmasq.conf
cp source-router/source-config/hosts /etc/hosts
cp source-router/source-config/hostapd.conf /etc/hosts/hostpad.conf
cp source-router/source-config/interfaces /etc/network/interfaces

# Project dependencies; run a subprocesses
(cd source-server && npm install)
(cd source-firewall && npm install)

# Start install
sudo ifdown wlan0

# IPv4 packet forwarding
sed -i '/#net.ipv4.ip_forward=1/c\net.ipv4.ip_forward=1' /etc/sysctl.conf

# hostpad daemon
sed -i '/#DAEMON_CONF=""/c\DAEMON_CONF="/etc/hostapd/hostapd.conf"' /etc/default/hostapd

# Finish install
sudo ifup wlan0

# Bring up hostapd, dnsmasq
service dnsmasq start
service hostapd start

# Get node server to start on boot
# echo "sudo node ~/source-firewall/server.js" > rc.local
# Restart and serve portal; TODO: is this necessary?
# reboot
