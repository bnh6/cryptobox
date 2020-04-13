#!/bin/bash

# set -uo pipefail
# trap 's=$?; echo "$0: Error on line "$LINENO": $BASH_COMMAND"; exit $s' ERR
# IFS=$'\n\t'
set -ex

VERSION="0.1"
APPNAME=$(node -p "require('./package.json').productName")
PATH=$(npm bin):$PATH

echo $PWD

electron-packager . \
--asar \
--executable-name="$APPNAME" \
--app-version="$npm_package_version" \
--build-version="$npm_package_version" \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon="./resources/cloud-enc.icns" \
--prune=true \
--out=release-builds \
--darwin-dark-mode-support 


REL_FILE=$(find . -type d -name "$APPNAME.app")
echo "file created is $REL_FILE"
