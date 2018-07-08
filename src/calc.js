var vals = ["ew", "crew", "pax", "fwdcrg", "aftcrg", "fob", "fobmax", "towmax", "lwmax", "tow", "lw", "zfw", "fb360", "fb360x"];
var valstab = ["clbfuel", "crs1fuel", "crs2fuel", "crs3fuel", "crs11fuel", "crs22fuel", "crs33fuel", "todfuel", "fltfuel", "outconti", "outtaxi", "outresfuel", "outadd", "blockfuel"];
var lbskg = 0.453592;
	
var profildiagsizex = 300;
var profildiagsizey = Math.floor(profildiagsizex / 3);
	
var fltfuel = 0;
var block = 0;
	
var fillmode = "fillouter";
document.getElementById("fillouter").classList.add("enabled");
	
var objs = document.getElementsByClassName("usrval");

var entertemp = 0;
	
for (i = 0; i < objs.length; i++)
{
	objs[i].addEventListener("keyup", calcWeights);		
	objs[i].addEventListener("change", calcWeights);	
	objs[i].addEventListener("focus", beginEnter);	
	objs[i].addEventListener("blur", endEnter);
}	
	
var objs = document.getElementsByClassName("paramval");

for (i = 0; i < objs.length; i++)
{
	objs[i].addEventListener("keyup", calcWeights);		
	objs[i].addEventListener("change", calcWeights);
	objs[i].addEventListener("focus", beginEnter);	
	objs[i].addEventListener("blur", endEnter);		
}	

var objs = document.getElementsByClassName("showhidebutton");
	
for (i = 0; i < objs.length; i++)
{
	objs[i].addEventListener("click", showHideBox);		
}

document.getElementById("prevcrsalt2").addEventListener("click", calcWeights);
document.getElementById("prevcrsalt3").addEventListener("click", calcWeights);
document.getElementById("emptyload").addEventListener("click", emptyLoad);
document.getElementById("rndpax").addEventListener("click", rndPax);
document.getElementById("maxpaxset").addEventListener("click", maxPaxSet);

document.getElementById("fillouter").addEventListener("click", changeFillMode);
document.getElementById("fillequal").addEventListener("click", changeFillMode);

var objs = document.getElementsByClassName("statval");

for (i = 0; i < objs.length; i++)
{
	objs[i].disabled = true;
}	

var objs = document.getElementsByClassName("outval");

for (i = 0; i < objs.length; i++)
{
	objs[i].disabled = true;
}	

calcWeights();
	
function showHideBox()
{
	this.parentElement.nextElementSibling.classList.toggle("hidden");
	if (this.parentElement.nextElementSibling.classList.contains("hidden"))
	{
		this.children[0].classList.replace("hideimg", "showimg");
	}
	else
	{
		this.children[0].classList.replace("showimg", "hideimg");
	}
}

function changeFillMode()
{	
	document.getElementById("fillequal").classList.remove("enabled");
	document.getElementById("fillouter").classList.remove("enabled");
	
	if (this.id == "fillouter")
	{
		fillmode = "fillouter";
	}	
	else
	{
		fillmode = "fillequal";			
	}
		
	this.classList.add("enabled");
		
	calcWeights();
}
	
function beginEnter()
{
	entertemp = this.value;
	this.value = '';		
}
	
function endEnter()
{
	if (this.value == '')
	{
		this.value = entertemp;
		calcWeights();
	}	
}
	
function setPax(cnt)
{
	document.getElementById("paxcnt").value = cnt;
	document.getElementById("fwdcrg").value = Math.floor(cnt * 20 / lbskg / 2);
	document.getElementById("aftcrg").value = Math.floor(cnt * 20 / lbskg / 2);	
		
	calcWeights();
}
	
function rndPax()
{
	var cnt = Math.floor((Math.random() * parseInt(document.getElementById("maxpax").value)) + 1);
		
	setPax(cnt);
}
	
function maxPaxSet()
{
	var cnt = parseInt(document.getElementById("maxpax").value);
	
	setPax(cnt);
}
	
function emptyLoad()
{
	setPax(0);
}


function calcKg(sender) 
{
	document.getElementById(sender + "kg").value = Math.floor(parseInt(document.getElementById(sender).value) * lbskg);					
}

