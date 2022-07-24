#!/bin/bash

# Creates a zip archive that can be published in chrome:
# https://chrome.google.com/webstore/developer/dashboard
# or Firefox
# https://addons.mozilla.org/en-US/developers/addon/khan-academy-dots/edit

set -euo pipefail
set -x

browser=${1-}
if [[ -z $browser ]];then
  echo "USAGE: ./pack_plugin.sh <firefox|chrome>"
  exit 1
fi

if [[ $browser != "chrome" && $browser != "firefox" ]];then
  echo "Unrecognized browser!"
  echo "Please use \"firefox\" of \"chrome\""
  exit 1
fi

# Don't forget to bump version in manifest.json before each official publish!
version=$(grep '"version"' manifest.json | awk -F'"' '{print $4}')
if [[ -z $version ]];then
  echo "ERROR: Could not determine version"
  exit 1
fi

PACKAGE_NAME=KhanAcademyDots-${version}-${browser}

rm -rf $PACKAGE_NAME.zip $PACKAGE_NAME
mkdir $PACKAGE_NAME

cp *js *html *png *gif manifest.json $PACKAGE_NAME
cp -r 3rdPartyLibs KhanAcademyLibs $PACKAGE_NAME

# Get rid of module.exports and babel requires,
# which are not supported in browser plugins
nlines=$(grep -n 'module.exports' translation-assistant/lib/math-translator.js | awk -F":" '{print $1;end}')
let nlines--
head -n $nlines translation-assistant/lib/math-translator.js |\
 egrep -v 'require(.+)' > $PACKAGE_NAME/KhanAcademyLibs/math-translator.js

cd $PACKAGE_NAME
zip -r ../${PACKAGE_NAME}.zip *

rm -r ../$PACKAGE_NAME
