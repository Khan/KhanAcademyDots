#!/bin/bash

REPO_NAME=KhanAcademyDots
TMP_REPO=temp_repo

cd ../

rm -rf $REPO_NAME.zip

if [[ -e $TMP_REPO ]];then
   echo "ERROR: Directory $TMP_REPO already exists!"
   exit 1
fi

if [[ ! -d $REPO_NAME ]];then
   echo "ERROR: Directory $REPO_NAME does not exist!"
   exit 1
fi

cp -r $REPO_NAME $TMP_REPO

cd $TMP_REPO
if [[ $? -ne 0 ]];then
   echo "ERROR: Could not enter dir ../$TMP_REPO"
   exit 1
fi

rm -rf .git README.md package_plugin.sh
cd ..
zip -r $REPO_NAME.zip $TMP_REPO
rm -rf $TMP_REPO
