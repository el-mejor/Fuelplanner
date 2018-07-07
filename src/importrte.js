document.getElementById("fileimp").addEventListener("change", importRte, false);
document.getElementById("clearRte").addEventListener("click", clearRte, false);
document.getElementById("loadMetar").addEventListener("click", loadMetarOnline, false);
document.getElementById("zoommap").addEventListener("click", zoomSwitch, false);

var waypointsX = [0.0];
var waypointsY = [0.0];
var waypointsName = ["none"];
var waypointsDist = [0];
var flownRte = [ ];
var xsize = 600;
var filename = "";
var updateTimer = 1; /* seconds to refresh current Postion*/

var zoomswitch = false;

var nodesPos = [ "/position/longitude-deg", "/position/latitude-deg", "/position/altitude-ft" ];

var xhigh = 0.0; var yhigh = 0.0; var xsize = 0.0; var mapy = 0.0; var xlow = 0.0; var ylow = 0.0; var refx = 0.0; var refy = 0.0;
var _a = 0.0;
var _b = 0.0;
var _c = 0.0;
var _d = 0.0;

var _at = 0.0;
var _bt = 0.0;
var _ct = 0.0;
var _dt = 0.0;

for (var i in nodesPos)
{			
	ADDProperty(nodesPos[i], 0, true);
}

function zoomSwitch()
{
	if (!zoomswitch) 
	{ zoomswitch = true; }
	else
	{ zoomswitch = false; }
}

function clearRte()
{
	document.getElementById("fileimp").value = null;
	document.getElementById("dist").classList.replace("outval", "usrval");
	document.getElementById("dist").disabled = false;
	document.getElementById("rteoutput").innerHTML = "The Route was cleared.";
	document.getElementById("rteimpbox").style.background = "lightgray";
	document.getElementById("rteimpbox").style.display = "block";
	document.getElementById("svgrte").innerHTML = "";
	document.getElementById("rtetable").innerHTML = "";
	document.getElementById("wplistbox").classList.add("boxhidden");
	document.getElementById("metar").classList.add("hidden");
	document.getElementById("zoommap").classList.add("boxhidden");

	waypointsX = [0.0];
	waypointsY = [0.0];
	waypointsName = ["none"];
	waypointsDist = [0];

	xlow = 0; xhigh = 0; ylow = 0; yhigh = 0;
	
	calcWeights();
}

function importRte(e) 
{	
	var file = e.target.files[0];
	
	if (!file) 
	{
		return;
	}
	
	filename = file.name;
	
	var reader = new FileReader();
	reader.onload = function() 
	{
		var str = reader.result;
		interpretRte(str);
	};

	reader.readAsText(file);  
}

