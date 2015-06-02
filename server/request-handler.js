/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var qs = require('querystring');
var url = require('url');
var storage = [];
var fs = require('fs');
var path = require("path");

var requestHandler = function(request, response) {

// ==========  ORIGINAL CODE =======
  console.log("Serving request type " + request.method + " for url " + request.url);
  // The outgoing status.
  var statusCode = 200;
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  if (request.method === "GET") {

    if (request.url === "/") {
      fs.readFile('../client/client/index.html',function (err, data) {
        response.writeHead(statusCode, {'Content-Type': 'text/html','Content-Length':data.length});
        console.log("data is -- ,", data );
        response.write(data);
        response.end();
      });
    }

    else if (request.url === "/styles/styles.css") {
     fs.readFile('../client/client/styles/styles.css', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/css','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/bower_components/jquery/jquery.min.js") {
     fs.readFile('../client/client/bower_components/jquery/jquery.min.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/bower_components/underscore/underscore-min.js") {
     fs.readFile('../client/client/bower_components/underscore/underscore-min.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/bower_components/underscore.string/dist/underscore.string.min.js") {
     fs.readFile('../client/client/bower_components/underscore.string/dist/underscore.string.min.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/bower_components/backbone/backbone-min.js") {
     fs.readFile('../client/client/bower_components/backbone/backbone-min.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/env/config.js") {
     fs.readFile('../client/client/env/config.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/scripts/app.js") {
     fs.readFile('../client/client/scripts/app.js', function(err, data){
       response.writeHead(statusCode, {'Content-Type': 'text/javascript','Content-Length':data.length});
       response.write(data);
       response.end();
     });
    }

    else if (request.url === "/classes/room1" || request.url === "/log" || request.url === '/classes/messages'  ) {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: storage}));
    } else {
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }

    // console.log("url is: , ",request.url )



  } else if (request.method === "POST") {
    console.log(request.url);
    statusCode = 201;
    var requestBody = "";

    request.on("data", function(data){
      requestBody += data;
      console.log("receive data, JSON parse data is: ",data);
      console.log(" request body is: ", requestBody);
      console.log("storage is: ", storage)
    });

    request.on('end', function(){
      // storage.push(requestBody);
      var formData = JSON.parse(requestBody);
      storage.push(formData);
      console.log("end of Post, storage is: " + storage);
      response.end();
    });

  }


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = "text/plain";
  headers['Content-Type'] = "application/json";

  console.log('statuscode is ', statusCode)
  // .writeHead() writes to the request line and headers of the response,
  //
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //
  // response.end(JSON.stringify({results: storage}));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


exports.requestHandler = requestHandler
