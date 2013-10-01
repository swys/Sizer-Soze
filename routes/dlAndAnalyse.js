var downloader = require('./downloader.js'),
	getDimensions = require('./getDimensions.js'),
	writeHook = require('../../writeHook/index.js'),
	https = require('https'),
	fs = require('fs'),
	rosebud = {},
	urls = ['https://github-camo.global.ssl.fastly.net/4d670b404676927ab953876b7f50811284a649a4/687474703a2f2f737562737461636b2e6e65742f696d616765732f646e6f64652e706e67', 'https://github-camo.global.ssl.fastly.net/da881d7ab5e9ae8fdcd4f6a11a999a8040d00930/687474703a2f2f737562737461636b2e6e65742f696d616765732f6d63696c726f792e706e67'];

rosebud['dirName'] = process.cwd() + '/images';
rosebud['imageURLs'] = urls;
rosebud['dimensions'] = {};
rosebud['downloadImgsCB'] = function(rosebud) {
	console.log("Finished Downoading Images!!!!");
	console.dir(rosebud.dimensions);
};

fs.mkdirSync(rosebud.dirName);
downloader(rosebud, rosebud.downloadImgsCB);
getImgDimensions(rosebud);

function getImgDimensions(rosebud) {
	getDimensions(rosebud, rosebud['downloadImgsCB']);
}





