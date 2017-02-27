#!/bin/sh

# This is the source install script
#
# Usage: curl sourcewifi.com/install.sh | sudo sh
#
#   Currently supports:
#     Raspbian 4.4
#

# TODO: update for versioning
install_requirements () {
  sudo apt-get -y update

  PGK_OK=$(dpkg -s nodejs | grep "install ok installed")
  if [ "" = "$PKG_OK" ]; then
    sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
    sudo apt-get -y install nodejs
  fi

  PGK_OK=$(dpkg -s npm | grep "install ok installed")
  if [ "" = "$PKG_OK" ]; then
    sudo curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
    sudo apt-get -y install npm
  fi

  PGK_OK=$(dpkg -s hostpad | grep "install ok installed")
  if [ "" = "$PKG_OK" ]; then
    sudo apt-get -y install hostapd
  fi

  PGK_OK=$(dpkg -s dnsmasq | grep "install ok installed")
  if [ "" = "$PKG_OK" ]; then
    sudo apt-get -y install dnsmasq
  fi
}

install_source () {
  git clone https://github.com/sourcenetworks/source
  sudo cp source/conf/dnsmasq.conf /etc/dnsmasq.conf
  sudo cp source/conf/hosts /etc/hosts
  sudo cp source/conf/hostapd.conf /etc/hostapd/hostapd.conf
  sudo cp source/conf/interfaces /etc/network/interfaces

  sudo npm --prefix ./source/lib/source-firewall install
  (cd source/lib/source-firewall; sudo npm link)
  (cd source/server; sudo npm link source-firewall)
  sudo npm --prefix ./source/server install

  # IPv4 packet forwarding
  sudo sed -i '/#net.ipv4.ip_forward=1/c\net.ipv4.ip_forward=1' /etc/sysctl.conf

  # hostpad daemon
  sudo sed -i '/#DAEMON_CONF=""/c\DAEMON_CONF="/etc/hostapd/hostapd.conf"' /etc/default/hostapd
}

start_services () {
  sudo service dnsmasq start
  sudo service hostapd start
  sudo ifconfig wlan0 192.168.24.1
  sudo service dnsmasq restart
  sudo service hostapd restart
}

main () {
  # TODO: fix
  PGK_OK=$(dpkg -s hostapd | grep "install ok installed")
  if [ "" = "$PKG_OK" ]; then
    install_requirements
  fi

  install_source
  start_services
}

main
