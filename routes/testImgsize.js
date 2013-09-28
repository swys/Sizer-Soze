var getImgsize = require('imagesize'),
    request = require('request'),
    site = ['http://substack.net/images/browserling/why_browserling.png', 'http://substack.net/images/browserling/screenling.png'];

    request.get(site.shift(), function reqCB(err, res, body) {
        if (err) {
            console.error(err);
        } else {
            //console.log("Here is the data returned :");
            //console.dir(body);
            getImgsize(body, getImgsizeCB);
        }
    });

    function getImgsizeCB(err, result) {
        if (err) {
            console.error(err);
        } else {
            console.dir(result);
        }
    }
//});
