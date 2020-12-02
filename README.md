# Cryptobox


| Branch        | Travis           | GitHub  |
| :------------- |:-------------|:-----|
| MASTER        |[![Build Status](https://travis-ci.org/bnh6/cryptobox.svg?branch=master)](https://travis-ci.org/bnh6/cryptobox)| ![testing on all PUSH and PR](https://github.com/bnh6/cryptobox/workflows/Cryptobox%20CI/badge.svg?branch=master) |
| DEV           |[![Build Status](https://travis-ci.org/bnh6/cryptobox.svg?branch=dev)](https://travis-ci.org/bnh6/cryptobox)      |   ![testing on all PUSH and PR](https://github.com/bnh6/cryptobox/workflows/Cryptobox%20CI/badge.svg?branch=dev)|


testing dynamic tag:
```{r, echo=FALSE, eval=TRUE, results="asis"}
travis_url <- "https://travis-ci.org/bnh6/cryptobox.svg?branch="
shield <- paste0("[![Build Status](",
                 travis_url,
                 system("git rev-parse --abbrev-ref HEAD", intern = TRUE),
                 ")](https://travis-ci.org/bnh6/cryptobox)")
cat(shield)
```

Cryptobox is a desktop and mobile application (future), cloud agnostic solution to preserve privacy. 

In short, it allows the user to mount a virtual volume from a given folder, enabling the user to interact with unecrypted files only while the cloud provider only see the encrypted version of the same folder. 

Because it is totally cloud agnostic (we mean it!), it can be used with any cloud provider. In fact, Cryptobox can be used to encrypt files within the local disk as well, a cloud provider it is not required to use cryptbox.


Features:
 - Encrypt files individually, so cloud providers don't need to synchronize the entire folder everytime a file is changed.
 - Encrypt both file content file/folder name, therefore none information is leaked about the data.
 - It automatically unmount the volume after no active (idle) for X minutes.
 - Store user's password on Keystore (for mac -linux and windows under dev), so user just need to type its password once.


# Development details
Requirements:
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
