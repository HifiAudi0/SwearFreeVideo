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

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;


// Note to self:
// Chrome deveeloper console - highlight object then ctrl+alt+click to expand all object properties
// Turbo console log = ctrl+alt+l (that is an lowercase L) after highlighting variable
// Emojis picker = Windows + .


// FEATURES TO ADD:
// If no transcript is availabile which happens, do not load the video at all, show error message to user.
// Add multiple languages support
// add clearInterval so we only run interval function when video is playing
// Watching multiple videos WITHOUT refreshing the page is still buggy.


// Videos with Confirmed swearing in them (for testing purposes): 
// ENGLISH
//https://www.youtube.com/watch?v=_SvIzSD0USE
// https://www.youtube.com/watch?v=2uvV1-02UCU 
// https://www.youtube.com/watch?v=2d4L1flXhLY- Swat video 5 total swear words
// https://www.youtube.com/watch?v=7RAJUzIO8kg TONS OF SWEARING Kanel Joseph
// https://www.youtube.com/watch?v=we6PRXmfils - Mr. Beast - 42 total swear words
// https://www.youtube.com/watch?v=-2JmHi9x7VY - Risk Kill Pete Channel - 40 words
// https://www.youtube.com/watch?v=kQWXoQZWlMw - South Park - 1o words detected

// SPAIN/SPANISH
// https://www.youtube.com/watch?v=S95rBrTJGF0
// https://www.youtube.com/watch?v=VFJb5Ut95mI - A LOT
// https://www.youtube.com/watch?v=jFVyEdQCZYg - pepa pig

// Italy/Italian
// https://www.youtube.com/watch?v=CHbxVhzVF5k - South Park

// France/French 
// https://www.youtube.com/watch?v=e_zJLS-5POo - Only 1 swear word
// https://www.youtube.com/watch?v=Ng2lqQlRkmA - 5 swear words music video
// https://www.youtube.com/watch?v=rq0FllWlGpk - A LOT - South Park

// Videos with -no- transcript availabile (for testing purposes):
// https://www.youtube.com/watch?v=xXTujbDlfuA - No transcript availabile (English)
// https://www.youtube.com/watch?v=a5ffLo6JSy4 - No transcript availabile (English)

// Keeping tracking of swear words that are MAYBE not detected by the transcript
// Could be added manually in the future?
// "shittest", "dick", "vagina", "balls"
// Sometimes when music is playing with swears in it. Transcript says [Music] and no words are transcripted.

var data = [];

// var the_url = "";

