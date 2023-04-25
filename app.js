const express = require("express");
const fs = require("fs");
const exphbs = require("express-handlebars");
const app = express();
const path = require("node:path"); // FIX half of the fix for vercel not working with views
const bodyParser = require("body-parser");
const router = express.Router();
var qs = require('qs'); // Need this to capture req.query instead of req.params
const e = require("express");
const spawn = require("child_process").spawn;
require("dotenv").config({ path: __dirname + "/.env" }); // FIX vercel .replace ERROR , always worked locally though
var cors = require('cors')
const validator = require('validator');

app.use(cors()) // FIX solves the following error: Access to XMLHttpRequest at  from origin has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource

app.use("/", router);


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




app.post("/sendUrl", (req, res, next) => {
    console.log("GOT INDEX POST REQUEST");
    // ! **CAUTION**: We are -NOT- checking req.query for malicious code
    console.log("URL", req.query);



    var video_id = /v=(\w\w\w\w\w\w\w\w\w\w\w)/.exec(req.query.url)[1];
    // console.log("video_id", sanitizedUrl);

    // See python notes at bottom of .py file
    // This block of code is not working, but it is not needed for the project
    // to function. It is just a nice to have feature.
    // pythonProcess.stdout.on('data', (data) => {
    //     console.log("(Node) Python said this to me: ", data.toString());
    // });

    /*
        if (video_id.length >= 12) {
    
            console.log("VIDEO ID is longer than 12 characters, so it is probably an invalid video id")
    
            let date_time = new Date();
            // get current date
            // adjust 0 before single digit date
            let date = ("0" + date_time.getDate()).slice(-2);
    
            // get current month
            let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    
            // get current year
            let year = date_time.getFullYear();
    
            // get current hours
            let hours = date_time.getHours();
    
            // get current minutes
            let minutes = date_time.getMinutes();
    
            // get current seconds
            let seconds = date_time.getSeconds();
    
            // prints date in YYYY-MM-DD format
            console.log(year + "-" + month + "-" + date);
    
            // prints date & time in YYYY-MM-DD HH:MM:SS format
            console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    
            fs.appendFile('.security.log', `\nAttempt to read file ${req.query.url} on year: ${year}  month: ${month} day: ${date} @ ${hours} hours and ${minutes} minutes and ${seconds} seconds`, 'utf-8', (err) => {
    
                console.log("video_is was longer then 11 charchters, so it is probably an invalid video id and unsafe to proceed with the request....exiting....");
    
                process.exit(1)
            });
        }
    */

    var fetchTrandscript = spawn('python', ["fetch_transcript.py", video_id]);

    fetchTrandscript.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    fetchTrandscript.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    fetchTrandscript.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);

        // fetchTranscriptReadFile().then((data) => {

        // WARNING
        // SNYK
        // Path Traversal: Unsanitized input from an HTTP parameter flows into fs.readFileSync, where it is use...
        // deepcode ignore PT: <please specify a reason of ignoring this>

        data = fs.readFileSync(`./transcripts/${video_id}.json`, 'utf8')
        // WARNING
        // SNYK
        // Path Traversal: Unsanitized input from an HTTP parameter flows into fs.readFileSync, where it is use...

        // console.log("DATA:::::::::  ", data)
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
                // swearingData.push(sentence["text"]);
                swearingData.push(sentence["duration"]);
                swearingData.push(sentence["start"]);
            } //else { console.log("No swear words found", sentence["text"]) }
        })
        console.log("SWEARING DATA", swearingData)
        console.log("EXPRESS I SHOULD BE SENDING DATA NOW BACK TO CLIENT");
        res.locals.swearingData = swearingData;
        res.locals.url = video_id;
        // next();

        // res.render("youtube_iframe", {
        //     url: video_id,
        //     swearingData: swearingData
        // });
        let jsonSwearingData = JSON.stringify(swearingData);
        res.json(swearingData);

    })
});
// })

// router.post("/sendUrl", (req, res) => {
//     res.send(`Swearing Data 2nd middleware: ${res.locals.swearingData}`);

// });



module.exports = app;