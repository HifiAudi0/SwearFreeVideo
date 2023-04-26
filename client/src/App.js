import './App.css';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player/youtube'
import './neon-shadow-button-effect.css';

import './liquid-button-effect.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { motion } from "framer-motion";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Checkbox from '@mui/material/Checkbox';
import { green } from '@mui/material/colors';

// Note to self:
// Chrome deveeloper console - highlight object then ctrl+alt+click to expand all object properties
// Turbo console log = ctrl+alt+l (that is an lowercase L) after highlighting variable
// Emojis picker = Windows + .


// FEATURES TO ADD:
// If no transcript is availabile which happens, do not load the video at all, show error message to user.


// Videos with Confirmed swearing in them (for testing purposes): 
//https://www.youtube.com/watch?v=_SvIzSD0USE
// https://www.youtube.com/watch?v=2uvV1-02UCU 
// https://www.youtube.com/watch?v=2d4L1flXhLY- Swat video 5 total swear words
// https://www.youtube.com/watch?v=7RAJUzIO8kg TONS OF SWEARING Kanel Joseph
// https://www.youtube.com/watch?v=we6PRXmfils - Mr. Beast - 42 total swear words
// https://www.youtube.com/watch?v=-2JmHi9x7VY - Risk Kill Pete Channel - 40 words
// https://www.youtube.com/watch?v=kQWXoQZWlMw - South Park - 1o words detected

// Keeping tracking of swear words that are MAYBE not detected by the transcript
// Could be added manually in the future?
// "shittest", "dick", "vagina", "balls"
// Sometimes when music is playing with swears in it. Transcript says [Music] and no words are transcripted.

var data = [];

// var the_url = "";

