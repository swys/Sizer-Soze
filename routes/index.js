var imgSize = require('image-size'),
    request = require('request'),
    fs = require('fs'),
    $ = require('cheerio'),
    path = require('path'),
    url = require('url'),
    downloader = require('./downloader.js');

exports.index = function indexHandle(req, res) {
    var domain = 'http://www.cnn.com',
        dirParts = [process.cwd(), 'public', 'images'],
        downloadDir = dirParts.join(path.sep),
        host = url.parse(domain),
        dirName = downloadDir + path.sep + host.host;

    fs.mkdir(dirName, mkdirCB);

    function mkdirCB(err) {
        if (err) {
            res.json(err);
        } else {
            request(domain, gotHTML);
        }
    }

    function gotHTML(err, response, html) {
        if (err) {
            res.json(err);
        } else {
            var parsedHTML = $.load(html),
                imageURLs = [];
            parsedHTML('img').map(function(i, hello) {
                var href = $(hello).attr('src');
                href = hasProtocol(domain, href);
                if (imageURLs.indexOf(href) === -1) {
                    imageURLs.push(href);
                }
            });
            console.dir(imageURLs);
            downloader(imageURLs, dirName, function(err, success) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("The " + imageURLs.length + " Files you requsted to download have finished!!!!");
                    res.json(success);
                }
            });
        }
    }
};

function hasProtocol(domain, href) {
    if (href.substr(0,1) !== 'h') {
        return domain + href;
    }
    return href;
}


    // GET DIMENSIONS OF DOWNLOADED IMAGES
    // imgSize(process.cwd() + path.sep + 'public' + path.sep + 'images' + path.sep + fileName, function(err, dim) {
    // if (err) {
    // console.error(err);
    // } else {
    // console.log("Height : ", dim.height);
    // console.log("Width : ", dim.width);
    // //res.render('index', {title : 'node Sizer'});
    // }
    // });
