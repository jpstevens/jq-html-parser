# jq-html-parser

[![Build Status](https://secure.travis-ci.org/jpstevens/jq-html-parser.png?branch=master)](https://travis-ci.org/jpstevens/jq-html-parser)

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
    regexp: "url\\(([\/A-z0-9]+.png)\\)"
  }
};
url = "http://google.co.uk";

// request a page
request.get(url, function(err, res, body){

  // handle error and non-200 response here
  if(err || (res.statusCode != 200)){
    return console.log("An error occured.");
  }

  var parser, result;

  // parse body
  parser = new Parser(config);
  result = parser.parse(body);

  console.log(result.title); // "Google"
  console.log(result.logo);  // "/images/srpr/logo11w.png"

});
```

## Options:

### selector (required)

The jQuery selector, used to locate the desired element.

For example, if `html` equals:

```html
<!-- head, etc. -->
<h1>Hello, world!</h1>
<!-- more html... -->
<h1>Another Hello!</h1>
<!-- even more html... -->
```

And our JavaScript is:

```javascript
var parser = new Parser(html);
var result = parser.parse({
  myElement: { selector: "h1" }
});
```

The parser would match the first h1 element from the DOM, and assign its value to the `myElement` attribute:

```js
// value of 'result':
{ myElement: "Hello, world!"}
```

The parser would match all h1 elements from the DOM, and assign the array to the `myElement` attribute:

**NOTE:** To return *all* h1's from the DOM, see the `multiple` option below.

### multiple (optional, defaults to `false`)

Returns an array of values when set to `true`. By default, or when set to `false`, will return a string containing the first value found for the specified jQuery selector.

For example, if `html` equals:

```html
<!-- head, etc. -->
<h1>Hello, world!</h1>
<!-- more html... -->
<h1>Another Hello!</h1>
<!-- even more html... -->
```

And our JavaScript is:

```javascript
var parser = new Parser(html);
var result = parser.parse({
  myElement: { selector: "h1", multiple: true }
});
```

The parser would match all h1 elements from the DOM, and assign the array to the `myElement` attribute:

```js
// value of 'result':
{
  myElement: ["Hello, world!", "Another Hello!"]
}
```

```javascript
var parser = new Parser(config);
parser.parse(html); // returns { myElement: ["Hello, world!", "Another Hello!"]}
```

### attribute (optional)

Returns the text value of the specified attribute, for the given selector.

For example, if `html` equals:

```html
<!-- head, etc. -->
<h1 data-secret-title="Shh, don't tell...">Hello, world!</h1>
<!-- more html... -->
```

And our JavaScript is:

```javascript
var parser = new Parser(html);
var result = parser.parse({
  myElement: { selector: "h1", attribute: "data-secret-title" }
});
```
Then our result would contains "Shh, don't tell...", as that is the
`data-secret-title` attribute of the `h1` tag:

```js
// value of 'result':
{
  myElement: "Shh, don't tell..."
}

```

**NOTE** Setting the `attribute` option will ignore `remove` and `html` options, as those options relate to the inner contents of an element, and not the attribute.

### remove (optional)

Specifies any descendant elements to remove before parsing the value of the selected elements.

For example, if `html` equals:

```html
<!-- head, etc. -->
<article>
  <p>Keep me. </p>
  <p class="advert">Annoying advert</p>
  <p>Keep me too.</p>
</article>
<!-- more html... -->
```

And our JavaScript is:

```javascript
var parser = new Parser(html);
var result = parser.parse({
  myElement: { selector: "article", remove: ".advert" }
});
```

Then our result will contain everything inside of `article`, except the content from `.advert`:

```js
// value of 'result':
{
  myElement: "Keep me. Keep me too."
}
```

### html (optional, defaults to `false`)

When set to `true`, sets return the selected element as HTML. By default, or when set to true, returns the contents of the selected element as text.

For example, if `html` equals:

```html
<!-- head, etc. -->
<article>
  <p>I am the text</p>
</article>
<!-- more html... -->
```

And our JavaScript is:

```javascript
var parser = new Parser(html);
var result = parser.parse({
  myElement: { selector: "article", html: true }
});
```

Then our result will be a string of HTML, instead of the text value:

```js
// value of 'result':
{
  myElement: "<article><p>I am the text</p></article>" // this would simply be "I am the text" if html=false
}
```

### regexp (optional)

Use regular expressions to extract data from the parsed value(s) from your selected elements. `regexp` is the second-to-last option applied to the text, before `transform`.

For example, if `html` equals:

```html
<!-- head, etc. -->
<h1>The title is 'jQuery Rocks'</h1>
<!-- more html... -->
```

And our JavaScript is:

```javascript
var parser = new Parser(html);
var result = parser.parse({
  myElement: { selector: "h1", regexp: "The title is '(.*)'" }
});
```

Then our result will be "jQuery Rocks".

```js
// value of 'result':
{
  myElement: "jQuery Rocks"
}
```

**NOTE** Only the first match will be returned. For more advanced transformations, like combining multiple regular expression matches together, use the `transform` option.

### transform

Used to transform parsed values of selected element(s).

For example, if `html` equals:

```html
<!-- head, etc. -->
<div class="points">Total points: 21</div>
<!-- more html... -->
```

And our JavaScript is:

```javascript
var parser = new Parser(html);
var result = parser.parse({
  pointsScored: {
    selector: "h1",
    regexp: "Total points: (.*)",
    transform: function (val) {
      return val ? parseInt(val) : 0;
    }
  }
});
```

Then our result will be the numerical value for "points scored":

```js
// value of 'result':
{
  pointsScored: 21
}
```

## Combining Options:

All options can be combined, and when being parsed they will be processed in a particular order, depending on their specificity.

If you find your returned object doesn't match what you were expecting, it may be due to conflicting configuration options.

Configuration options will be evaluated in the following order:

1. `selector`
2. `multiple`
3. `attribute`
4. `remove` (skipped if `attribute` is defined)
5. `html` (skipped if `attribute` is defined)
6. `regexp`
7. `transform`

## Support

If you need any help, please let me know via the "issues" tab on Github.

Contributions are also welcome, so please feel free to fork the code, play around, then put in a PR.
