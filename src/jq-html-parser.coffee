JQDom = require "jqdom"

class HTMLParser

  constructor: (@selectors) ->
    # ...

  setHTML: (html) ->
    @jQuery = JQDom html

  parse: (html) ->
    # set the HTML that needs to be parsed
    @setHTML(html)
    # parse the HTML data, for the specified selectors
    data = {}
    for selectorId, selector of @selectors
      val = @getDataForSelector selector
      data[selectorId] = val unless (val is "") or (val is undefined) or (val is null)
    data

  getDataForSelector: (config) ->
    # handle the case where parseSelector is called with a selector string
    if typeof config is "string" then config = { selector: config }
    # rename regex (for legacy purposes)
    if config.regex and not config.regexp
      config.regexp = config.regex
      delete config.regex
    # throw error if selector is undefined
    throw new Error "Selector must be defined." unless config.selector
    # get the element
    $el = @jQuery(config.selector)
    # multiple
    if config.multiple
      val = []
      parser = @
      $el.each ->
        val.push parser.getValueForElement parser.jQuery(@), config
      val
    else
      @getValueForElement $el.first(), config

  getValueForElement: ($el, config) ->
    # ignore child elements within the current $el, if specified
    $el = @getElForIgnore($el, config.ignore) if config.ignore
    # get attribute, if there is one
    if config.attribute then val = @getAttribute $el, config.attribute
    else val = @getText $el
    # extract regex, if applicable
    val = @getRegex val, config.regexp if config.regexp
    val

  getElForIgnore: ($el, ignore) ->
    $el.clone().find(ignore).remove().end()
  
  getAttribute: ($el, attribute) ->
    val = $el.attr(attribute)
    val.trim() if val is typeof "string"
    val
  
  getText: ($el) ->
    $el.text().trim()

  getRegex: (val, regex) ->
    r = new RegExp regex
    match = val.match(r)
    return null unless match instanceof Array
    return match[0] if match.length is 1
    match[1] if match.length > 1

module.exports = HTMLParser
