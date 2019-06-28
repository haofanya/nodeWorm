let express = require('express');
let cheerio = require('cheerio');
let superagent = require('superagent');

let app = express();

app.get('/', function (req, res, next) {
    superagent.get('http://www.people.com.cn/')
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            let $ = cheerio.load(sres.text);
            let items = [];
            $('.zh-general-list .blk').each(function (idx, element) {
                let $element = $(element);
                items.push({
                    title: $element.childNodes[0].childNodes[1].innerHTML,
                    extra: $element.childNodes[1].innerHTML
                });
            });
            res.send(items);
        });
});


app.listen(3000, function () {
    console.log('app is listening at port 3000');
});
