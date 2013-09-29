var imagesize = require('imagesize'),
	http = require('http');

module.exports = function getDimensions(scrape, done) {
	scrape.dimensions.err = {};
	scrape.dimensions.done = done;
	scrape.dimensions.finCount = scrape.imageURLs.length;

	scrape.imageURLs.forEach(function(url) {
		http.get(url, function httpRequestCB(res) {
			var headers = res.headers;
			imagesize(res, hasDimensions.bind(null, scrape, url, headers));
		}).on('error', function httpRequestErr(err) {
			scrape.dimensions.err[url] = {
				url : url,
				error : err
			};
		});
	});

	function hasDimensions(scrape, url, headers, err, result) {
		if (err) {
			scrape.dimensions.finCount -= 1;
			scrape.dimensions.err[url] = {
				url : url,
				headers : headers,
				error : err
			};
		} else {
			scrape.dimensions.finCount -= 1;
			result.byteCount = headers['content-length'];
			scrape.dimensions[url] = result;
		}
		if (scrape.dimensions.finCount === 0) {
			scrape.dimensions.done(scrape);
		}
	}
};