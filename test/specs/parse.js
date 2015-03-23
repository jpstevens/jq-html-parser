require("../helper");

describe("#parse", function () {

  before(function () {
    var htmlPath = path.resolve(__dirname, "../fixtures/example.html");
    this.html = fs.readFileSync(htmlPath);
  });

  describe("using options object", function () {
    describe("with selector string", function () {
      describe("by default", function () {
        it("returns the expected results", function () {
          var parser = new Parser({ item: ".basic" });
          expect(parser.parse(this.html)).to.deep.equal({ item: "BASIC" });
        });
      });

      describe("for an element that does not exist", function () {
        it("does not set the selector's key", function () {
          var parser = new Parser({ item: '.does-not-exist' });
          expect(parser.parse(this.html)).to.deep.equal({});
        });
      });
    });

    describe("without selector string", function () {
      it('throws an error', function () {
        var parser = new Parser({ item: {} });
        expect(function () {
          parser.parse(this.html)
        }.bind(this)).to.throw("#parse requires a valid selector");
      });
    });
  });

  describe("using selector string", function () {
    it("returns the same results as using the options object with selector defined", function () {
      var parserString = new Parser({ item: '.selector' });
      var parserObject = new Parser({ item: { selector: '.selector' } });
      expect()
    });
  });

  describe("without options object or selector string", function () {

  });

  describe("when a selection cannot be found", function () {
    it("returns an empty object", function () {
      var parser = new Parser({ thisDoesNotExist: ".this-does-not-exist" });
      expect(parser.parse(this.html)).to.deep.equal({});
    });
  });

});
