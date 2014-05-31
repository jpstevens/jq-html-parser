(function() {
  var HTMLParser, JQDom;

  JQDom = require("jqdom");

  HTMLParser = (function() {
    function HTMLParser(html) {
      this.html = html;
      this.jQuery = JQDom(this.html);
    }

    HTMLParser.prototype.parseAll = function(selectors) {
      var data, selector, selectorId;
      data = {};
      for (selectorId in selectors) {
        selector = selectors[selectorId];
        data[selectorId] = this.parse(selector);
      }
      return data;
    };

    HTMLParser.prototype.parse = function(config) {
      var $el, val;
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
