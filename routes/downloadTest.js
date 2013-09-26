var downloader = require('./downloader.js'),
	images = ['http://i1.ytimg.com/vi/sjXcmX5cfLQ/mqdefault.jpg', 'http://i1.ytimg.com/vi/KkMWXVx-Ul8/mqdefault.jpg'];

console.log("Testing downloader...");
downloader(images, function(err, success) {
	if (err) {
		console.error(err);
	} else {
		console.log("The " + images.length + " Files you requsted to download have finished!!!!");
		console.log(success);
	}
});
