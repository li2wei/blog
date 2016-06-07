# ignore coffescript sudo code
### istanbul ignore next ###

Bit = require './bit'

class Zigzag extends Bit
  type: 'path'
  ratio: 1.43
  draw:->
    return if !@props.points
    radiusX = if @props.radiusX? then @props.radiusX else @props.radius
    radiusY = if @props.radiusY? then @props.radiusY else @props.radius
    points = ''; stepX = 2*radiusX/@props.points
    stepY  = 2*radiusY/@props.points; strokeWidth = @props['stroke-width']
    xStart = @props.x - radiusX; yStart = @props.y - radiusY
    for i in [@props.points...0]
      iX = xStart + i*stepX + strokeWidth; iY = yStart + i*stepY + strokeWidth
      iX2 = xStart + (i-1)*stepX + strokeWidth
      iY2 = yStart + (i-1)*stepY + strokeWidth
      char = if i is @props.points then 'M' else 'L'
      points += "#{char}#{iX},#{iY} l0, -#{stepY} l-#{stepX}, 0"
    @setAttr d: points
    super
  # getLength:-> @el.getTotalLength()

module.exports = Zigzag
