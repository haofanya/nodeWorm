const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
(async () => {
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport:{
            width:1920,
            height:1080
        }
    });
    const page = await browser.newPage();
    await page.goto('https://weibo.com/p/1005053233552940/photos?from=page_100505&mod=TAB#place');
    await page.setViewport({width:1920, height:1080});
    await page.waitForNavigation();
    await page.waitFor(1000);
    await page.screenshot({path: 'example.png'});

    console.log('begin');

    const result =await page.evaluate(() => {
        console.log('evaluate');
        let imgs = document.querySelectorAll('.photo_pict');
        let data=[];
        for(let i in imgs){
            data.push(imgs[i].src);
        }
        return data;

    });
    await fs.mkdir('./sources/qianyi/', function(err){
        if(err){
        }else{
        }
    })
    console.log(result);
    for (let i in result){
        if(result[i]){
            await request.head({
                url:    result[i].slice(0,4)+result[i].slice(5),   // 请求的URL
                method: 'GET',                   // 请求方法
                headers: {                       // 指定请求头
                    'Host': 'wxt.sinaimg.cn',
                    'If-Modified-Since': 'Mon, 08 Jul 2013 18:06:40 GMT',
                    'Upgrade-Insecure-Requests':1,
                    'Pragma': 'no-cache',
                    'Connection': 'keep-alive',
                    'Sec-Fetch-User':'?1',
                    'Sec-Fetch-Site':'none',
                    'Sec-Fetch-Mode':'navigate',
                    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'zh-CN,zh;q=0.9',         // 指定 Accept-Language
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3803.0 Safari/537.36',

                }
            },function(err,res,body){
                if(err){
                    console.log(err);
                }
            });
            console.log(result[i].slice(0,4)+result[i].slice(5));
            await request({
                url:    result[i].slice(0,4)+result[i].slice(5),   // 请求的URL
                method: 'GET',                   // 请求方法
                encoding: null,
                headers: {                       // 指定请求头
                    'Accept-Language': 'zh-CN,zh;q=0.9',         // 指定 Accept-Language
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3803.0 Safari/537.36',

                }
            }).pipe(fs.createWriteStream('./sources/qianyi/'+i+'.jpg'));
            if(i===result.length-1){
                console.log('end');
            }
        }
    }

})();
