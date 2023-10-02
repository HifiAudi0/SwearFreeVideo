const https = require('https');
const fs = require('fs');
const app = require("./app")



const port = process.env.PORT || 3000;
//const server = app.listen(port, () => {
//    console.log("App is running on port", port)
//});

// serve the API with signed certificate on 443 (SSL/HTTPS) port
const httpsServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/www.swearfreevideos.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.swearfreevideos.com/fullchain.pem'),
}, app);

httpsServer.listen(51655, () => {
    console.log('HTTPS Server running on port 51655');
});