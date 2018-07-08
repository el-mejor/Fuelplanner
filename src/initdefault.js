/* Values for IDG A32X by it0uchpods Design Group (A very advanced simulation of the Airbus A320 Family for FlightGear: https://github.com/it0uchpods/IDG-A32X)*/

document.getElementById("title1").innerHTML = "AIRBUS A320 FUEL PLANNING";
document.getElementById("title2").innerHTML = "AIRBUS A320 FUEL PLANNING";

document.getElementById("fgfswsip").value = "192.168.2.111"; /*FGFS IP*/
document.getElementById("fgfswsport").value = "80"; /*FGFS PORT*/

document.getElementById("initdata").innerHTML = "IDG A32X by it0uchpods Design Group<br/><a href='https://github.com/it0uchpods/IDG-A32X' target='_blank'>https://github.com/it0uchpods/IDG-A32X</a>";

document.getElementById("ew").value = 82078; /*the aircrafts empty weight */

document.getElementById("crew").value = 380; /*the weight of the crew*/
document.getElementById("paxcnt").value = 150; /*default value of pax on board*/
document.getElementById("paxweight").value = 82; /*weight of one pax in kg*/
document.getElementById("fwdcrg").value = 3306; /*default cargo in the forward cargo bay*/
document.getElementById("aftcrg").value = 3306; /*default cargo in the aft cargo bay*/

/* Fuel compartments */
var WingTanksNames = [ "RightWT", "LeftWT"];
var WingTanksNodes = [ "consumables/fuel/tank[0]/level-lbs", "consumables/fuel/tank[2]/level-lbs" ];
var WingTanksValue = [ 0, 0];
var WingTanksMax = [ 13914, 13914];

var CenteredTanksNames = [ "CtrT" ];
var CenteredTanksNodes = [ "consumables/fuel/tank[1]/level-lbs" ];
var CenteredTanksValue = [ 0 ];
var CenteredTanksMax = [ 14281 ];

initFuelCompartments();

document.getElementById("towmax").value = 169756; /*maximum take off weight*/
document.getElementById("lwmax").value = 142198; /*maximum landing weight*/

document.getElementById("gs360").value = 440; /*groundspeed on FL360*/
document.getElementById("gs100").value = 260; /*groundspeed on FL100*/
document.getElementById("fb360").value = 3000; /*fuel consumption on FL360 with an aircraft that has 10000 lbs more than the empty weight (e.g. 10000 lbs of fuel and no pax/cargo)*/
document.getElementById("fb360x").value = 4200; /*fuel consumption on FL360 with an aircraft that has 40000 lbs more than the empty weight (e.g. 10000 lbs of fuel and 30000 lbs pax/cargo) - you may interpolate this value if you know other fuel consumption/weight combi!*/
document.getElementById("clb").value = 2500; /*average climb rate*/
document.getElementById("des").value = 2000; /*average descent rate*/
document.getElementById("maxpax").value = 150; /*max pax on board*/

document.getElementById("dist").value = 500; /*default value for distance*/
document.getElementById("crsalt1").value = 36000; /*default value for flightlevel of 1st segment */
document.getElementById("crsalt2").value = 36000; /*default value for flightlevel of 2nd segment */
document.getElementById("crsalt3").value = 36000; /*default value for flightlevel of 3rd segment */
document.getElementById("origalt").value = 1000; /*default value for height of origin airport*/
document.getElementById("destalt").value = 1000; /*default value for height of destination airport*/
document.getElementById("contiperc").value = 5; /*default value for contigency fuel percent*/
document.getElementById("taxifl").value = 2200; /*default value for taxi fuel*/
document.getElementById("resflmin").value = 75; /*default value for time to reach alternate airport, holding and go around*/
document.getElementById("addfl").value = 0; /*default value for additional fuel*/

document.getElementById("setFuelBtn").addEventListener("click", setFuelBtnClick);
document.getElementById("setPayloadBtn").addEventListener("click", setPayloadBtnClick);

function sumTanksToFOBMax()
{
	var fob = 0;
	for (var i = 0; i < WingTanksMax.length; i ++)
	{ fob += WingTanksMax[i]; }
	for (var i = 0; i < CenteredTanksMax.length; i ++)
	{ fob += CenteredTanksMax[i]; }

	return fob;
}