function interpretRte(rtesrc)
{	
	document.getElementById("rteoutput").innerHTML = "";
	document.getElementById("rteimpbox").style.background = "lime";
	document.getElementById("rteimpbox").style.display = "none";

	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(rtesrc, "text/xml");

	var origin = xmlDoc.getElementsByTagName("departure")[0].getElementsByTagName("airport")[0].textContent;
	var dest = xmlDoc.getElementsByTagName("destination")[0].getElementsByTagName("airport")[0].textContent;

	var dist = 0;

	waypointsX = [0.0];
	waypointsY = [0.0];
	waypointsName = [origin];

	document.getElementById("rtetable").innerHTML = "<tr><th style='border-right:1px solid dimgray;border-bottom:1px solid dimgray'></th><th style='border-bottom:1px solid dimgray'>ID</th><th style='border-bottom:1px solid dimgray'>Leg Dist</th><th style='border-bottom:1px solid dimgray'>Total Dist</th></tr>";
	document.getElementById("rtetable").innerHTML += "<tr class='rtehover wpt0' id='wpt0'><td style='border-right:1px solid dimgray;text-align:center'><img class='dep' /></td><td><b>" + xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[0].getElementsByTagName("ident")[0].textContent + "</b></td>" + 
		"<td>0 nm</td>" + 
		"<td>0 nm</td></tr>";

	var skip = 0;
		
	for (var i = 1; i< xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp").length; i++)
	{
		if(!xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i - 1].getElementsByTagName("lat")[0] || !xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("lat")[0])
		{
			skip += 1;
			continue; 
		}
		
		leg = getDistanceFromLatLonInKm(
			xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i - 1].getElementsByTagName("lat")[0].textContent, 
			xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i - 1].getElementsByTagName("lon")[0].textContent, 
			xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("lat")[0].textContent,
			xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("lon")[0].textContent);	

		dist += leg;

		waypointsDist.push(dist);

		var img;
		if (i < xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp").length - 1)
		{
			img = "circle";
		}
		else
		{
			img = "arr";
		}

		document.getElementById("rtetable").innerHTML += "<tr class='rtehover wpt" + (i-skip) + "' id='wpt" + (i-skip) + "'><td style='border-right:1px solid dimgray;text-align:center'><img class='" + img + "' /></td><td><b>" + xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("ident")[0].textContent + "</b></td>" + 
			"<td>" + Math.floor(leg / 1.852) + " nm</td>" + 
			"<td>" + Math.floor(dist / 1.852) + " nm</td></tr>";
	}

	skip = 0;
	
	for (var i = 1; i< xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp").length; i++)
	{
		if(!xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i - 1].getElementsByTagName("lat")[0] || !xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("lat")[0])
		{
			skip += 1;
			continue; 
		}
		
		var tempx = getDistanceFromLatLonInKm(
			xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("lat")[0].textContent, 
			0, 
			xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i-1].getElementsByTagName("lat")[0].textContent, 
			0);

		var tempy = getDistanceFromLatLonInKm(
			0,
			xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("lon")[0].textContent, 
			0,
			xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i-1].getElementsByTagName("lon")[0].textContent);

		if (parseFloat(xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("lon")[0].textContent) < parseFloat(xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i-1].getElementsByTagName("lon")[0].textContent))
		{
			tempy = -tempy;
		}				

		if (parseFloat(xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("lat")[0].textContent) > parseFloat(xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i-1].getElementsByTagName("lat")[0].textContent))
		{
			tempx = -tempx;
		}

		waypointsX.push(tempy + waypointsX[i-1-skip]);	

		waypointsY.push(tempx + waypointsY[i-1-skip]);

		waypointsName.push(xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[i].getElementsByTagName("ident")[0].textContent);		
	}

	/*waypointsName[0] = origin; waypointsName[waypointsName.length - 1] = dest;*/
	
	var i = xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp").length - 1;
	document.getElementById("rteoutput").innerHTML = "<p>Route has been imported: <span style='color:magenta'>[" + filename +"]</span></p>";
	document.getElementById("rteoutput").innerHTML += "<p><b><img class='dep' /> " + origin + "</b> <img class='arrow' /> " +
		Math.floor(dist / 1.852) + " NM <img class='arrow' /> " +
		"<b>" + dest + " <img class='arr' /></b></p> ";

	document.getElementById("dist").value = Math.floor(dist / 1.852);
	document.getElementById("dist").classList.replace("usrval", "outval");
	document.getElementById("dist").disabled = true;
	
	document.getElementById("wplistbox").classList.remove("boxhidden");
	
	document.getElementById("metar").classList.remove("hidden");
	document.getElementById("metar").innerHTML = "<div class='checkwx-container' id='metarorig' data-type='METAR' data-station='" + origin + "'></div>";
	document.getElementById("metar").innerHTML += "<div class='checkwx-container' id='metardest'  data-type='METAR' data-station='" + dest + "'></div>";
	
	var firstwp = 0;
	
	if(!xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[0].getElementsByTagName("lat")[0])
	{ firstwp = 1; }
	
	drawSVGRoute(xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[firstwp].getElementsByTagName("lat")[0].textContent, xmlDoc.getElementsByTagName("route")[0].getElementsByTagName("wp")[firstwp].getElementsByTagName("lon")[0].textContent);
	calcWeights();
}

function loadMetarOnline()
{
	document.getElementById("metarorig").innerHTML = "";
	document.getElementById("metardest").innerHTML = "";
	loadMetar();
}

function enableHover()
{
	var elements = document.getElementsByClassName("rtehover");
	for (var i = 0; i < elements.length; i++)
	{
		elements[i].addEventListener("mouseleave", rteHoverExit);
		elements[i].addEventListener("mouseenter", rteHover);		
		elements[i].addEventListener("click", rteLock);	
	}
}

function rteHoverExit()
{
	var elements = document.getElementsByClassName(this.id);
	for (var i = 0; i < elements.length; i++)
	{
		elements[i].classList.remove("rtehighlight");
	}
}

function rteHover()
{
	var elements = document.getElementsByClassName(this.id);
	for (var i = 0; i < elements.length; i++)
	{
		elements[i].classList.add("rtehighlight");
	}
}

function rteLock()
{
	var elements = document.getElementsByClassName("rtehover");
	for (var i = 0; i < elements.length; i++)
	{
		elements[i].classList.remove("rtehighlightlock");
	}

	var elements = document.getElementsByClassName(this.id);
	for (var i = 0; i < elements.length; i++)
	{
		elements[i].classList.add("rtehighlightlock");
	}
}

