var retryattempts = 10; /* attempts to establish fgfs connection*/
var retrydelay = 3; /*delay for another attempt */

var connbutton = document.getElementById("connectfgfsbtn"); /*the button to initiate a connection to fgfs*/;
var ipsrc = document.getElementById("fgfswsip"); /*the input element with the IP address*/
var portsrc = document.getElementById("fgfswsport"); /*the input element with the PORT*/
var connectedhint = document.getElementById("fgfsconnected"); /*the element to inform the user that a connection is established*/
var closedhint = document.getElementById("fgfsconnlost"); /*the element to inform the user that the connection was closed*/
var errorhint = document.getElementById("fgfsconnerr"); /*the element to inform the user that there was an error*/
var logoutput = document.getElementById("fgconnlog"); /* the element where the logs are sent to*/

var ip;
var port;
var retry;
var FGFSConnected = false;
var FGFSProperties = { "properties": {} };
var FGFSListeners = [];

connbutton.addEventListener("click", FGconnectToWebsocketButton);

function FGconnectToWebsocketButton() 
{
	retry = retryattempts;
	FGconnectToWebsocket();
}

function FGconnectToWebsocket() 
{
	document.getElementById("fgconnlogbox").style.height = "100em";
	
	ip = document.getElementById("fgfswsip").value;
	port = document.getElementById("fgfswsport").value;
    
	FGConnLog("CONNECTING: " + "ws://" + ip + ":" + port + "/PropertyListener", "log");
	
	socket = new WebSocket("ws://" + ip + ":" + port + "/PropertyListener");
	socket.onopen = function(evt) { FGonOpen(evt) };
	socket.onclose = function(evt) { FGonClose(evt) };
	socket.onmessage = function(evt) { FGonMessage(evt) };
	socket.onerror = function(evt) { FGonError(evt) };	
	retry -= 1;
}

function FGonOpen(evt)
{		
	errorhint.classList.add("xboxhidden");
	closedhint.classList.add("xboxhidden");
	connectedhint.classList.remove("xboxhidden");

	retry = retryattempts;	
	FGFSConnected = true;
	
	for (var i in FGFSListeners)
	{
		FGGetValue(FGFSListeners[i]);
		FGAddListener(FGFSListeners[i]);	
	}
}

function FGonClose(evt)
{
	FGFSConnected = false;
	
	connectedhint.classList.add("xboxhidden");
	closedhint.innerHTML = "NOT CONNECTED TO FGFS: ";
	closedhint.innerHTML += evt.code + " / " + evt.reason;
	closedhint.classList.remove("xboxhidden");
	
	FGConnLog("CLOSED: " + evt.code, "warn");	
	
	if (retry > 0) 
	{ 
		setTimeout(FGconnectToWebsocket, retrydelay * 1000); 
		FGConnLog("RETRY IN " + retrydelay + "s - " + retry + " ATTEMPTS LEFT", "warn");
	}
	else
	{
		FGConnLog("NO CONNECTION ESTABLISHED - SRY, I DIDN'T WORK OUT!", "warn");		
	}
	
}

function FGonMessage(evt)
{
	var msg = evt.data;
	/*FGConnLog("RECEIVE: " + msg, "rcv");*/
	
	var JSONobj = JSON.parse(msg);

	FGFSProperties.properties[JSONobj.path] = JSONobj.value;
}

function FGonError(evt)
{
	FGConnLog("ERROR!", "err");
	errorhint.innerHTML = "ERROR: CONNECTION FAILED TO " + "ws://" + ip + ":" + port + "/PropertyListener";
	connectedhint.classList.add("xboxhidden");
	errorhint.classList.remove("xboxhidden");
}

function FGAddListener(node)
{
	var JSONobj = { "command":"addListener", "node":node };
	var msg = JSON.stringify(JSONobj);
	if (FGFSConnected) 
	{ 
		socket.send(msg); 	
		/*FGConnLog("SEND: " + msg, "snd");*/
	}
}

function FGSetValue(node, value)
{
	var JSONobj = { "command":"set", "node":node, "value":value };
	var msg = JSON.stringify(JSONobj);
	if (FGFSConnected) 
	{ 
		socket.send(msg); 	
		/*FGConnLog("SEND: " + msg, "snd");*/
	}
}

function FGGetValue(node)
{
	var JSONobj = { "command":"get", "node":node };
	var msg = JSON.stringify(JSONobj);
	if (FGFSConnected) 
	{ 
		socket.send(msg); 	
		/*FGConnLog("SEND: " + msg, "snd");*/
	}
}

function FGConnLog(msg, type)
{	
	var color;
	switch (type) 
	{
		case "log":
			color = "Lime"; 
			break;
		case "err":
			color = "orange"; 
			break;
		case "warn":
			color = "yellow";
			break;
		case "rcv":
			color = "lightblue";
			break;
		case "snd":
			color = "white"; 
			break;
		default:
			color = "Lime"; 
	}
	
	msg = "<span style='color:" + color + ";font-family:monospace;'>" + msg + "</span>";
	
	logoutput.innerHTML = msg + "<br/>" + document.getElementById("fgconnlog").innerHTML;
}

function ADDProperty(key, initVal, enableListener)
{
	FGFSProperties.properties[key] = initVal;	
	
	if (enableListener)
	{
		FGFSListeners.push(key);
		FGGetValue(key);
		FGAddListener(key);		
	}
}

function GETPropertyValue(key)
{
	return FGFSProperties.properties[key];
}

function setPayloadBtnClick()
{
	if (checkIfLoadingIsPossible())
	{	
		FGSetValue(nodesPayload[0], document.getElementById("crew").value);
		FGSetValue(nodesPayload[1], document.getElementById("pax").value);
		
		for (var i = 0; i < CargoBaysNames.length; i++)
		{
			FGSetValue(CargoBaysNodes[i], document.getElementById(CargoBaysNames[i]).value);
		}
	}
}

function setFuelBtnClick()
{
	if (checkIfLoadingIsPossible())
	{
		for (var i = 0; i < WingTanksNames.length; i++)
		{
			FGSetValue(WingTanksNodes[i], WingTanksValue[i]);
		}
		
		for (var i = 0; i < WingTanksNames.length; i++)
		{
			FGSetValue(CenteredTanksNodes[i], CenteredTanksValue[i]);
		}
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
	
	/* here a propper value should be checked to ensure that the acft can be refuelled, e.g. if the engines are off or on ground */
	
	if (confirm("Are you sure to send the values to FGFS now?"))
	{
		return true;
	}		
	
	return false;	
}


