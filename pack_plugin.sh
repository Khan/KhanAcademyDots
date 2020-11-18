#!/bin/bash

# Creates a zip archive that can be published in chrome:
# https://chrome.google.com/webstore/developer/dashboard
# or Firefox
# https://addons.mozilla.org/en-US/developers/addon/khan-academy-dots/edit

set -eou pipefail

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
REPO_NAME=KhanAcademyDots
PACKAGE_NAME=${REPO_NAME}-${version}-${browser}

cd ../ || exit 1

rm -rf $PACKAGE_NAME.zip

if [[ -e $PACKAGE_NAME ]];then
  rm -r $PACKAGE_NAME
fi

if [[ ! -d $REPO_NAME ]];then
   echo "ERROR: Directory $REPO_NAME does not exist!"
   exit 1
fi

if [[ -d $PACKAGE_NAME ]];then
  rm -rf $PACKAGE_NAME
fi

cp -r $REPO_NAME $PACKAGE_NAME

cd $PACKAGE_NAME || exit 1
if [[ $? -ne 0 ]];then
   echo "ERROR: Could not enter dir ../$PACKAGE_NAME"
   exit 1
fi

# Get rid of module.exports and babel requires,
# which are not supported in browser plugins
nlines=$(grep -n 'module.exports' translation-assistant/lib/math-translator.js | awk -F":" '{print $1;end}')
let nlines--
head -n $nlines translation-assistant/lib/math-translator.js |\
 egrep -v 'require(.+)' > KhanAcademyLibs/math-translator.js

rm -rf node_modules/ package.json package-lock.json .eslintrc .git/ *.md pack_plugin.sh translation-assistant/
if [[ $browser = 'chrome' ]];then
  # We need to exclude Firefox-specific manifest entries
  grep -v -e gecko -e browser_specific_settings manifest.json > tmp
  # More chrome specific things
  sed -i 's/"persistent": true/"persistent": false/' tmp
  sed -i 's/browser_style/chrome_style/' tmp
  mv tmp manifest.json
fi
zip -r $PACKAGE_NAME.zip *
mv $PACKAGE_NAME.zip ../
cd .. || exit 1

rm -rf $PACKAGE_NAME
