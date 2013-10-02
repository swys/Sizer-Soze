var $ = require('cheerio'),
	request = require('request'),
	url = require('url'),
	path = require('path');


function getHTML(rosebud, done) {
	rosebud.getHTMLCB = done;
	request(rosebud.domain, rosebud.hasHTML.bind(null, rosebud));
}

function hasHTML(rosebud, err, response, html) {
	if (err) {
		rosebud.res.json(err);
	} else {
		var parsedHTML = $.load(html),
			imageURLs = [];
		parsedHTML('img').map(function(i, link) {
			var href = $(link).attr('src');
			if (href) {
				href = hasProtocol(rosebud.domain, href);
				if (rosebud.imageURLs.indexOf(href) === -1) {
					rosebud.imageURLs.push(href);
				}
			}
		});
		rosebud.getHTMLCB(rosebud);
	}
}

function hasProtocol(domain, href) {
	var uri = url.format(url.parse(href).protocol);
	return (uri === '' ? domain + path.sep + href : href);
}

module.exports = {
	getHTML : getHTML,
	hasHTML : hasHTML,
};