function calcKgAll ()
{
	for (i = 0; i < vals.length; i++)
	{
		calcKg(vals[i]);
	}
	
	for (i = 0; i < WingTanksNames.length; i++)
	{
		calcKg(WingTanksNames[i]);
		calcKg(WingTanksNames[i] + "max");
	}
	
	for (i = 0; i < CenteredTanksNames.length; i++)
	{
		calcKg(CenteredTanksNames[i]);
		calcKg(CenteredTanksNames[i] + "max");
	}

	for (i = 0; i < valstab.length; i++)
	{
		document.getElementById(valstab[i] + "kg").innerHTML = Math.floor(parseInt(document.getElementById(valstab[i]).innerHTML) * lbskg);	
	}
}

function calcWeights()
{
	try
	{
		calcWeightsEx();
		calcWeightsEx();
		enableHover();
	}
	catch (err)
	{
		document.getElementById("genericfatalerror").innerHTML = "ERROR: " + err.message;
	}
}

function calcWeightsEx()
{
	if (!document.getElementById("prevcrsalt2").checked)
	{
		document.getElementById("crsalt2").value = document.getElementById("crsalt1").value
	}
	if (!document.getElementById("prevcrsalt3").checked)
	{
		document.getElementById("crsalt3").value = document.getElementById("crsalt2").value
	}		

    document.getElementById("pax").value = Math.floor((parseInt(document.getElementById("paxcnt").value) * parseInt(document.getElementById("paxweight").value)) / lbskg);

	var zfw = 0.0;
		
    zfw = parseInt(document.getElementById("ew").value) + 
		    parseInt(document.getElementById("crew").value) + 
		    parseInt(document.getElementById("pax").value) + 
		    parseInt(document.getElementById("fwdcrg").value) + 
		    parseInt(document.getElementById("aftcrg").value);		

	document.getElementById("zfw").value = zfw;

    calcFuel();
	
	var fobmax = sumTanksToFOBMax();
	var fob = 0;
	
	for (var i = 0; i < WingTanksNames.length; i ++)
	{ 
		document.getElementById(WingTanksNames[i]).value = Math.floor(block / fobmax * WingTanksMax[i]);
		fob += Math.floor(block / fobmax * WingTanksMax[i]);
	}
	for (var i = 0; i < CenteredTanksNames.length; i ++)
	{ 
		document.getElementById(CenteredTanksNames[i]).value = Math.floor(block / fobmax * CenteredTanksMax[i]);
		fob += Math.floor(block / fobmax * CenteredTanksMax[i]);
	}

	document.getElementById("fob").value = fob;

	document.getElementById("tow").value = parseInt(document.getElementById("zfw").value) + fob;

	document.getElementById("lw").value = Math.floor(parseInt(document.getElementById("tow").value) - fltfuel);
		
	/*if (fillmode == "fillouter")
	{			
		var outfree = 2 * (rwtmax - Math.floor(block / fobmax * rwtmax));
		if (Math.floor(block / fobmax * ctrmax) >= outfree)
		{
			document.getElementById("ctr").value = Math.floor(block / fobmax * ctrmax) - outfree
		}
		else
		{
			outfree = Math.floor(block / fobmax * ctrmax);
			document.getElementById("ctr").value = 0;
		}
		document.getElementById("rwt").value = Math.floor(block / fobmax * rwtmax + outfree / 2);
		document.getElementById("lwt").value = Math.floor(block / fobmax * lwtmax + outfree / 2);
	}*/
		
	/*fuel compartment diagram*/
	/*
	profildiagsizex = document.getElementById("svgtank").getBoundingClientRect().width * 0.8;
	profildiagsizey = Math.floor(profildiagsizex / 3);

	var rwtmax = parseInt(document.getElementById("rwtmax").value);		
	var ctrmax = parseInt(document.getElementById("ctrmax").value);		
	document.getElementById("svgtank").innerHTML = "<svg width='" + profildiagsizex + "px' height='60px' id='gendiagtank' class='diag'>";
	document.getElementById("svgtank").innerHTML += "</svg>";
	document.getElementById("gendiagtank").innerHTML = "<rect x='0' y='0' width='" + rwtmax / ctrmax * profildiagsizex + "px' height='20px'  style='fill:none;stroke:black;stroke-width:1px;'/>";
	document.getElementById("gendiagtank").innerHTML += "<rect x='0' y='20' width='" + ctrmax / ctrmax * profildiagsizex + "px' height='20px'  style='fill:none;stroke:black;stroke-width:1px;' />";
	document.getElementById("gendiagtank").innerHTML += "<rect x='0' y='40' width='" + rwtmax / ctrmax * profildiagsizex + "px' height='20px'  style='fill:none;stroke:black;stroke-width:1px;' />";
	document.getElementById("gendiagtank").innerHTML += "<rect x='0' y='0' width='0' height='20px'  style='fill:lime;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + parseFloat(document.getElementById("rwt").value) / ctrmax * profildiagsizex + "px' begin ='0s' dur='.5s' fill='freeze'/></rect>";
	document.getElementById("gendiagtank").innerHTML += "<rect x='0' y='20' width='0' height='20px'  style='fill:lime;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + parseFloat(document.getElementById("ctr").value) / ctrmax * profildiagsizex + "px' begin ='.2s' dur='.55s' fill='freeze'/></rect>";
	document.getElementById("gendiagtank").innerHTML += "<rect x='0' y='40' width='0' height='20px'  style='fill:lime;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + parseFloat(document.getElementById("lwt").value) / ctrmax * profildiagsizex + "px' begin ='.4s' dur='.6s' fill='freeze'/></rect>";
	document.getElementById("gendiagtank").innerHTML += 
		"<text x='0' y='0' class='diagtext' dx='5' dy='12px'>" + 
		"<tspan>LWT</tspan>" + 
		"</text>";
	document.getElementById("gendiagtank").innerHTML += 
		"<text x='0' y='20' class='diagtext' dx='5' dy='12px'>" + 
		"<tspan>CTR</tspan>" + 
		"</text>";
	document.getElementById("gendiagtank").innerHTML += 
		"<text x='0' y='40' class='diagtext' dx='5' dy='12px'>" + 
		"<tspan>RWT</tspan>" + 
		"</text>";	
	*/
	calcKgAll();

	checkErr();
}

