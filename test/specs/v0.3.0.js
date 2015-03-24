require('../helper');

describe('#parse', function () {
  before(function () {
    var htmlPath = path.resolve(__dirname, '../fixtures/example.html');
    this.html = fs.readFileSync(htmlPath, 'utf8');
  });
  describe('v0.3.0', function () {
    describe('with `selector` and `transform` defined', function () {
      describe('when a match is found', function () {
        it('returns the expected results', function () {
          this.parser = new Parser({
            myElement: {
              selector: '.selector',
              transform: function (value) {
                return value.toLowerCase();
              }
            }
          });
          expect(this.parser.parse(this.html)).to.deep.equal({
            myElement: 'selector'
          });
        });
      });
      describe('when a match is not found', function () {
        it('returns the expected results', function () {
          this.parser = new Parser({
            myElement: {
              selector: '.does-not-exist',
              transform: function (value) {
                return value.toLowerCase();
              }
            }
          });
          expect(this.parser.parse(this.html)).to.deep.equal({});
        });
      });
    });
    describe('with `selector` defined and `html: true`', function () {
      describe('when a match is found', function () {
        it('returns the expected results', function () {
          this.parser = new Parser({
            myElement: {
              selector: '.selector',
              html: true
            }
          });
          expect(this.parser.parse(this.html)).to.deep.equal({
            myElement: '<div class="selector">SELECTOR</div>'
          });
        });
      });
      describe('when a match is not found', function () {
        it('returns the expected results', function () {
          this.parser = new Parser({
            myElement: {
              selector: '.does-not-exist',
              html: true
            }
          });
          expect(this.parser.parse(this.html)).to.deep.equal({});
        });
      });
    });
    describe('with `selector`, `attribute`, `regexp` and `transform` defined', function () {
      it('returns the expected results', function () {
        this.parser = new Parser({
          myElement: {
            selector: '.attribute',
            attribute: 'src',
            regexp: 'http:\/\/example.com(.*)',
            transform: function (filePath) {
              return filePath.toLowerCase();
            }
          }
        });
        expect(this.parser.parse(this.html)).to.deep.equal({
          myElement: "/assets/attribute.jpg"
        });
      });
    });
    describe('with `selector`, `multiple`, `attribute`, `regexp` and `transform` defined', function () {
      it('returns the expected results', function () {
        this.parser = new Parser({
          myElement: {
            selector: '.multiple-item',
            multiple: true,
            attribute: 'data-attribute',
            regexp: 'MULTI ATTR #(.*)',
            transform: function (number) {
              return parseInt(number);
            }
          }
        });
        expect(this.parser.parse(this.html)).to.deep.equal({
          myElement: [1, 2]
        });
      });
    });
    describe('with `selector`, `remove`, `html`, and `transform` defined', function () {
      it('returns the expected results', function () {
        this.parser = new Parser({
          myElement: {
            selector: '.nested',
            remove: '.ignore-1, .ignore-2',
            html: true,
            transform: function (html) {
              return html.replace(/(\s)+/g, ' ').replace(/>(\s)+/, ">").replace(/(\s)+</, "<");
            }
          }
        });
        expect(this.parser.parse(this.html)).to.deep.equal({
          myElement: "<div class=\"nested\">But the following part should show: IGNORE+REGEX</div>"
        });
      });
    });
    describe('with `selector`, `multiple`, `remove`, `html`, and `transform` defined', function () {
      it('returns the expected results', function () {
        this.parser = new Parser({
          myElement: {
            selector: '.multiple-item',
            multiple: true,
            remove: 'b, i',
            html: true,
            transform: function (html) {
              return html.replace("MULTI ATTR #", "").replace(" class=\"multiple-item\"", "");
            }
          }
        });
        expect(this.parser.parse(this.html)).to.deep.equal({
          myElement: [
            '<li data-attribute="1">#1</li>',
            '<li data-attribute="2">#2</li>'
          ]
        });
      });
    });
  });
});