function initFuelCompartments()
{
	var refuelTable = document.getElementById("fuelcompartments");
	
	for (var i = 0; i < WingTanksNames.length; i ++)
	{ 
		refuelTable.innerHTML += `<tr><td>${WingTanksNames[i]}:</td><td> <input type="number" id="${WingTanksNames[i]}" class="outval">lbs</td><td> <input type="number" id="${WingTanksNames[i]}kg" class="statval">kg</td></tr>`;
		refuelTable.innerHTML += `<tr><td>${WingTanksNames[i]} Max:</td><td> <input type="number" id="${WingTanksNames[i]}max" class="outval">lbs</td><td> <input type="number" id="${WingTanksNames[i]}maxkg" class="statval">kg</td></tr>`;
	}
	
	for (var i = 0; i < CenteredTanksNames.length; i ++)
	{ 
		refuelTable.innerHTML += `<tr><td>${CenteredTanksNames[i]}:</td><td> <input type="number" id="${CenteredTanksNames[i]}" class="outval">lbs</td><td> <input type="number" id="${CenteredTanksNames[i]}kg" class="statval">kg</td></tr>`;
		refuelTable.innerHTML += `<tr><td>${CenteredTanksNames[i]} Max:</td><td> <input type="number" id="${CenteredTanksNames[i]}max" class="outval">lbs</td><td> <input type="number" id="${CenteredTanksNames[i]}maxkg" class="statval">kg</td></tr>`;	
	}
	
	refuelTable.innerHTML += '<tr><td>FOB:</td><td> <input type="number" id="fob" class="outval">lbs</td><td> <input type="number" id="fobkg" class="statval">kg</td></tr>';
	refuelTable.innerHTML += '<tr><td>FOB Max:</td><td> <input type="number" id="fobmax" class="outval">lbs</td><td> <input type="number" id="fobmaxkg" class="statval">kg</td></tr>';
	
	for (var i = 0; i < WingTanksNames.length; i ++)
	{ 		
		document.getElementById(WingTanksNames[i]).value = 0;
		document.getElementById(WingTanksNames[i] + "max").value = WingTanksMax[i];
	}
	
	for (var i = 0; i < CenteredTanksNames.length; i ++)
	{ 		
		document.getElementById(CenteredTanksNames[i]).value = 0;
		document.getElementById(CenteredTanksNames[i] + "max").value = CenteredTanksMax[i];	
	}
	
	document.getElementById("fob").value = 0;
	document.getElementById("fobmax").value = sumTanksToFOBMax();
}

function setPayloadBtnClick()
{
	if (checkIfLoadingIsPossible())
	{
		var nodesPayload = [ "payload/weight[0]/weight-lb", "payload/weight[1]/weight-lb", "payload/weight[2]/weight-lb", "payload/weight[3]/weight-lb" ]; 
		
		FGSetValue(nodesPayload[0], document.getElementById("crew").value);
		FGSetValue(nodesPayload[1], document.getElementById("pax").value);
		FGSetValue(nodesPayload[2], document.getElementById("fwdcrg").value);
		FGSetValue(nodesPayload[3], document.getElementById("aftcrg").value);
	}
}

function setFuelBtnClick()
{
	if (checkIfLoadingIsPossible())
	{
		FGSetValue(WingTanksNodes[0], document.getElementById("rwt").value);
		FGSetValue(CenteredTanksNodes[0], document.getElementById("ctr").value);
		FGSetValue(WingTanksNodes[1], document.getElementById("lwt").value);
	}
}

function checkIfLoadingIsPossible()
{
	if (!FGFSConnected)
	{
		closedhint.innerHTML = "NOT CONNECTED TO FGFS.";		
		closedhint.classList.remove("xboxhidden");
		return false;
	}
	
	/* here a propper value should be checked to ensure that the acft can be refuelled, e.g. e.g. if the engines are off */
	
	if (confirm("Are you sure to send the values to FGFS now?"))
	{
		return true;
	}		
	
	return false;	
}
