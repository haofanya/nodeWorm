const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');

let names=[],browser,z=0 ;

const loadPage=async (url,z,name) => {
    console.log(url,z,name);
    const page = await browser.newPage();
    try{await page.goto(url);}
    catch(e){
        console.log(e)
    }
    if(z===0){
        await page.waitForNavigation();
    }else{
        await page.waitFor(2000);
    }

    //检索当前页面a标签，img标签
    const result =await page.evaluate((name) => {
        console.log('evaluate');
        let imgs = document.querySelectorAll('img');
        let links = document.querySelectorAll('.WB_frame_c a');
        let female =document.querySelectorAll('.icon_pf_female').length>0||name==='vczh';
        let data={imgs:[],links:[],female:female};
        for(let i in imgs){
            if(imgs[i].width>80){
                data.imgs.push(imgs[i].src);
            }
        }
        for(let v of links){
            if(!!v.href&&v.href.indexOf('javascript')===-1&&v.href.indexOf('https://weibo.com/')!==-1
                &&v.href.length>20&&v.href.indexOf('signup')===-1&&v.href[18]>'9'&&v.innerHTML.indexOf('@')!==-1
                &&v.href.indexOf('follow')===-1&&data.links.indexOf(v.href)===-1&&v.href.indexOf('1005051916825084/')===-1){
                data.links.push(v.href);
            }
        }
        return data;
    });
    if((!result.female)&&(name!=='vczh')){
        result.imgs=[];
        result.links=[];
    }
    // fs.appendFile('./sources/' + name+ '.json', JSON.stringify(result), 'utf-8', function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // })
    if(result.female){
        await fs.mkdir('./sources/vczh/'+name, function(err){
            if(err){
            }else{
            }
        })
    }
    //遍历下载当前页面图片
    for (let i in result.imgs){
        if(result.imgs[i]){
            request.head({
                url:    result.imgs[i].slice(0,4)+result.imgs[i].slice(5),   // 请求的URL
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
            try{
                let writeStream = fs.createWriteStream('./sources/vczh/'+name+'/'+name+i+'.jpg');
                let readStream = request({
                    url:    result.imgs[i][4]==='s'?(result.imgs[i].slice(0,4)+result.imgs[i].slice(5)):result.imgs[i],   // 请求的URL
                    method: 'GET',                   // 请求方法
                    encoding: null,
                    headers: {                       // 指定请求头
                        'Accept-Language': 'zh-CN,zh;q=0.9',         // 指定 Accept-Language
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3803.0 Safari/537.36',
                    }
                })
                readStream.pipe(writeStream);
                readStream.on('end', function(response) {
                    writeStream.end();
                });
                readStream.on('error', error => {
                    console.log(error.message);
                });
            }catch(e){
                console.log(e);
            }
        }
    }
    //深度递归遍历url
    z+=1;
    if(z<3){
        for (let i of result.links) {
            if(!!i){
                i=decodeURI(i);
                let rev=i.split('').reverse().join('');
                let name=i.slice(rev.length-1-rev.indexOf('/'));
                if(i.indexOf('?')!==-1){
                    name=i.slice(rev.length-rev.indexOf('/'),i.indexOf('?',i.indexOf('/',i.length-1)));
                }
                if(names.indexOf(name)===-1){
                    names.push(name);
                    await loadPage(i,z,name);
                    //await loadPage(i,z,name);
                }
            }
        }
    }
    console.log(result.imgs.length,result.links.length);
    //await browser.close();
}

(async()=>{
    browser = await  puppeteer.launch({
        headless:false,
        defaultViewport:{
            width:1920,
            height:1080
        }
    });
    names.push('vczh');
    await fs.mkdir('./sources/vczh', function(err){
        if(err){
        }else{
        }
    })

    await loadPage('https://weibo.com/vczh',z,'vczh');
})();

