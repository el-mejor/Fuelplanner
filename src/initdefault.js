/* Values for IDG A32X by it0uchpods Design Group (A very advanced simulation of the Airbus A320 Family for FlightGear: https://github.com/it0uchpods/IDG-A32X)*/

document.getElementById("title1").innerHTML = "AIRBUS A320 FUEL PLANNING";
document.getElementById("title2").innerHTML = "AIRBUS A320 FUEL PLANNING";

document.getElementById("fgfswsip").value = '127.0.0.1'; /*FGFS IP*/
document.getElementById("fgfswsport").value = '80'; /*FGFS PORT*/

document.getElementById("initdata").innerHTML = "IDG A32X by it0uchpods Design Group<br/><a href='https://github.com/it0uchpods/IDG-A32X' target='_blank'>https://github.com/it0uchpods/IDG-A32X</a>";

document.getElementById("ew").value = 82078; /*the aircrafts empty weight */

document.getElementById("crew").value = 380; /*the weight of the crew*/
document.getElementById("paxcnt").value = 150; /*default value of pax on board*/
document.getElementById("paxweight").value = 82; /*weight of one pax in kg*/
document.getElementById("fwdcrg").value = 3306; /*default cargo in the forward cargo bay*/
document.getElementById("aftcrg").value = 3306; /*default cargo in the aft cargo bay*/

document.getElementById("rwt").value = 0; /*initialy the tanks must be empty!*/
document.getElementById("lwt").value = 0; /*initialy the tanks must be  empty!*/
document.getElementById("ctr").value = 0; /*initialy the tanks must be  empty!*/
document.getElementById("rwtmax").value = 13914; /*max fuel in the right wing tank*/
document.getElementById("lwtmax").value = 13914; /*max fuel in the left wing tank*/
document.getElementById("ctrmax").value = 14281; /*max fuel in the center tank*/
document.getElementById("fobmax").value = 42109; /*max fuel at all*/

document.getElementById("towmax").value = 169756; /*maximum take off weight*/
document.getElementById("lwmax").value = 142198; /*maximum landing weight*/

document.getElementById("gs360").value = 440; /*groundspeed on FL360*/
document.getElementById("gs100").value = 260; /*groundspeed on FL100*/
document.getElementById("fb360").value = 3000; /*fuel consumption on FL360 with an aircraft that has 10000 lbs more than the empty weight (e.g. 10000 lbs of fuel and no pax/cargo)*/
document.getElementById("fb360x").value = 4000; /*fuel consumption on FL360 with an aircraft that has 40000 lbs more than the empty weight (e.g. 10000 lbs of fuel and 30000 lbs pax/cargo) - you may interpolate this value if you know other fuel consumption/weight combi!*/
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
		var nodesFuel = [ "consumables/fuel/tank[0]/level-lbs", "consumables/fuel/tank[1]/level-lbs", "consumables/fuel/tank[2]/level-lbs" ];

		FGSetValue(nodesFuel[0], document.getElementById("rwt").value);
		FGSetValue(nodesFuel[1], document.getElementById("ctr").value);
		FGSetValue(nodesFuel[2], document.getElementById("lwt").value);
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