function drawSVGRoute(origx, origy) 
{
	xsize = document.getElementById("svgrte").getBoundingClientRect().width * 0.8;

	for (var i = 1; i < waypointsX.length; i++)
	{
		if (waypointsX[i] < xlow) { xlow = waypointsX[i]; }
		if (waypointsX[i] > xhigh) { xhigh = waypointsX[i]; }
		if (waypointsY[i] < ylow) { ylow = waypointsY[i]; }
		if (waypointsY[i] > yhigh) { yhigh = waypointsY[i]; }
	}

	for (var i = 0; i < waypointsX.length; i++)
	{
		waypointsX[i] += -xlow + 200; 
		waypointsY[i] += -ylow + 200;
	}

	xhigh += -xlow + 400;
	yhigh += -ylow + 400;

	if (yhigh == 0) { yhigh = 1; }
	
	mapy = yhigh / xhigh * xsize;

	_a = 0.0;
	_b = 0.0;
	_c = xsize;
	_d = mapy;
	
	_at = _a; _bt = _b; _ct = _c; _dt = _d;
	
	document.getElementById("svgrte").innerHTML = "<svg width='" + xsize + "' height='" + mapy + "' id='gendiagrte' class='diag'></svg>";	
	document.getElementById("gendiagrte").setAttribute("viewBox", _a + " " + _b + " " + _c + " " + _d);
	document.getElementById("gendiagrte").innerHTML += 
	'<marker id="pos" viewBox="0 -2.2 4.2 4.4" refX="2.2" refY="0" markerUnits="strokeWidth" markerWidth="8" markerHeight="8" orient="auto" style="stroke:none;fill:red;">' + 
	'<path d="M 0,0 l 0,1 l 1,-.8 l 1,0 l 0,2 l 1,-2 l 1,0 l 0.2,-0.2 l -0.2,-0.2 l -1,0 l -1,-2 l 0,2 l -1,0 l -1,-0.8 z" />' + 
	'</marker>';
	
	document.getElementById("gendiagrte").innerHTML += "<rect width='" + xsize + "px' height='" + mapy + "px' style='fill:rgb(180,200,255);stroke:none;stroke-width:2px;' />";
	
	refx = getDistanceFromLatLonInKm(
			0, 
			origy, 
			0,
			0);

	refy = getDistanceFromLatLonInKm(
			origx, 
			0, 
			0,
			0);

	if (origx > 0)
	{
		refx = -refx;
	}

	if (origy > 0)
	{
		refy = -refy;
	}

	drawWorldMap(xhigh, yhigh, xsize, mapy, xlow, ylow, refx, refy);
	
	for (var i = 0; i < waypointsX.length; i++)
	{		
		document.getElementById("gendiagrte").innerHTML += 
			"<text class='diagtext' x='" + String(waypointsX[i] / xhigh * xsize)  + "' y='" + String(waypointsY[i] / yhigh * mapy) + "' dy='5px' dx='5px'>" + 
			"<tspan class='rtehover wpt" + i + "' id='wpt" + i + "'>" + waypointsName[i] + "</tspan>" + 
			"</text>";		
	}	

	var points = "";

	for (var i = 0; i < waypointsX.length; i++)
	{
		points += waypointsX[i] / xhigh * xsize + "," + waypointsY[i] / yhigh * mapy + " ";
	}

	document.getElementById("gendiagrte").innerHTML += "<polyline points='" + points + "' style='fill:none;stroke:blue;stroke-width:3px;stroke-opacity:.5;vector-effect:non-scaling-stroke;' />";
	
	document.getElementById("gendiagrte").innerHTML += "<rect width='" + xsize + "px' height='" + mapy + "px' style='fill:none;stroke:black;stroke-width:1px;' />";
	
	drawFlnRouteTimer(xhigh, yhigh, xsize, mapy, xlow, ylow, refx, refy);	
}

function drawWorldMap(xhigh, yhigh, xsize, mapy, xlow, ylow, refx, refy)
{
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(mapdata, "text/xml");
		
	var worldmap;
	
	for (var i = 0; i < xmlDoc.getElementsByTagName("coordinates").length; i++)
	{			
		var crd = (xmlDoc.getElementsByTagName("coordinates")[i].textContent.split(" "));		
		
		worldmap += drawInMap("map" + i, crd, xhigh, yhigh, xsize, mapy, xlow, ylow, refx, refy, 1, "gray", "rgb(240,240,240)", "");
	}
		
	document.getElementById("gendiagrte").innerHTML += worldmap;
}

