var express = require('express');
var client1 = require('./client.js');
var app = express();
var c = new client1;

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


// Hit this first to authenticate
app.get('/login', function (req,res){
	console.log('potato');
	var data = c.login(function (data){
		console.log("YOU ARE AUTHENTICATED");

		var apiClient = c.apiCall('/api/client/', function (apiClient){
			// console.log(apiClient);
			console.log(' ----- ');
			var clientInfo = JSON.parse(apiClient);
			console.log(clientInfo);
			clientData.uuid = clientInfo[0].id;
			clientData.locationID = clientInfo[0].locations[0];
			//res.redirect('/atITP');
		});
	});

});


/*******************************************
Code to get when the coffee machine is used
*******************************************/
var equipId;
app.get('/atITP', function (req,res){

	var locationId = clientData.locationID;

	/****************************************
	GET CURRENT TIME
	****************************************/
	var endTime = new Date();
	//endTime.setMinutes(0);
	//endTime.setSeconds(0);
	var endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';

	/****************************************
	GET TIME N HOURS BEFORE
	****************************************/
	var noOfHours = 24;
	var interval = '15min';

	var detailOfEquipmentUrl;
	var equipId;
	var overAllData = [];

	var startTime = new Date( endTime.getTime() - noOfHours*60*60*1000);

	var startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';



	//:Laser

	equipId = 'a85a60b9-c858-446a-b083-33aae441c12f';
	detailOfEquipmentUrl = '/api/equipment/' + equipId + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=min&cost=true';

	var laser = c.apiCall(detailOfEquipmentUrl, function(laser){
		var b = JSON.parse(laser);
		var parsedData = b.data;
		//sent just the required data
		//console.log(c);
		var data = [];
		for(var i=0;i<parsedData.length;i++)
		{
			var xAxis = i;
			//var yAxis = parsedData[i]["Coffee MakerTotalCost"]
			//var yAxis = parsedData[i]["DishwasherTotalCost"];
			var y1Axis = parsedData[i]["3 Laser Cutters"];
			var cost = parsedData[i]["3 Laser CuttersTotalCost"];
			console.log(y1Axis);
			data[i] = {x:xAxis, y1:y1Axis};
		}
		overAllData.push(data);
		// res.send(overAllData);

		equipId = '28b35713-2259-453a-882e-65408aec2bca';

		detailOfEquipmentUrl = '/api/equipment/' + equipId + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=min&cost=true';

		var equip2 = c.apiCall(detailOfEquipmentUrl, function(equip2){
			b = JSON.parse(equip2);
			parsedData = b.data;
			//sent just the required data
			//console.log(c);
			data = [];
			for(var i=0;i<parsedData.length;i++)
			{
				var xAxis = i;
				var y1Axis = parsedData[i]["Coffee Maker"];	//console.log(yAxis);
				data[i] = {x:xAxis, y1:y1Axis};
			}
			overAllData.push(data);
			res.send(overAllData);
		});




	});
	//Coffee machine
});

/**********************
equipId = '28b35713-2259-453a-882e-65408aec2bca';

detailOfEquipmentUrl = '/api/equipment/' + equipId + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=min&cost=true';

var equip2 = c.apiCall(detailOfEquipmentUrl, function(equip2){
	b = JSON.parse(equip2);
	c = b.data;
	//sent just the required data
	//console.log(c);
	data = [];
	for(var i=0;i<data.length;i++)
	{
		var y2Axis = c[i]["Coffee MakerTotalCost"];	//console.log(yAxis);
		data[i].y2 = y2Axis;
	}
	overAllData.push(data);
	res.send(overAllData);
});




	//var equipId = JSON.parse(atITP)[0].id;
  //Dish washer
	//var equipId = '5a2ed6fe-05a9-42d9-8797-88045412c05a';

	//Coffee machine
	//var equipId = '28b35713-2259-453a-882e-65408aec2bca';
**********************/

// Start our server
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('app listening at http://%s:%s', host, port);
});
