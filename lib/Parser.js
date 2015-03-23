(function () {

  'use strict';

  var jqdom = require('jqdom');

  function Parser (config) {
    this.config = config;
  }

  Parser.prototype.parse = function (html) {
    if (!html) throw new Error('#parse requires HTML is defined');
    this.$ = jqdom(html);
    return Object.keys(this.config).reduce(function (obj, key) {
      var value = this.getDataForSelector(this.config[key]);
      // do not return undefined objects
      if (value !== undefined) obj[key] = value;
      return obj;
    }.bind(this), {});
  };

  Parser.prototype.getDataForSelector = function (config) {
    // handle config being a selector string
    if (typeof config === "string") config = { selector: config };
    // we require a selector; no selector = no parsing :(
    if (config.selector === undefined || typeof config.selector !== 'string') {
      throw new Error('#parse requires a valid selector');
    }
    // init jquery object
    var $el = this.$(config.selector);
    // if requiring multiple results, handle that here...
    if (config.multiple) return $el.map(function (i, el) {
      return getDataForElement($(el), config).filter(function (value) {
        // remove undefined values from results
        return value !== undefined;
      });
    });
    return getDataForElement($el, config);
  };

  function getDataForElement ($el, config) {
    if (!$el.length) return undefined;
    var value;
    // FIXME legacy support for config.remove
    handleLegacy(config, 'ignore', 'remove');
    // find attribute value, if required
    if (config.attribute) {
      value = getAttributeValue($el, config.attribute);
    } else {
      // ignore child elements within
      if (config.remove) $el = applyRemoveOption($el, config.remove);
      // cast to text or html?
      value = config.html ? getHTML($el) : getText($el);
    }
    // FIXME legacy support for config.regex
    handleLegacy(config, 'regex', 'regexp');
    // find regexp, if required
    if (config.regexp) value = applyRegexpOption (value, config.regexp);
    // transform value, if required
    if (config.transform) value = applyTransformOption(value, config.transform);
    // return the value we've managed to parse :)
    return value;
  }

  function applyRemoveOption ($el, remove) {
    return $el.clone().find(remove).remove().end();
  }

  function applyRegexpOption (value, regexp) {
    var pattern = new RegExp(regexp);
    var matches = value.match(pattern);
    if (matches.length) return matches[1];
  }

  function applyTransformOption (value, transform) {
    if (typeof transform === 'function') return transform(value);
    return value;
  }

  function getAttributeValue ($el, attribute) {
    return $el.attr(attribute).trim();
  }

  function getText ($el) {
    return $el.text().trim();
  }

  function getHTML ($el) {
    return $el[0].outerHTML;
  }

  function handleLegacy(config, oldVal, newVal) {
    if (config[oldVal] !== undefined) {
      console.log('Warning:', oldVal, 'is deprecated, use', newVal, 'instead');
    }
    // new val will always be favoured
    config[newVal] = config[newVal] || config[oldVal];
  }

  module.exports = Parser;

})();
