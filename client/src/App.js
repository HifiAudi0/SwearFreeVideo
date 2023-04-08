import './App.css';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player/youtube'

// Note to self:
// Chrome deveeloper console - highlight object then ctrl+alt+click to expand all object properties
// Turbo console log = ctrl+alt+l (that is an lowercase L) after highlighting variable
// Emojis picker = Windows + .

function IntialPage() {

  const [data, setData] = useState({}); // DEBUG FIX, do -not- use {} for objects. use [] for objects too. see console.log
  const [video_id, setVideoId] = useState("");

  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const handleProgress = (state) => {
    if (state.playedSeconds >= 49 && !isMuted) {
      playerRef.current?.getInternalPlayer()?.mute();
      setIsMuted(true);
    } else if (state.playedSeconds >= 50 && isMuted) {
      playerRef.current?.getInternalPlayer()?.unMute();
      setIsMuted(false);
    }
  };
  


  useEffect(() => {

    // Videos with Confirmed swearing in them: 
    //https://www.youtube.com/watch?v=_SvIzSD0USE
    // https://www.youtube.com/watch?v=2uvV1-02UCU - ALOT OF SWEARING OVER 300 TIMES I THINK
    // https://www.youtube.com/watch?v=2d4L1flXhLY

    var the_url = "/sendUrl?url=https://www.youtube.com/watch?v=_SvIzSD0USE";

    // Using axios instead of fetch fixed an issue where we got a response but not the data we wanted.

    axios.post(the_url)
      .then((jsonData) => {
        setData(jsonData.data);
        setVideoId(/v=(.*)/.exec(the_url)[1]);
        // var id = /v=(.*)/.exec(the_url)[1];
      }).catch((err) => { console.log("REACT FETCH ERROR::: ", err); })

  }, [])

  setInterval(function () {

    console.log("_____________________________________________", video_id["data"]);
    var currentTimestamp = playerRef.current?.getCurrentTime();
    var nextSwearStartsAt = video_id["data"][1];
    var nextSwearDurationIs = video_id["data"][0];
    var endSwearingDuration = nextSwearStartsAt + nextSwearDurationIs;

    if (currentTimestamp > nextSwearStartsAt && currentTimestamp < endSwearingDuration) {
      console.log("SWEARING INCOMING TIMSTAMP:::::", currentTimestamp);
      console.log("__________________________________FIRST MUTE")
      console.log("_____________________________________________")

      video_id["data"].shift();
      video_id["data"].shift();
    } else {
      console.log("NO SWEARING::::", currentTimestamp)
      console.log("NO SWEARING NEXT SWEAR STARTS AT", nextSwearStartsAt)
      console.log("NO SWEARING NEXT SWEAR DURATION IS", nextSwearDurationIs)
    }
  }, 2800); // This SHOULD be 800 under 1 second, in the future. 2800 temporarily.

  return (
    <>
      {/* WORKS - <form onSubmit={() => fetchSubmit(document.getElementById("url").value)}> */}
      {/*  WORKS - jsonSwearingData = FetchSubmit({ url: document.getElementById("url").value }) */}
      <form onSubmit={() => { }}>
        <label htmlFor="url">Youtube URL (example: https://www.youtube.com/watch?v=_SvIzSD0USEI) :</label><br />
        <input className="url" type="text" id="url" name="url" /><br />
        <input type="submit" value="Submit"></input>
      </form>

      <p>{data && `DATA here: ${data}`}</p>
      {/* {video_id && <LoadVideo video_id={video_id} data={data} />} */}


      <div>
      <ReactPlayer
        url='https://www.youtube.com/watch?v=_SvIzSD0USE'
        playing
        controls
        volume={1}
        muted={false}
        onProgress={handleProgress}
        ref={playerRef}
      />
    </div>
    </>
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





