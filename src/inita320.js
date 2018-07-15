/* Values for IDG A32X by it0uchpods Design Group (A very advanced simulation of the Airbus A320 Family for FlightGear: https://github.com/it0uchpods/IDG-A32X)*/

document.getElementById("title1").innerHTML = "AIRBUS A320 FUEL PLANNING";
document.getElementById("title2").innerHTML = "AIRBUS A320 FUEL PLANNING";

document.getElementById("fgfswsip").value = "192.168.2.111"; /*FGFS IP*/
document.getElementById("fgfswsport").value = "80"; /*FGFS PORT*/

document.getElementById("initdata").innerHTML = "IDG A32X by it0uchpods Design Group<br/><a href='https://github.com/it0uchpods/IDG-A32X' target='_blank'>https://github.com/it0uchpods/IDG-A32X</a>";

document.getElementById("ew").value = 82078; /*the aircrafts empty weight */

document.getElementById("crew").value = 380; /*the weight of the crew*/
document.getElementById("paxcnt").value = 168; /*default value of pax on board*/
document.getElementById("paxweight").value = 73; /*weight of one pax in kg*/

var nodesPayload = [ "payload/weight[0]/weight-lb", "payload/weight[1]/weight-lb" ]; /* crew, pax */

/* Hide Paxes for Freight Variant - comment out for passenger variants */
/*document.getElementById("paxcnt").style.display = "none";
document.getElementById("paxweight").style.display = "none";
document.getElementById("pax").style.display = "none";
document.getElementById("paxkg").style.display = "none";*/

/* Cargo bays */
var CargoBaysNames = ["FwdCrg", "AftCrg"];
var CargoBaysNodes = [ "payload/weight[2]/weight-lb", "payload/weight[3]/weight-lb" ]; 
var CargoBaysValues = [ 3306,3306 ];
var CargoBaysMaxLoad = [ 8765, 8765 ];

/* Fuel compartments */
var WingTanksNames = [ "RightWT", "LeftWT" ]; /* Names of the stations */
var WingTanksNodes = [ "consumables/fuel/tank[0]/level-lbs", "consumables/fuel/tank[2]/level-lbs" ]; /* FGFS properties of the stations */
var WingTanksValue = [ 0, 0 ]; /* as many zeros as stations there are */
var WingTanksMax = [ 13914, 13914]; /* maximum lbs of the station */

var CenteredTanksNames = [ "CtrT" ]; /* Names of the stations */
var CenteredTanksNodes = [ "consumables/fuel/tank[1]/level-lbs" ]; /* FGFS properties of the stations */
var CenteredTanksValue = [ 0 ]; /* as many zeros as stations there are */
var CenteredTanksMax = [ 14281 ]; /* maximum lbs of the station */

document.getElementById("towmax").value = 169756; /*maximum take off weight*/
document.getElementById("lwmax").value = 142198; /*maximum landing weight*/

document.getElementById("gs360").value = 440; /*groundspeed on FL360*/
document.getElementById("gs100").value = 260; /*groundspeed on FL100*/
document.getElementById("fb360").value = 3700; /*fuel consumption on FL360 with an aircraft that has 10000 lbs more than the empty weight (e.g. 10000 lbs of fuel and no pax/cargo)*/
document.getElementById("fb360x").value = 5000; /*fuel consumption on FL360 with an aircraft that has 40000 lbs more than the empty weight (e.g. 10000 lbs of fuel and 30000 lbs pax/cargo) - you may interpolate this value if you know other fuel consumption/weight combi!*/
document.getElementById("clb").value = 2500; /*average climb rate*/
document.getElementById("des").value = 2000; /*average descent rate*/
document.getElementById("maxpax").value = 168; /*max pax on board*/

document.getElementById("dist").value = 500; /*default value for distance*/
document.getElementById("crsalt1").value = 36000; /*default value for flightlevel of 1st segment */
document.getElementById("crsalt2").value = 36000; /*default value for flightlevel of 2nd segment */
document.getElementById("crsalt3").value = 36000; /*default value for flightlevel of 3rd segment */
document.getElementById("origalt").value = 1000; /*default value for height of origin airport*/
document.getElementById("destalt").value = 1000; /*default value for height of destination airport*/
document.getElementById("contiperc").value = 10; /*default value for contigency fuel percent*/
document.getElementById("taxifl").value = 2200; /*default value for taxi fuel*/
document.getElementById("resflmin").value = 75; /*default value for time to reach alternate airport, holding and go around*/
document.getElementById("addfl").value = 0; /*default value for additional fuel*/

document.getElementById("setFuelBtn").addEventListener("click", setFuelBtnClick);
document.getElementById("setPayloadBtn").addEventListener("click", setPayloadBtnClick);
