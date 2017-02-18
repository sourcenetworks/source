# Get root privileges
sudo -i

# Install node, hostapd, dnsmasq
apt-get -y update
apt-get -y install nodejs, npm, hostapd, dnsmasq

# Distribute configuration files
git clone # TODO put repo link here
cp source-config/dnsmasq.conf /etc/dnsmasq.conf
cp source-config/hosts /etc/hosts
cp source-config/hostapd.conf /etc/hosts/hostpad.conf
cp source-config/interfaces /etc/network/interfaces

# IPv4 packet forwarding
sed -i '/#net.ipv4.ip_forward=1/c\net.ipv4.ip_forward=1' /etc/sysctl.conf

# hostpad daemon
sed -i '/#DAEMON_CONF=""/c\DAEMON_CONF="/etc/hostapd/hostapd.conf"' /etc/default/hostapd

# Get node server to start on boot
echo "sudo node ~/source-firewall/server.js" > rc.local

# Restart and serve portal
reboot
