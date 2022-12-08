const ai = require("openai");
require("dotenv").config({ path: __dirname + "/.env" });

async function listEngines() {
    const configuration = new ai.Configuration({
        organization: "org-vHDnh3NHOdxm8QurS9DLwZlY",
        apiKey: process.env.OPENAI_API_KEY,
    });


    const openai = new ai.OpenAIApi(configuration);
    // let response = await openai.listModels();

    // console.log(response.data.data);

    let response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "A map of Toronto Ontario Canada",
        max_tokens: 7,
        temperature: 0,
    });
    console.log(response.data);

    // response = await openai.createImage({
    //     prompt: "A map of Toronto Ontario Canada",
    //     n: 2,
    //     size: "1024x1024",
    // });

    // console.log(response.data);
}


listEngines();