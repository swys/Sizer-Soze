var request = require('request'),
    getDimensions = require('./getDimensions.js'),
    fs = require('fs'),
    $ = require('cheerio'),
    path = require('path'),
    url = require('url'),
    downloader = require('./downloader.js');

exports.index = function indexHandle(req, res) {
    var domain = 'http://amazon.com',
        dirParts = [process.cwd(), 'public', 'images'],
        downloadDir = dirParts.join(path.sep),
        host = url.parse(domain),
        dirName = path.join(downloadDir, host.host),
        scrape = {
            res : res,
            domain : domain,
            dirName : dirName,
            getHTML : getHTML,
            hasHTML : hasHTML,
            getDimensions : getDimensions,
            getDimensionsCB : getDimensionsCB,
            dimensions : {},
            imageURLs : []
        };

    scrape.getHTML(scrape);

    function getHTML(scrape) {
        request(scrape.domain, scrape.hasHTML.bind(null, scrape));
    }

    function hasHTML(scrape, err, response, html) {
        if (err) {
            scrape.res.json(err);
        } else {
            var parsedHTML = $.load(html),
                imageURLs = [];
            parsedHTML('img').map(function(i, link) {
                var href = $(link).attr('src');
                if (href) {
                    href = hasProtocol(scrape.domain, href);
                    if (scrape.imageURLs.indexOf(href) === -1) {
                        scrape.imageURLs.push(href);
                    }
                }
            });
            scrape.getDimensions(scrape, getDimensionsCB);
            
        }
    }
};

function getDimensionsCB(scrape) {
    scrape.res.json({
        'This Domain had this many images' : scrape.imageURLs.length,
        'I was able to get the dimensions of this many images' : Object.keys(scrape.dimensions).length,
        'I was not able to get the dimensions for this many images' : Object.keys(scrape.dimensions.err).length,
        'Here is a list of all the dimensions' : scrape.dimensions
    });
}

function allDimensions(scrape) {
    return Object.keys(scrape.dimensions).forEach(function(img) {
        return scrape.dimensions[img];
    });
}

function hasProtocol(domain, href) {
    if (href.substr(0,1) !== 'h') {
        return domain + href;
    }
    return href;
}
