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
    <div className="bg" id="gradient">



      {/* <!-- NAV BAR --> */}

      <nav className="navbar navbar-expand-lg navbar-dark mx-auto">

        {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button> */}

        <div className="" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-link fw-bold fs-3 active " aria-current="page" href="#home">HOME</a>
            <a className="nav-link fw-bold fs-3" href="#features">FEATURES</a>
            <a className="nav-link fw-bold fs-3" href="#disclaimer">DISCLAIMER</a>
            <a className="nav-link fw-bold fs-3" href="#faq">FAQ</a>
          </div>
        </div>


      </nav>
      {/* <!-- NAV BAR ENDS --> */}


      <br /><br />


      <form onSubmit={(e) => {
        e.preventDefault();

        setTheUrl(document.getElementById("url").value);
        LoadVideo(document.getElementById("url").value);
        console.log("the url", the_url);
      }}><br /><br /><br /><br /><br /><br /><br /><br />
        <img className="logo" src="./img/logo.png" /><br />
        <label htmlFor="url">Youtube URL ( example:  https://www.youtube.com/watch?v=we6PRXmfils ) :</label><br />
        <div className="neonShadow"><input className="url" type="text" id="url" name="url" /></div>
        <button type="submit"><span id="submit">SUBMIT</span>
          <div className="liquid"></div></button>
        {/* <input className="liquid" type="submit" value="Submit">
        </input> */}
      </form>


      <div className="info">
        <img className="infoBlueBg" src="./img/infoBlue.png" />
        <img className="infoBlueIcon" src="./img/infoBulb.png" />
        <h1 className="infoHeading infoBlueHeading">What does it do?</h1>
        <div className="swearFreePara">
          Auto-detects swear words in YouTube videos and mutes the volume at each swear word sentence in the video<br /><br />
          {/* Example use-case: A parent can watch a YouTube video with their child with only a few bad words in it with the swear words muted.<br /> */}
        </div>
      </div>

      <br /><br />


      <div className="info">
        <img className="infoBlueBg" src="./img/infoYellow.png" />
        <img className="infoBlueIcon" src="./img/infoCompt.png" />
        <h1 className="infoHeading infoYellowHeading">Compatibility</h1>
        <div className="swearFreePara">
          Current version only works with YouTube videos. I am not endored, affiliated, or sponsored by YouTube in anyway. Youtube is a registered copyright and trademark of Google LLC.
        </div>
      </div>


      <Disclaimer />



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

function Disclaimer() {
  return (
    <>
      <br />  <br />
      <div className="info">
        <img className="infoBlueBg" src="./img/infoRed.png" />
        <img className="infoBlueIcon disclaimerImage" src="./img/disclaimer2.png" />
        <h1 className="infoHeading infoRedHeading">Disclaimer</h1>
        <div className="swearFreePara">
          This is tool is not a subsutite for parenting.<br />
          This tool is not fool proof nor is it 100% accurate.<br />
          Children should always be supervised.<br />
          This tool should be operated with adult supervision.<br />
        </div>
      </div>
      {/* 
      <img className="disclaimerImage" src="./img/disclaimer2.png" />

      <div className="disclaimerPara">
        This is tool is not a subsutite for parenting.<br />
        This tool is not fool proof nor is it 100% accurate.<br />
        Children should always be supervised.<br />This tool should be understood and operated with adult supervision.<br />
      </div> */}

    </>
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



      {

        // <ul>
        //   <div className="featuresContainer">
        //     <li><img className="featuresIcons" src="./img/video2.png" />
        //       <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Works on almost every video on Youtube</span></li><br />


        //     <li className="autoDetect">
        //       <img className="featuresIcons" src="./img/autoDetectRed.png" />
        //       <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Automatically detects swear words</span></li><br />

        //     <li>
        //       <img className="featuresIcons" src="./img/muted3.png" />
        //       <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Visual and audio notification of swearing</span></li><br />

        //     <li className="swearWord">
        //       <img className="featuresIcons" src="./img/counter.png" />
        //       <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Swear word counter</span></li><br />

        //     <li className="swearCounter"><img className="featuresIcons" src="./img/countdown.jpeg" />
        //       <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Swear word countdown</span></li><br />

        //     <li className="easyToUse"><img className="featuresIcons" src="./img/easyToUse2.png" />
        //       <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">Easy to use - just paste and go!</span></li><br />

        //     <li className="noDownload"><img className="featuresIcons" src="./img/safeSecure3.png" />
        //       <Checkbox className="featurePara" disabled defaultChecked /><span className="featurePara">No need to download anything - safe and secure.</span></li><br />
        //   </div>
        // </ul>

      }


      < div className="featuresContainer">


        <div className="featureList">
          <img src="./img/featuresList1.png" className="featureListHex" />
          <img src="./img/safeSecure3-v2.png" className="featureListAutoDetect featureListIcon" />
          <h3 id="pinkGradient" className="featureListHeading featureGradient featureHeadingSecure">No need to download anything - safe and secure.</h3>
        </div>


        <div className="featureList">
          <img src="./img/featuresList2.png" className="featureListHex" />
          <img src="./img/autoDetectOrangish.png" className="featureListAutoDetect featureListIcon featureListIconBottom" />
          <h3 id="orangeGradient" className="featureListHeading featureGradient featureHeadingDetect">Automatically detects swear words</h3>
        </div>
        <br />     <br />     <br />

        <div className="featureList">
          <img src="./img/featuresList3-v3.png" className="featureListHex" />
          <img src="./img/easyToUseYellowish.png" className="featureListAutoDetect featureListIcon" />
          <h3 id="yellowGradient" className="featureListHeading featureGradient ">Just paste and go!</h3>
        </div>


        <div className="featureList">
          <img src="./img/featuresList4.png" className="featureListHex" />
          <img src="./img/videoPlayerPurpleish.png" className="featureListAutoDetect featureListIcon featureListIconBottom " />
          <h3 id="purpleGradient" className="featureListHeading featureGradient featureHeadingWorksEvery">Works on almost every video on Youtube</h3>
        </div>

        <br />     <br />     <br />

        <div className="featureList">
          <img src="./img/featuresList5.png" className="featureListHex" />
          <img src="./img/mutedTealish.png" className="featureListAutoDetect featureListIcon" />
          <h3 id="tealGradient" className="featureListHeading featureGradient featureHeadingAudioVideo">Visual and audio notification of swearing</ h3>
        </div>

        <div className="featureList">
          <img src="./img/featuresList6.png" className="featureListHex" />
          <img src="./img/countdownGreenish.png" className="featureListAutoDetect featureListIcon featureListIconBottom " />
          <h3 id="greenGradient" className="featureListHeading featureGradient featureHeadingCountdown">Swear word countdown</h3>
        </div>

        <div className="featureList">
          <img src="./img/featuresList7.png" className="featureListHex" />
          <img src="./img/counter-v2.png" className="featureListAutoDetect featureListIcon" />
          <h3 id="redGradient" className="featureListHeading featureGradient ">Swear word counter</h3>
        </div>


      </div >
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
          <Typography className="accordHeading">Muting lasts for a few seconds or longer, why?</Typography>
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