function drawFlnRouteTimer(xhigh, yhigh, xsize, mapy, xlow, ylow, refx, refy)
{
	setTimeout(function()
	{	
		if (FGFSConnected)
		{ document.getElementById("zoommap").classList.remove("boxhidden"); }
		else
		{ document.getElementById("zoommap").classList.add("boxhidden"); }
	
		flownRte.push(GETPropertyValue(nodesPos[0]) + "," + GETPropertyValue(nodesPos[1]) + ",0");
		
		if (document.getElementById("flownRte"))
		{
			document.getElementById("flownRte").remove();
		}

		var strkwidth;
		
		if (FGFSConnected && zoomswitch)
		{
			var a = getXPos(GETPropertyValue(nodesPos[0]), xlow, xhigh, xsize, refx) - 20;
			var b = getYPos(GETPropertyValue(nodesPos[1]), ylow, yhigh, mapy, refy) - 20;
			var c = 40;
			var d = 40;
			
			setZoomTransition(document.getElementById("gendiagrte"), a,b,c,d);
			
			strkwidth = 1;
		}
		else
		{
			/*document.getElementById("gendiagrte").setAttribute("viewBox", 0 + " " + 0 + " " + xsize + " " + mapy); */
			setZoomTransition(document.getElementById("gendiagrte"), 0,0,xsize,mapy);
			
			strkwidth = 3;
		}
		
		document.getElementById("gendiagrte").innerHTML += drawInMap("flownRte", flownRte, xhigh, yhigh, xsize, mapy, xlow, ylow, refx, refy, strkwidth, "red", "none", "pos");
				
		drawFlnRouteTimer(xhigh, yhigh, xsize, mapy, xlow, ylow, refx, refy);
	}, updateTimer * 1000);
}

function drawInMap(id, crd, xhigh, yhigh, xsize, mapy, xlow, ylow, refx, refy, width, stroke, fill, markerid)
{	
	if (crd.length == 0)
	{
		return "";
	}

	var mapsvg = "";

	var points = "";
	var first = false;
	var valid = false;
	
	for (var p = 0; p < crd.length; p += 1)
	{
		var x = crd[p].split(",");
		
		var tempx = getXPos(parseFloat(x[0]), xlow, xhigh, xsize, refx);
		var tempy = getYPos(parseFloat(x[1]), ylow, yhigh, mapy, refy);
		
		if (tempx > -200  && tempx < xsize + 200 && tempy > -200 && tempy < mapy + 200)
		{
			valid = true;
			
			if (!first)
			{
				points += " M " + tempx + " " + tempy;
			}
			else
			{
				points += " L " + tempx + " " + tempy;
			}
			first = true;
		}
	}
	
	if (valid)
	{
		mapsvg += "<path id='" + id + "' d='" + points + "' marker-end='url(#" + markerid + ")' style='fill:" + fill + ";stroke:" + stroke + ";stroke-width:" + width + "px;' />";
	
		return mapsvg;
	}
	else
	{ 
		return "";
	}
}

function getXPos(wmapx, xlow, xhigh, xsize, refx)
{
	var tempx = getDistanceFromLatLonInKm(
		wmapx, 
		0, 
		0, 
		0);					

	if (wmapx < 0)
	{
		tempx = -tempx;
	}

	tempx += -xlow + 200 + refx;
	return ((tempx)  / xhigh * xsize);
}
	
function getYPos(wmapy, ylow, yhigh, mpay, refy)
{		
	var tempy = getDistanceFromLatLonInKm(
		0,
		wmapy, 
		0,
		0);
		
	if (wmapy > 0)
	{
		tempy = -tempy;
	}	
	
	tempy += -ylow + 200 - refy;
	return ((tempy) / yhigh * mapy);
}

function setZoomTransition(diag, a, b, c, d)
{
	if (_at == a && _bt == b && _ct == c && _dt == d)
	{ return; }
	
	_at = a; _bt = b; _ct = c; _dt = d;
	
	setTimeout(zoomTransitionLoop, 30, diag);
}

function zoomTransitionLoop(diag)
{	
	if (_a != _at)
	{ _a += (_at - _a) / 16.0;}
	if (_b != _bt)
	{ _b += (_bt - _b) / 16.0;}
	if (_c != _ct)
	{ _c += (_ct - _c) / 16.0;}
	if (_d != _dt)
	{ _d += (_dt - _d) / 16.0;}
	
	diag.setAttribute("viewBox", _a + " " + _b + " " + _c + " " + _d); 
	
	if (Math.abs(_a - _at) > 2.0 || Math.abs(_b - _bt) > 2.0 || Math.abs(_c - _ct) > 2.0 || Math.abs(_d - _dt) > 2.0)
	{ setTimeout(zoomTransitionLoop, 30, diag); }
}

/* from: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula */
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) 
{
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}