function calcFuel()
{
	var time = 0;

    var coeff = (parseFloat(document.getElementById("fb360x").value) - parseFloat(document.getElementById("fb360").value)) / 30000;
    var addweight = parseFloat(document.getElementById("zfw").value) - parseFloat(document.getElementById("ew").value) - (10000);

	var gs360 = parseFloat(document.getElementById("gs360").value);
	var gs100 = parseFloat(document.getElementById("gs100").value);

	var fb360 = parseFloat(document.getElementById("fb360").value);

	var dist = parseFloat(document.getElementById("dist").value);

	var origalt = parseFloat(document.getElementById("origalt").value);
	var destalt = parseFloat(document.getElementById("destalt").value);

	var crs1alt = parseFloat(document.getElementById("crsalt1").value);
	var crs2alt = parseFloat(document.getElementById("crsalt2").value);
	var crs3alt = parseFloat(document.getElementById("crsalt3").value);

	var clb = parseFloat(document.getElementById("clb").value);
	var des = parseFloat(document.getElementById("des").value);

	var crs1effgs = gs100 + ((crs1alt - 10000) / (36000 - 10000)) * (gs360 - gs100);
	var crs2effgs = gs100 + ((crs2alt - 10000) / (36000 - 10000)) * (gs360 - gs100);
	var crs3effgs = gs100 + ((crs3alt - 10000) / (36000 - 10000)) * (gs360 - gs100);
	var crs1efffb = fb360;
	var crs2efffb = fb360;
	var crs3efffb = fb360;

	block = 0;

	document.getElementById("clbalt").innerHTML = origalt;
	var clbtime = Math.floor((crs1alt - origalt) / clb);
		

	var toddist = dist - (((crs3alt - destalt) / des) / 60) * (crs3effgs + gs100) / 2;
	document.getElementById("toddist").innerHTML = Math.floor(toddist);
	document.getElementById("todalt").innerHTML = Math.floor(crs3alt);

	document.getElementById("crs1alt").innerHTML = Math.floor(crs1alt);		
    document.getElementById("crs11alt").innerHTML = Math.floor(crs1alt);
	var crs1dist = (((crs1alt - origalt) / clb) / 60) * (crs1effgs + 150) / 2;		
    var crs11dist = crs1dist +  1 *  (toddist - crs1dist) / 6; 

    document.getElementById("crs1dist").innerHTML = Math.floor(crs1dist);		
    document.getElementById("crs11dist").innerHTML = Math.floor(crs11dist);	

	document.getElementById("crs2alt").innerHTML = Math.floor(crs2alt);		
    document.getElementById("crs22alt").innerHTML = Math.floor(crs2alt);
	var crs2dist = crs1dist + 2 * (toddist - crs1dist) / 6;

	var crs22dist = crs1dist + 3 * (toddist - crs1dist) / 6; document.getElementById("crs2dist").innerHTML = Math.floor(crs2dist);
    document.getElementById("crs22dist").innerHTML = Math.floor(crs22dist);
		

	document.getElementById("crs3alt").innerHTML = Math.floor(crs3alt);
    document.getElementById("crs33alt").innerHTML = Math.floor(crs3alt);		
	var crs3dist = crs1dist + 4 * (toddist - crs1dist) / 6;

	var crs33dist = crs1dist + 5 * (toddist - crs1dist) / 6; document.getElementById("crs3dist").innerHTML = Math.floor(crs3dist);		
    document.getElementById("crs33dist").innerHTML = Math.floor(crs33dist);		
	document.getElementById("crs1time").innerHTML = getHHMM(Math.floor((crs11dist - crs1dist) / crs1effgs * 60));
    document.getElementById("crs11time").innerHTML = getHHMM(Math.floor((crs2dist - crs11dist) / crs1effgs * 60)); 


	document.getElementById("crs2time").innerHTML = getHHMM(Math.floor((crs22dist - crs2dist) / crs2effgs * 60));
    document.getElementById("crs22time").innerHTML = getHHMM(Math.floor((crs3dist - crs22dist) / crs2effgs * 60));		


	document.getElementById("crs3time").innerHTML = getHHMM(Math.floor((crs33dist - crs3dist) / crs3effgs * 60));
    document.getElementById("crs33time").innerHTML = getHHMM(Math.floor((toddist - crs33dist) / crs3effgs * 60));		

    document.getElementById("todtime").innerHTML = getHHMM(Math.floor(((crs3alt - destalt) / des)));
		
    document.getElementById("clbtime").innerHTML = getHHMM(clbtime);

    document.getElementById("outtaxi").innerHTML = parseFloat(document.getElementById("taxifl").value);				
	document.getElementById("outadd").innerHTML = parseFloat(document.getElementById("addfl").value);
	document.getElementById("outrestime").innerHTML = getHHMM(parseFloat(document.getElementById("resflmin").value));
	document.getElementById("outresfuel").innerHTML = Math.floor(parseFloat(document.getElementById("resflmin").value) * fb360 / 60 * 1.05);



    addweight += parseFloat(document.getElementById("outtaxi").innerHTML) + parseFloat(document.getElementById("outadd").innerHTML) + parseFloat(document.getElementById("outresfuel").innerHTML);
    var aw2 = addweight;

    /* first calculation w/o contigency fuel */
    var _desfl = Math.floor(((crs3alt - destalt) / des) / 60 * (fb360 * 0.5 + addweight * coeff));
    addweight += _desfl;
    var _crs6fl = Math.floor((toddist - crs33dist) / crs3effgs * (fb360 + addweight * coeff));
    addweight += _crs6fl;
    var _crs5fl = Math.floor((crs33dist - crs3dist) / crs3effgs * (fb360 + addweight * coeff));
    addweight += _crs5fl;
    var _crs4fl = Math.floor((crs3dist - crs22dist) / crs2effgs * (fb360 + addweight * coeff));
    addweight += _crs4fl;
    var _crs3fl = Math.floor((crs22dist - crs2dist) / crs2effgs * (fb360 + addweight * coeff));
    addweight += _crs3fl;
    var _crs2fl = Math.floor((crs2dist - crs11dist) / crs1effgs * (fb360 + addweight * coeff));
    addweight += _crs2fl;
    var _crs1fl = Math.floor((crs11dist - crs1dist) / crs1effgs * (fb360 + addweight * coeff));
    addweight += _crs1fl;
    var _clbfl = Math.floor(clbtime / 60 * (fb360 * 2.5 + addweight * coeff));

    /* first contigency estimation */
    var contifl = (_desfl + _crs6fl + _crs5fl + _crs4fl + _crs3fl + _crs2fl + _crs1fl + _clbfl) * parseFloat(document.getElementById("contiperc").value) / 100.0;		

    addweight = aw2 + contifl;
        
    /* second calculation with contigency fuel*/
    var _desfl = Math.floor(((crs3alt - destalt) / des) / 60 * (fb360 * 0.5 + addweight * coeff));
    addweight += _desfl;
    var _crs6fl = Math.floor((toddist - crs33dist) / crs3effgs * (fb360 + addweight * coeff));
    addweight += _crs6fl;
    var _crs5fl = Math.floor((crs33dist - crs3dist) / crs3effgs * (fb360 + addweight * coeff));
    addweight += _crs5fl;
    var _crs4fl = Math.floor((crs3dist - crs22dist) / crs2effgs * (fb360 + addweight * coeff));
    addweight += _crs4fl;
    var _crs3fl = Math.floor((crs22dist - crs2dist) / crs2effgs * (fb360 + addweight * coeff));
    addweight += _crs3fl;
    var _crs2fl = Math.floor((crs2dist - crs11dist) / crs1effgs * (fb360 + addweight * coeff));
    addweight += _crs2fl;
    var _crs1fl = Math.floor((crs11dist - crs1dist) / crs1effgs * (fb360 + addweight * coeff));
    addweight += _crs1fl;
    var _clbfl = Math.floor(clbtime / 60 * (fb360 * 4.0 + addweight * coeff));

    /* real contigency fuel */
    var contifl = (_desfl + _crs6fl + _crs5fl + _crs4fl + _crs3fl + _crs2fl + _crs1fl + _clbfl) * parseFloat(document.getElementById("contiperc").value) / 100.0;

    document.getElementById("clbfuel").innerHTML = Math.floor(_clbfl);
    document.getElementById("crs1fuel").innerHTML = Math.floor(_crs1fl);
    document.getElementById("crs11fuel").innerHTML = Math.floor(_crs2fl);
    document.getElementById("crs2fuel").innerHTML = Math.floor(_crs3fl);
    document.getElementById("crs22fuel").innerHTML = Math.floor(_crs4fl);
    document.getElementById("crs3fuel").innerHTML = Math.floor(_crs5fl);
    document.getElementById("crs33fuel").innerHTML = Math.floor(_crs6fl);
    document.getElementById("todfuel").innerHTML = Math.floor(_desfl);

    contifl = (_desfl + _crs6fl + _crs5fl + _crs4fl + _crs3fl + _crs2fl + _crs1fl + _clbfl) * parseFloat(document.getElementById("contiperc").value) / 100.0;		

	time += (crs1alt - origalt) / clb + (crs2dist - crs1dist) / crs1effgs * 60 + (crs3dist - crs2dist) / crs2effgs * 60 + (toddist - crs3dist) / crs3effgs * 60 + ((crs3alt - destalt) / des);
		
    block = _desfl + _crs6fl + _crs5fl + _crs4fl + _crs3fl + _crs2fl + _crs1fl + _clbfl;
		
    document.getElementById("landdist").innerHTML = dist;
	document.getElementById("landalt").innerHTML = destalt;

	document.getElementById("fltfuel").innerHTML = Math.floor(block);
	document.getElementById("flttime").innerHTML = getHHMM(Math.floor(Math.floor(time)));

	fltfuel = block;

    document.getElementById("outconti").innerHTML = Math.floor(contifl);

		

	time += parseFloat(document.getElementById("resflmin").value);
	block += 
        parseFloat(document.getElementById("outconti").innerHTML) +
        parseFloat(document.getElementById("taxifl").value) +
        parseFloat(document.getElementById("addfl").value) +
        parseFloat(document.getElementById("resflmin").value) * fb360 / 60 * 1.05;

	document.getElementById("blockfuel").innerHTML = Math.floor(block);
	document.getElementById("blocktime").innerHTML = getHHMM(Math.floor(time));
		
	var maxalt = 45000;
	var maxdist = dist;
		
	var diagy = [ origalt, crs1alt, crs2alt, crs3alt, destalt ];
	var diagx = [ 0, crs1dist, crs2dist, crs3dist, toddist, dist ];

	/*flight profil diagram*/

	profildiagsizex = document.getElementById("svgprofile").getBoundingClientRect().width * 0.8;
	profildiagsizey = Math.floor(profildiagsizex / 3);

	document.getElementById("svgprofile").innerHTML = "<svg width='" + profildiagsizex + "px' height='" + profildiagsizey + "px' id='gendiagprofil' class='diag'>";
	document.getElementById("svgprofile").innerHTML += "</svg>";

	if (waypointsDist.length > 1)
	{
		for (var i = 0; i < waypointsDist.length; i++)
		{
			document.getElementById("gendiagprofil").innerHTML += "<polyline class='rtehover wpt" + i + "' id='wpt" + i + "' points='" + getPtStr(waypointsDist[i] / 1.852, 0, maxalt, maxdist) + getPtStr(waypointsDist[i]  / 1.852, maxalt, maxalt, maxdist) + "' style='stroke-width:3px;' />";
		}
	}
	else
	{
		document.getElementById("gendiagprofil").innerHTML += "<polyline points='" + getPtStr(diagx[0], 0, maxalt, maxdist) + getPtStr(diagx[0], maxalt, maxalt, maxdist) + "' style='fill:none;stroke:black;stroke-width:1px;stroke-dasharray:1, 2' />";
		document.getElementById("gendiagprofil").innerHTML += "<polyline points='" + getPtStr(diagx[1], 0, maxalt, maxdist) + getPtStr(diagx[1], maxalt, maxalt, maxdist) + "' style='fill:none;stroke:black;stroke-width:1px;stroke-dasharray:1, 2' />";
		document.getElementById("gendiagprofil").innerHTML += "<polyline points='" + getPtStr(diagx[2], 0, maxalt, maxdist) + getPtStr(diagx[2], maxalt, maxalt, maxdist) + "' style='fill:none;stroke:black;stroke-width:1px;stroke-dasharray:1, 2' />";
		document.getElementById("gendiagprofil").innerHTML += "<polyline points='" + getPtStr(diagx[3], 0, maxalt, maxdist) + getPtStr(diagx[3], maxalt, maxalt, maxdist) + "' style='fill:none;stroke:black;stroke-width:1px;stroke-dasharray:1, 2' />";
		document.getElementById("gendiagprofil").innerHTML += "<polyline points='" + getPtStr(diagx[4], 0, maxalt, maxdist) + getPtStr(diagx[4], maxalt, maxalt, maxdist) + "' style='fill:none;stroke:black;stroke-width:1px;stroke-dasharray:1, 2' />";
		document.getElementById("gendiagprofil").innerHTML += "<polyline points='" + getPtStr(diagx[5], 0, maxalt, maxdist) + getPtStr(diagx[5], maxalt, maxalt, maxdist) + "' style='fill:none;stroke:black;stroke-width:1px;stroke-dasharray:1, 2' />";
	}

	document.getElementById("gendiagprofil").innerHTML += "<polyline points='" + 
	getPtStr(diagx[0], diagy[0], maxalt, maxdist) + 
	getPtStr(diagx[1], diagy[1], maxalt, maxdist) + 
	getPtStr(diagx[2], diagy[1], maxalt, maxdist) + 
	getPtStr(diagx[2], diagy[2], maxalt, maxdist) + 
	getPtStr(diagx[3], diagy[2], maxalt, maxdist) + 
	getPtStr(diagx[3], diagy[3], maxalt, maxdist) + 
	getPtStr(diagx[4], diagy[3], maxalt, maxdist) +
	getPtStr(diagx[5], diagy[4], maxalt, maxdist) +
	"' style='fill:none;stroke:blue;stroke-width:1px;' />";
	
	document.getElementById("gendiagprofil").innerHTML += 
		"<text x='" + getPtX(diagx[1], maxdist) + "' y='" + getPtY(diagy[1], maxalt) + "' class='diagtext' dy='-5px'>" + 
		"<tspan>" + Math.floor(diagx[1]) + "NM </tspan>" + 
		"</text>";
	document.getElementById("gendiagprofil").innerHTML += 
		"<text x='" + getPtX(diagx[2], maxdist) + "' y='" + getPtY(diagy[2], maxalt) + "' class='diagtext' dy='-5px'>" + 
		"<tspan>" + Math.floor(diagx[2]) + "NM </tspan>" + 
		"</text>";
	document.getElementById("gendiagprofil").innerHTML += 
		"<text x='" + getPtX(diagx[3], maxdist) + "' y='" + getPtY(diagy[3], maxalt) + "' class='diagtext' dy='-5px'>" + 
		"<tspan>" + Math.floor(diagx[3]) + "NM </tspan>" + 
		"</text>";
	document.getElementById("gendiagprofil").innerHTML += 
		"<text x='" + getPtX(diagx[4], maxdist) + "' y='" + getPtY(diagy[3], maxalt) + "' class='diagtext' dy='-5px'>" + 
		"<tspan>" + Math.floor(diagx[4]) + "NM </tspan>" + 
		"</text>";

	document.getElementById("gendiagprofil").innerHTML += "<circle cx='" + getPtX(diagx[0], maxdist) + "' cy='" + getPtY(diagy[0], maxalt) + "' r='5' stroke-width='2' fill='blue' />";
	document.getElementById("gendiagprofil").innerHTML += "<circle cx='" + getPtX(diagx[1], maxdist) + "' cy='" + getPtY(diagy[1], maxalt) + "' r='5' stroke-width='2' fill='blue' />";
	document.getElementById("gendiagprofil").innerHTML += "<circle cx='" + getPtX(diagx[2], maxdist) + "' cy='" + getPtY(diagy[2], maxalt) + "' r='5' stroke-width='2' fill='blue' />";
	document.getElementById("gendiagprofil").innerHTML += "<circle cx='" + getPtX(diagx[3], maxdist) + "' cy='" + getPtY(diagy[3], maxalt) + "' r='5' stroke-width='2' fill='blue' />";
	document.getElementById("gendiagprofil").innerHTML += "<circle cx='" + getPtX(diagx[4], maxdist) + "' cy='" + getPtY(diagy[3], maxalt) + "' r='5' stroke-width='2' fill='blue' />";
	document.getElementById("gendiagprofil").innerHTML += "<circle cx='" + getPtX(diagx[5], maxdist) + "' cy='" + getPtY(diagy[4], maxalt) + "' r='5' stroke-width='2' fill='blue' />";
	
	document.getElementById("gendiagprofil").innerHTML += "<polyline points='" + getPtStr(0, 0, maxalt, maxdist) + getPtStr(dist, 0, maxalt, maxdist) + "' style='fill:none;stroke:black;stroke-width:1px' />";
		
	/*fuel fractions diagram*/

	profildiagsizex = document.getElementById("svgfuel").getBoundingClientRect().width * 0.8;
	profildiagsizey = Math.floor(profildiagsizex / 3);
	
	var maxfob = parseInt(document.getElementById("fobmax").value);		
	document.getElementById("svgfuel").innerHTML = "<svg width='" + profildiagsizex + "px' height='60px' id='gendiagfuel' class='diag'>";
	document.getElementById("svgfuel").innerHTML += "</svg>";
	document.getElementById("gendiagfuel").innerHTML = "<rect x='0' y='0' width='" + profildiagsizex + "px' height='20px'  style='fill:white;stroke:black;stroke-width:1px;' />";
		
	var vl = (fltfuel + parseFloat(document.getElementById("addfl").value) + parseFloat(document.getElementById("outresfuel").innerHTML) + parseFloat(document.getElementById("taxifl").value) + parseFloat(document.getElementById("outconti").innerHTML)) / maxfob * profildiagsizex;
	document.getElementById("gendiagfuel").innerHTML += "<rect x='0' y='0' width='0' height='20px'  style='fill:magenta;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + vl + "px' begin ='1s' dur='.75s' fill='freeze'/></rect>";

	document.getElementById("gendiagfuel").innerHTML += "<circle cx='10' cy='29' r='5' stroke-width='2' fill='lime' /><text x='20' y='32' class='diagtext'><tspan>Trip</tspan></text>";
	document.getElementById("gendiagfuel").innerHTML += "<circle cx='100' cy='29' r='5' stroke-width='2' fill='green' /><text x='120' y='32' class='diagtext'><tspan>Contigency</tspan></text>";
	document.getElementById("gendiagfuel").innerHTML += "<circle cx='200' cy='29' r='5' stroke-width='2' fill='yellow' /><text x='220' y='32' class='diagtext'><tspan>Taxi</tspan></text>";
	
	document.getElementById("gendiagfuel").innerHTML += "<circle cx='10' cy='49' r='5' stroke-width='2' fill='orange' /><text x='20' y='52' class='diagtext'><tspan>Alt & Hold</tspan></text>";
	document.getElementById("gendiagfuel").innerHTML += "<circle cx='100' cy='49' r='5' stroke-width='2' fill='magenty' /><text x='120' y='52' class='diagtext'><tspan>Additional</tspan></text>";
	document.getElementById("gendiagfuel").innerHTML += "<circle cx='200' cy='49' r='5' stroke-width='2' fill='red' /><text x='220' y='52' class='diagtext'><tspan>Over MLW</tspan></text>";

	var vl = (fltfuel + parseFloat(document.getElementById("outresfuel").innerHTML) + parseFloat(document.getElementById("taxifl").value) + parseFloat(document.getElementById("outconti").innerHTML)) / maxfob * profildiagsizex;
	document.getElementById("gendiagfuel").innerHTML += "<rect x='0' y='0' width='0' height='20px'  style='fill:orange;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + vl + "px' begin ='.2s' dur='.55s' fill='freeze'/></rect>";

	vl = (fltfuel + parseFloat(document.getElementById("taxifl").value) + parseFloat(document.getElementById("outconti").innerHTML)) / maxfob * profildiagsizex;
	document.getElementById("gendiagfuel").innerHTML += "<rect x='0' y='0' width='0' height='20px'  style='fill:yellow;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + vl + "px' begin ='.4s' dur='.6s' fill='freeze'/></rect>";

	vl = (fltfuel + parseFloat(document.getElementById("outconti").innerHTML)) / maxfob * profildiagsizex;
	document.getElementById("gendiagfuel").innerHTML += "<rect x='0' y='0' width='0' height='20px'  style='fill:green;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + vl + "px' begin ='.6s' dur='.65s' fill='freeze'/></rect>";

	vl = fltfuel / maxfob * profildiagsizex;
	document.getElementById("gendiagfuel").innerHTML += "<rect x='0' y='0' width='0' height='20px'  style='fill:lime;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + vl + "px' begin ='.8s' dur='.7s' fill='freeze'/></rect>";

	vl = (parseFloat(document.getElementById("tow").value) - parseFloat(document.getElementById("lwmax").value)) / maxfob * profildiagsizex;
	if (vl > 0)
	{
		document.getElementById("gendiagfuel").innerHTML += "<rect x='0' y='0' width='0' height='5px'  style='fill:red;stroke:black;stroke-width:1px;'><animate attributeName='width' from='0' to='" + vl + "px' begin ='1s' dur='.75s' fill='freeze'/></rect>";	
	}
}

