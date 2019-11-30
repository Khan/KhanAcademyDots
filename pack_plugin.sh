#!/bin/bash

# Creates a zip archive that can be published in chrome:
# https://chrome.google.com/webstore/developer
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
PACKAGE_NAME=${REPO_NAME}-${version}

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

sed 's/module.exports/\/\/module.exports/' translation-assistant/lib/translation-assistant.js > KhanAcademyLibs/translation-assistant.js

rm -rf .git/ README.md pack_plugin.sh translation-assistant/
if [[ $browser = 'chrome' ]];then
  # We need to exclude Firefox-specific manifest entries
  grep -v -e gecko -e browser_specific_settings manifest.json > tmp
  mv tmp manifest.json
fi
zip -r $PACKAGE_NAME.zip *
mv $PACKAGE_NAME.zip ../
cd ..

rm -rf $PACKAGE_NAME
