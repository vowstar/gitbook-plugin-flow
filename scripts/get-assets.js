var fs = require('fs');
var path = require('path');

var download = require('./download');

var PACKAGE_JSON_PATH = path.join(__dirname, '../package.json');
var flowchartVersion = require(PACKAGE_JSON_PATH).flowchartVersion;
var raphaelVersion = require(PACKAGE_JSON_PATH).raphaelVersion;

var ASSETS_DIR_PATH = path.join(__dirname, '../assets');
var FLOWCHART_PATH = path.join(ASSETS_DIR_PATH, 'flowchart.min.js');
var RAPHAEL_PATH = path.join(ASSETS_DIR_PATH, 'raphael.min.js');

var FLOWCHART_URL = 'https://cdnjs.cloudflare.com/ajax/libs/flowchart' + '/' + flowchartVersion + '/flowchart.min.js';
var RAPHAEL_URL = 'https://cdnjs.cloudflare.com/ajax/libs/raphael' + '/' + raphaelVersion + '/raphael.min.js';

console.log('Downloading flowchart version ' + flowchartVersion);
download(FLOWCHART_URL, FLOWCHART_PATH, true);
console.log('Downloading raphael version ' + raphaelVersion);
download(RAPHAEL_URL, RAPHAEL_PATH, true);



