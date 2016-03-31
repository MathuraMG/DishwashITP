var express = require('express');
var client1 = require('./client.js');
var app = express();
var c = new client1;

//To use static HTML pages
app.use(express.static('public'));

// Examples using Enertiv node module with Express
// See https://api.enertiv.com/docs/#!/api/ for available endpoints

// Start our server
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('app listening at http://%s:%s', host, port);
});


/*
	*
	*		Important Info
	*
	*		Must hit '/login' first to authenticate
	*			- Follow setup in 'client.js'
	*		Most API endpoints use client info (client/location uuid)
	*		So, use '/client' to save that info for later use
	*
*/


// A couple boxes to push our API responses into
var clientData = {};
var topData = [];
var energyData = [];
var equipData = [];


// Hit this first to authenticate
app.get('/login', function (req,res){
	var data = c.login(function (data){
		console.log("YOU ARE AUTHENTICATED");
		var apiClient = c.apiCall('/api/client/', function (apiClient){
			// console.log(apiClient);
			// console.log(' ----- ');
			var clientInfo = JSON.parse(apiClient);
			console.log(clientInfo);
			clientData.uuid = clientInfo[0].id;
			clientData.locationID = clientInfo[0].locations[0];
			res.send(clientData);
		});
	});

});


// Returns client information, saves the important bits for later
// app.get('/client', function (req,res){
//
// });



// Example showing top 10 energy consumers
// Uses the client uuid we saved from '/client'
app.get('/getTop', function (req,res){
	// Set the date range you want to examine
	var start = encodeURIComponent('2015-01-01 00:00:00Z');
	var end = encodeURIComponent('2015-01-03 00:00:00Z');
	var client = clientData.uuid;

	var top10 = c.apiCall('/api/client/'+client+'/top_consumers/?count=10&fromTime='+start+'&toTime='+end, function (top10){
		console.log(JSON.parse(top10));
		topData.push(JSON.parse(top10));
		res.end();
		for(var i =0;i<JSON.parse(top10).now.total.length;i++)
		{
			console.log(JSON.parse(top10).now.total[0]);
		}
	});
});


// Get energy and cost data by location
// Uses the location uuid we saved from '/client'
app.get('/getEnergy', function (req,res){
	var location = clientData.locationID;
	var startdate = encodeURIComponent('2015-01-01 00:00:00Z');
	var enddate = encodeURIComponent('2015-09-01 00:00:00Z')
	var interval = 'month';

	var energy = c.apiCall('/api/location/'+location+'/data/?fromTime='+startdate+'&toTime='+enddate+'&interval='+interval+'&cost=true', function (energy){
	    console.log(JSON.parse(energy));
	    energyData.push(JSON.parse(energy));
	    res.end()
	});
});

app.get('/getEq', function (req,res){
var id =  '3e9815ef-af63-4ca1-af80-641885547931';
console.log(clientData);
var equip = c.apiCall('/api/equipment/'+id + '/data/', function (equip){
		console.log(JSON.parse(equip));
		equipData.push(JSON.parse(equip));
		res.end()
});
});

app.get('/top10', function (req,res){
	res.send(topData);
});

app.get('/energy', function (req,res){
	res.send(energyData);
});
