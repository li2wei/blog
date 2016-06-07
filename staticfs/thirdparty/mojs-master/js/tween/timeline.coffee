h = require '../h'
t = require './tweener'

class Timeline
  state: 'stop'
  defaults:
    repeat: 0
    delay:  0
  constructor:(@o={})-> @vars(); @_extendDefaults(); @
  vars:->
    @timelines = []; @props = time: 0, repeatTime: 0, shiftedRepeatTime: 0
    @loop = h.bind @loop, @
    @onUpdate = @o.onUpdate
  add:(args...)-> @pushTimelineArray(args); @
  pushTimelineArray:(array)->
    for tm, i in array
      # recursive push to handle arrays of arrays
      if h.isArray tm then @pushTimelineArray tm
      # simple push
      else @pushTimeline tm
  # ---

  # Method to extend defaults by options and save
  # the result to props object
  _extendDefaults:->
    for key, value of @defaults
      @props[key] = if @o[key]? then @o[key] else value
  # ---

  # Method to add a prop to the props object.
  setProp:(props)->
    for key, value of props
      @props[key] = value
    @recalcDuration()

  pushTimeline:(timeline, shift)->
    # if timeline is a module with timeline property then extract it
    timeline = timeline.timeline if timeline.timeline instanceof Timeline
    # add self delay to the timeline
    shift? and timeline.setProp 'shiftTime': shift
    @timelines.push(timeline); @_recalcTimelineDuration timeline

  remove:(timeline)->
    index = @timelines.indexOf timeline
    if index isnt -1 then @timelines.splice index, 1
  # ---

  # Method to append the tween to the end of the
  # timeline. Each argument is treated as a new 
  # append. Array of tweens is treated as a parallel
  # sequence. 
  # @param {Object, Array} Tween to append or array of such.
  append:(timeline...)->
    for tm, i in timeline
      if h.isArray(tm) then @_appendTimelineArray(tm)
      else @appendTimeline(tm, @timelines.length)
    @

  _appendTimelineArray:(timelineArray)->
    i = timelineArray.length; time = @props.repeatTime - @props.delay
    len = @timelines.length
    @appendTimeline(timelineArray[i], len, time) while(i--)
  
  appendTimeline:(timeline, index, time)->
    shift = (if time? then time else @props.time)
    shift += (timeline.props.shiftTime or 0)
    timeline.index = index; @pushTimeline timeline, shift

  recalcDuration:->
    len = @timelines.length
    @props.time = 0; @props.repeatTime = 0; @props.shiftedRepeatTime = 0
    @_recalcTimelineDuration @timelines[len] while(len--)

  _recalcTimelineDuration:(timeline)->
    timelineTime = timeline.props.repeatTime + (timeline.props.shiftTime or 0)
    @props.time = Math.max timelineTime, @props.time
    @props.repeatTime = (@props.time+@props.delay)*(@props.repeat+1)
    @props.shiftedRepeatTime = @props.repeatTime + (@props.shiftTime or 0)
    @props.shiftedRepeatTime -= @props.delay

  # ---

  # Method to take care of the current time.
  # @param {Number} The current time
  # @return {Undefined, Boolean} Returns true if the tween
  # had ended it execution so should be removed form the 
  # tweener's active tweens array
  update:(time, isGrow)->
    # don't go further then the endTime
    time = @props.endTime if time > @props.endTime
    # return true if timeline was already completed
    return true if time is @props.endTime and @isCompleted
    # set the time to timelines
    @_updateTimelines time, isGrow
    # check the callbacks for the current time
    # NOTE: _checkCallbacks method should be returned
    # from this update function, because it returns true
    # if the tween was completed, to indicate the tweener
    # module to remove it from the active tweens array for 
    # performance purposes
    return @_checkCallbacks(time)
  # ---
  # 
  # Method to set time on timelines,
  # with respect to repeat periods **if present**
  # @param {Number} Time to set
  _updateTimelines:(time, isGrow)->
    # get elapsed with respect to repeat option
    # so take a modulo of the elapsed time
    startPoint = @props.startTime - @props.delay
    elapsed = (time - startPoint) % (@props.delay + @props.time)

    # get the time for timelines
    timeToTimelines = if time is @props.endTime then @props.endTime
    # after delay
    else if startPoint + elapsed >= @props.startTime
      if time >= @props.endTime then @props.endTime
      else startPoint + elapsed
    else
      if time > @props.startTime + @props.time
        @props.startTime + @props.time
      else null

    # set the normalized time to the timelines
    if timeToTimelines?
      i = -1; len = @timelines.length-1
      while(i++ < len)
        isGrow ?= time > (@_previousUpdateTime or 0)
        @timelines[i].update(timeToTimelines, isGrow)

    @_previousUpdateTime = time
  # ---

  # Method to check the callbacks
  # for the current time
  # @param {Number} The current time
  _checkCallbacks:(time)->
    # dont care about the multiple exact same time calls
    return if @prevTime is time

    # if there is no prevTime - so it wasnt called ever at all
    # or if it was called but have been completed already
    # and it wasnt started yet -- then start!
    if !@prevTime or @isCompleted and !@isStarted
      @o.onStart?.apply(@); @isStarted = true; @isCompleted = false
    # if isn't complete
    if time >= @props.startTime and time < @props.endTime
      @onUpdate? (time - @props.startTime)/@props.repeatTime
    # if reverse completed
    if @prevTime > time and time <= @props.startTime
      @o.onReverseComplete?.apply(@)
    # @isCompleted = false if time < @props.startTime
    # save the current time as previous for future
    @prevTime = time
    # if completed
    if time is @props.endTime and !@isCompleted
      @onUpdate?(1); @o.onComplete?.apply(@)
      @isCompleted = true; @isStarted = false; return true

  start:(time)->
    @setStartTime(time); !time and (t.add(@); @state = 'play')
    @
  
  pause:-> @removeFromTweener(); @state = 'pause'; @
  stop:->  @removeFromTweener(); @setProgress(0); @state = 'stop'; @
  restart:-> @stop(); @start()
  removeFromTweener:-> t.remove(@); @

  setStartTime:(time)-> @getDimentions(time); @startTimelines(@props.startTime)

  startTimelines:(time)->
    i = @timelines.length
    !time? and (time = @props.startTime)
    @timelines[i].start(time) while(i--)

  setProgress:(progress)->
    if !@props.startTime? then @setStartTime()
    progress = h.clamp progress, 0, 1
    @update @props.startTime + progress*@props.repeatTime
  getDimentions:(time)->
    time ?= performance.now()
    @props.startTime = time + @props.delay + (@props.shiftTime or 0)
    @props.endTime = @props.startTime + @props.shiftedRepeatTime
    @props.endTime -= (@props.shiftTime or 0)

module.exports = Timeline

