import './App.css';
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { CLIENT_MULTI_STATEMENTS } from 'mysql/lib/protocol/constants/client';


function IntialPage() {

  var jsonSwearingData = "";
  const [data, setData] = useState({}); // DEBUG FIX, do -not- use {} for objects. use [] for objects too. see console.log

  const [fetchUrl, setFetchUrl] = useState("false");
  const [url, setUrl] = useState("");
  const [video_id, setVideoId] = useState("");


  // Chrome deveeloper console - highlight object then ctrl+alt+click to expand all object properties

  // fetch(`/sendUrl/?url=${props.url}`, {
  //   method: "POST"
  // })

  // WHERE I LEFT OFF: before using useEffect I did actually get the data response it was working.
  useEffect(() => {

    // Videos with Confirmed swearing in them: 
    //https://www.youtube.com/watch?v=_SvIzSD0USE
    // https://www.youtube.com/watch?v=2uvV1-02UCU - ALOT OF SWEARING OVER 300 TIMES I THINK
    // https://www.youtube.com/watch?v=2d4L1flXhLY



    // setUrl(`${document.getElementById("url").value}`)
    // setUrl("https://www.youtube.com/watch?v=IhQmXaEhksI")
    var the_url = "https://www.youtube.com/watch?v=2d4L1flXhLY";
    // console.log("URLS IS", url);

    // console.log("URL REACT::::  ", url);
    // Using axios instead of fetch fixed an issue where we got a response but not the data we wanted.
    const constructedUrl = "/sendUrl?url=https://www.youtube.com/watch?v=2d4L1flXhLY";
    console.log("CONSTRUCTED URL::: ", constructedUrl)

    axios.post(constructedUrl)
      .then((jsonData) => {
        // console.log("JSON DATA::: ", jsonData.data);
        setData(jsonData.data);
        // console.log("DATA:::::::::::::::::::::::::", jsonData.data);
        setVideoId(/v=(.*)/.exec(the_url)[1]);
        var id = /v=(.*)/.exec(the_url)[1];
        // console.log("LOAD VIDEO _OUTSIDE_", id);

      }).catch((err) => { console.log("REACT FETCH ERROR::: ", err); })

  }, [])



  return (
    <>
      {/* WORKS - <form onSubmit={() => fetchSubmit(document.getElementById("url").value)}> */}
      {/*  WORKS - jsonSwearingData = FetchSubmit({ url: document.getElementById("url").value }) */}
      {/* create a form with onsubmit and call the function FetchSubmit passing down the argument document.getElementById("url").value */}
      <form onSubmit={() => { }}>
        <label htmlFor="url">Youtube URL (example: https://www.youtube.com/watch?v=_SvIzSD0USEI) :</label><br />
        <input className="url" type="text" id="url" name="url" /><br />
        <input type="submit" value="Submit"></input>
      </form>

      <p>{data && `DATA here: ${data}`}</p>
      {/* Pass down video_id as props to <LoadVideo/> */}
      {video_id && <LoadVideo video_id={video_id} data={data} />}
      {/* <p id="constructedUrl">{constructedUrl && `Constructed Url: ${constructedUrl}`}</p> */}
    </>
  );
}





function LoadVideo(video_id, data) {


  // console.log("VIDEO IS INSIDE", video_id);
  // console.log("5555555555555DATA555555555555", video_id["data"]);

  //const fetch = document.getElementById("fetch").innerHTML = `${swearingData}`;
  // const some_data = document.getElementById("data").value;
  // const fetch = document.getElementById("fetch").innerHTML = "blank data";

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

    function onPlayerReady(event) {

      player.loadVideoById(`${video_id["video_id"]}`, 5, "large")
      // var duration = player.getDuration();
      // console.log()
      // player.playerInfo.apiInterface.seekTo(200, true);
      // event.target.playVideo();

      var currentTimestamp, startSwearing, durationSwearing;
      var endSwearing = startSwearing + durationSwearing;
      // console.log("FIRST MUTEEEEEEEEEEEEEEEEEE")
      // player.mute();

      // console.log("LENGTH", video_id["data"].length)

      // try {
      //   console.log("CURRENT TIME STAMP IS KOOLAIDKOOLAIDKOOLAIDKOOLAIDKOOLAIDKOOLAID", player.playerInfo.currentTime)
      // } catch (err) {
      //   console.log("ERROR IS", err)
      // }

      // CANT get timestamp here
      // CAN mute here
      // player.mute();



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
    }


    var done = false;
    function onPlayerStateChange(event) {

      // Default code //
      var videoStatuses = Object.entries(window.YT.PlayerState);
      console.log(videoStatuses.find(status => status[1] === event.data)[0]);
      // Default code //

      // MUTE doesn't work in my own function even when passed player.

      setInterval(function () {

        // CANT mute here
        // CAN get timestamp here

        var currentTimestamp = player.playerInfo.currentTime;
        var endSwearingDuration = video_id["data"][1] + video_id["data"][0];

        if (currentTimestamp > video_id["data"][1] && currentTimestamp < endSwearingDuration) {
          console.log("SWEARING INCOMING TIMSTAMP:::::", currentTimestamp);
          console.log("___________________________FIRST MUTEEEEEEEEEEEEEEEEEE")
          console.log("_____________________________________________")

          video_id["data"].shift();
          video_id["data"].shift();
        } else {
          console.log("NO SWEARING::::", currentTimestamp)
          console.log("NO SWEARING NEXT SWEAR STARTS AT", video_id["data"][1])
          console.log("NO SWEARING NEXT SWEAR DURATION IS", video_id["data"][0])

        }


      }, 800);

      // try {
      //   console.log("CURRENT TIME STAMP IS BLINKBLINKBLINKBLINK", player.playerInfo.currentTime)
      // } catch (err) {
      //   console.log("ERROR IS", err)
      // }


      if (event.data == window.YT.PlayerState.PLAYING && !done) {

        // CANT mute here
        // TIMESTAMP is not updated every second here

        // try {
        //   console.log("CURRENT TIME STAMP IS FROSTFROSTFROSTFROSTFROST", player.playerInfo.currentTime)
        // } catch (err) {
        //   console.log("ERROR IS", err)
        // }

        done = true;
      }
    }
  }

  if (document.readyState !== "loading") {
    console.info(`document.readyState ==>`, document.readyState);
    // loadVideo();
    loadVideo()  // CHANGED

  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.info(`DOMContentLoaded ==>`, document.readyState);
      loadVideo()  // CHANGED
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

        </body>
      </html>
    </>
  );
}


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

export { LoadVideo, IntialPage };



