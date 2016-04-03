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
        var totalEnergy = 0;
        for(var i =0;i<parsedData.data.length;i++)
        {
          equipmentEnergy[i] = {x:i,y:parsedData.data[i][keyName]*1000};
          totalEnergy += parsedData.data[i][keyName]*1000;
        }
        //console.log('total energy is -- ' + totalEnergy);
        equipmentResponse.push({name:keyName,value: equipmentEnergy,totalEnergy: totalEnergy});


      }
      else{

      }
      //console.log('the length of the response is - ' + equipmentResponse.length + ' -- length of equipments is -- ' + noOfEquipments);
      if(equipmentResponse.length == noOfEquipments)
      {
        res.send(equipmentResponse);
      }
      else{

      }

  	});


  }
};
