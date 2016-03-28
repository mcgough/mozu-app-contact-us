/**
 * Implementation for http.storefront.routes


 * HTTP Actions all receive a similar context object that includes
 * `request` and `response` objects. These objects are similar to
 * http.IncomingMessage objects in NodeJS.

{
  configuration: {},
  request: http.ClientRequest,
  response: http.ClientResponse
}

 * Call `response.end()` to end the response early.
 * Call `response.set(headerName)` to set an HTTP header for the response.
 * `request.headers` is an object containing the HTTP headers for the request.
 *
 * The `request` and `response` objects are both Streams and you can read
 * data out of them the way that you would in Node.

 */
var needle = require('needle');
var xssFilters = require('xss-filters');

function xFilter(input) {
  return xssFilters.inHTMLData(input);
}

module.exports = function(context, callback) {


  if(context.request.method === "POST") {

    var body = context.request.body;

    var message = {
      "text": xFilter(body.message),
      "subject": xFilter(body.subject),
      "from_email": 'contact_us@redington.com',
      "from_name": xFilter(body.firstName) + " " + xFilter(body.lastName),
      "to":[{
        // "email": xFilter(body.department)
        "email": "mcgough.dan@gmail.com",
        "type": "to"
      }],
      "headers": {
        "Reply-To": xFilter(body.email)
      }
    };

    var mandrillParams = {
      "key": "",
      "message": message
    };

    var url = "https://mandrillapp.com/api/1.0/messages/send.json";

    try {
      needle.post(url, mandrillParams, function(error,response) {
        if(!error && response.statusCode == 200) {
          console.log('success:', params);
          context.response.end();
        }else{
          console.log('fail', response.statusCode);
          context.response.end();
        }
      });
    }catch(err) {
      console.log(err);
      context.response.end();
    }

  }else {
    context.response.end();
  }
};
