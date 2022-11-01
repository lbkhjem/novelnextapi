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
  var idnovels = req.query.id;
  const URL = "https://bestlightnovel.com/";

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
  var author = null;
  var genresdata = [];
  var chapterlist = [];
  var dateupdate = null;
  var othername = null;
  var lasterchapter = null;
  var idnovel = null;
  var idchapter = null;
  var othernovel = [];
  var cover = null;
  var lastupdates = [];
  var update_time = null;
  var id = null;
  var totalpages = null;
  getPageContent(URL + idnovels).then(($) => {
    novelsname = $(".truyen_info_right li:nth-child(1) h1").text();
    cover = $(".info_image img").attr("src");
    othername = $(".truyen_info_right li:nth-child(1) span").text();
    author = $(".truyen_info_right li:nth-child(2) a").text();

    $(".truyen_info_right li:nth-child(3) a").each(function (result) {
      let genres = $(this).text();
      var link = $(this).attr("href");
      var dem = link.search("&state");
      let idgenres = link.slice(link.search("category=") + 9, dem);
      // console.log(idgenres);
      genresdata.push({
        genrename: genres,
        idgenres: idgenres,
      });
    });
    $(".wrap_update .update_item").each(function (result) {
      let other = "";
      var idnovel = "",
        img = "";
      $(this)
        .find("h3 a")
        .each(function () {
          other = $(this).text();
          let novelid = $(this).attr("href");
          idnovel = novelid.slice(novelid.search(".com/") + 5);
          //   console.log(idnovel);
        });
      $(this)
        .find("img")
        .each(function () {
          img = $(this).attr("src");
          //   console.log(idnovel);
        });
      othernovel.push({
        novelsname: other,
        idnovels: idnovel,
        img: img,
      });
      console.log(othernovel);
    });
    let status = $(".truyen_info_right li:nth-child(4) a").text();
    let dateupdate = $(".updated").text();
    let description = $("#noidungm").text();
    $(".chapter-list .row a").each(function (result) {
      let chaptername = $(this).text();
      var chapterid = $(this).attr("href");
      let idchapter = chapterid.slice(
        chapterid.search(idnovels + "/") + (idnovels.length + 1)
      );
      chapterlist.unshift({
        chaptername: chaptername,
        idchapter: idchapter,
      });
    });
    novel.push({
      novelsname: novelsname,
      idnovels: idnovels,
      othername: othername,
      author: author,
      cover: cover,
      genresdata: genresdata,
      status: status,
      dateupdate: dateupdate,
      description: description,
      chapterlist: chapterlist,
      othernovel: othernovel
    });
    try {
      res.status(200).json(novel);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  });
};

export default handler;
