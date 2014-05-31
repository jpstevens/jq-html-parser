# parsers return an object, containing the data they were asked to parse from the html
fs         = require 'fs'
path       = require 'path'
HTMLParser = require '../../src/html-parser'

describe 'HTMLParser', ->
  
  parser    = null
  html      = fs.readFileSync path.resolve(__dirname, '../fixtures/index.html'), 'utf8'
  selectors = require "../fixtures/config"

  expectedResults = 
    basic: "BASIC"
    complex: "COMPLEX"
    ignore: "SHOW THIS"
    attribute: "http://example.com/assets/ATTRIBUTE.jpg"
    regex: "REGEX"
    attribute_regex: "ATTRIBUTE"
    ignore_regex: "IGNORE+REGEX"

  describe '#constructor', ->
      
    beforeEach -> parser = new HTMLParser html
    afterEach -> parser = null

    it 'sets the html property of the parser', ->
      expect(parser.html).toBe html

    it 'sets the jQuery property to a jQuery object', ->
      expect(parser.jQuery).toBeTruthy()
      trimmedJQueryHTML = parser.jQuery('html').html().replace(/\s/g, '')
      trimmedHTML = html.replace('<html>','').replace('</html>','').replace(/\s/g, '')
      expect(trimmedJQueryHTML).toBe trimmedHTML

  describe '#parse', ->

    beforeEach -> parser = new HTMLParser html
    afterEach -> parser = null

    it 'can parse a selector string', ->
      expect(parser.parse selectors.basic).toBe expectedResults.basic

    it 'can parse a selector object', ->
      expect(parser.parse selectors.complex).toBe expectedResults.complex

    it 'can parse a selector with an "ignore" flag', ->
      expect(parser.parse selectors.ignore).toBe expectedResults.ignore

    it 'can parse a selector with an "attribute" flag', ->
      expect(parser.parse selectors.attribute).toBe expectedResults.attribute

    it 'can parse a selector with a "regex" flag', ->
      expect(parser.parse selectors.regex).toBe expectedResults.regex

    it 'can parse a selector with both "attribute" and "regex" flags', ->
      expect(parser.parse selectors.attribute_regex).toBe expectedResults.attribute_regex

    it 'can parse a selector with both "ignore" and "regex" flags', ->
      expect(parser.parse selectors.ignore_regex).toBe expectedResults.ignore_regex

  describe '#parseAll', ->

    beforeEach -> parser = new HTMLParser html
    afterEach -> parser = null

    it 'can correctly parse a collection of selectors', ->
      expect(parser.parseAll selectors).toEqual expectedResults

