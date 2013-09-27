var imgSize = require('image-size'),
    request = require('request'),
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
        scrape.res.json({
            'Images Successfully Downloaded' : scrape.imgFileNames.length,
            'Images Failed Download' : scrape.errImgFiles.length,
            imagesDownloaded : scrape.imgFileNames,
            imagesFailedDownload : function() {
                if (scrape.errImgFiles.length === 0) {
                    return "All images downloaded successfully!!!!"
                } else {
                    return scrape.errImgFiles;
                }
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

function hasDimensions(err, dim) {
    if (err) {
        res.json(err);
    } else {
        res.json({
            filename : file,
            dimensions : {
                width : dim.width,
                height : dim.height
            }
        });
    }
}
