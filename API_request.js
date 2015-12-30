// API_request

var request = require("request");

// get authentication data from json file

var API = {
	"newSession": 	LifeSize_shoreditch + "/rest/new",
	"poll":			LifeSize_shoreditch + "/rest/poll/<session-id>",
	"request":		LifeSize_shoreditch + "/rest/request/<session-id>",
	"longpoll":		LifeSize_shoreditch + "/longpoll.rb?session=<sessionid>&timeout=<seconds>"		//seconds to be replaced, for default 5 sec., remove "&timeout=<seconds>"
};


//function to request a new SessionID from the server, session and data is not necessary yet because this is the information we request from the server.
//new functions are named after the variables they need for more clarity.

// function newSession (session, data, sendData) {					//session, data, sendData: where defined ??? - I defined it! sendData=callback
// 	request(API.newSession, function(error, response, body) {		//function to handle response from server
// 		if (error) throw error;										//if there is error response at all the function throws an error. (could be also used to check if the server and/or the system is down)
// 	 sendData(body.session);
// 	})
// }					
// console.log(API.newSession);

function newSession (session, data, sendData) {						//session, data, sendData: where defined ??? - I defined it! sendData=callback
	request(API.newSession, function(error, response, body) {		//function to handle response from server
		if (error) throw error;										//if there is error response at all the function throws an error. (could be also used to check if the server and/or the system is down)
		var data = JSON.parse(body)									//'json': true
		var specifiedURL = setSessionID(data.session)
		var data = {
			counter:0
		}
		getLinkStatus(specifiedURL, data, sendData);
		getPhoneStatus(specifiedURL, data, sendData);
		getScreenStatus(specifiedURL, data, sendData);
		getCameraStatus(specifiedURL, data, sendData);
		// console.log(data);		
		// console.log(specifiedURL, data);									//replaced console.log with new variable for URL with replaced Session-ID
	})
}	

// put configuration data in body



//all underneath is "definition" for the stuff up there in the function. Also possible to put in function.



function setSessionID (SessionID) {
//	console.log(SessionID);
	return API.request.replace("<session-id>",	SessionID)											// return value
}


function getLinkStatus (specifiedURL, data, sendData) {
	data.counter +=1;								// set counter +/- in function to check if there is a response
	request({
		method:"POST",
		url:specifiedURL,
		json:true,
		body:{
			call:"SysAdmin_getLinkState",
			params:{
				ifnum:"0"
			}
		}
	}, function(error, response, body){
//		console.log("linkStatus",body);
		data.linkStatus = body
		data.counter -=1
		if (data.counter == 0) {
			sendData(data);
		}
	})
}

function getPhoneStatus (specifiedURL, data, sendData) {
	data.counter +=1;
	request({
		method:"POST",
		url:specifiedURL,
		json:true,
		body:{
			call:"Audio_getPhoneConnectionStatus"
		}
	}, function(error, response, body){
//		console.log("phoneStatus",body);
		data.phoneStatus = body
		data.counter -=1
		if (data.counter == 0) {
			sendData(data);
		}
	})
}

function getScreenStatus (specifiedURL, data, sendData) {
	data.counter +=1;
	request({
		method:"POST",
		url:specifiedURL,
		json:true,
		body:{
			call:"CEC_tvStatus"
		}
	}, function(error, response, body){
//		console.log("screenStatus",body);
		data.screenStatus = body
		data.counter -=1
		if (data.counter == 0) {
			sendData(data);
		}
	})
}

function getCameraStatus (specifiedURL, data, sendData) {
	data.counter +=1;
	request({
		method:"POST",
		url:specifiedURL,
		json:true,
		body:{
			call:"getConnected(0)"
		}
	}, function(error, response, body){
//		console.log("cameraStatus", body);
		data.screenStatus = body
		data.counter -=1
		if (data.counter == 0) {
			sendData(data);
		}
	})
}
	
// Determine if the camera is currently connected.
// privilege level ADMIN
// Parameters
// Inputs
// dev unsigned
// int
// Camera device interface
// dvi0=0x00100000 DVI camera 0
// hdmi0=0x00020000 HDMI camera 0
// Outputs
// _rv integer Return status (0 = success)
// connected integer Returned connected state (0 == disconnected, 1
// == connected)

module.exports = {
	getData:function(setResponse){
		newSession(null, null, setResponse);				//null because no parameter available at this point.
	}
}
										