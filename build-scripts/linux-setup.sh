#!/usr/bin/env bash

set -xeuo pipefail
id
sudo apt install -y libsecret-1-dev
sudo apt install -y cryfs encfs
sudo apt install -y gnome-keyring
# sudo apt install -y python-gnomekeyring # trying to install gnomekeyring python module 
# export DISPLAY=:99.0;
# export DISPLAY=:0.0
# sudo apt install gnupg2 pass
sudo apt install dbus-x11
NO_AT_BRIDGE=1;
eval $(dbus-launch --sh-syntax);
eval $(echo -n "" | /usr/bin/gnome-keyring-daemon --login);
eval $(/usr/bin/gnome-keyring-daemon --components=secrets --start);
# /usr/bin/python -c "import gnomekeyring;gnomekeyring.create_sync('login', '');";
pip3 install keyring
dbus-run-session -- sh
gnome-keyring-daemon --unlock
sudo apt install python3-venv libdbus-glib-1-dev
cd /tmp
pyvenv py3
source py3/bin/activate
pip install -U pip
pip install secretstorage dbus-python
pip install keyring
python -c "import keyring; keyring.get_keyring(); keyring.set_password('system', 'username', 'password');"
# https://github.com/vladimiry/ElectronMail/blob/aefc6654181f5ec47429fdaa889468fa2edb0645/.travis.yml#L60-L66
# export DISPLAY=:.0
# xhost +
# sudo apt install pass
# gpg2  --batch  --gen-key # get generated key
# gpg --list-keys
# pass init -p /tmp # testing random folder
# sudo apt install cryfs
