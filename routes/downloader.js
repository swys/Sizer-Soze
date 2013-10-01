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

module.exports = function downloader(rosebud, done) {
	var opts = {
			flags: 'w',
			encoding: null,
			mode: 0666
		};
	rosebud.downloadImgsCB = done;
	rosebud.finCount = rosebud.imageURLs.length;
	rosebud._downloadcb = _cb;
	rosebud.imgFileNames = [];
	rosebud.errImgFiles = [];
	rosebud.fileCount = 0;

	rosebud.imageURLs.forEach(function(url) {
		download(url, rosebud);
	});
	
	function download(url, rosebud) {
		var fileType = path.extname(url),
			filename = 'image_' + (rosebud.fileCount += 1) + '(' + path.basename(url, fileType) + ')' + fileType,
			fullPath = path.join(rosebud.dirName, filename);

		console.log("URL is : ", url);
		ws = fs.createWriteStream(fullPath, opts);

		ws.on('error', function(err) {
			errStream.write("Got Err : ", err + "\n");
			rosebud._downloadcb({file : fullPath, url : url, error : err},null, rosebud);
		});
		ws.on('close', function() {
			successStream.write("__FINISHED WRITING " + filename + "__\n");
			//console.log("__FINISHED WRITING " + filename + "__");
			rosebud._downloadcb(null, fullPath, rosebud);
		});

		request.get(url).pipe(ws);
	}

	errStream.pipe(process.stderr);
	successStream.pipe(process.stdout);

	function _cb(err, filename, rosebud) {
		if (err) {
			rosebud.errImgFiles.push(err);
			rosebud.finCount -= 1;
		} else {
			rosebud.imgFileNames.push(filename);
			console.log("Got Callback that " + filename + " is finished!!!!");
			console.log((rosebud.finCount -= 1) + " images left to download");
		}
		if (rosebud.finCount === 0) {
			rosebud.downloadImgsCB(rosebud);
		}
	}
};
