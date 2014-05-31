(function() {
  var HTMLParser, JQDom;

  JQDom = require("jqdom");

  HTMLParser = (function() {
    function HTMLParser(selectors) {
      this.selectors = selectors;
    }

    HTMLParser.prototype.setHTML = function(html) {
      this.html = html;
      return this.jQuery = JQDom(this.html);
    };

    HTMLParser.prototype.parse = function(html) {
      var data, selector, selectorId, _ref;
      this.setHTML(html);
      data = {};
      _ref = this.selectors;
      for (selectorId in _ref) {
        selector = _ref[selectorId];
        data[selectorId] = this.getDataForSelector(selector);
      }
      return data;
    };

    HTMLParser.prototype.getDataForSelector = function(config) {
      var $el, val;
      if (!(this.html && this.jQuery)) {
        throw new Error("HTML is not defined");
      }
      if (typeof config === "string") {
        config = {
          selector: config
        };
      }
      $el = this.jQuery(config.selector);
      if (config.ignore) {
        $el = this.getElForIgnore($el, config.ignore);
      }
      if (config.attribute) {
        val = this.getAttribute($el, config.attribute);
      } else {
        val = this.getText($el);
      }
      if (config.regex) {
        val = this.getRegex(val, config.regex);
      }
      return val;
    };

    HTMLParser.prototype.getElForIgnore = function($el, ignore) {
      return $el.clone().find(ignore).remove().end();
    };

    HTMLParser.prototype.getAttribute = function($el, attribute) {
      return $el.attr(attribute).trim();
    };

    HTMLParser.prototype.getText = function($el) {
      return $el.text().trim();
    };

    HTMLParser.prototype.getRegex = function(val, regex) {
      var r;
      r = new RegExp(regex);
      return val.match(r)[1];
    };

    return HTMLParser;

  })();

  module.exports = HTMLParser;

}).call(this);
