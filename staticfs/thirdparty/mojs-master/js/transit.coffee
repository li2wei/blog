### istanbul ignore next ###

h         = require './h'
bitsMap   = require './shapes/bitsMap'
Tween     = require './tween/tween'
Timeline  = require './tween/timeline'

class Transit extends bitsMap.map.bit
  progress: 0
  defaults:
    # presentation props
    strokeWidth:        2
    strokeOpacity:      1
    strokeDasharray:    0
    strokeDashoffset:   0
    stroke:             'transparent'
    fill:               'deeppink'
    fillOpacity:        'transparent'
    strokeLinecap:      ''
    points:             3
    # position props/el props
    x:                  0
    y:                  0
    shiftX:             0
    shiftY:             0
    opacity:            1
    # size props
    radius:             0: 50
    radiusX:            undefined
    radiusY:            undefined
    angle:              0
    size:               null
    sizeGap:            0
    # callbacks
    onStart:            null
    onComplete:         null
    # onCompleteChain:    null
    onUpdate:           null
    # tween props
    duration:           500
    delay:              0
    repeat:             0
    yoyo:               false
    easing:             'Linear.None'
  vars:->
    @h ?= h; @lastSet ?= {}; @index = @o.index or 0
    @runCount ?= 0
    @extendDefaults()
    o = @h.cloneObj(@o); @h.extend(o, @defaults)
    # inherit the radiusX/Y from radius if werent defined
    # o.radiusX ?= o.radius; o.radiusY ?= o.radius
    @history = [o]
    @isForeign = !!@o.ctx; @isForeignBit = !!@o.bit
    @timelines = []

  render:->
    if !@isRendered# or isForce
      if !@isForeign and !@isForeignBit
        @ctx = document.createElementNS @ns, 'svg'
        @ctx.style.position  = 'absolute'
        @ctx.style.width     = '100%'
        @ctx.style.height    = '100%'
        @createBit(); @calcSize()
        @el = document.createElement 'div'
        @el.appendChild @ctx
        (@o.parent or document.body).appendChild @el
      else
        @ctx = @o.ctx; @createBit(); @calcSize()
      @isRendered = true
    @setElStyles()
    @setProgress 0, true
    @createTween()
    @

  setElStyles:->
    # size        = "#{@props.size/@h.remBase}rem"
    if !@isForeign
      size        = "#{@props.size}px"
      marginSize  = "#{-@props.size/2}px"
      @el.style.position    = 'absolute'
      @el.style.top         = @props.y
      @el.style.left        = @props.x
      @el.style.width       = size
      @el.style.height      = size
      @el.style['margin-left'] = marginSize
      @el.style['margin-top']  = marginSize
      @el.style['marginLeft']  = marginSize
      @el.style['marginTop']   = marginSize
      # @h.setPrefixedStyle @el, 'backface-visibility', 'hidden'

    @el?.style.opacity     = @props.opacity
    if @o.isShowInit then @show() else @hide()

  show:->
    return if @isShown or !@el?
    @el.style.display = 'block'
    @isShown = true
  hide:->
    return if (@isShown is false) or !@el?
    @el.style.display = 'none'
    @isShown = false

  draw:->
    @bit.setProp
      x:                  @origin.x
      y:                  @origin.y
      stroke:             @props.stroke
      'stroke-width':     @props.strokeWidth
      'stroke-opacity':   @props.strokeOpacity
      'stroke-dasharray': @props.strokeDasharray
      'stroke-dashoffset':@props.strokeDashoffset
      'stroke-linecap':   @props.strokeLinecap
      fill:               @props.fill
      'fill-opacity':     @props.fillOpacity
      radius:             @props.radius
      radiusX:            @props.radiusX
      radiusY:            @props.radiusY
      points:             @props.points
      transform:          @calcTransform()

    @bit.draw()
    @drawEl()

  drawEl:->
    return true if !@el?
    @isPropChanged('opacity') and (@el.style.opacity = @props.opacity)
    if !@isForeign
      @isPropChanged('x') and (@el.style.left = @props.x)
      @isPropChanged('y') and (@el.style.top  = @props.y)
      if @isNeedsTransform()
        @h.setPrefixedStyle @el, 'transform', @fillTransform()

  fillTransform:-> "translate(#{@props.shiftX}, #{@props.shiftY})"
  isNeedsTransform:->
    isX = @isPropChanged('shiftX'); isY = @isPropChanged('shiftY'); isX or isY
  isPropChanged:(name)->
    @lastSet[name] ?= {}
    if @lastSet[name].value isnt @props[name]
      @lastSet[name].value = @props[name]; true
    else false

  calcTransform:->
    @props.transform = "rotate(#{@props.angle},#{@origin.x},#{@origin.y})"
    
  calcSize:->
    return if @o.size
    radius = @calcMaxRadius()

    dStroke = @deltas['strokeWidth']
    stroke = if dStroke?
      Math.max Math.abs(dStroke.start), Math.abs(dStroke.end)
    else @props.strokeWidth
    @props.size = 2*radius + 2*stroke
    
    # increase el's size on elastic
    # and back easings
    switch @props.easing.toLowerCase?()
      when 'elastic.out', 'elastic.inout'
        @props.size *= 1.25
      when 'back.out', 'back.inout'
        @props.size *= 1.1

    @props.size   *= @bit.ratio
    @props.size   += 2*@props.sizeGap
    @props.center = @props.size/2

  calcMaxRadius:->
    selfSize  = @getRadiusSize key: 'radius'
    selfSizeX = @getRadiusSize key: 'radiusX', fallback: selfSize
    selfSizeY = @getRadiusSize key: 'radiusY', fallback: selfSize
    Math.max selfSizeX, selfSizeY

  getRadiusSize:(o)->
    if @deltas[o.key]?
      Math.max Math.abs(@deltas[o.key].end), Math.abs(@deltas[o.key].start)
    else if @props[o.key]? then parseFloat(@props[o.key]) else o.fallback or 0

  createBit:->
    bitClass = bitsMap.getBit(@o.type or @type)
    @bit = new bitClass ctx: @ctx, el: @o.bit, isDrawLess: true
    if @isForeign or @isForeignBit then @el = @bit.el

  setProgress:(progress, isShow)->
    if !isShow then @show(); @onUpdate?(progress)
    @progress = if progress < 0 or !progress then 0
    else if progress > 1 then 1 else progress
    # calc the curent value from deltas
    @calcCurrentProps(progress); @calcOrigin()
    @draw(progress)
    @

  calcCurrentProps:(progress)->
    keys = Object.keys(@deltas); len = keys.length
    while(len--)
      key = keys[len]; value = @deltas[key]
      @props[key] = switch value.type
        when 'array' # strokeDasharray/strokeDashoffset
          stroke = []
          for item, i in value.delta
            dash = value.start[i].value + item.value*@progress
            stroke.push { value: dash, unit: item.unit }
          stroke
        when 'number'
          value.start + value.delta*progress
        when 'unit'
          units = value.end.unit
          "#{value.start.value+value.delta*progress}#{units}"
        when 'color'
          r = parseInt (value.start.r + value.delta.r*progress), 10
          g = parseInt (value.start.g + value.delta.g*progress), 10
          b = parseInt (value.start.b + value.delta.b*progress), 10
          a = parseInt (value.start.a + value.delta.a*progress), 10
          "rgba(#{r},#{g},#{b},#{a})"

  calcOrigin:->
    @origin = if @o.ctx then x: parseFloat(@props.x), y: parseFloat(@props.y)
    else x: @props.center, y: @props.center

  extendDefaults:(o)->
    @props ?= {}; fromObject = o or @defaults
    # override deltas only if options obj wasnt passed
    !o? and (@deltas = {})

    keys = Object.keys(fromObject); len = keys.length
    while(len--)
      key = keys[len]; defaultsValue = fromObject[key]
      # skip props from skipProps object
      continue if @skipProps?[key]
      # if options object was passed = save the value to
      # options object and delete the old delta value
      # is used for new run options
      if o
        @o[key] = defaultsValue; optionsValue = defaultsValue
        # delete the old delta
        delete @deltas[key]
      # else get the value from options or fallback to defaults
      else optionsValue = if @o[key]? then @o[key] else defaultsValue
      # if non-object and non-array value - just save it to @props
      if !@isDelta(optionsValue)
        # parse random values
        if typeof optionsValue is 'string'
          if optionsValue.match /stagger/
            optionsValue = @h.parseStagger optionsValue, @index
        if typeof optionsValue is 'string'
          if optionsValue.match /rand/
            optionsValue = @h.parseRand optionsValue
        # save to props
        @props[key] = optionsValue
        if key is 'radius'
          if !@o.radiusX? then @props.radiusX = optionsValue
          if !@o.radiusY? then @props.radiusY = optionsValue
        # position properties should be parsed with units
        if @h.posPropsMap[key]
          @props[key] = @h.parseUnit(@props[key]).string
        # strokeDash properties should be parsed with units
        if @h.strokeDashPropsMap[key]
          property = @props[key]; value = []
          switch typeof property
            when 'number'
              value.push @h.parseUnit(property)
            when 'string'
              array = @props[key].split ' '
              for unit, i in array
                value.push @h.parseUnit(unit)
          @props[key] = value
        continue
      # if delta object was passed: like { 20: 75 }
      # calculate delta
      @isSkipDelta or @getDelta key, optionsValue
    @onUpdate = @props.onUpdate

  isDelta:(optionsValue)->
    isObject = (optionsValue? and (typeof optionsValue is 'object'))
    isObject = isObject and !optionsValue.unit
    not (!isObject or @h.isArray(optionsValue) or h.isDOM(optionsValue))

  getDelta:(key, optionsValue)->
    if (key is 'x' or key is 'y') and !@o.ctx
      @h.warn 'Consider to animate shiftX/shiftY properties instead of x/y,
       as it would be much more performant', optionsValue
    # skip props defined in skipPropsDelta map
    # needed for modules based on transit like swirl
    return if @skipPropsDelta?[key]
    delta = @h.parseDelta key, optionsValue, @defaults[key]
    # stoke-linecap filter
    if delta.type? then @deltas[key] = delta
    # and set the start value to props
    @props[key] = delta.start

  mergeThenOptions:(start, end)->
    o = {}
    # copy start values to o to exclude tween options and callbacks
    # but inherit duration
    for key, value of start
      if !@h.tweenOptionMap[key] and !@h.callbacksMap[key] or key is 'duration'
        o[key] = value
      else
        # if tween option or callback reset it
        o[key] = if key is 'easing' then '' else undefined
    # loop thru result object
    keys = Object.keys(end); i = keys.length
    while(i--)
      key = keys[i]; endValue = end[key]
      
      # if new value is a tween value or new value is an object/ function
      # then just save it
      isFunction = typeof endValue is 'function'
      if @h.tweenOptionMap[key] or typeof endValue is 'object' or isFunction
        o[key] = if endValue? then endValue else start[key]
        continue

      startKey = start[key]; startKey ?= @defaults[key]
      # inherit radius value for radiusX/Y
      if (key is 'radiusX' or key is 'radiusY') and !startKey?
        startKey = start.radius
      # if start value is object - rewrite the start value
      if typeof startKey is 'object' and startKey?
        # set startKey to delta object's start valeu
        startKeys = Object.keys(startKey); startKey = startKey[startKeys[0]]

      if endValue?
        # make delta object
        o[key] = {}; o[key][startKey] = endValue
      # if endValue is null or undefined save start value to options
      # else o[key] = startKey
    o

  then:(o)->
    return if !o? or !Object.keys(o)
    merged = @mergeThenOptions @history[@history.length-1], o
    @history.push merged
    # copy the tween options from passed o or current props
    keys = Object.keys(@h.tweenOptionMap); i = keys.length; opts = {}
    opts[keys[i]] = merged[keys[i]] while(i--)
    it = @; len = it.history.length
    do (len)=>
      opts.onUpdate      = (p)=> @setProgress p
      opts.onStart       = => @props.onStart?.apply(@)
      opts.onComplete    = => @props.onComplete?.apply @
      opts.onFirstUpdate = -> it.tuneOptions it.history[@index]
      opts.isChained = !o.delay
      @timeline.append new Tween(opts)
    @
    
  tuneOptions:(o)-> @extendDefaults(o); @calcSize(); @setElStyles()
  # TWEEN
  createTween:->
    it = @
    @createTimeline()
    @timeline = new Timeline
      onComplete:=> !@o.isShowEnd and @hide(); @props.onComplete?.apply @
    @timeline.add @tween
    !@o.isRunLess and @startTween()

  createTimeline:->
    @tween = new Tween
      duration: @props.duration
      delay:    @props.delay
      repeat:   @props.repeat
      yoyo:     @props.yoyo
      easing:   @props.easing
      onUpdate: (p)=> @setProgress p
      onStart:=> @show(); @props.onStart?.apply @
      onFirstUpdateBackward:=>
        @history.length > 1 and @tuneOptions @history[0]
      onReverseComplete:=>
        !@o.isShowInit and @hide(); @props.onReverseComplete?.apply @

  run:(o)->
    @runCount++
    if o and Object.keys(o).length
      # if then chain is present and the user tries to
      # change the start timing - warn him and delete the
      # props to prevent the timing change
      if @history.length > 1
        keys = Object.keys(o); len = keys.length
        while(len--)
          key = keys[len]
          if h.callbacksMap[key] or h.tweenOptionMap[key]
            h.warn "the property \"#{key}\" property can not
              be overridden on run with \"then\" chain yet"
            delete o[key]
      # transform the history, tune current option and save to
      # the history but only if actual options were passed
      @transformHistory(o)
      @tuneNewOption(o)
      o = @h.cloneObj(@o); @h.extend(o, @defaults); @history[0] = o
      !@o.isDrawLess and @setProgress(0, true)
    else @tuneNewOption @history[0]
    @startTween()

  # adds new options to history chain
  # on run call
  transformHistory:(o)->
    keys = Object.keys(o); i = -1
    len = keys.length; historyLen = @history.length
    # loop over the past options
    while(++i < len)
      key = keys[i]; j = 0
      # loop over the history skipping the first item
      while(++j < historyLen)
        optionRecord = @history[j][key]
        # if optionRecord?
        # if history record is object
        if typeof optionRecord is 'object'
          # get the end value and delete the record
          valueKeys = Object.keys(optionRecord)
          value = optionRecord[valueKeys[0]]
          delete @history[j][key][valueKeys[0]]
          # if delta in history and object in passed value
          # :: new {100: 50} was {200: 40}
          if typeof o[key] is 'object'
            valueKeys2 = Object.keys(o[key])
            value2 = o[key][valueKeys2[0]]
            @history[j][key][value2] = value
          # :: new 20 was {200: 40}
          else @history[j][key][o[key]] = value
          break
        else @history[j][key] = o[key]
        # else @history[j][key] = o[key]

  tuneNewOption:(o, isForeign)->
    # if type is defined and it's different
    # than the current type - warn and delete
    if o? and o.type? and o.type isnt (@o.type or @type)
      @h.warn 'Sorry, type can not be changed on run'
      delete o.type
    # extend defaults only if options obj was passed
    if o? and Object.keys(o).length
      @extendDefaults(o); @resetTimeline()
      !isForeign and @timeline.recalcDuration()
      @calcSize()
      !isForeign and @setElStyles()
  # defer tween start to wait for "then" functions
  startTween:-> setTimeout (=> @timeline?.start()), 1
  resetTimeline:->
    # if you reset the timeline options -
    # you should reset the whole "then" chain
    # if one is present
    timelineOptions = {}
    for key, i in Object.keys @h.tweenOptionMap
      timelineOptions[key] = @props[key]
    timelineOptions.onStart    = @props.onStart
    timelineOptions.onComplete = @props.onComplete
    @tween.setProp timelineOptions
  
  getBitLength:->
    @props.bitLength = @bit.getLength()
    @props.bitLength

module.exports = Transit

