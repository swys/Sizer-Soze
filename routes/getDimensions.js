var imagesize = require('imagesize'),
	http = require('http');

module.exports = function getDimensions(scrape, done) {
	scrape.dimensions.err = {};
	scrape.dimensions.done = done;
	scrape.dimensions.finCount = scrape.imageURLs.length;

	scrape.imageURLs.forEach(function(url) {
		http.get(url, function httpRequestCB(res) {
			imagesize(res, hasDimensions.bind(null, scrape, url));
		}).on('error', function httpRequestErr(err) {
			scrape.dimensions.err[url] = {
				url : url,
				error : err
			};
		});
	});

	function hasDimensions(scrape, url, err, result) {
		if (err) {
			scrape.dimensions.finCount -= 1;
			scrape.dimensions.err[url] = {
				url : url,
				error : err
			};
		} else {
			scrape.dimensions.finCount -= 1;
			scrape.dimensions[url] = result;
		}
		if (scrape.dimensions.finCount === 0) {
			scrape.dimensions.done(scrape);
		}
	}

	// function hasDimensions(scrape, file, err, dim) {
	// 	if (err) {
	// 		scrape._dimensionscb({
	// 			filename : file,
	// 			err : err
	// 		}, null);
	// 	} else {
	// 		var filename = file;
	// 		scrape.dimensions[file] = {
	// 			width : dim.width,
	// 			height : dim.height
	// 		};
	// 		scrape._dimensionscb(null, filename, scrape);
	// 	}
	// }

	// function _cb(err, filename, scrape) {
	// 	if (err) {
	// 		scrape.dimensions.finCount -= 1;
	// 		scrape.dimensions.err[err.filename] = err;
	// 	} else {
	// 		scrape.dimensions.finCount -= 1;
	// 		console.log("Got Callback that " + filename + " is !!!!");
	// 		console.log((scrape.finCount -= 1) + " images left to download");
	// 	}
	// 	if (scrape.dimensions.finCount === 0) {
	// 		scrape.dimensions.done(scrape);
	// 	}
	// }
};