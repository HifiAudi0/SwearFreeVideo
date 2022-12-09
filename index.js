// WHEN vercel logs are not refreshing... use Production: URL/_logs
// For this project its https://node-mongoose-practise.vercel.app/_logs
// refreshes faster and works


const app = require("./app")



const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log("App is running on port", port)
});



