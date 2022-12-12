const express = require("express");
const fs = require("fs");
const exphbs = require("express-handlebars");
const app = express();
const path = require("node:path"); // FIX half of the fix for vercel not working with views
const bodyParser = require("body-parser");
var qs = require('qs'); // Need this to capture req.query instead of req.params
const e = require("express");
const spawn = require("child_process").spawn;

app.engine(
    "hbs",
    exphbs.engine({
        defaultLayout: false,
        layoutsDir: "views/",
        extname: ".hbs",
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views")); // FIX vercel was not working with views until this line was added, localally always worked though even without this line

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


app.get("/index", (req, res) => {
    res.render("youtube_iframe", {

    });
})




app.get("/sendUrl", (req, res) => {
    console.log("GOT INDEX POST REQUEST");
    // **CAUTION**: We are -NOT- checking req.query for malicious code
    console.log("URL", req.query);
    const video_id = /v=(.*)/.exec(req.query.url)[1];
    console.log("video_id", video_id);
    const pythonProcess = spawn('python', ["fetch_transcript.py", video_id]);

    // See python notes at bottom of .py file
    // This block of code is not working, but it is not needed for the project
    // to function. It is just a nice to have feature.
    // pythonProcess.stdout.on('data', (data) => {
    //     console.log("(Node) Python said this to me: ", data.toString());
    // });
    var data;

    function startReadFile() {
        try {
            if (data) stopReadFile();
            data = fs.readFileSync(`${video_id}.json`, 'utf8')

            // console.log("data", JSON.parse(data));

        }
        catch (e) {
            console.log("File not ready yet error:::", e)
            const myInterval = setInterval(() => { data = startReadFile() }, 1000, video_id)

        }
        return data
    }

    function stopReadFile() {
        clearInterval(myInterval);
    }

    startReadFile();
    console.log("DATA:::::::::  ", data)
    let jsonData = JSON.parse(data);
    var swearingData = [];
    // jsonData = JSON.parse(data);
    jsonData.map((sentence) => {
        // console.log("sentence", sentence.text);
        doesTextSwear = /[ __ ]/.exec(sentence["text"]);
        if (doesTextSwear) {
            console.log("%c Swear word found: ", "color: orange", sentence["text"])
            console.log("%c Duration: ", "color: red", sentence["duration"]);
            console.log("%c Timestamp: ", "color: blue", sentence["start"]);
            swearingData.push(sentence["text"]);
            swearingData.push(sentence["duration"]);
            swearingData.push(sentence["start"]);
        } //else { console.log("No swear words found", sentence["text"]) }
    })

    // res.render("youtube_iframe", {
    //     url: video_id,
    //     swearingData: swearingData
    // });

    // res.send(swearingData);
})




module.exports = app;