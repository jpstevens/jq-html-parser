# jq-html-parser

[![Build Status](https://secure.travis-ci.org/jpstevens/jq-html-parser.png?branch=master)](https://travis-ci.org/jpstevens/jq-html-parser)
![Downloads/month](http://img.shields.io/npm/dm/jq-html-parser.svg)

A jQuery powered parser for extracting text (strings) from HTML documents

## Installation:

```
npm install jq-html-parser --save
```

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

  var parser, data;

  // parse body
  parser = new Parser(config);
  data   = parser.parse(body);

  console.log(data.title); // "Google"
  console.log(data.logo);  // "/images/srpr/logo11w.png"

});
```

## Options:

### selector (required)

The jQuery selector, used to locate the desired element.

For example, if our HTML body looked like this:

```html
<h1 class='title'>My Title</h1>
<p>Lorem ipsum dolar sit amet.</p>
```

And our parser config looked like this:

```javascript
var config;

config = {
  myElement: { selector: ".title" }
};

// or, using the short-hand version:

config = { myElement: ".title" };

```

The parser would match the first ```.title``` element from the DOM, and assign its value to the ```myElement``` attribute:

```
var parser = new Parser(config);
parser.parse(html); // returns { myElement: "My Title"}
```

### attribute (optional)

Returns the text value of the specified attribute, for the given selector.

For example, if our HTML looked like this:

```html
<h1 data-secret-title="Shh, don't tell...">Hello, world!</h1>
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

### regexp (optional)

Returns the text value of the specified regular expression, for a given selector.

For example, if our HTML looked like this:

```html
<span class="cost">Cost: 1500</span>
```

And our config looked like this:

```javascript
var config = {
  cost: { selector: ".cost", regexp: "Cost: (\d+)" }
};
```

Our response would equal ```{ cost: "1500" }```, as that is the first match of the ```regexp``` expression within the ```.cost``` element:

```javascript
var parser = new Parser(config);
parser.parse(html); // returns { cost: "1500" }
```

**NOTE:** ```regex```. can be used as an alias for ```regexp```.

### ignore (optional)

Returns the text value of an element for a given selector, ignoring child elements matching the ignore value's pattern.

For example, if our HTML looked like this:

```html
<p>This is a great article! <span class="spam">This is spam :(</span></p>
```

And our config looked like this:

```javascript
var config = {
  article: { selector: "p", ignore: ".spam" }
};
```

Our response would equal ```{ article: "This is a great article!" }```, as the ```.spam``` content is being ignored.

```javascript
var parser = new Parser(config);
parser.parse(html); // returns { article: "This is a great article!" }
```

### mulitple (optional, defaults to ```false```)

Returns an array of values when set to ```true```. Otherwise returns the value of the first matching element.

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

```javascript
var parser = new Parser(config);
parser.parse(html); // returns { myElement: ["Hello, world!", "Another Hello!"]}
```

However if our parser config looked like this, with multiple not set to ```true```:

```javascript
var config = {
  myElement: { selector: "h1" }
};
```

The parser would match only the first h1 elements from the DOM:

```javascript
var parser = new Parser(config);
parser.parse(html); // returns { myElement: "Hello, world!" }
```

## Combining Options:

All options can be combined, and when being parsed they will be processed in a particular order, depending on their specificity.

If you find your returned object doesn't match what you were expecting, it may be due to conflicting configuration options.

Configuration options will be evaluated in the following order:

![image](https://pbs.twimg.com/media/BsyoDgzCQAAN83C.png:large)

Mmm... diagrams. 

## Support:

If you need any help, please let me know via the "issues" tab on Github.

Contributions are also welcome, so please feel free to fork the code, play around, then put in a PR.
