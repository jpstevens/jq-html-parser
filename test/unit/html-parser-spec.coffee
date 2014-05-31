# parsers return an object, containing the data they were asked to parse from the html
fs         = require 'fs'
path       = require 'path'
HTMLParser = require '../../src/html-parser'

describe 'HTMLParser', ->
  
  parser    = null
  html      = fs.readFileSync path.resolve(__dirname, '../fixtures/example.html'), 'utf8'
  config = require '../fixtures/config'

  expectedResults = 
    basic: 'BASIC'
    complex: 'COMPLEX'
    ignore: 'SHOW THIS'
    attribute: 'http://example.com/assets/ATTRIBUTE.jpg'
    regex: 'REGEX'
    attribute_regex: 'ATTRIBUTE'
    ignore_regex: 'IGNORE+REGEX'

  beforeEach -> parser = new HTMLParser config
  afterEach -> parser = null

  describe '#constructor', ->

    it 'sets the "selectors" property of the parser', ->
      expect(parser.selectors).toBe config

  describe "#setHTML", ->

    beforeEach -> parser.setHTML html
    afterEach -> parser = null

    it 'sets the html property of the parser', ->
      expect(parser.html).toBe html

    it 'sets the jQuery property to a jQuery object', ->
      expect(parser.jQuery).toBeTruthy()
      trimmedJQueryHTML = parser.jQuery('html').html().replace(/\s/g, '')
      trimmedHTML = html.replace('<html>','').replace('</html>','').replace(/\s/g, '')
      expect(trimmedJQueryHTML).toBe trimmedHTML

  describe '#getDataForSelector', ->

    describe "if html has been set", ->

      beforeEach -> parser.setHTML html
      afterEach -> parser = null

      it 'can parse a selector string', ->
        expect(parser.getDataForSelector config["basic"]).toBe expectedResults.basic

      it 'can parse a selector object', ->
        expect(parser.getDataForSelector config["complex"]).toBe expectedResults.complex

      it 'can parse a selector with an "ignore" flag', ->
        expect(parser.getDataForSelector config["ignore"]).toBe expectedResults.ignore

      it 'can parse a selector with an "attribute" flag', ->
        expect(parser.getDataForSelector config["attribute"]).toBe expectedResults.attribute

      it 'can parse a selector with a "regex" flag', ->
        expect(parser.getDataForSelector config["regex"]).toBe expectedResults.regex

      it 'can parse a selector with both "attribute" and "regex" flags', ->
        expect(parser.getDataForSelector config["attribute_regex"]).toBe expectedResults.attribute_regex

      it 'can parse a selector with both "ignore" and "regex" flags', ->
        expect(parser.getDataForSelector config["ignore_regex"]).toBe expectedResults.ignore_regex

    describe "if html is undefined", ->

      it 'throws an error when the method is called', ->
        expect(-> parser.getDataForSelector(config["basic"])).toThrow()

  describe '#parse', ->

    it 'sets the html value', ->
      parser.parse html
      expect(parser.html).toEqual html

    it 'parses a collection of selectors correctly', ->
      expect(parser.parse html).toEqual expectedResults

