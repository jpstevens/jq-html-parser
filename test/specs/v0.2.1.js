require('../helper');

describe('Parser', function() {
  before(function() {
    this.html = fs.readFileSync(path.resolve(__dirname, '../fixtures/example.html'), 'utf8');
  });
  describe('#parse', function() {
    describe("parsing a selector string", function() {
      before(function() {
        this.parser = new Parser({
          item: ".selector"
        });
      });
      it("returns the correct object", function() {
        expect(this.parser.parse(this.html)).to.deep.equal({
          item: "SELECTOR"
        });
      });
      describe("that doesn't exist", function() {
        before(function() {
          this.parser = new Parser({
            item: ".does-not-exist"
          });
        });
        it("does not set the value for the selector's key", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({});
        });
      });
    });
    describe("parsing a selector object", function() {
      describe("with 'selector' defined", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: ".selector"
            }
          });
        });
        it("returns the correct object", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: "SELECTOR"
          });
        });
        describe("that doesn't exist", function() {
          before(function() {
            this.parser = new Parser({
              item: {
                selector: ".does-not-exist"
              }
            });
          });
          it("does not set the value for the selector's key", function() {
            expect(this.parser.parse(this.html)).to.deep.equal({});
          });
        });
      });
      describe("with 'selector' not defined", function() {
        before(function() {
          this.parser = new Parser({
            item: {}
          });
        });
        it("throws an error", function() {
          expect(function() {
            this.parser.parse(this.html);
          }.bind(this)).to.throw("#parse requires a valid selector");
        });
      });
      describe("with 'selector' and 'ignore' defined", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: ".ignore-container",
              ignore: ".ignore"
            }
          });
        });
        it("returns the correct object", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: "SHOW THIS"
          });
        });
        describe("that does not match the given selector", function() {
          before(function() {
            this.parser = new Parser({
              item: {
                selector: ".does-not-exist",
                ignore: ".ignore"
              }
            });
          });
          it("does not set the value for the selector's key", function() {
            expect(this.parser.parse(this.html)).to.deep.equal({});
          });
        });
        describe("with nothing to ignore", function() {
          before(function() {
            this.parser = new Parser({
              item: {
                selector: ".ignore-container",
                ignore: ".does-not-exist"
              }
            });
          });
          it("sets the value of for the selector's key", function() {
            expect(this.parser.parse(this.html)).to.deep.equal({
              item: "DON'T SHOW THIS"
            });
          });
        });
      });
      describe("with 'selector' and 'attribute' defined", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: ".attribute",
              attribute: "src"
            }
          });
        });
        it("returns the correct object", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: "http://example.com/assets/ATTRIBUTE.jpg"
          });
        });
        describe("that does not match the given selector", function() {
          before(function() {
            this.parser = new Parser({
              item: {
                selector: ".does-not-exist",
                attribute: "src"
              }
            });
          });
          it("does not set the value for the selector's key", function() {
            expect(this.parser.parse(this.html)).to.deep.equal({});
          });
        });
        describe("with nothing to ignore", function() {
          before(function() {
            this.parser = new Parser({
              item: {
                selector: ".attribute",
                attribute: "does-not-exist"
              }
            });
          });
          it("sets the value of for the selector's key", function() {
            expect(this.parser.parse(this.html)).to.deep.equal({});
          });
        });
      });
      describe("with 'selector' and 'regex' defined", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: ".regex",
              regex: "This is the content: (.*)"
            }
          });
        });
        it("returns the correct object", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: "REGEX"
          });
        });
        describe("that does not match the given selector", function() {
          before(function() {
            this.parser = new Parser({
              item: {
                selector: ".does-not-exist",
                regex: "This is the content: (.*)"
              }
            });
          });
          it("does not set the value for the selector's key", function() {
            expect(this.parser.parse(this.html)).to.deep.equal({});
          });
        });
        describe("with nothing to match", function() {
          before(function() {
            this.parser = new Parser({
              item: {
                selector: ".regex",
                regex: "This matches nothing"
              }
            });
          });
          it("does not set the value for the selector's key", function() {
            expect(this.parser.parse(this.html)).to.deep.equal({});
          });
        });
      });
      describe("with 'selector', 'ignore' and 'attribute' defined", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: ".attribute",
              ignore: ".ignore",
              attribute: "src"
            }
          });
        });
        it("ignores the 'ignore' flag", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: "http://example.com/assets/ATTRIBUTE.jpg"
          });
        });
      });
      describe("with 'selector', 'ignore' and 'regex' defined", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: ".nested",
              ignore: ".ignore-1, .ignore-2",
              regex: "But the following part should show: ([A-Z +]+)"
            }
          });
        });
        it("returns the correct object", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: "IGNORE+REGEX"
          });
        });
      });
      describe("with 'selector', 'attribute' and 'regex' defined", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: "body > img.attribute",
              attribute: "src",
              regex: "assets/(.*).jpg"
            }
          });
        });
        it("returns the correct object", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: "ATTRIBUTE"
          });
        });
      });
    });
    describe("parsing selectors which match more than one element", function() {
      before(function() {
        this.parser = new Parser({
          item: ".multiple-item"
        });
      });
      it("sets the selector value to the first matching element", function() {
        expect(this.parser.parse(this.html)).to.deep.equal({
          item: "MULTIPLE #1"
        });
      });
      describe("when the multiple flag is set to true", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: ".multiple-item",
              multiple: true
            }
          });
        });
        it("sets the selector value to an array of matching elements", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: ["MULTIPLE #1", "MULTIPLE #2"]
          });
        });
      });
      describe("when the multiple flag is set to false", function() {
        before(function() {
          this.parser = new Parser({
            item: {
              selector: ".multiple-item",
              multiple: false
            }
          });
        });
        it("sets the selector value to the first matching element", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({
            item: "MULTIPLE #1"
          });
        });
      });
      describe("when none exist", function() {
        before(function() {
          this.parser = new Parser({
            item: ".multiple-item-that-do-not-exist"
          });
        });
        it("returns nothing", function() {
          expect(this.parser.parse(this.html)).to.deep.equal({});
        });
      });
    });
    describe("when one or more selectors are not found", function() {
      before(function() {
        this.parser = new Parser({
          item: ".does-not-exist",
          exists: ".selector"
        });
      });
      it("only sets the keys for the found selectors", function() {
        expect(this.parser.parse(this.html)).to.deep.equal({
          exists: "SELECTOR"
        });
      });
    });
    describe("using 'regexp' instead of 'regex'", function() {
      before(function() {
        this.regexParser = new Parser({
          item: {
            selector: ".regex",
            regex: "This is the content: (.*)"
          }
        });
        this.regexpParser = new Parser({
          item: {
            selector: ".regex",
            regexp: "This is the content: (.*)"
          }
        });
      });
      it("works the same as 'regex'", function() {
        expect(this.regexParser.parse(this.html)).to.deep.equal({
          item: "REGEX"
        });
        expect(this.regexpParser.parse(this.html)).to.deep.equal({
          item: "REGEX"
        });
      });
    });
  });
});
