#!/usr/bin/python

import base64
from os import environ
from os.path import expanduser,isfile
import re


#force 
home = expanduser('~')

username = environ.get('ARTIFACTORY_USERNAME')
password = environ.get('ARTIFACTORY_PASSWORD')

rawCredentials = username + ':' + password
encodedCredentials = base64.b64encode(bytes(rawCredentials))

npmrcPath = home + r'/.npmrc'

hasRegistryLine = False
hasAuthLine = False
hasAlwaysAuthLine = False
if isfile(npmrcPath):
    with open(npmrcPath) as npmrcFile:
        for line in npmrcFile:
            if re.search('registry.*', line):
                hasRegistryLine = True
            if re.search('_auth.*', line):
                hasAuthLine = True
            if re.search('always-auth.*', line):
                hasAlwaysAuthLine = True

with open(npmrcPath, 'a+') as npmrcFile:
    if not hasRegistryLine:
        npmrcFile.write('registry=https://artifacts.werally.in/artifactory/api/npm/npm\n')
    if not hasAlwaysAuthLine:
        npmrcFile.write('always-auth=true\n')
    if hasAuthLine:
        print 'npmrc already contains "_auth" value. skipping'
        print 'if you are unable to restore packages, delete your ~/.npmrc and run this script again'
    else:
        npmrcFile.write('_auth=' + encodedCredentials + '\n')
    print '.npmrc configured'
