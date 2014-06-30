jq-html-parser
[![Build Status](https://secure.travis-ci.org/jpstevens/jq-html-parser.png?branch=master)](https://travis-ci.org/jpstevens/jq-html-parser)
---
A jQuery powered parser for extracting text (strings) from HTML documents

## Example Usage:
```javascript

var Parser, request, config, url;

// npm dependencies
Parser  = require("jq-html-parser");
request = require("request");

// config, etc.
config = {
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

## Options:

### selector (required)

The jQuery selector, used to locate the desired element.

For example, if our HTML body looked like this:

```html
<!-- head, etc. -->
<h1>Hello, world!</h1>
<!-- more html... -->
<h1>Another Hello!</h1>
<!-- even more html... -->
```

And our parser config looked like this:

```javascript
var config = {
  myElement: { selector: "h1" }
};
```

The parser would match the first h1 element from the DOM, and assign its value to the 'myElement' attribute:

```
var parser = new Parser(config);
parser.parse(html); // returns { myElement: "Hello, world!"}
```

**NOTE:** To return *all* h1's from the DOM, see the 'multiple' option below.

### attribute (optional)

Returns the text value of the specified attribute, for the given selector.

For example, if our HTML looked like this:

```html
<!-- head, etc. -->
<h1 data-secret-title="Shh, don't tell...">Hello, world!</h1>
<!-- more html... -->
```

And our config looked like this:

```javascript
var config = {
  myElement: { selector: "h1", attribute: "data-secret-title" }
};
```

Our response would contain "Shh, don't tell...", as that is the ```data-secret-title``` attribute or the ```h1``` tag.

```javascript
var parser = new Parser(config);
parser.parse(html); // returns { myElement: "Shh, don't tell..." }
```

- **mulitple** (optional, defaults to ```false```)

Returns an array of values when set to ```true```.

So if our HTML body looked like this:

```html
<!-- head, etc. -->
<h1>Hello, world!</h1>
<!-- more html... -->
<h1>Another Hello!</h1>
<!-- even more html... -->
```

And our parser config looked like this:

```javascript
var config = {
  myElement: { selector: "h1", multiple: true }
};
```

The parser would match all h1 elements from the DOM, and assign the array to the 'myElement' attribute:

```
var parser = new Parser(config);
parser.parse(html); // returns { myElement: ["Hello, world!", "Another Hello!"]}
```
