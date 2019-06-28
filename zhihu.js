const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
let names=[],browser,page,z=0 ;

const pressArrowDown=async (num)=>{
    for(let i=0;i<num;i++){
        await setTimeout(()=>{},10);
        await page.keyboard.press('ArrowDown');
        // await page.keyboard.down('Shift');
        // await page.keyboard.press('KeyA');
        // await page.keyboard.up('Shift');
    }
}
function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1)
            } catch (e) {
                reject(0)
            }
        }, delay)
    })
}
const loadPage=async (url,z,name) => {
    console.log(url,z,name);
    page = await browser.newPage();
    page.setViewport({width:1920, height:1080});
    try{await page.goto(url,{
        waitUntil: 'networkidle2',
        timeout: 3000000
    });}
    catch(e){
        console.log(e)
    }
    await page.waitFor(2000);
    console.log(1);
    // await page.on('request', (sources) => console.log(sources));
    // await page.on('requestfailed', (sources) => console.log(sources));
    // await page.on('requestfinished', (sources) => {
    //     //console.log(sources._url);
    //     //Object.keys(sources).map(key=>console.log(key));
    //     //sources.keys(key=>console.log(key));
    //     if(sources._url==='https://www.zhihu.com/people/excited-vczh/activities'){
    //         console.log(sources);
    //         // Object.keys(sources).map(key=>console.log(key));
    //     }
    // });
    ////注入代码，慢慢把滚动条滑到最底部，保证所有的元素被全部加载
    // let scrollEnable = true;
    // let scrollStep = 500; //每次滚动的步长
    // while (scrollEnable) {
    //     scrollEnable = await page.evaluate((scrollStep) => {
    //         let scrollTop = document.scrollingElement.scrollTop;
    //         document.scrollingElement.scrollTop = scrollTop + scrollStep;
    //         return document.body.clientHeight > scrollTop + 1080 ? true : false
    //     }, scrollStep);
    //     await sleep(100);
    // }

    request.head({
        url:    'https://www.zhihu.com/api/v4/members/excited-vczh/activities?limit=7&session_id=1018073864680538112&after_id=1560495627&desktop=True',   // 请求的URL
        method: 'GET',                   // 请求方法
        headers: {                       // 指定请求头
            'Host': 'www.zhihu.com',
            'If-Modified-Since': 'Mon, 08 Jul 2013 18:06:40 GMT',
            'Upgrade-Insecure-Requests':1,
            'Pragma': 'no-cache',
            'Connection': 'keep-alive',
            'Sec-Fetch-User':'?1',
            'Sec-Fetch-Site':'none',
            'Sec-Fetch-Mode':'navigate',
            'Accept':'*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',         // 指定 Accept-Language
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3803.0 Safari/537.36',
            // 'Cookie':'_zap=00177aa1-c13c-4f2a-88b1-cd89282ad4bd; ' +
            //     'd_c0="ALAqt6sTlQ-PToAnQLARh_7eu3MnzgEeN0I=|1560482415";' +
            //     ' _xsrf=b7b0122a-a259-4728-bd5a-c1d3875be222; ' +
            //     'tgw_l7_route=a37704a413efa26cf3f23813004f1a3b',

        }
    },function(err,res,body){
        if(err){
            console.log(err);
        }
        else{
            let ans=JSON.parse(res);
            console.log(ans.paging);
        }

    });

    //_zap=00177aa1-c13c-4f2a-88b1-cd89282ad4bd; d_c0="ALAqt6sTlQ-PToAnQLARh_7eu3MnzgEeN0I=|1560482415"; tgw_l7_route=73af20938a97f63d9b695ad561c4c10c; _xsrf=87757a4e-60e2-4609-984d-db457a128789
    //检索当前页面a标签，img标签
    // const result =await page.evaluate((name) => {
    //     console.log(2);
    //     let imgs = document.querySelectorAll('img');
    //     let links = document.querySelectorAll('.WB_frame_c a');
    //     let female =document.querySelectorAll('.icon_pf_female').length>0;
    //     let sources={imgs:[],links:[],female:female};
    //     for(let i in imgs){
    //         if(imgs[i].width>80){
    //             sources.imgs.push(imgs[i].src);
    //         }
    //     }
    //     // for(let v of links){
    //     //     if(!!v.href&&v.href.indexOf('javascript')===-1&&v.href.indexOf('https://weibo.com/')!==-1
    //     //         &&v.href.length>20&&v.href.indexOf('signup')===-1&&v.href[18]>'9'&&v.innerHTML.indexOf('@')!==-1
    //     //         &&v.href.indexOf('follow')===-1&&sources.links.indexOf(v.href)===-1&&v.href.indexOf('1005051916825084/')===-1){
    //     //         sources.links.push(v.href);
    //     //     }
    //     // }
    //     return sources;
    // });

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
    await loadPage('https://www.zhihu.com/people/excited-vczh/activities',z,'vczh');

    // await loadPage('https://www.zhihu.com/people/excited-vczh/activities',z,'vczh');
})();

