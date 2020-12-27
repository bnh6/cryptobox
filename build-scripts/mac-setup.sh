#!/usr/bin/env bash

set -xeuo pipefail

csrutil status
id

#  sudo xcode-select --reset
if (csrutil status | grep -isq " enabled"); then
    echo "SIP is enabled, not installing CryFS nor EncFS"
else
    echo "SIP is disabled :)"
    brew install --cask osxfuse
    brew install cryfs
fi

npm install 
npm run build
npm run install-impl
