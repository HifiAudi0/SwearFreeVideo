import './App.css';
import { useEffect, useRef, useState } from "react";
import axios from 'axios';


function IntialPage() {

  var jsonSwearingData = "";
  const [data, setData] = useState({}); // DEBUG FIX, do -not- use {} for objects. use [] for objects too. see console.log

  const [fetchUrl, setFetchUrl] = useState("false");
  const [url, setUrl] = useState("");
  const [video_id, setVideoId] = useState("");



  // fetch(`/sendUrl/?url=${props.url}`, {
  //   method: "POST"
  // })

  // WHERE I LEFT OFF: before using useEffect I did actually get the data response it was working.
  useEffect(() => {

    // Videos with Confirmed swearing in them: 
    //https://www.youtube.com/watch?v=_SvIzSD0USE&t=76s
    // https://www.youtube.com/watch?v=2uvV1-02UCU
    // https://www.youtube.com/watch?v=2d4L1flXhLY



    // setUrl(`${document.getElementById("url").value}`)
    // setUrl("https://www.youtube.com/watch?v=IhQmXaEhksI")
    var the_url = "https://www.youtube.com/watch?v=2uvV1-02UCU";
    // console.log("URLS IS", url);

    // console.log("URL REACT::::  ", url);
    // Using axios instead of fetch fixed an issue where we got a response but not the data we wanted.
    const constructedUrl = "/sendUrl?url=https://www.youtube.com/watch?v=2uvV1-02UCU";
    console.log("CONSTRUCTED URL::: ", constructedUrl)

    axios.post(constructedUrl)
      .then((jsonData) => {
        console.log("JSON DATA::: ", jsonData.data);
        setData(jsonData.data);
        console.log("DATA:::::::::::::::::::::::::", jsonData.data);
        setVideoId(/v=(.*)/.exec(the_url)[1]);
        var id = /v=(.*)/.exec(the_url)[1];
        console.log("LOAD VIDEO _OUTSIDE_", id);

      }).catch((err) => { console.log("REACT FETCH ERROR::: ", err); })

  }, [])



  return (
    <>
      {/* WORKS - <form onSubmit={() => fetchSubmit(document.getElementById("url").value)}> */}
      {/*  WORKS - jsonSwearingData = FetchSubmit({ url: document.getElementById("url").value }) */}
      {/* create a form with onsubmit and call the function FetchSubmit passing down the argument document.getElementById("url").value */}
      <form onSubmit={() => { }}>
        <label htmlFor="url">Youtube URL (example: https://www.youtube.com/watch?v=IhQmXaEhksI) :</label><br />
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


  console.log("VIDEO IS INSIDE", video_id);
  console.log("5555555555555DATA555555555555", video_id["data"]);

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

      // event.target.playVideo();
    }

    var done = false;
    function onPlayerStateChange(event) {
      // Default code //
      var videoStatuses = Object.entries(window.YT.PlayerState);
      console.log(videoStatuses.find(status => status[1] === event.data)[0]);
      // Default code //

      if (event.data == window.YT.PlayerState.PLAYING && !done) {
        var currentTimestamp = 0;
        var startSwearing = 67.32;
        var durationSwearing = 12.24;
        var endSwearing = startSwearing + durationSwearing;

        console.log("33333333333DATA3333333333", video_id["data"])


        setInterval(function () {
          currentTimestamp = player.playerInfo.currentTime
          // console.log("CURRENT TIMESTAMP::: " + currentTimestamp);
          // console.log("START SWEARING::::", startSwearing, "ENDING SWEARING:::", endSwearing);
          if (currentTimestamp > startSwearing && currentTimestamp < endSwearing) { // HARD CODED
            console.log("SWEARING INCOMING")
          } else { console.log("NO SWEARING::::") }
        }, 1000);


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

export { LoadVideo, IntialPage };
