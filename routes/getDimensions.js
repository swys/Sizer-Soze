var imgSize = require('image-size');

module.exports = function getDimensions(scrape, done) {
	scrape.getDimensionsCB = hasDimensions;
	scrape._dimensionscb = _cb;
	scrape.dimensions.err = {};
	scrape.dimensions.done = done;
	scrape.dimensions.finCount = scrape.imgFileNames.length;

	scrape.imgFileNames.forEach(function(file) {
		imgSize(file, hasDimensions.bind(null, scrape, file));
	});

	function hasDimensions(scrape, file, err, dim) {
		if (err) {
			scrape._dimensionscb({
				filename : file,
				err : err
			}, null);
		} else {
			var filename = file;
			scrape.dimensions[file] = {
				width : dim.width,
				height : dim.height
			};
			scrape._dimensionscb(null, filename, scrape);
		}
	}

	function _cb(err, filename, scrape) {
		if (err) {
			scrape.dimensions.finCount -= 1;
			scrape.dimensions.err[err.filename] = err;
		} else {
			scrape.dimensions.finCount -= 1;
			console.log("Got Callback that " + filename + " is !!!!");
			console.log((scrape.finCount -= 1) + " images left to download");
		}
		if (scrape.dimensions.finCount === 0) {
			scrape.dimensions.done(scrape);
		}
	}
};