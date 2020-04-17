# Cryptobox


| Branch        | Travis           | GitHub  |
| :------------- |:-------------|:-----|
| MASTER        |[![Build Status](https://travis-ci.org/bnh6/cryptobox.svg?branch=master)](https://travis-ci.org/bnh6/cryptobox)| ![testing on all PUSH and PR](https://github.com/bnh6/cryptobox/workflows/testing%20on%20all%20PUSH%20and%20PR/badge.svg?branch=master) |
| DEV           |[![Build Status](https://travis-ci.org/bnh6/cryptobox.svg?branch=dev)](https://travis-ci.org/bnh6/cryptobox)      |   ![testing on all PUSH and PR](https://github.com/bnh6/cryptobox/workflows/testing%20on%20all%20PUSH%20and%20PR/badge.svg?branch=dev)|

Cryptobox is a desktop and mobile application (future) cloud agnistic solution to preserve privacy. In short, it mounts a virtual volume where the user interecat with unecrypted files, while the cloud provider only see encrypted filesoutside of the virtual volume. 

Because it is totally cloud agnostic (we mean it), it can be used with any cloud provider, in fact Cryptobox can be used to encrypt files within the local disk as well, a cloud provider it is not required to use cryptbox.


Features:
 - Encrypt files individually, so cloud providers dont need to synchorised the entire folder everytime a file is changed
 - Encrypt both file content as well as file and folder names, so not information is leaked about the data.
 - It automatically unmount the volume after no active (idle) for X minutes
 - Store user's password on Keystore (for mac, linux and windows under dev), so customer just need to type its password once.


# Development details
Requiremets:
 - homebrew \
    `$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
 - encfs \
    `brew install encfs`
 - npm  \
    `brew install node`


## Project structure
```
cryptobox/
├─ src/
│  ├─ main/
│  │  └─ index.js
│  ├─ renderer/     -> UI scripts 
│  └─ scripts/      -> backend scripts
└─ static/          -> UI pages
   ├─ resources/    -> static resources, eg images and icons
   ├─ ui/           -> html files

```

## How to run
```
npm install
npm start
```

## How to build the .app
```
npm build
```
