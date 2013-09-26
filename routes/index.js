var imgSize = require('image-size'),
    request = require('request'),
    fs = require('fs'),
    $ = require('cheerio'),
    path = require('path'),
    url = require('url'),
    downloader = require('./downloader.js');

exports.index = function indexHandle(req, res) {
    var domain = 'http://www.lolcats.com',
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
                console.log("Is valid URL : ", isValidURL(href));
                // TODO :
                // Fix issue where duplicate files make it into array
                if (imageURLs.indexOf(href) === -1) {
                    console.log("HREF : ", href);
                    if (isValidURL(href) && href.substr(0,1) === 'h') {
                        imageURLs.push(href);
                    } else {
                        if (isValidURL(domain + href)) {
                            imageURLs.push(domain + href);
                        }
                        console.log("Can\'t Validate URL : ", href);
                    }
                }
            });
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

function isValidURL(){ 
  return /((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(isValidURL.arguments[0]); 
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
