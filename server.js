"use strict";

// set up ========================
var express = require('express');
var http = require("http")
var mongoose = require('mongoose'); // mongoose for mongodb

var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);

// configuration =================

mongoose.connect('mongodb://localhost:27017/test'); // connect to mongoDB database on modulus.io

app.configure(function() {
	app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.bodyParser()); // pull information from html in POST
	app.use(express.methodOverride()); // simulate DELETE and PUT
});

// model =======================================================================

var Appointment = mongoose.model('Appointment', {
	text: String
})

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all appointments 
app.get('/api/appointments', function(req, res) {

	Appointment.find(function(err, appointments) {

		if (err)
			res.send(err);

		res.json(appointments)
	});

});

// insert a new appointment
app.post('/api/appointments', function(req, res) {
	Appointment.create({
		text: req.body.text
	}, function(err, appointment) {
		if (err)
			res.send(err);

		Appointment.find(function(err, appointments) {
			if (err)
				res.send(err);

			// broadcast the changes to all interested sockets
			io.sockets.emit("appointments_updated", {
				appointments: JSON.stringify(appointments)
			});

			res.json(appointments);
		});
	});



});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
server.listen(8080);
console.log("App listening on port 8080");