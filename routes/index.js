var request = require('request'),
    getDimensions = require('./getDimensions.js'),
    fs = require('fs'),
    $ = require('cheerio'),
    path = require('path'),
    url = require('url'),
    downloader = require('./downloader.js');

exports.index = function indexHandle(req, res) {
    var domain = 'http://cnn.com'
        dirParts = [process.cwd(), 'public', 'images'],
        downloadDir = dirParts.join(path.sep),
        host = url.parse(domain),
        dirName = path.join(downloadDir, host.host),
        scrape = {
            res : res,
            domain : domain,
            dirName : dirName,
            createDirCB : createDirCB,
            getHTML : getHTML,
            hasHTML : hasHTML,
            downloadImgs : downloadImgs,
            downloadImgsCB : downloadImgsCB,
            imgDimensions : imgDimensions,
            dimensions : {},
            imageURLs : []
        };

    createDir(scrape);

    function createDir(scrape) {
        fs.mkdir(scrape.dirName, scrape.createDirCB.bind(null, scrape));
    }

    function createDirCB(scrape, err) {
        if (err) {
            scrape.res.json(err);
        } else {
            scrape.getHTML(scrape);
        }
    }

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
                href = hasProtocol(scrape.domain, href);
                if (scrape.imageURLs.indexOf(href) === -1) {
                    scrape.imageURLs.push(href);
                }
            });
            scrape.downloadImgs(scrape);
            
        }
    }
    function downloadImgs(scrape) {
        downloader(scrape);
    }

    function downloadImgsCB(scrape) {
        console.log("The " + scrape.imageURLs.length + " Files you requsted to download have finished!!!!");
        scrape.imgDimensions(scrape, imgDimensionsCB);
    }

    function imgDimensions(scrape, done) {
        getDimensions(scrape);
    }

    function imgDimensionsCB(scrape) {
        scrape.res.json({
            'This Domain had this many images ' : scrape.imageURLs,
            'I was able to download this many images' : scrape.imgFileNames.length,
            'I was unable to download this many images' : scrape.errImgFiles.length,
            'I was able to get the dimensions of this many images' : Object.keys(scrape.dimensions).length,
            AllDimensions : function() {
                return Object.keys(scrape.dimensions).forEach(function(img) {
                    return {
                        width : scrape.dimensions[img].width,
                        height : scrape.dimensions[img].height
                    };
                });
            }
        });
    }
};

function hasProtocol(domain, href) {
    if (href.substr(0,1) !== 'h') {
        return domain + href;
    }
    return href;
}
