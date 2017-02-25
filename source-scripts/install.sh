#!/bin/sh

# This is the source install script
#
# MAC AND LINUX:
#   Just open up your terminal and type:
#
#     curl https://sourcewifi.com | sh
#
#   Currently supports:
#    - Linux: x86 and x86_64 systems
#
###########

# TODO: run ping and if not output, then output error message
# wget -q --tries=10 --timeout=5 --spider http://google.com
# if [[ $? -eq 0 ]]; then
#  echo "Online"
# else
#  echo "Offline"
#  exit
# fi

# Install node, hostapd, dnsmasq
sudo apt-get -y update
sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get -y install nodejs
sudo apt-get -y install npm
sudo apt-get -y install hostapd
sudo apt-get -y install dnsmasq

# TODO: this should not require password - need public release
git clone https://github.com/sourcewifi/source-router
sudo cp source-router/source-config/dnsmasq.conf /etc/dnsmasq.conf
sudo cp source-router/source-config/hosts /etc/hosts
sudo cp source-router/source-config/hostapd.conf /etc/hostapd/hostapd.conf
sudo cp source-router/source-config/interfaces /etc/network/interfaces

# Project dependencies; run a subprocesses
sudo npm --prefix ./source-router/source-firewall install
(cd source-router/source-firewall; sudo npm link)
(cd source-router/source-server; sudo npm link source-firewall)
sudo npm --prefix ./source-router/source-server install

# IPv4 packet forwarding
sudo sed -i '/#net.ipv4.ip_forward=1/c\net.ipv4.ip_forward=1' /etc/sysctl.conf

# hostpad daemon
sudo sed -i '/#DAEMON_CONF=""/c\DAEMON_CONF="/etc/hostapd/hostapd.conf"' /etc/default/hostapd

# Bring up hostapd, dnsmasq
sudo service dnsmasq start
sudo service hostapd start
sudo ifconfig wlan0 192.168.24.1
sudo service dnsmasq restart
sudo service hostapd restart

sudo npm --prefix ./source-router/source-server start
