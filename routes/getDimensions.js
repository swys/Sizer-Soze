var imagesize = require('imagesize'),
	http = require('http'),
	https = require('https'),
	urlFormat = require('url'),
	watercolor = require('watercolor'),
	errTxt = watercolor({
		color : 'red'
	});
// 	protocol = (function() {
//     return function(tst) {
//       if (tst === 'reg') {
//         return http;
//       } else {
//         return os;
//       }
//     };
// }());

errTxt.pipe(process.stdout);

module.exports = function getDimensions(rosebud, done) {
	rosebud.dimensions.err = {};
	rosebud.dimensions.imgs = {};
	rosebud.dimensions.done = done;
	rosebud.dimensions.finCount = rosebud.imageURLs.length;

	rosebud.imageURLs.forEach(function(url) {
		var protocol = urlFormat.format(urlFormat.parse(url).protocol);
		protocol = protocol.substr(0,protocol.length - 1);

		console.log("Protocol is : " + protocol);
		getProtocol(protocol).get(url, function httpRequestCB(res) {
			var headers = res.headers;
			imagesize(res, hasDimensions.bind(null, rosebud, url, headers));
		}).on('error', function httpRequestErr(err) {
			errTxt.write(toJSON(err) + "\n");
			rosebud.dimensions.err[url] = {
				url : url,
				error : err
			};
		});
	});




	function hasDimensions(rosebud, url, headers, err, result) {
		if (err) {
			console.dir(err);
			rosebud.dimensions.finCount -= 1;
			rosebud.dimensions.err[url] = {
				url : url,
				headers : headers,
				error : err
			};
		} else {
			rosebud.dimensions.finCount -= 1;
			result.byteCount = headers['content-length'];
			rosebud.dimensions.imgs[url] = result;
		}
		if (rosebud.dimensions.finCount === 0) {
			rosebud.dimensions.done(rosebud);
		}
	}
};

function toJSON(o) {
	return JSON.stringify(o, null, 4);
}

function getProtocol(protocol) {
	return (protocol === 'http' ? http : https);
}