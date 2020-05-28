function setup() {
	createCanvas(300,300);
	socket = io.connect(location.origin);
	socket.on('message', function(data) {
		console.log(data);
	});
}
function draw() {
	background(0);
}