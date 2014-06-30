# parsers return an object, containing the data they were asked to parse from the html
fs         = require 'fs'
path       = require 'path'
HTMLParser = require '../../src/jq-html-parser'

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
    multiple_default: 'MULTIPLE #1'
    multiple_false: 'MULTIPLE #1'
    multiple_false_complex: 'MULTI ATTR #1'
    multiple_true: ['MULTIPLE #1', 'MULTIPLE #2']
    multiple_true_complex: ['MULTI ATTR #1', 'MULTI ATTR #2']

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

    describe "if HTML has been set", ->

      beforeEach -> parser.setHTML html
      afterEach -> parser = null

      it 'parses a selector string', ->
        expect(parser.getDataForSelector config["basic"]).toBe expectedResults.basic

      it 'parses a selector object', ->
        expect(parser.getDataForSelector config["complex"]).toBe expectedResults.complex

      it 'parses a selector with an "ignore" flag', ->
        expect(parser.getDataForSelector config["ignore"]).toBe expectedResults.ignore

      it 'parses a selector with an "attribute" flag', ->
        expect(parser.getDataForSelector config["attribute"]).toBe expectedResults.attribute

      it 'parses a selector with a "regex" flag', ->
        expect(parser.getDataForSelector config["regex"]).toBe expectedResults.regex

      it 'parses a selector with both "attribute" and "regex" flags', ->
        expect(parser.getDataForSelector config["attribute_regex"]).toBe expectedResults.attribute_regex

      it 'parses a selector with both "ignore" and "regex" flags', ->
        expect(parser.getDataForSelector config["ignore_regex"]).toBe expectedResults.ignore_regex

      describe "when multiple elements match the selector", ->

        it 'returns the composite value by default', ->
          expect(parser.getDataForSelector config["multiple_default"]).toBe expectedResults.multiple_default

        describe "if 'multiple' is set to false", ->
        
          it 'returns the first value', ->
            expect(parser.getDataForSelector config["multiple_false"]).toBe expectedResults.multiple_false

          describe "with a complex selector", ->

            it 'returns the correct array of values', ->        
              expect(parser.getDataForSelector config["multiple_false_complex"]).toEqual expectedResults.multiple_false_complex

        describe "if 'multiple' is set to true", ->

          it 'returns the correct array of values', ->
            expect(parser.getDataForSelector config["multiple_true"]).toEqual expectedResults.multiple_true

          describe "with a complex selector", ->

            it 'returns the correct array of values', ->        
              expect(parser.getDataForSelector config["multiple_true_complex"]).toEqual expectedResults.multiple_true_complex

    describe "if HTML is undefined", ->

      it 'throws an error when the method is called', ->
        expect(-> parser.getDataForSelector(config["basic"])).toThrow()

  describe '#parse', ->

    it 'sets the html value', ->
      parser.parse html
      expect(parser.html).toEqual html

    it 'parses a collection of selectors correctly', ->
      expect(parser.parse html).toEqual expectedResults
