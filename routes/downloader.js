var request = require('request'),
	fs = require('fs'),
	path = require('path'),
	urlFormat = require('url'),
	fileCount = 0,
	finished = [];
	
// TODO :
// Need to add a directory for every site queried
// Files are named as generic file_1 file_2, probably want
// to convert the original path into a valid file name

module.exports = function downloader(urlList, dirName, cb) {
	var opts = {
			flags: 'w',
			encoding: null,
			mode: 0666
		};

	urlList.forEach(function(url) {
		download(url, _cb);
	});
	
	function download(url, _cb) {
		var fileType = path.extname(url),
			pathName = urlFormat.parse(url),
			filename = 'file_' + (fileCount += 1) + '(' + path.basename(url, fileType) + ')' + fileType,
			ws;

		console.log("URL is : ", url);
		ws = fs.createWriteStream(dirName + path.sep + filename, opts);
		ws.on('error', function(err) {
			console.log("Got Error : ", err);
			_cb({file : filename, url : url, error : err},null, cb);
		});
		ws.on('close', function() {
			console.log("__FINISHED WRITING " + filename + "__");
			_cb(null, filename, cb);
		});

		request.get(url).pipe(ws);
	}
	function _cb(err, filename, cb) {
		if (err) {
			cb(err, null);
		} else {
			finished.push(filename);
			console.log("Got Callback that " + filename + " is finished!!!!");
			console.log(urlList.length - finished.length + " left to download");
			if (urlList.length === finished.length) {
				cb(null, 'dumb da dumb dumb dum!!!!');
			}
		}
	}
};
