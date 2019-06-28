let http = require('http');
let fs = require('fs');
let cheerio = require('cheerio');
const iconv = require("iconv-lite");
let i = 0;
let num=38;
let url="http://world.people.com.cn/n1/2019/0606/c1002-31123338.html";
//初始url

function fetchPage(options) {     //封装了一层函数
    startRequest(options);
}
let request = require('request');

// 通过 GET 请求来读取 http://cnodejs.org/ 的内容
request({
    url:    'http://world.people.com.cn/n1/2019/0606/c1002-31123338.html',   // 请求的URL
    method: 'GET',                   // 请求方法
    headers: {                       // 指定请求头
        'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
        'Cookie': 'wdcid=15c46050bcbbbc68; ALLYESID4=11BBF1B9208CB053; sso_c=0; sfr=1; _people_ip_new_code=310000; _ma_tk=vbrs18ntnp7vatpda5q3cf5kbq2uhc7v; _ma_starttm=1559805122588; _ma_is_new_u=0; wdses=46a84ffbe4871a12; wdlast=1559808754',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',

    }
}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // 输出网页内容
        console.log('sucess');
    }else{
        console.log(error);
    }
});

let options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/pay/pay_callback?',
    method: 'GET'
};
function startRequest(options) {
    //采用http模块向服务器发起一次get请求
    console.log('main');
   request(options, async function (error, response, res) {
        let buf=iconv.decode(new Buffer(res, 'utf8'),'gb2312');
        //console.log(buf);
        let html = [];        //用来存储请求网页的整个html内容
        let titles = [];
        let $ = cheerio.load(buf);
        let news_item = {
           //获取文章的标题
           title: $('h1').text(),
           //获取文章发布的时间
           Time: $('.box01 .fl').text(),
            id: i = i + 1,
        };

       console.log(news_item);     //打印新闻信息
       let news_title = $('h1').text().trim();
       await fs.mkdir('./sources/people/', function(err){
           if(err){
               //console.log(err);
           }else{
           }
       })
       savedContent($,news_title);  //存储每篇文章的内容及文章标题

       //savedImg($,news_title);    //存储每篇文章的图片及图片标题


       //下一篇文章的url
       num++;
       let nextLink="http://world.people.com.cn/n1/2019/0606/c1002-311233" +num+".html";
       str1 = nextLink.split('-');  //去除掉url后面的中文
       str = encodeURI(str1[0]);
       //这是亮点之一，通过控制I,可以控制爬取多少篇文章.
       if (i <= 20) {
           fetchPage( {
               url:    nextLink,   // 请求的URL
               method: 'GET',                   // 请求方法
               encoding: null,
               headers: {                       // 指定请求头
                   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                   'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
                   'Cookie': 'wdcid=15c46050bcbbbc68; ALLYESID4=11BBF1B9208CB053; sso_c=0; sfr=1; _people_ip_new_code=310000; _ma_tk=vbrs18ntnp7vatpda5q3cf5kbq2uhc7v; _ma_starttm=1559805122588; _ma_is_new_u=0; wdses=46a84ffbe4871a12; wdlast=1559808754',
                   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',

               }
           });
       }
    }).on('error', function (err) {
        console.log(err);
    });

}
//该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent($, news_title) {
    $('#rwb_zw p').each(function (index, item) {
        let x = $(this).text();

        let y = x.substring(0, 2).trim();

        if (y == '') {
            x = x + '\n';
            
            fs.appendFile('./sources/people/' + news_title + '.txt', x, 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    })
}
//该函数的作用：在本地存储所爬取到的图片资源
function savedImg($,news_title) {
    $('.article-content img').each(function (index, item) {
        let img_title = $(this).parent().next().text().trim();  //获取图片的标题
        if(img_title.length>35||img_title==""){
            img_title="Null";}
        let img_filename = img_title + '.jpg';

        let img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); //获取图片的url

//采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./sources/people/'+news_title + '---' + img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })
}
fetchPage({
    url:    'http://world.people.com.cn/n1/2019/0606/c1002-31123338.html',   // 请求的URL
    method: 'GET',                   // 请求方法
    encoding: null,
    headers: {                       // 指定请求头
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
        'Cookie': 'wdcid=15c46050bcbbbc68; ALLYESID4=11BBF1B9208CB053; sso_c=0; sfr=1; _people_ip_new_code=310000; _ma_tk=vbrs18ntnp7vatpda5q3cf5kbq2uhc7v; _ma_starttm=1559805122588; _ma_is_new_u=0; wdses=46a84ffbe4871a12; wdlast=1559808754',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',

    }
});      //主程序开始运行

