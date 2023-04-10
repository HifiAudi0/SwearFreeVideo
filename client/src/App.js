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

  // const handleProgress = (state) => {
  //   if (state.playedSeconds >= 49 && !isMuted) {
  //     playerRef.current?.getInternalPlayer()?.mute();
  //     setIsMuted(true);
  //   } else if (state.playedSeconds >= 50 && isMuted) {
  //     playerRef.current?.getInternalPlayer()?.unMute();
  //     setIsMuted(false);
  //   }
  // };
  


  // useEffect(() => {

    // Videos with Confirmed swearing in them: 
    //https://www.youtube.com/watch?v=_SvIzSD0USE
    // https://www.youtube.com/watch?v=2uvV1-02UCU 
    // https://www.youtube.com/watch?v=2d4L1flXhLY- ALOT OF SWEARING OVER 300 TIMES I THINK
    // https://www.youtube.com/watch?v=7RAJUzIO8kg TONS OF SWEARING Kanel Joseph

    // setTheUrl("https://www.youtube.com/watch?v=_SvIzSD0USE");

    // Using axios instead of fetch fixed an issue where we got a response but not the data we wanted.
function LoadVideo() {
    axios.post("/sendUrl?url=" + the_url)
      .then((jsonData) => {
        // setData(jsonData.data);
        data = jsonData.data;
        setVideoId(/v=(.*)/.exec(the_url)[1]);
        // var id = /v=(.*)/.exec(the_url)[1];
      }).catch((err) => { console.log("REACT FETCH ERROR::: ", err); })
    }
  // }, [])

  setInterval(function () {

    var counter;

    const removeItem = (index) => {
      // setData(prevItems => prevItems.filter((_, i) => i !== index));
    }

    console.log("_____________________________________________ DATA", data);
    var currentTimestamp = playerRef.current?.getCurrentTime();
    var nextSwearStartsAt = data[1];
    var nextSwearDurationIs = data[0];
    var endSwearingDuration = nextSwearStartsAt + nextSwearDurationIs;
    setTMinusNextSwearAt(Math.round(nextSwearStartsAt - currentTimestamp));

    if (currentTimestamp > nextSwearStartsAt && currentTimestamp < endSwearingDuration) {
      console.log("SWEARING INCOMING TIMSTAMP:::::", currentTimestamp);
      console.log("__________________________________MUTE")
      console.log("_____________________________________________")

      playerRef.current?.getInternalPlayer()?.mute();
      setIsMuted(true);

      counter = 0;
      // setData.shift();
      // setData.shift();
    } else if (currentTimestamp > endSwearingDuration) {
      playerRef.current?.getInternalPlayer()?.unMute();
      setIsMuted(false);
      if (counter != 1) {
        // console.log("----------------------------------------------")
        // console.log("....................REMOVING ITEMS............")
        // console.log("----------------------------------------------")
        // removeItem(0);
        // removeItem(1);
        data.shift();
        data.shift();
        counter = 1;
      }
    } else {
      // console.log("NO SWEARING::::", currentTimestamp)
      console.log("NO SWEARING NEXT SWEAR STARTS AT", nextSwearStartsAt)
      console.log("NO SWEARING NEXT SWEAR DURATION IS", nextSwearDurationIs)
    }
  }, 800); // This SHOULD be 800 under 1 second, in the future. 2800 temporarily.

  return (
    <div className="bg">
      {/* WORKS - <form onSubmit={() => fetchSubmit(document.getElementById("url").value)}> */}
      {/*  WORKS - jsonSwearingData = FetchSubmit({ url: document.getElementById("url").value }) */}
      <form onSubmit={(e) => { 
         e.preventDefault(); 
   
        setTheUrl(document.getElementById("url").value); 
        LoadVideo();
        console.log("the url", the_url); 
        }}>
        <label htmlFor="url">Youtube URL (example: https://www.youtube.com/watch?v=_SvIzSD0USEI) :</label><br />
        <input className="url" type="text" id="url" name="url" />
        <button id="" type="submit"><span>SUBMIT</span>
        <div className="liquid"></div></button>
        {/* <input className="liquid" type="submit" value="Submit">
        </input> */}
      </form>
      <ul>Disclaimer:<br/>
      <li>This is tool is not a subsutite for parenting.</li>
      <li>This tool is not fool proof nor is it 100% accurate.</li>
      <li>Children should always be supervised when using this tool.</li>
      </ul>

      <p>{data && `DATA here: ${data}`}</p>
      <p>{the_url && `the url: ${the_url}`}</p>
      <p>{tMinusNextSwearAt && `T-minus next swear word in: ${tMinusNextSwearAt} seconds`}</p>
      {/* {video_id && <LoadVideo video_id={video_id} data={data} />} */}


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

      
        // player.loadVideoById(`${video_id["video_id"]}`, 5, "large") // a bit of hack to get the video_id to load. For some reason, if we don't include this line, it will break it. This may cause unexpected issues, but it works for now.

      
      // setInterval(function () {  console.log("STAMP:::::::", player.playerInfo.currentTime)  }, 800);



export { IntialPage };




        // try {
        //   console.log("CURRENT TIME STAMP IS FROSTFROSTFROSTFROSTFROST", player.playerInfo.currentTime)
        // } catch (err) {
        //   console.log("ERROR IS", err)
        // }


        
      // console.log("LENGTH", video_id["data"].length)



// try {
//   console.log("CURRENT TIME STAMP IS BLINKBLINKBLINKBLINK", player.playerInfo.currentTime)
// } catch (err) {
//   console.log("ERROR IS", err)
// }


// document.getElementById("video").addEventListener("onvolumechange", e => {
//   // Change your custom control UI
// });


// console.log("onPlayerStateChange called with event:", event);
// console.log("Player state:", player.getPlayerState);



// setInterval(function () {
//   try {
//     console.log("CURRENT TIME STAMP IS MOUSEMOUSEMOUSEMOUSEMOUSEMOUSEMOUSE", player.playerInfo.currentTime)
//   } catch (err) {
//     console.log("ERROR IS", err)
//   }
//     console.log("PLAYER1111111111", player)
//     console.log("NEXT SWEARING IS AT", video_id["data"][1])
//     console.log("NEXT SWEARING DURATION LASTS FOR", video_id["data"][0])

//     // This way of doing it - will -not- work with REWINDING
//     if (currentTimestamp > video_id["data"][1] && currentTimestamp < video_id["data"][0]) {
//       console.log("SWEARING INCOMING TIMSTAMP:::::", currentTimestamp);
//       console.log("FIRST MUTEEEEEEEEEEEEEEEEEE")
//       player.mute();
//       video_id["data"].shift();
//       video_id["data"].shift();
//     } else { console.log("NO SWEARING::::", currentTimestamp) }
// }, 500, player);


// setUrl(`${document.getElementById("url").value}`)
// setUrl("https://www.youtube.com/watch?v=IhQmXaEhksI")

// var currentTimestamp = 0;
// var startSwearing = 67.32;
// var durationSwearing = 12.24;

// var counter = 0;
// video_id["data"].map((eachSwearPoint) => {
//   if (counter % 2 == 0) {
//     // even number
//     console.log("SWEAR DURATION", eachSwearPoint)
//   }
//   else {
//     // odd number
//     console.log("SWEAR START", eachSwearPoint)
//   }
//   counter++;
// })





