var request = require('request'),
	fs = require('fs'),
	path = require('path'),
	urlFormat = require('url'),
	watercolor = require('watercolor'),
	errStream = watercolor({
		color : 'red'
	}),
	successStream = watercolor({
		color : 'green'
	});

module.exports = function downloader(scrape) {
	var opts = {
			flags: 'w',
			encoding: null,
			mode: 0666
		};
	scrape.finCount = scrape.imageURLs.length;
	scrape._downloadcb = _cb;
	scrape.imgFileNames = [];
	scrape.errImgFiles = [];
	scrape.fileCount = 0;

	scrape.imageURLs.forEach(function(url) {
		download(url, scrape);
	});
	
	function download(url, scrape) {
		var fileType = path.extname(url),
			filename = 'image_' + (scrape.fileCount += 1) + '(' + path.basename(url, fileType) + ')' + fileType,
			fullPath = path.join(scrape.dirName, filename);

		console.log("URL is : ", url);
		ws = fs.createWriteStream(fullPath, opts);

		ws.on('error', function(err) {
			errStream.write("Got Err : ", err + "\n");
			scrape._downloadcb({file : fullPath, url : url, error : err},null, scrape);
		});
		ws.on('close', function() {
			successStream.write("__FINISHED WRITING " + filename + "__\n");
			//console.log("__FINISHED WRITING " + filename + "__");
			scrape._downloadcb(null, fullPath, scrape);
		});

		request.get(url).pipe(ws);
	}

	errStream.pipe(process.stderr);
	successStream.pipe(process.stdout);

	function _cb(err, filename, scrape) {
		if (err) {
			scrape.errImgFiles.push(err);
			scrape.finCount -= 1;
		} else {
			scrape.imgFileNames.push(filename);
			console.log("Got Callback that " + filename + " is finished!!!!");
			console.log((scrape.finCount -= 1) + " images left to download");
		}
		if (scrape.finCount === 0) {
			scrape.downloadImgsCB(scrape);
		}
	}
};
