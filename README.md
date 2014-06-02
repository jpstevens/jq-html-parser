jq-html-parser
---
A jQuery powered parser for extracting text (strings) from HTML documents

Example Usage:
```javascript

var Parser, request, config, url;

// npm dependencies
Parser  = require("jq-html-parser");
request = require("request");

// config, etc.
config  = {
  title: "title",
  logo: {
    selector: "#hplogo",
    attribute: "style",
    regex: "url\\(([\/A-z0-9]+.png)\\)"
  }
};
url = "http://google.co.uk";

// request a page
request.get(url, function(err, res, body){
  
  // handle error and non-200 response here
  if(err || (res.statusCode != 200)){
    return console.log("An error occured.");
  }

  var parser, selectors;

  // parse body
  parser    = new Parser(config);
  selectors = parser.parse(body);

  console.log(selectors.title); // "Google"
  console.log(selectors.logo);  // "/images/srpr/logo11w.png"

});

  
```