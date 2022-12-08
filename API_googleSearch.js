const cheerio = require("cheerio");
const unirest = require("unirest");
const getData = async () => {
    try {
        const url = "https://www.google.com/search?q=longtitude+and+latitude+of+toronto";
        const response = await unirest.get(url).headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
        });
        const $ = cheerio.load(response.body)
        let ads = [];
        console.log("DEBUG", $().html)
        $("#tads .uEierd").each((i, el) => {
            let sitelinks = [];
            ads[i] = {
                title: $(el).find(".v0nnCb span").text(),
                snippet: $(el).find(".lyLwlc").text(),
                displayed_link: $(el).find(".qzEoUe").text(),
                link: $(el).find("a.sVXRqc").attr("href"),
            }
            console.log("ADS", ads);
            if ($(el).find(".UBEOKe").length) {
                console.log("IF STATEMENT IS TRUE")
                $(el).find(".MhgNwc").each((i, el) => {
                    sitelinks.push({
                        title: $(el).find("h3").text(),
                        link: $(el).find("a").attr("href"),
                        snippet: $(el).find(".lyLwlc").text()
                    })
                }); ads[i].sitelinks = sitelinks
            }
            console.log("SITELINKS", sitelinks);
        }); console.log(ads)

    } catch (e) {
        console.log(e);
    }
}
getData();