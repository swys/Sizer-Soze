var http = require('http');
var imagesize = require('imagesize');
var imgs = ['http://substack.net/images/browserling/queue.png', 'http://substack.net/images/browserling/loading-20.gif'];

imgs.forEach(function(url) {
    http.get(url, function(res) {
        imagesize(res, imagesizeCB);
    }).on('error', function (err) {
        console.log("Http Error :", err);
    });
});


function imagesizeCB(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.dir(result);
    }
}
