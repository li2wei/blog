(function() {
  var Bit, Line, line, ns, svg;

  Line = mojs.Line;

  Bit = mojs.Bit;

  ns = 'http://www.w3.org/2000/svg';

  svg = typeof document.createElementNS === "function" ? document.createElementNS(ns, "svg") : void 0;

  line = new Line({
    ctx: svg
  });

  describe('Line', function() {
    it('should extend Bit', function() {
      return expect(line instanceof Bit).toBe(true);
    });
    it('should add itself to context', function() {
      line = new Line({
        ctx: svg
      });
      return expect(svg.firstChild).toBeDefined();
    });
    describe('methods ->', function() {
      return describe('draw method ->', function() {
        it('should add properties to el', function() {
          var attr1, attr2, delta;
          svg = typeof document.createElementNS === "function" ? document.createElementNS(ns, "svg") : void 0;
          line = new Line({
            ctx: svg,
            radius: 20
          });
          attr1 = parseInt(line.el.getAttribute('x1'), 10);
          attr2 = parseInt(line.el.getAttribute('x2'), 10);
          delta = attr2 - attr1;
          return expect(delta).toBe(40);
        });
        it('should work with radiusX', function() {
          var attr1, attr2, delta;
          svg = typeof document.createElementNS === "function" ? document.createElementNS(ns, "svg") : void 0;
          line = new Line({
            ctx: svg,
            radius: 20,
            radiusX: 40
          });
          attr1 = parseInt(line.el.getAttribute('x1'), 10);
          attr2 = parseInt(line.el.getAttribute('x2'), 10);
          delta = attr2 - attr1;
          return expect(delta).toBe(80);
        });
        return it('should call super method', function() {
          svg = typeof document.createElementNS === "function" ? document.createElementNS(ns, "svg") : void 0;
          line = new Line({
            ctx: svg
          });
          spyOn(Line.__super__, 'draw');
          line.draw();
          return expect(Line.__super__.draw).toHaveBeenCalled();
        });
      });
    });
    return describe('getLength method', function() {
      return it('should calculate total length of the path', function() {
        var bit;
        bit = new Line({
          ctx: document.createElementNS(ns, 'svg'),
          radius: 100
        });
        return expect(bit.getLength()).toBe(200);
      });
    });
  });

}).call(this);
