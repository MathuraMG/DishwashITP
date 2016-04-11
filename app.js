var express = require('express');
var client1 = require('./client.js');
var equipmentObject = require('./equipment.js');

var app = express();
var c = new client1;

var noComplete = 0;


//To use static HTML pages
app.use(express.static('public'));

// Examples using Enertiv node module with Express
// See https://api.enertiv.com/docs/#!/api/ for available endpoints

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
var equipmentIds = [];


// Hit this first to authenticate and get current data
app.get('/login', function (req,res){
	var equipmentResponse = [];
	//console.log('potato');
	var data = c.login(function (data){
		console.log("YOU ARE AUTHENTICATED");

		var apiClient = c.apiCall('/api/client/', function (apiClient){

			//CHANGE CLIENT ID -- HARDCODE

			// TOKEN IS BEING SAVED -- TRY AND RETRIEVE
			// IF TOKEN IS EXPIRED -- LOGIN AGAIN

			//console.log(apiClient);
			//console.log(' ----- ');
			var clientInfo = JSON.parse(apiClient);
			console.log(clientInfo);
			clientData.uuid = clientInfo[0].id;

			var shopLocationId = 'b121b9e6-44e6-40b3-b787-ee667bfa084d';

			var equipFromSublocationUrl = '/api/sublocation/'+ shopLocationId +'/equipment/';

			/******************************************
			TIME VARIABLES FOR THE API CALL
			******************************************/
			// var noOfHours = 24;
			//  +
			//  +			var endTime = new Date();
			//  +			var endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';
			//  +
			//  +			var startTime = new Date( endTime.getTime() - noOfHours*60*60*1000);
			//  +			var startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';

			var noOfHours = 24*7;

			var endTime = new Date();
			endTime.setHours(23);
			endTime.setMinutes(0);
			endTime.setSeconds(0);

		//	var endTime = new Date(2016,03,10,23,00,00);
			var endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';

			var startTime =  new Date( endTime.getTime() - noOfHours*60*60*1000);
			var startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';
			console.log('the time that is showing is')
			console.log(startTimeFormatted);
			console.log(endTimeFormatted);

			var equipmentsInShop = c.apiCall(equipFromSublocationUrl, function(equipmentsInShop){
				var parsedData = JSON.parse(equipmentsInShop);
				var equipmentLength = parsedData.length;


				for(var i=0;i<parsedData.length;i++)
				{
					equipmentIds[i] = parsedData[i]["id"];
					equipmentObject.getEquipmentData(i, equipmentIds[i],c,equipmentResponse,equipmentLength,res, startTimeFormatted, endTimeFormatted
					);
				}

			});
		});
	});
});

// Start our server
var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('app listening at http://%s:%s', host, port);
});
