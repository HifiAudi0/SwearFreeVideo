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


  function LoadVideo() {
    axios.post("/sendUrl?url=" + the_url)
      .then((jsonData) => {
        data = jsonData.data;
        setVideoId(/v=(.*)/.exec(the_url)[1]);
      }).catch((err) => { console.log("REACT FETCH ERROR::: ", err); })
  }


  setInterval(function () {

    var counter;

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
      setIsMuted(true);

      counter = 0;
      // setData.shift();
      // setData.shift();
    } else if (currentTimestamp > endSwearingDuration) {
      playerRef.current?.getInternalPlayer()?.unMute();
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
  }, 800);

  return (
    <div className="bg">
      <h1>YouTube Swearing Blocker</h1>
      <h3>Auto-detects swear words in YouTube videos and mutes the volume at each swear word in the video.</h3>
      <h3>Example use-case: A parent can watch a YouTube video with their child with only a few bad words in it.</h3>
      <form onSubmit={(e) => {
        e.preventDefault();

        setTheUrl(document.getElementById("url").value);
        LoadVideo();
        console.log("the url", the_url);
      }}>
        <label htmlFor="url">Youtube URL (example:  https://www.youtube.com/watch?v=7RAJUzIO8kg) :</label><br />
        <input className="url" type="text" id="url" name="url" />
        <button id="" type="submit"><span>SUBMIT</span>
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
      <p>{totalSwearWordsDetected && `Total Number of swear words detected is: ${totalSwearWordsDetected}`}</p>
      <p>{tMinusNextSwearAt && `T-minus next swear word in: ${tMinusNextSwearAt} seconds`}</p>

      <div>
        <ReactPlayer
          url={the_url}
          playing
          controls
          volume={1}
          muted={false}
          // onProgress={handleProgress}
          ref={playerRef}
        />
      </div>
    </div>
  );
}

export { IntialPage };