function IntialPage() {

  // const [data, setData] = useState({}); // DEBUG FIX, do -not- use {} for objects. use [] for objects too. see console.log

  const [the_url, setTheUrl] = useState("");

  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [tMinusNextSwearAt, setTMinusNextSwearAt] = useState(0);
  const [totalSwearWordsDetected, setTotalSwearWordsDetected] = useState(0);

  /* framer-motion */
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  var [goodResponse, setGoodResponse] = useState(false);

  const [err, setErr] = useState("");

  console.log("Good response?????", goodResponse);


  function LoadVideo(formUrl) {



    console.log("Inside LoadVideo() sending url:/sendUrl?url=", formUrl)

    formUrl = /v=(\w\w\w\w\w\w\w\w\w\w\w)/.exec(formUrl)[1];

    setTheUrl("https://www.youtube.com/watch?v=" + formUrl);

    axios.post("https://www.swearfreevideos.com:51655/sendUrl?url=" + formUrl)
      // axios.post("http://ec2-3-145-171-139.us-east-2.compute.amazonaws.com:49655/sendUrl?url=" + formUrl)
      // axios.post("http://127.0.0.1:3005/sendUrl?url=" + formUrl)
      // axios.post("/login?url=" + formUrl)
      .then((jsonData) => {
        data = jsonData.data;

        if (typeof (data) == "object") { setGoodResponse(true); console.log("Response was a success", goodResponse); }
        console.log("Error[0]", data)
        console.log("Typof.....", typeof (data))
        console.log("response status...........", jsonData.status)

        // Give me an example of res.sendStatus

      }).catch((error) => {


        /* check if response was a success or not */
        // console.log("Pattern checking...........")
        // let pattern = /^\d+\W\d+$/;
        // let result = pattern.test(data);
        // setErr(error.response.data);
        setErr(error.response.data)
        console.log("REACT FETCH ERROR::: ", error);
        console.log("type of err", typeof (error), "ERROR====", error.response.data)
      })

    // setInterval(function () {
    //   if (totalSwearWordsDetected <= 0) {
    //     console.log("No swear words detected!!!");
    //   }
    // }, 2000);


  }

  // function startedPlaying() {
  //   if (totalSwearWordsDetected <= 0) {
  //     console.log("No swear words detected!!!");
  //   }
  //   else {
  //     console.log(totalSwearWordsDetected + " swear words detected!!!")
  //     console.log("TYPEOF................", typeof (data))
  //   }
  // }


  function currentlyPlaying() {
    var counter;
    var displaySwearingText = document.querySelector("#displaySwearingText");

    // console.log("DATA", data);
    var currentTimestamp = playerRef.current?.getCurrentTime();
    var nextSwearStartsAt = data[1];
    var nextSwearDurationIs = data[0];
    var endSwearingDuration = nextSwearStartsAt + nextSwearDurationIs;
    setTMinusNextSwearAt(Math.round(nextSwearStartsAt - currentTimestamp));
    if (typeof (data) == "object") {
      setTotalSwearWordsDetected(data.length / 2)
    }
    else {
      setTotalSwearWordsDetected(0)
    }

    // console.log("Number:", totalSwearWordsDetected);
    // console.log("No swear words detected!!!");

    if (currentTimestamp > nextSwearStartsAt && currentTimestamp < endSwearingDuration) {
      // console.log("SWEARING INCOMING TIMSTAMP:::::", currentTimestamp);

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
  }



  return (
    <div className="bg">



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
      <br />
      {/* <!-- NAV BAR ENDS --> */}
      <div className="bgImage"></div>




      <form onSubmit={(e) => {
        e.preventDefault();

        setTheUrl(document.getElementById("url").value);
        LoadVideo(document.getElementById("url").value);
        console.log("the url", the_url);
      }}>

        <br /><br />

        <img className="logo" src="./img/logo.png" alt="Company logo image" /><br />

        <p>Languages supported:<br />
          🇺🇸 English, 🇪🇸 Spanish, 🇮🇹 Italian and 🇩🇪 German. More languages coming soon!
        </p>

        <label htmlFor="url" alt="An input box to input the url of the video to load.">Youtube&#169;&trade; URL ( example:  https://www.youtube.com/watch?v=we6PRXmfils ) :</label><br />

        <div className="neonShadow"><input className="url" type="text" id="url" name="url" /></div>


        <button type="submit"><span id="submit">SUBMIT</span>

          <div className="liquid"></div>
        </button>

        {/* <input className="liquid" type="submit" value="Submit">
        </input> */}
      </form>

      <h3>Video Player Information:</h3>
      <div className="statusBg">
        <p>Status: <span id={goodResponse ? 'green' : 'red'}>{goodResponse ? "Ready to play!" : err}</span></p>
        {/* <p>{the_url && `the url: ${the_url}`}</p> */}
        <p>Total Number of swear words detected (remaining) is: <span id='counters'>{totalSwearWordsDetected}</span></p>

        <p>T-minus next swear word in: <span id='counters'>{tMinusNextSwearAt} seconds</span></p>
      </div>


      <h3>Video Player:</h3>
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
          onPlay={() =>
            setInterval(currentlyPlaying, 500)}
          width={"50rem"}
          height={"40rem"}
          className="reactPlayer"
        />
      </div>

      <br /><br />

      <motion.div
        initial={false}
        animate={
          isLoaded && isInView
            ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
            : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
        }
        transition={{ duration: 1, delay: 1 }}
        viewport={{ once: true }}
        onViewportEnter={() => setIsInView(true)}
      >

        <div className="info" onLoad={() => setIsLoaded(true)} >
          <img className="infoBg" src="./img/infoBlue.png" alt="Background to hold text" />
          <img className="infoIcon" src="./img/infoBulb.png" alt="Lightbulb icon" />
          <h1 className="infoHeading infoBlueHeading">What does it do?</h1>
          <div className="swearFreePara">
            Auto-detects swear words in videos and mutes the volume at each swear word sentence in the video. Current version only works with YouTube&#169;&trade; videos.<br /><br />
            {/* Example use-case: A parent can watch a YouTube video with their child with only a few bad words in it with the swear words muted.<br /> */}
          </div>
        </div>

        <br /><br />


        <div className="info">
          <img className="infoBg" src="./img/infoYellow.png" alt="Background to hold text" />
          <img className="infoIcon" src="./img/infoCompt.png" alt="A gear icon for compatibility" />
          <h1 className="infoHeading infoYellowHeading">Compatibility</h1>
          <div className="swearFreePara">
            Current version works with YouTube&#169;&trade; videos. I am not endored, affiliated, or sponsored by YouTube&#169;&trade; in anyway. Youtube&#169;&trade; is a registered copyright and trademark of Google LLC.
          </div>
        </div>


        <br />  <br />
        <div className="info" onLoad={() => setIsLoaded(true)} >
          <img className="infoBg" src="./img/infoRed.png" alt="Background to hold text" />
          <img className="infoIcon disclaimerImage" src="./img/disclaimer2.png" alt="A disclaimer image" />
          <h1 className="infoHeading infoRedHeading">Disclaimer</h1>
          <div className="swearFreePara">
            This is tool is not a subsutite for parenting.<br />
            This tool is not fool proof nor is it 100% accurate.<br />
            This tool should be operated with adult supervision.<br />
          </div>
        </div>

      </motion.div>



      <Features />
      <Faq />
    </div>


  );
}


function Features() {

  /* framer-motion */
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  return (
    <>

      <motion.div
        initial={false}
        animate={
          isLoaded && isInView
            ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
            : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
        }
        transition={{ duration: 1, delay: 1 }}
        viewport={{ once: true }}
        onViewportEnter={() => setIsInView(true)}
      >

        <div onLoad={() => setIsLoaded(true)} >


          <svg height="5px" width="150px">
            <line class="svgLine" x1="0" y1="0" x2="300" y2="0" />
          </svg>
          <h2 id="features">FEATURES</h2>
          <svg height="5px" width="150px">
            <line class="svgLine" x1="0" y1="0" x2="300" y2="0" />
          </svg>
          <br />     <br />

          < div className="featuresContainer">

            <div className="featureList">
              <img src="./img/featuresList1.png" className="featureListHex" alt="A background icon to hold heading and text" />
              <img src="./img/safeSecure3-v2.png" className="featureListAutoDetect featureListIcon" alt="A safe and secure icon" />
              <h3 id="pinkGradient" className="featureListHeading featureGradient featureHeadingSecure">No need to download anything - safe and secure.</h3>
            </div>


            <div className="featureList">
              <img src="./img/featuresList2.png" className="featureListHex" alt="A background icon to hold heading and text" />
              <img src="./img/autoDetectOrangish.png" className="featureListAutoDetect featureListIcon featureListIconBottom" alt="A bullseye icon" />
              <h3 id="orangeGradient" className="featureListHeading featureGradient featureHeadingDetect">Automatically detects swear words</h3>
            </div>
            <br />     <br />     <br />

            <div className="featureList">
              <img src="./img/featuresList3-v3.png" className="featureListHex" alt="A background icon to hold heading and text" />
              <img src="./img/easyToUseYellowish.png" className="featureListAutoDetect featureListIcon" alt="A ponting hand, clicking like a mouse." />
              <h3 id="yellowGradient" className="featureListHeading featureGradient ">Just paste and go!</h3>
            </div>


            <div className="featureList">
              <img src="./img/featuresList4.png" className="featureListHex" alt="A background icon to hold heading and text" />
              <img src="./img/videoPlayerPurpleish.png" className="featureListAutoDetect featureListIcon featureListIconBottom " alt="A video player icon" />
              <h3 id="purpleGradient" className="featureListHeading featureGradient featureHeadingWorksEvery">Works on almost every video on Youtube&#169;&trade;</h3>
            </div>

            <br />     <br />     <br />

            <div className="featureList">
              <img src="./img/featuresList5.png" className="featureListHex" alt="A background icon to hold heading and text" />
              <img src="./img/mutedTealish.png" className="featureListAutoDetect featureListIcon" alt="A audio icon that is muted." />
              <h3 id="tealGradient" className="featureListHeading featureGradient featureHeadingAudioVideo">Visual and audio notification of swearing</ h3>
            </div>

            <div className="featureList">
              <img src="./img/featuresList6.png" className="featureListHex" alt="A background icon to hold heading and text" />
              <img src="./img/countdownGreenish.png" className="featureListAutoDetect featureListIcon featureListIconBottom " alt="A icon representing a counter of numbers" />
              <h3 id="greenGradient" className="featureListHeading featureGradient featureHeadingCountdown">Swear word countdown</h3>
            </div>

            <div className="featureList">
              <img src="./img/featuresList7.png" className="featureListHex" alt="A background icon to hold heading and text" />
              <img src="./img/counter-v2.png" className="featureListAutoDetect featureListIcon" alt="An icon representing how many swear words are counted total." />
              <h3 id="redGradient" className="featureListHeading featureGradient ">Swear word counter</h3>
            </div>

          </div>
        </div >

      </motion.div>

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
            Just copy and paste the YouTube&#169;&trade; video URL into the form and click submit.
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
          <Typography className="accordHeading">Does it work with any Youtube&#169;&trade; video?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="accordPara">
            Yes it works with almost any Youtube&#169;&trade; video, where an auto generated transcript is available.
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
      <Accordion className="accordion">
        <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
          <Typography className="accordHeading">What languages are currently supported?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="accordPara">
            The languages currently supported area: 🇺🇸 English, 🇪🇸 Spanish, 🇮🇹 Italian and 🇩🇪 German. More languages are coming soon, stay tuned!
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




{/* 
      <img className="disclaimerImage" src="./img/disclaimer2.png" />

      <div className="disclaimerPara">
        This is tool is not a subsutite for parenting.<br />
        This tool is not fool proof nor is it 100% accurate.<br />
        Children should always be supervised.<br />This tool should be understood and operated with adult supervision.<br />
      </div> */}



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