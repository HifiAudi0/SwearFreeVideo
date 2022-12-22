import './App.css';
import { useEffect, useState } from "react";
import axios from 'axios';

// Note to self:
// Chrome deveeloper console - highlight object then ctrl+alt+click to expand all object properties
// Turbo console log = ctrl+alt+l (that is an lowercase L) after highlighting variable
// Emojis picker = Windows + .

function IntialPage() {

  const [data, setData] = useState({}); // DEBUG FIX, do -not- use {} for objects. use [] for objects too. see console.log
  const [video_id, setVideoId] = useState("");

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
      {video_id && <LoadVideo video_id={video_id} data={data} />}
    </>
  );
}


function LoadVideo(video_id, data) {

  function loadVideo() {
    console.info(`loadVideo called`);

    (function loadYoutubeIFrameApiScript() {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      tag.onload = setupPlayer;
    })();

    var player;

    function setupPlayer() {
      /**
       * Need to wait until Youtube Player is ready!
       *
       * YT.ready is not documented in https://developers.google.com/youtube/iframe_api_reference
       * but found from https://codesandbox.io/s/youtube-iframe-api-tpjwj
       */
      window.YT.ready(player = function () {
        player = new window.YT.Player("video", {
          sandbox: "allow-presentation",
          height: "390",
          width: "640",
          videoId: `${video_id}`,
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          }
        });

      });

    }

    function mute() {
      player.mute();
    }

    function onPlayerReady(event) {

      player.loadVideoById(`${video_id["video_id"]}`, 5, "large") // a bit of hack to get a -different- video id to load. This may cause unexpected issues, but it works for now.

      // ! NOTE TO DEVELOPER: this is NOT actually the place where I want the mute to occur. It is actually a litter further down in the code. It's just proof that mute will actually work somewhere in the code atleast. see similar NOTE down below, thanks!
      // ! CANT get timestamp here
      // ! CAN mute here
      // player.mute();
      // mute();
    }

    var done = false;

    function onPlayerStateChange(event) {

      // Default code //
      var videoStatuses = Object.entries(window.YT.PlayerState);
      console.log(videoStatuses.find(status => status[1] === event.data)[0]);
      // Default code //

      try {
        // player.setPlayerState(window.YT.PlayerState.PAUSED);
        // mute();
        console.log("👀 -------------------------------------------------------👀")
        console.log("👀 ~ file: App.js:216 ~ onPlayerStateChange ~ muting : Player=", player)
        console.log("👀 -------------------------------------------------------👀")

      } catch (err) {
        console.log("ERROR IS", err)
      }

      setInterval(function () {

        // ! NOTE TO DEVELOPER: THIS is where I need mute to be called and function properly (Inside of setInterval)
        // ! CANT mute here
        // ! CAN get timestamp here

        var currentTimestamp = player.playerInfo.currentTime;
        var nextSwearStartsAt = video_id["data"][1];
        var nextSwearDurationIs = video_id["data"][0]
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
      }, 800);

      if (event.data == window.YT.PlayerState.PLAYING && !done) {

        // ! NOTE TO DEVELOPER: Again, this is NOT where I actually need to mute. It's just proof that mute will work somewhere in the code. See similar NOTE above, thanks!
        // ! CANT mute here
        // ! TIMESTAMP is not updated every second here

        done = true;
      }
    }
  }

  if (document.readyState !== "loading") {
    console.info(`document.readyState ==>`, document.readyState);
    loadVideo()
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.info(`DOMContentLoaded ==>`, document.readyState);
      loadVideo()
    });
  }

  return (
    <>
      <html>
        <head>
          <title>Parcel Sandbox</title>
          <meta charset="UTF-8" />
        </head>

        <body>
          <div id="video"></div>
          div
        </body>
      </html>
    </>
  );
}


export { LoadVideo, IntialPage };




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





