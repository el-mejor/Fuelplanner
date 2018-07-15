/* Values for IDG A32X by it0uchpods Design Group (A very advanced simulation of the Airbus A320 Family for FlightGear: https://github.com/it0uchpods/IDG-A32X)*/

document.getElementById("title1").innerHTML = "AIRBUS A330-200F FUEL PLANNING";
document.getElementById("title2").innerHTML = "AIRBUS A330-200F FUEL PLANNING";

document.getElementById("fgfswsip").value = "192.168.2.111"; /*FGFS IP*/
document.getElementById("fgfswsport").value = "80"; /*FGFS PORT*/

document.getElementById("initdata").innerHTML = "IDG A33X by it0uchpods Design Group<br/><a href='https://github.com/it0uchpods/IDG-A33X' target='_blank'>https://github.com/it0uchpods/IDG-A33X</a>";

document.getElementById("ew").value = 224000; /*the aircrafts empty weight */

document.getElementById("crew").value = 380; /*the weight of the crew*/
document.getElementById("paxcnt").value = 0; /*default value of pax on board*/
document.getElementById("paxweight").value = 73; /*weight of one pax in kg*/

var nodesPayload = [ "payload/weight[0]/weight-lb", "payload/weight[1]/weight-lb" ]; /* crew, pax */

/* Hide Paxes for Freight Variant - comment out for passenger variants */
document.getElementById("paxcnt").parentElement.parentElement.style.display = "none";
document.getElementById("pax").parentElement.parentElement.style.display = "none";

/* Cargo bays */
var CargoBaysNames = [ "Upper", "FwdCrg", "AftCrg", "RrBulkCrg" ];
var CargoBaysNodes = [ "payload/weight[1]/weight-lb", "payload/weight[2]/weight-lb", "payload/weight[3]/weight-lb", "payload/weight[4]/weight-lb"  ]; 
var CargoBaysValues = [ 300, 300, 300, 300 ];
var CargoBaysMaxLoad = [ 41000, 13200, 13200, 11880 ];

/* Fuel compartments */
var WingTanksNames = [ "RightWT", "LeftWT" ]; /* Names of the stations */
var WingTanksNodes = [ "consumables/fuel/tank[0]/level-lbs", "consumables/fuel/tank[2]/level-lbs" ]; /* FGFS properties of the stations */
var WingTanksValue = [ 0, 0 ]; /* as many zeros as stations there are */
var WingTanksMax = [ 67803, 67803]; /* maximum lbs of the station */

var CenteredTanksNames = [ "CtrT" ]; /* Names of the stations */
var CenteredTanksNodes = [ "consumables/fuel/tank[1]/level-lbs" ]; /* FGFS properties of the stations */
var CenteredTanksValue = [ 0 ]; /* as many zeros as stations there are */
var CenteredTanksMax = [ 60925 ]; /* maximum lbs of the station */

document.getElementById("towmax").value = 513677; /*maximum take off weight*/
document.getElementById("lwmax").value = 412264; /*maximum landing weight*/

document.getElementById("gs360").value = 440; /*groundspeed on FL360*/
document.getElementById("gs100").value = 260; /*groundspeed on FL100*/
document.getElementById("fb360").value = 7600; /*fuel consumption on FL360 with an aircraft that has 10000 lbs more than the empty weight (e.g. 10000 lbs of fuel and no pax/cargo)*/
document.getElementById("fb360x").value = 9500; /*fuel consumption on FL360 with an aircraft that has 40000 lbs more than the empty weight (e.g. 10000 lbs of fuel and 30000 lbs pax/cargo) - you may interpolate this value if you know other fuel consumption/weight combi!*/
document.getElementById("clb").value = 2500; /*average climb rate*/
document.getElementById("des").value = 2000; /*average descent rate*/
document.getElementById("maxpax").value = 0; /*max pax on board*/

document.getElementById("dist").value = 1500; /*default value for distance*/
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


