import './App.css';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player/youtube'
import './neon-shadow-button-effect.css';
import './liquid-button-effect.css';
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

// Keeping tracking of swear words that are MAYBE not detected by the transcript
// Could be added manually in the future?
// "shittest", "dick", "vagina"

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
      <h1>YouTube Swearing Blocker</h1>
      <h3>Auto-detects swear words in YouTube videos and mutes the volume at each swear word in the video.</h3>
      <h3>Example use-case: A parent can watch a YouTube video with their child with only a few bad words in it.</h3>
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
      <ul>Disclaimer:<br />
        <li>This is tool is not a subsutite for parenting.</li>
        <li>This tool is not fool proof nor is it 100% accurate.</li>
        <li>Children should always be supervised. This tool should be understood and operated with adult supervision.</li>
      </ul>

      <p>{data && `DATA here: ${data}`}</p>
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
        />
      </div>
    </div>
  );
}

export { IntialPage };


