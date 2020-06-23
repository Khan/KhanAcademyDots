#!/bin/bash

# Creates a zip archive that can be published in chrome:
# https://chrome.google.com/webstore/developer/dashboard
# or Firefox
# https://addons.mozilla.org/en-US/developers/addon/khan-academy-dots/edit

if [[ -z $1 ]];then
  echo "Please, provide browser name (firefox|chrome) as the parameter to this script"
  exit 1
fi

if [[ $1 != "chrome" && $1 != "firefox" ]];then
  echo "Unrecognized browser!"
  echo "Please use \"firefox\" of \"chrome\""
  exit 1
fi

browser=$1
# Don't forget to bump version in manifest.json before each official publish!
version=$(grep '"version"' manifest.json | awk -F'"' '{print $4}')
REPO_NAME=KhanAcademyDots
PACKAGE_NAME=${REPO_NAME}-${version}-${browser}

cd ../

rm -rf $PACKAGE_NAME.zip

if [[ -e $PACKAGE_NAME ]];then
  rm -r $PACKAGE_NAME
fi

if [[ ! -d $REPO_NAME ]];then
   echo "ERROR: Directory $REPO_NAME does not exist!"
   exit 1
fi

cp -r $REPO_NAME $PACKAGE_NAME

cd $PACKAGE_NAME
if [[ $? -ne 0 ]];then
   echo "ERROR: Could not enter dir ../$PACKAGE_NAME"
   exit 1
fi

#sed 's/module.exports/\/\/module.exports/' translation-assistant/lib/math-translator.js > KhanAcademyLibs/math-translator.js
# Get rid of module.exports, which is not supported in browser plugins
nlines=$(grep -n 'module.exports' translation-assistant/lib/math-translator.js | awk -F":" '{print $1;end}')
let nlines--
head -n $nlines translation-assistant/lib/math-translator.js > KhanAcademyLibs/math-translator.js

rm -rf .git/ *.md pack_plugin.sh translation-assistant/
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
cd ..

rm -rf $PACKAGE_NAME
