module.exports = {
  getEquipmentData: function(index, equipmentId, c, equipmentResponse, noOfEquipments,res, startTimeFormatted, endTimeFormatted)
  {
    //console.log('inside test function -- '+ index );



  	var detailOfEquipmentUrl = '/api/equipment/' + equipmentId + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=15min&cost=false';

    var equipmentData = c.apiCall(detailOfEquipmentUrl, function(equipmentData){
  		var parsedData = JSON.parse(equipmentData);
      //console.log(parsedData);
      if(parsedData.data.length>0)
      {
    		var keyName =  Object.keys(parsedData.data[0])[1];
        console.log('obtaining data for -- ' + keyName );
        var timeVar = Object.keys(parsedData.data[0])[0];

        var equipmentEnergy = [];
        var totalEnergyOffPeak = 0;
        var totalEnergyPeak = 0;
        for(var i =0;i<parsedData.data.length;i++)
        {
          
          equipmentEnergy[i] = {x:parsedData.data[i][timeVar],y:parsedData.data[i][keyName]*1000};
          if(i%96<40)
          {
            totalEnergyOffPeak += parsedData.data[i][keyName]*1000;
          }
          else
          {
            totalEnergyPeak += parsedData.data[i][keyName]*1000;
          }

        }
        //console.log('total energy is -- ' + totalEnergy);
        equipmentResponse.push({name:keyName,value: equipmentEnergy,totalEnergyOffPeak: totalEnergyOffPeak, totalEnergyPeak: totalEnergyPeak});


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
