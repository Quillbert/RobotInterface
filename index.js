var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));
const WebSocket = require('ws');
const wss = new WebSocket.Server({server: server});
console.log("socket started");
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});