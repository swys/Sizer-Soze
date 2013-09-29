var imagesize = require('imagesize'),
	http = require('http'),
	watercolor = require('watercolor'),
	successTxt = watercolor({
		color : 'green'
	}),
	infoTxt = watercolor({
		color : 'warn'
	}),
	errTxt = watercolor({
		color : 'red'
	});

successTxt.setMaxListeners(0);
errTxt.setMaxListeners(0);
infoTxt.setMaxListeners(0);
module.exports = function getDimensions(scrape, done) {
	scrape.dimensions.err = {};
	scrape.dimensions.imgs = {};
	scrape.dimensions.done = done;
	scrape.dimensions.finCount = scrape.imageURLs.length;

	scrape.imageURLs.forEach(function(url) {
		http.get(url, function httpRequestCB(res) {
			var headers = res.headers;
			imagesize(res, hasDimensions.bind(null, scrape, url, headers));
		}).on('error', function httpRequestErr(err) {
			console.dir(err);
			scrape.dimensions.err[url] = {
				url : url,
				error : err
			};
		});
	});

	function hasDimensions(scrape, url, headers, err, result) {
		if (err) {
			console.dir(err);
			scrape.dimensions.finCount -= 1;
			scrape.dimensions.err[url] = {
				url : url,
				headers : headers,
				error : err
			};
		} else {
			scrape.dimensions.finCount -= 1;
			result.byteCount = headers['content-length'];
			scrape.dimensions.imgs[url] = result;
		}
		if (scrape.dimensions.finCount === 0) {
			scrape.dimensions.done(scrape);
		}
	}
};

function toJSON(o) {
	return JSON.stringify(o, null, 4);
}