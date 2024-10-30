#!/usr/bin/env node
/*jshint esversion: 8 */

const path = require('path');
const fs = require('fs');
const download = require('./download');

const PACKAGE_JSON_PATH = path.join(__dirname, '../package.json');
const { flowchartVersion, raphaelVersion } = require(PACKAGE_JSON_PATH);

const ASSETS_DIR_PATH = path.join(__dirname, '../assets');
const assets = [
  {
    name: 'Flowchart',
    path: path.join(ASSETS_DIR_PATH, 'flowchart.min.js'),
    version: flowchartVersion,
    url: `https://cdnjs.cloudflare.com/ajax/libs/flowchart/${flowchartVersion}/flowchart.min.js`,
    verFile: path.join(ASSETS_DIR_PATH, 'flowchart')
  },
  {
    name: 'Raphael',
    path: path.join(ASSETS_DIR_PATH, 'raphael.min.js'),
    version: raphaelVersion,
    url: `https://cdnjs.cloudflare.com/ajax/libs/raphael/${raphaelVersion}/raphael.min.js`,
    verFile: path.join(ASSETS_DIR_PATH, 'raphael')
  }
];

if (!fs.existsSync(ASSETS_DIR_PATH)) {
  fs.mkdirSync(ASSETS_DIR_PATH, { recursive: true });
}

async function downloadAssets() {
  for (const asset of assets) {
    console.info(`Downloading ${asset.name} version ${asset.version}...`);
    try {
      if (!fs.existsSync(asset.verFile) || !fs.existsSync(asset.path)) {
        await download(asset.url, asset.path, true);
        try {
          const time = new Date();
          fs.utimesSync(asset.verFile, time, time);
        } catch (err) {
          fs.closeSync(fs.openSync(asset.verFile, 'w'));
        }
        console.info(`${asset.name} version ${asset.version} download complete.`);
      } else {
        console.info(`${asset.name} version ${asset.version} is already up to date.`);
      }
    } catch (error) {
      console.error(`Failed to download ${asset.name} version ${asset.version}:`, error);
    }
  }
}

downloadAssets().catch(error => console.error('Error during downloads:', error));
