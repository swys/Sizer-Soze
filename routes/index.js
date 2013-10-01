var request = require('request'),
    getDimensions = require('./getDimensions.js'),
    scraper = require('./scraper.js'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    downloader = require('./downloader.js');

exports.index = function indexHandle(req, res) {
    var domain = 'http://cnn.com',
        dirParts = [process.cwd(), 'public', 'images'],
        downloadDir = dirParts.join(path.sep),
        host = url.parse(domain),
        dirName = path.join(downloadDir, host.host),
        rosebud = {
            res : res,
            domain : domain,
            dirName : dirName,
            createDir : createDir,
            createDirCB : createDirCB,
            getHTML : scraper.getHTML,
            hasHTML : scraper.hasHTML,
            getHTMLCB : getHTMLCB,
            downloadImgs : downloadImgs,
            downloadImgsCB : downloadImgsCB,
            getDimensions : getDimensions,
            getDimensionsCB : getDimensionsCB,
            dimensions : {},
            imageURLs : []
        };

    createDir(rosebud);

};

function createDir(rosebud) {
    fs.mkdir(rosebud.dirName, rosebud.createDirCB.bind(null, rosebud));
}

function createDirCB(rosebud, err) {
    if (err) {
        rosebud.res.json(err);
    } else {
        console.log("Created Directory!!!!");
        rosebud.getHTML(rosebud, getHTMLCB);
    }
}

function getHTMLCB(rosebud) {
    console.log("Finished Scraping!!!!");
    rosebud.downloadImgs(rosebud, downloadImgsCB);
}

function downloadImgs(rosebud) {
    downloader(rosebud, downloadImgsCB);
}

function downloadImgsCB(rosebud) {
    console.log("Downloading Complete!!!!");
}


function getDimensionsCB(rosebud) {
    console.dir(rosebud.dimensions);
    rosebud.res.json({
        domain : rosebud.domain,
        'This Domain had this many images' : rosebud.imageURLs.length,
        'I was able to get the dimensions of this many images' : Object.keys(rosebud.dimensions.imgs).length,
        'I was not able to get the dimensions for this many images' : Object.keys(rosebud.dimensions.err).length,
        'Here is a list of all the dimensions' : rosebud.dimensions
    });
}


