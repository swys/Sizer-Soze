var http = require('http'),
    imgsze = require('imagesize'),
    wc = require('watercolor'),
    errTxt = wc({
        color : 'red'
    }),
    successTxt = wc({
        color : 'green'
    }),
    infoTxt = wc({
        color : 'yellow'
    });
    goo = 'http://www.google.com/intl/en_ALL/images/srpr/logo1w.png',
    stack = 'http://cdn.sstatic.net/stackoverflow/img/apple-touch-icon.png';


http.get(goo, function(res) {
    successTxt.write('Status Code : ' + res.statusCode + "\n");
    infoTxt.write(JSON.stringify(res.headers, null, 4) + "\n");
    imgsze(res, imgszeCB);
}).on('error', function errBack(err) {
    errTxt.write("Error!!!!\n");
    infoTxt.write(JSON.stringify(err, null, 4) + "\n");
});

successTxt.pipe(process.stdout);
infoTxt.pipe(process.stdout);
errTxt.pipe(process.stdout);

function imgszeCB(err, result) {
    if (err) {
        errTxt.write(JSON.stringify(err, null, 4) + "\n");
    } else {
        successTxt.write("Success!!!!\n");
        infoTxt.write(JSON.stringify(result, null, 4) + "\n");
    }
}