function IntialPage() {

  // const [data, setData] = useState({}); // DEBUG FIX, do -not- use {} for objects. use [] for objects too. see console.log
  const [video_id, setVideoId] = useState("");
  const [the_url, setTheUrl] = useState("");

  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [tMinusNextSwearAt, setTMinusNextSwearAt] = useState(0);
  const [totalSwearWordsDetected, setTotalSwearWordsDetected] = useState(0);




  function LoadVideo(formUrl) {

    console.log("Inside LoadVideo() sending url:/sendUrl?url=", formUrl)

    axios.post("/sendUrl?url=" + formUrl)
      .then((jsonData) => {
        data = jsonData.data;
        setVideoId(/v=(.*)/.exec(formUrl)[1]);
      }).catch((err) => { console.log("REACT FETCH ERROR::: ", err); })

    // setInterval(function () {
    //   if (totalSwearWordsDetected <= 0) {
    //     console.log("No swear words detected!!!");
    //   }
    // }, 2000);


  }

  function startedPlaying() {
    // setInterval(function () {
    if (totalSwearWordsDetected <= 0) {
      console.log("No swear words detected!!!");
    }
    else {
      console.log(totalSwearWordsDetected + " swear words detected!!!")
    }
    // }, 2000);
  }

  setInterval(function () {



    var counter;
    var displaySwearingText = document.querySelector("#displaySwearingText");

    // console.log("DATA", data);
    var currentTimestamp = playerRef.current?.getCurrentTime();
    var nextSwearStartsAt = data[1];
    var nextSwearDurationIs = data[0];
    var endSwearingDuration = nextSwearStartsAt + nextSwearDurationIs;
    setTMinusNextSwearAt(Math.round(nextSwearStartsAt - currentTimestamp));
    setTotalSwearWordsDetected(data.length / 2)


    // console.log("Number:", totalSwearWordsDetected);
    // console.log("No swear words detected!!!");

    if (currentTimestamp > nextSwearStartsAt && currentTimestamp < endSwearingDuration) {
      // console.log("SWEARING INCOMING TIMSTAMP:::::", currentTimestamp);
      // console.log("__________________________________MUTE")
      // console.log("_____________________________________________")

      playerRef.current?.getInternalPlayer()?.mute();
      displaySwearingText.classList.add("show");
      displaySwearingText.classList.remove("hide");

      setIsMuted(true);

      counter = 0;
      // setData.shift();
      // setData.shift();
    } else if (currentTimestamp > endSwearingDuration) {
      playerRef.current?.getInternalPlayer()?.unMute();
      displaySwearingText.classList.add("hide");
      displaySwearingText.classList.remove("show");
      setIsMuted(false);
      if (counter != 1) {
        data.shift();
        data.shift();
        counter = 1;
      }
    } else {
      // console.log("NO SWEARING::::", currentTimestamp)
      // console.log("NO SWEARING NEXT SWEAR STARTS AT", nextSwearStartsAt)
      // console.log("NO SWEARING NEXT SWEAR DURATION IS", nextSwearDurationIs)
    }
  }, 500);

  return (
    <div className="bg">



      {/* <!-- NAV BAR --> */}

      <nav class="navbar navbar-expand-lg navbar-dark mx-auto">

        <div class="container-fluid">

          <img className="logo" src="./img/logo.png" />

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link fw-bold fs-3 active" aria-current="page" href="#home">HOME</a>
              <a class="nav-link fw-bold fs-3" href="#features">FEATURES</a>
              <a class="nav-link fw-bold fs-3" href="#faq">FAQ</a>
            </div>
          </div>
        </div>

      </nav>
      {/* <!-- NAV BAR ENDS --> */}


      <br /><br />
      <img className="swearingEmoji" src="./img/swearingEmoji.png" /><h1 id="home">Swear Free Video</h1>
      <p>Auto-detects swear words in YouTube videos and mutes the volume at each swear word in the video
        <br />Example use-case: A parent can watch a YouTube video with their child with only a few bad words in it.<br />Current version only works with YouTube videos. I am not endored, affiliated, or sponsored by YouTube in anyway. Youtube is a registered copyright and trademark of Google LLC.
      </p>

      <form onSubmit={(e) => {
        e.preventDefault();

        setTheUrl(document.getElementById("url").value);
        LoadVideo(document.getElementById("url").value);
        console.log("the url", the_url);
      }}>
        <label htmlFor="url">Youtube URL ( example:  https://www.youtube.com/watch?v=we6PRXmfils ) :</label><br />
        <div className="neonShadow"><input className="url" type="text" id="url" name="url" /></div>
        <button type="submit"><span id="submit">SUBMIT</span>
          <div className="liquid"></div></button>
        {/* <input className="liquid" type="submit" value="Submit">
        </input> */}
      </form>
      <img class="disclaimerImage" src="./img/disclaimer.png" />
      <ul>Disclaimer:<br />
        <li>This is tool is not a subsutite for parenting.</li><br />
        <li>This tool is not fool proof nor is it 100% accurate.</li><br />
        <li>Children should always be supervised.<br />This tool should be understood and operated with adult supervision.</li><br />
      </ul>
      <br /><br />
      <p>{data && `Debug data here: ${data}`}</p>
      <p>{the_url && `the url: ${the_url}`}</p>
      <p>Total Number of swear words detected is: <span id='counters'>{totalSwearWordsDetected}</span></p>
      {/* <p>{tMinusNextSwearAt && `T-minus next swear word in: <span id='counters'>  ${tMinusNextSwearAt} seconds</span>`}</p> */}

      <p>T-minus next swear word in: <span id='counters'>{tMinusNextSwearAt} seconds</span></p>

      <div>
        <h1 className="hide" id="displaySwearingText"></h1>
        <ReactPlayer
          url={the_url}
          playing
          controls
          volume={1}
          muted={false}
          // onProgress={handleProgress}
          ref={playerRef}
          id="videoPlayer"
          onStart={() => startedPlaying()}
        />
      </div>
      <Features />
      <Faq />
    </div>


  );
}

function Features() {

  return (
    <>
      <svg height="5px" width="150px">
        <line class="svgLine" x1="0" y1="0" x2="300" y2="0" />
      </svg>
      <h1 id="features">FEATURES</h1>
      <svg height="5px" width="150px">
        <line class="svgLine" x1="0" y1="0" x2="300" y2="0" />
      </svg>
      <br />     <br />
      {/* <div class="footer-grid-container">
        <div class="footer-grid-item"> */}
      <ul>
        <div className="featuresContainer">
          <li><img className="featuresIcons" src="./img/video.png" />
            <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Works on almost every video on Youtube</span></li><br />

          <li>
            {/* <img className="featuresIcons" src="./img/visual.png" /> */}
            <img className="featuresIcons" src="./img/muted.png" />
            <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Visual and audio notification of swearing</span></li><br />

          <li className="swearWord">
            <img className="featuresIcons" src="./img/curseIcon.png" />
            <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Swear word counter</span></li><br />

          <li className="swearCounter"><img className="featuresIcons" src="./img/countdown.jpeg" />
            <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Swear word countdown</span></li><br />

          <li className="easyToUse"><img className="featuresIcons" src="./img/easyToUse.png" />
            <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Easy to use - just paste and go!</span></li><br />

          <li className="noDownload"><img className="featuresIcons" src="./img/secure.png" />
            <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">No need to download anything - safe and secure.</span></li><br />
        </div>
      </ul>

      {/* </div>
      </div> */}
    </>
  );
}

function Faq() {
  return (
    <>
      <br /> <br /> <br /> <br />
      <svg height="5px" width="150px">
        <line class="svgLine" x1="0" y1="0" x2="300" y2="0" />
      </svg>
      <h1 id="faq">FAQ</h1>
      <svg height="5px" width="150px">
        <line class="svgLine" x1="0" y1="0" x2="300" y2="0" />
      </svg>
      <br /> <br />
      <Accordion className="accordion">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="accordHeading">Is it Free to use?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="accordPara">
            Yes, it is free to use.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className="accordion">
        <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
          <Typography className="accordHeading">How do I get started?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="accordPara">
            Just copy and paste the YouTube video URL into the form and click submit.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className="accordion">
        <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
          <Typography className="accordHeading">Is it safe to use?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="accordPara">
            Yes, it is safe to use. This service is web-based meaning, no need to download or install anything on your computer.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className="accordion">
        <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
          <Typography className="accordHeading">Does it work with any Youtube video?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="accordPara">
            Yes it works with almost any Youtube video, where an auto generated transcript is available.
            Not sure if it will work with your video? Just try it out!
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className="accordion">
        <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
          <Typography className="accordHeading">Why does the muting last for a few seconds or longer?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="accordPara">
            When a swear word is detected within a sentence, the muting will last until the end of the sentence. Not the start and end of any single word.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <br /> <br /><br /> <br />
    </>
  );
}

export { IntialPage };






// const myTimeout = setTimeout(checkTotalSwearWordsDetected, 1000);

// function checkTotalSwearWordsDetected() {
//   if (totalSwearWordsDetected <= 0) {
//     // console.log("Number:", totalSwearWordsDetected);
//     // console.log("No swear words detected!!!");
//   }

//   myStopFunction(myTimeout);
// }

// function myStopFunction(myTimeout) {
//   clearTimeout(myTimeout);
// }