var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000);
var streamURL;
app.use(express.static(__dirname + "/public"));
const WebSocket = require('ws');
const wss = new WebSocket.Server({server: server});
console.log("socket started");
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    if(data == "Hello Server!") {
        ws.send(streamURL);
    }
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

const axios = require("axios");
const developerkey = process.env.REMOTEIT_DEVELOPER_KEY;
const username = process.env.REMOTEIT_USERNAME;
const password = process.env.REMOTEIT_PASSWORD;
const wait = "true";
const hostip = "0.0.0.0";

setInterval(sendURL, 300 * 1000);
sendURL();

function sendURL() {
axios
  .post(
    "https://api.remot3.it/apv/v27/user/login",
    { username, password },
    { headers: { developerkey } }
  )
  .then(response => {
    //console.log("Status Code:", response.status);
    //console.log("Body:", response.data);
    //console.log("Data:", data);
    list(response.data);
  })
  .catch(error => {
    console.log(error);
  });
}

function list(data) {
token = data.token;
axios
  .get("https://api.remot3.it/apv/v27/device/list/all", {
    headers: {
      developerkey,
      token
    }
  })
  .then(response => {
    //console.log("Status Code:", response.status);
    //console.log("Body:", response.data);
    getProxy(response.data, token);
  })
  .catch(error => {
    console.log(error);
  });
}

function getProxy(data, token) {
var deviceaddress = data.devices[1].deviceaddress;
axios
  .post(
    "https://api.remot3.it/apv/v27/device/connect",
    { 
      deviceaddress,
      wait,
      hostip
    },
    {
      headers: {
        developerkey,
        token
      }
    }
  )
  .then(response => {
    //console.log("Status Code:", response.status);
    //console.log("Body:", response.data);
    streamURL = response.data.connection.proxy;
    console.log("StreamURL:" + streamURL);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(streamURL);
      }
    });
  })
  .catch(error => {
    console.log(error);
  });
}
