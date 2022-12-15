var video_id;
export async function sendUrl() {
    event.preventDefault()
    const url = document.getElementById("url").value;
    console.log("URL", url);
    axios.post('http://127.0.0.1:3005/sendUrl/?url=https://www.youtube.com/watch?v=IhQmXaEhksI')
        .then(function (response, error) {
            console.log("GOT RESPONSE", response);
            JSON.stringify(response.data)
            video_id = /v=(.*)/.exec(url)[1];
            console.log("video_id", video_id);
            everythingGetsReturned(video_id, url, response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function everythingGetsReturned(video_id, url, data) {
    return video_id, url, data;
}

