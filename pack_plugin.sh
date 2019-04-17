#!/bin/bash

# Creates a zip archive that can be publish in chrome:
# https://chrome.google.com/webstore/developer
# or Firefox
# https://addons.mozilla.org/en-US/developers/addon/khan-academy-dots/edit

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

rm -rf .git README.md pack_plugin.sh
zip -r $PACKAGE_NAME.zip *
mv $PACKAGE_NAME.zip ../
cd ..

rm -rf $PACKAGE_NAME
