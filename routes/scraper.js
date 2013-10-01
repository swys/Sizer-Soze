var $ = require('cherrio'),
	request = require('request');


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
	if (href.substr(0,1) !== 'h') {
		return domain + href;
	}
	return href;
}

module.exports = {
	getHTML : getHTML,
	hasHTML : hasHTML,
};