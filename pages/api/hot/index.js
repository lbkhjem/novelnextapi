import NextCors from "nextjs-cors";

var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  var novel = [];
  var page = req.query.page;
  const URL =
    "https://bestlightnovel.com/novel_list?type=topview&category=all&state=all&page=";
  const getPageContent = (uri) => {
    const options = {
      uri,
      headers: {
        "User-Agent": "Request-Promise",
      },
      transform: (body) => {
        return cheerio.load(body);
      },
    };

    return request(options);
  };
  var data = [];
  var novelsname = null;
  var lasterchapter = null;
  var idnovel = null;
  var idchapter = null;
  var cover = null;
  var lastupdates = [];
  var update_time = null;
  var id = null;
  var totalpages = null;
  getPageContent(URL + page).then(($) => {
    // console.log(
    //   "http://www.nettruyen.com/tim-truyen?status=-1&sort=15&page=" + page
    // );
    // var pagett = $(".pagination-outter ul li.hidden").text();
    // totalpage = pagett.slice(pagett.search("/") + 2);
    $(".cotgiua .wrap_update .update_item").each(function (result) {
      $(this)
        .find("h3.nowrap a")
        .each(function () {
          novelsname = $(this).text();
          var novelid = $(this).attr("href");
          idnovel = novelid.slice(novelid.search(".com/") + 5);
          //   console.log(idnovel);
        });
      $(this)
        .find(".chapter")
        .each(function () {
          lasterchapter = $(this).text();
          var chapterid = $(this).attr("href");
          idchapter = chapterid.slice(
            chapterid.search(idnovel + "/") + (idnovel.length + 1)
          );
          //   console.log(idchapter)
        });

      $(this)
        .find("a img")
        .each(function () {
          cover = $(this).attr("src");
          // console.log(cover);
          //   console.log(idchapter)
        });

      data.push({
        novelsname: novelsname,
        idnovel: idnovel,
        lasterchapter: lasterchapter,
        idchapter: idchapter,
        cover: cover,
      });
    });
    var totalpage = $(".phan-trang a:last-child").text();
    totalpages = totalpage.slice(5, 9);
    var novels = {
      url:
        "https://novelonlinefree.info/novel_list?type=topview&category=all&state=all&page=" +
        page,
      page: page,
      data: data,
      totalpage: parseInt(totalpages),
    };

    try {
      res.status(200).json(novels);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  });
};

export default handler;
