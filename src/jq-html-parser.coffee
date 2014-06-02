JQDom = require "jqdom"

class HTMLParser

  constructor: (@selectors) ->
    # ...

  setHTML: (@html) ->
    @jQuery = JQDom @html

  parse: (html) ->
    # set the HTML that needs to be parsed
    @setHTML(html)
    # parse the HTML data, for the specified selectors
    data = {}
    for selectorId, selector of @selectors
      data[selectorId] = @getDataForSelector selector
    data

  getDataForSelector: (config) ->
    # html and jQuery must have been set before getting data
    throw new Error ("HTML is not defined") unless ( @html and @jQuery )
    # handle the case where parseSelector is called with a selector string
    if typeof config is "string" then config = { selector: config }
    # get the element
    $el = @jQuery(config.selector)
    # ignore child elements within the current $el, if specified
    $el = @getElForIgnore($el, config.ignore) if config.ignore
    # get attribute, if there is one
    if config.attribute then val = @getAttribute $el, config.attribute
    else val = @getText $el
    # extract regex, if applicable
    val = @getRegex val, config.regex if config.regex
    val

  getElForIgnore: ($el, ignore) ->
    $el.clone().find(ignore).remove().end()
  
  getAttribute: ($el, attribute) ->
    $el.attr(attribute).trim()
  
  getText: ($el) ->
    $el.text().trim()

  getRegex: (val, regex) ->
    r = new RegExp regex
    val.match(r)[1]

module.exports = HTMLParser