function getPtStr(x,y,maxalt, maxdist)
{		
	var sx = getPtX(x, maxdist);
	var sy = getPtY(y, maxalt);
	return sx + "," + sy + " ";
}

function getPtX(x,maxdist)
{
	return Math.floor(x / maxdist * profildiagsizex);
}

function getPtY(y,maxalt)
{
	return Math.floor((maxalt - y) / maxalt * profildiagsizey);
}

function getHHMM(val)
{
	var x = val % 60;
	var y = "00" + x;
	return Math.floor(val/60) + ":" + y.substr(y.length - 2);
}

function checkErr()
{
	var checkFields = ["lwt", "rwt", "ctr", "fob", "tow", "lw"];
	for (i = 0; i < checkFields.length; i++)
	{
		if (parseInt(document.getElementById(checkFields[i]).value) > parseInt(document.getElementById(checkFields[i] + "max").value))
		{
			document.getElementById(checkFields[i]).classList.add("error");
				
			if (checkFields[i] == "lwt" || checkFields[i] == "rwt" || checkFields[i] == "ctr" || checkFields[i] == "fob")
			{	
				document.getElementById("exceedfuellimit").classList.remove("xboxhidden");
			}				
			if (checkFields[i] == "tow")
			{	
				document.getElementById("exceedtowlimit").classList.remove("xboxhidden");
			}
			if (checkFields[i] == "lw")
			{	
				document.getElementById("exceedlwlimit").classList.remove("xboxhidden");
			}
		}
		else
		{
			document.getElementById(checkFields[i]).classList.remove("error");
			if (checkFields[i] == "lwt" || checkFields[i] == "rwt" || checkFields[i] == "ctr" || checkFields[i] == "fob" )
			{
				document.getElementById("exceedfuellimit").classList.add("xboxhidden");
			}
			if (checkFields[i] == "tow")
			{	
				document.getElementById("exceedtowlimit").classList.add("xboxhidden");
			}
			if (checkFields[i] == "lw")
			{	
				document.getElementById("exceedlwlimit").classList.add("xboxhidden");
			}
		}
		
		if (parseInt(document.getElementById("resflmin").value)  < 45 )
		{
			document.getElementById("noaltfl").classList.remove("xboxhidden");
		}
		else
		{
			document.getElementById("noaltfl").classList.add("xboxhidden");
		}
		
		if (parseInt(document.getElementById("taxifl").value) < 400)
		{
			document.getElementById("notaxifl").classList.remove("xboxhidden");
		}
		else
		{
			document.getElementById("notaxifl").classList.add("xboxhidden");
		}
		

		if (parseInt(document.getElementById(checkFields[i] + "kg").value) > parseInt(document.getElementById(checkFields[i] + "maxkg").value))
		{
			document.getElementById(checkFields[i] + "kg").classList.add("error");
		}
		else
		{
			document.getElementById(checkFields[i] + "kg").classList.remove("error");
		}
	}
}