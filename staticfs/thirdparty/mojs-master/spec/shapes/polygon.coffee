Polygon  = mojs.Polygon
Bit     = mojs.Bit
ns      = 'http://www.w3.org/2000/svg'
svg     = document.createElementNS?(ns, "svg")

describe 'Polygon ->', ->
  it 'should extend Bit', ->
    polygon  = new Polygon ctx: svg
    expect(polygon instanceof Bit).toBe(true)

  it 'should have points prop', ->
    tri = new Polygon ctx: svg
    expect(tri.props.points).toBe 3
  it 'should have recieve points prop', ->
    tri = new Polygon ctx: svg, points: 8
    expect(tri.props.points).toBe 8
  
  it 'should call drawShape method', ->
    tri = new Polygon ctx: svg, points: 8
    spyOn tri, 'drawShape'
    tri.isDraw = false
    tri.draw()
    expect(tri.drawShape).toHaveBeenCalled()
  # it 'should call drawShape only once', ->
  #   tri = new Polygon ctx: svg, points: 8
  #   spyOn tri, 'drawShape'
  #   tri.draw()
  #   expect(tri.drawShape).not.toHaveBeenCalled()

  it 'should calculate radialPoints', ->
    tri = new Polygon ctx: svg
    expect(tri.radialPoints).toBeDefined()
    expect(tri.radialPoints.length).toBe tri.props.points
  it 'should calculate radialPoints', ->
    tri = new Polygon ctx: svg
    expect(tri.radialPoints).toBeDefined()
    expect(tri.radialPoints.length).toBe tri.props.points

  describe 'draw ->', ->
    it 'should add properties to el', ->
      svg = document.createElementNS?(ns, "svg")
      tri = new Polygon
        ctx:      svg
        radius:   20
      d   = tri.el.getAttribute('d')
      d2  = 'M0.0000,-20.0000 L17.3205,10.0000 L-17.3205,10.0000 z'
      isD = d is d2
      isIE9D = d is 'M 0 -20 L 17.3205 10 L -17.3205 10 Z'
      expect(isD or isIE9D).toBe true
    it 'should work with radiusX and fallback to radius', ->
      svg = document.createElementNS?(ns, "svg")
      tri = new Polygon
        ctx:      svg
        radius:   20
        radiusX:  40
      d   = tri.el.getAttribute('d')
      d2  = 'M0.0000,-20.0000 L34.6410,10.0000 L-34.6410,10.0000 z'
      isD = d is d2
      isIE9D = d is 'M 0 -20 L 34.641 10 L -34.641 10 Z'
      expect(isD or isIE9D).toBe true

    it 'should work with radiusY and fallback to radius', ->
      svg = document.createElementNS?(ns, "svg")
      tri = new Polygon
        ctx:      svg
        radius:   20
        radiusY:  40
      d   = tri.el.getAttribute('d')
      d2  = 'M0.0000,-40.0000 L17.3205,20.0000 L-17.3205,20.0000 z'
      isD = d is d2
      isIE9D = d is 'M 0 -40 L 17.3205 20 L -17.3205 20 Z'
      expect(isD or isIE9D).toBe true
    it 'should call super method', ->
      svg     = document.createElementNS?(ns, "svg")
      polygon  = new Polygon ctx: svg
      spyOn(Polygon.__super__, 'draw')
      polygon.draw()
      expect(Polygon.__super__.draw).toHaveBeenCalled()

  describe 'getLength method', ->
    it 'should calculate total length of the path', ->
      radius = 100
      bit = new Polygon
        ctx:    document.createElementNS ns, 'svg'
        radius: radius
      expect(bit.getLength().toFixed(1)).toBe '519.6'

    it 'should calculate total length of the with different radiusX/Y', ->
      radiusX = 100
      radiusY = 50
      bit = new Polygon
        ctx:    document.createElementNS ns, 'svg'
        radiusX: radiusX
        radiusY: radiusY
      expect(bit.getLength().toFixed(2)).toBe '402.33'






