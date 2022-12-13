import './App.css';
import { useEffect, useState } from "react";



function IntialPage() {

  return (
    <>
      <form onSubmit={() => fetchSubmit(document.getElementById("url").value)}>
        <label htmlFor="url">Youtube URL (example: https://www.youtube.com/watch?v=IhQmXaEhksI) :</label><br />
        <input className="url" type="text" id="url" name="url" /><br />
        <input type="submit" value="Submit"></input>
      </form>
    </>
  );
}

function fetchSubmit(url) {
  console.log("URL REACT::::  ", url);

  fetch(`/sendUrl/?url=${url}`, {
    method: "GET"
  }).then((resp_data) => {

    console.log(resp_data);
  })

}


function LoadVideo() {

  const [data, setData] = useState([]); // DEBUG FIX, do -not- use { } for objects. use [] for objects too. see console.log

  useEffect(() => {

    fetch("/index", {
      method: "GET"
    }).then((resp_data) => {

      console.log(resp_data);
      setData(resp_data);
    })
  }, [])



  //const fetch = document.getElementById("fetch").innerHTML = `${swearingData}`;
  // const some_data = document.getElementById("data").value;
  // const fetch = document.getElementById("fetch").innerHTML = "blank data";

  fetch("/sendUrl", {
    method: "GET"
  })
    .then((resp_data) => {
      console.log("GOT FETCH DATA INSIDE JS::::")
      console.log(resp_data)
    })
    .catch((err) => { console.log("ERROR FETCHING DATA:::", err) });


  function loadVideo() {
    console.info(`loadVideo called`);

    (function loadYoutubeIFrameApiScript() {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      tag.onload = setupPlayer;
    })();

    let player = null;

    function setupPlayer() {
      /**
       * Need to wait until Youtube Player is ready!
       *
       * YT.ready is not documented in https://developers.google.com/youtube/iframe_api_reference
       * but found from https://codesandbox.io/s/youtube-iframe-api-tpjwj
       */
      window.YT.ready(function () {
        player = new window.YT.Player("video", {
          height: "390",
          width: "640",
          videoId: "M7lc1UVf-VE",
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          }
        });
      });
    }

    function onPlayerReady(event) {
      event.target.playVideo();
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


        setInterval(function () {
          currentTimestamp = player.getCurrentTime()
          console.log("CURRENT TIMESTAMP::: " + currentTimestamp);
          console.log("START SWEARING::::", startSwearing, "ENDING SWEARING:::", endSwearing);
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
    loadVideo();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      console.info(`DOMContentLoaded ==>`, document.readyState);
      loadVideo();
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
