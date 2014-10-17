var http = require("http")
var API_request = require("./API_request.js")
var LifeSize_auth = require("./LifeSize_auth.json");

//console.log(LifeSize_auth);

var units = LifeSize_auth.LifeSize_Units;

//console.log(LifeSize_auth.LifeSize_Units);

var dataserver = http.createServer(function(request, response){
	console.log(request.url);

	// API_request.getData(function(data){
	// 	data = JSON.stringify(data)
	// 	response.end(data);
//	})
})
dataserver.listen("10007");
//console.log("http://localhost:10007")