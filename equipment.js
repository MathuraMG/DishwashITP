module.exports = {
  getEquipmentData: function(index, equipmentId, c, equipmentResponse, noOfEquipments,res)
  {
    //console.log('inside test function -- '+ index );

    var noOfHours = 24;

    var endTime = new Date();
  	var endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';

    var startTime = new Date( endTime.getTime() - noOfHours*60*60*1000);
    var startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';
    //console.log(startTimeFormatted);
    //console.log(endTimeFormatted);

  	var detailOfEquipmentUrl = '/api/equipment/' + equipmentId + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=hour&cost=false';

    var equipmentData = c.apiCall(detailOfEquipmentUrl, function(equipmentData){
  		var parsedData = JSON.parse(equipmentData);
      if(parsedData.data.length>0)
      {
    		var keyName =  Object.keys(parsedData.data[0])[1];
        console.log('obtaining data for -- ' + keyName );

        var equipmentEnergy = [];
        for(var i =0;i<parsedData.data.length;i++)
        {
          equipmentEnergy.push({x:i,y:parsedData.data[i][keyName]})
        }
        ////console.log('Energy of equipment no ' + index + ' -- ' + equipmentEnergy);
        equipmentResponse.push({name:keyName,value: equipmentEnergy});

      }
      else{
        equipmentResponse.push({name:keyName,value: [0]});
      }
      //console.log('the length of the response is - ' +equipmentResponse.length + ' -- length of equipments is -- ' + noOfEquipments);
      if(equipmentResponse.length == noOfEquipments)
      {
        //console.log('returning response'  + equipmentResponse);
        console.log('sending response to front end')
        res.send(equipmentResponse);
      }
      else{
        //console.log('continueeee!!');
        //continue();
      }

  	});

  }
};
