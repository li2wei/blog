(function() {
  var Timeline, Transit, Tween, tweener;

  Timeline = window.mojs.Timeline;

  Tween = window.mojs.Tween;

  tweener = window.mojs.tweener;

  Transit = window.mojs.Transit;

  describe('Timeline ->', function() {
    beforeEach(function() {
      return tweener.removeAll();
    });
    it('should have timelines var', function() {
      var t;
      t = new Timeline;
      expect(t.timelines.length).toBe(0);
      expect(t.props.time).toBe(0);
      expect(t.props.repeatTime).toBe(0);
      return expect(t.props.shiftedRepeatTime).toBe(0);
    });
    it('should have initial state flags', function() {
      var t;
      t = new Timeline;
      return expect(t.state).toBe('stop');
    });
    describe('defaults ->', function() {
      return it('should have defaults', function() {
        var t;
        t = new Timeline;
        expect(t.defaults.repeat).toBe(0);
        expect(t.defaults.delay).toBe(0);
        return expect(typeof t.props).toBe('object');
      });
    });
    describe('_extendDefaults method ->', function() {
      it('should extend defaults by options #1', function() {
        var t;
        t = new Timeline({
          delay: 200
        });
        expect(t.props.delay).toBe(200);
        expect(t.props.repeat).toBe(0);
        return expect(t.props.shiftedRepeatTime).toBe(0);
      });
      it('should extend defaults by options #2', function() {
        var t;
        t = new Timeline({
          repeat: 2
        });
        expect(t.props.repeat).toBe(2);
        expect(t.props.delay).toBe(0);
        return expect(t.props.shiftedRepeatTime).toBe(0);
      });
      return it('should extend defaults by options #3', function() {
        var t;
        t = new Timeline({
          repeat: 2,
          delay: 300
        });
        expect(t.props.repeat).toBe(2);
        expect(t.props.delay).toBe(300);
        return expect(t.props.shiftedRepeatTime).toBe(0);
      });
    });
    describe('setProp method ->', function() {
      it('should set a prop to the props object', function() {
        var t;
        t = new Timeline({
          repeat: 4
        });
        t.setProp({
          repeat: 8
        });
        return expect(t.props.repeat).toBe(8);
      });
      return it('should call recalcDuration method', function() {
        var t;
        t = new Timeline({
          repeat: 4
        });
        spyOn(t, 'recalcDuration');
        t.setProp({
          repeat: 8
        });
        return expect(t.recalcDuration).toHaveBeenCalled();
      });
    });
    describe('add method ->', function() {
      it('should add timeline', function() {
        var t;
        t = new Timeline;
        t.add(new Tween);
        expect(t.timelines.length).toBe(1);
        return expect(t.timelines[0] instanceof Tween).toBe(true);
      });
      it('should return self for chaining', function() {
        var obj, t;
        t = new Timeline;
        obj = t.add(new Tween);
        return expect(obj).toBe(t);
      });
      it('should treat a module with timeline object as a timeline', function() {
        var t;
        t = new Timeline;
        t.add(new Transit);
        expect(t.timelines.length).toBe(1);
        return expect(t.timelines[0] instanceof Timeline).toBe(true);
      });
      it('should work with arrays of tweens', function() {
        var t, t1, t2;
        t = new Timeline;
        t1 = new Tween({
          duration: 1000
        });
        t2 = new Tween({
          duration: 1500
        });
        t.add([t1, t2, new Timeline]);
        expect(t.timelines.length).toBe(3);
        expect(t.props.repeatTime).toBe(1500);
        expect(t.timelines[0] instanceof Tween).toBe(true);
        expect(t.timelines[1] instanceof Tween).toBe(true);
        return expect(t.timelines[2] instanceof Timeline).toBe(true);
      });
      it('should calculate shiftedRepeatTime', function() {
        var t, t1, t2;
        t = new Timeline;
        t1 = new Tween({
          duration: 1000
        });
        t2 = new Tween({
          duration: 1500
        });
        t.add([t1, t2, new Timeline]);
        expect(t.timelines.length).toBe(3);
        expect(t.props.repeatTime).toBe(1500);
        return expect(t.props.shiftedRepeatTime).toBe(1500);
      });
      it('should calculate shiftedRepeatTime #2', function() {
        var t, t1, t2;
        t = new Timeline;
        t1 = new Tween({
          duration: 1000
        });
        t2 = new Tween({
          duration: 1500
        });
        t.setProp({
          'shiftTime': 500
        });
        t.add([t1, t2, new Timeline]);
        expect(t.timelines.length).toBe(3);
        expect(t.props.repeatTime).toBe(1500);
        return expect(t.props.shiftedRepeatTime).toBe(2000);
      });
      it('should work with arguments', function() {
        var t1, t2, tween;
        tween = new Timeline;
        t1 = new Tween({
          duration: 500,
          delay: 200
        });
        t2 = new Tween({
          duration: 500,
          delay: 500
        });
        tween.add(t1, t2);
        expect(tween.props.repeatTime).toBe(1000);
        return expect(tween.timelines.length).toBe(2);
      });
      it('should work with mixed arguments', function() {
        var t, t1, t2;
        t = new Timeline;
        t1 = new Tween({
          duration: 1000
        });
        t2 = new Tween({
          duration: 1500
        });
        t.add([t1, new Tween, new Timeline], t2);
        expect(t.timelines.length).toBe(4);
        expect(t.props.repeatTime).toBe(1500);
        expect(t.timelines[0] instanceof Tween).toBe(true);
        expect(t.timelines[1] instanceof Tween).toBe(true);
        expect(t.timelines[2] instanceof Timeline).toBe(true);
        return expect(t.timelines[3] instanceof Tween).toBe(true);
      });
      it('should calc self duration', function() {
        var t;
        t = new Timeline;
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        expect(t.props.repeatTime).toBe(700);
        t.add(new Tween({
          duration: 500,
          delay: 200,
          repeat: 1
        }));
        return expect(t.props.repeatTime).toBe(1400);
      });
      return it('should work with another tweens', function() {
        var t, t1;
        t1 = new Timeline;
        t = new Timeline;
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(new Tween({
          duration: 500,
          delay: 200,
          repeat: 1
        }));
        t1.add(t);
        return expect(t1.props.repeatTime).toBe(1400);
      });
    });
    describe('pushTimeline method ->', function() {
      return it('should push timeline to timelines and calc repeatTime', function() {
        var t;
        t = new Timeline;
        t.pushTimeline(new Tween({
          duration: 4000
        }));
        expect(t.timelines.length).toBe(1);
        expect(t.timelines[0] instanceof Tween).toBe(true);
        return expect(t.props.repeatTime).toBe(4000);
      });
    });
    describe('repeat option ->', function() {
      it('should increase repeatTime', function() {
        var t;
        t = new Timeline({
          repeat: 2
        });
        t.add(new Tween({
          duration: 200
        }));
        expect(t.props.repeatTime).toBe(600);
        return expect(t.props.time).toBe(200);
      });
      return it('should set nearest start time', function() {
        var t;
        t = new Timeline({
          repeat: 2
        });
        t.add(new Tween({
          duration: 200
        }));
        t.setProgress(.6);
        return expect(t.timelines[0].progress).toBeCloseTo(.8, 5);
      });
    });
    describe('startTime ->', function() {
      return it('should set startTime', function() {
        var expectedTime, t;
        t = new Timeline({
          repeat: 2
        });
        t.add(new Tween({
          duration: 200
        }));
        t.setStartTime();
        expectedTime = performance.now();
        expect(t.props.startTime).toBeGreaterThan(expectedTime - 50);
        return expect(t.props.startTime).not.toBeGreaterThan(expectedTime);
      });
    });
    describe('endTime ->', function() {
      return it('should set endTime', function() {
        var expectedTime, t;
        t = new Timeline({
          repeat: 2
        });
        t.add(new Tween({
          duration: 200
        }));
        t.setStartTime();
        expectedTime = performance.now();
        return expect(t.props.endTime).toBe(t.props.startTime + t.props.shiftedRepeatTime);
      });
    });
    describe('append method ->', function() {
      it('should add timeline', function() {
        var t;
        t = new Timeline;
        t.append(new Tween);
        expect(t.timelines.length).toBe(1);
        return expect(t.timelines[0] instanceof Tween).toBe(true);
      });
      it('should treat every argument as new append call', function() {
        var t, tm1, tm2;
        t = new Timeline;
        tm1 = new Tween({
          duration: 1000,
          delay: 500
        });
        tm2 = new Tween({
          duration: 1000,
          delay: 700
        });
        t.append(tm1, tm2);
        expect(t.timelines.length).toBe(2);
        expect(t.timelines[0] instanceof Tween).toBe(true);
        expect(t.timelines[1] instanceof Tween).toBe(true);
        expect(t.timelines[1].props.shiftTime).toBe(1500);
        return expect(t.props.time).toBe(3200);
      });
      it('should treat arrays as parallel tweens #1', function() {
        var t, tm1, tm2, tm3;
        t = new Timeline;
        tm1 = new Tween({
          duration: 500,
          delay: 500
        });
        tm2 = new Tween({
          duration: 500,
          delay: 700
        });
        tm3 = new Tween({
          duration: 500,
          delay: 700
        });
        t.append(tm1, [tm2, tm3]);
        return expect(t.props.time).toBe(2200);
      });
      it('should treat arrays as parallel tweens #2', function() {
        var t, tm1, tm2, tm3;
        t = new Timeline;
        tm1 = new Tween({
          duration: 500,
          delay: 800
        });
        tm2 = new Tween({
          duration: 500,
          delay: 700
        });
        tm3 = new Tween({
          duration: 500,
          delay: 700
        });
        t.append([tm2, tm3], tm1);
        return expect(t.props.repeatTime).toBe(1200 + 1300);
      });
      it('should arguments time = array time', function() {
        var t1, t2, time, tm0, tm1, tm2;
        t1 = new Timeline({
          delay: 2500
        });
        t2 = new Timeline({
          delay: 2500
        });
        tm0 = new Tween({
          duration: 3000,
          delay: 200
        });
        tm1 = new Tween({
          duration: 500,
          delay: 800
        });
        tm2 = new Tween({
          duration: 500,
          delay: 800
        });
        t1.add(tm0);
        t2.add(tm0);
        t1.append(tm1);
        t2.append([tm2]);
        time = performance.now();
        t1.setStartTime(time);
        t2.setStartTime(time);
        return expect(tm2.props.startTime).toBe(tm1.props.startTime);
      });
      it('should delay the timeline to duration', function() {
        var t;
        t = new Timeline;
        t.add(new Tween({
          duration: 1000,
          delay: 200
        }));
        t.append(new Tween({
          duration: 500,
          delay: 500
        }));
        return expect(t.timelines[1].props.shiftTime).toBe(1200);
      });
      it('should recalc duration', function() {
        var t;
        t = new Timeline;
        t.add(new Tween({
          duration: 1000,
          delay: 200
        }));
        t.append(new Tween({
          duration: 500,
          delay: 500
        }));
        return expect(t.props.time).toBe(2200);
      });
      it('should work with array', function() {
        var t, tm1, tm2;
        t = new Timeline;
        t.add(new Tween({
          duration: 1000,
          delay: 200
        }));
        tm1 = new Tween({
          duration: 500,
          delay: 500
        });
        tm2 = new Tween({
          duration: 500,
          delay: 700
        });
        t.append([tm1, tm2]);
        expect(t.timelines.length).toBe(3);
        return expect(t.props.time).toBe(2400);
      });
      it('should work with one argument', function() {
        var t;
        t = new Timeline;
        t.append(new Tween({
          duration: 1000,
          delay: 200
        }));
        return expect(t.timelines.length).toBe(1);
      });
      it('should work with multiple arguments', function() {
        var t, tm1, tm2;
        t = new Timeline;
        tm1 = new Tween({
          duration: 500,
          delay: 500
        });
        tm2 = new Tween({
          duration: 500,
          delay: 700
        });
        t.append(tm1, tm2);
        return expect(t.timelines.length).toBe(2);
      });
      it('should work with array and set the indexes', function() {
        var t, tm1, tm2;
        t = new Timeline;
        t.add(new Tween({
          duration: 1000,
          delay: 200
        }));
        tm1 = new Tween({
          duration: 500,
          delay: 500
        });
        tm2 = new Tween({
          duration: 500,
          delay: 700
        });
        t.append([tm1, tm2]);
        expect(tm1.index).toBe(1);
        return expect(tm2.index).toBe(1);
      });
      return it('should add element index', function() {
        var t;
        t = new Timeline;
        t.append(new Tween({
          duration: 1000,
          delay: 200
        }));
        t.append(new Tween({
          duration: 1000,
          delay: 200
        }));
        expect(t.timelines[0].index).toBe(0);
        return expect(t.timelines[1].index).toBe(1);
      });
    });
    describe('remove method ->', function() {
      it('should remove timeline', function() {
        var t, timeline;
        t = new Timeline;
        timeline = new Tween;
        t.add(timeline);
        t.remove(timeline);
        return expect(t.timelines.length).toBe(0);
      });
      return it('should remove tween', function() {
        var t, t1, timeline;
        t1 = new Timeline;
        t = new Timeline;
        timeline = new Tween;
        t.add(timeline);
        t1.add(t);
        t1.remove(t);
        return expect(t1.timelines.length).toBe(0);
      });
    });
    describe('recalcDuration method ->', function() {
      return it('should recalculate duration', function() {
        var t, timeline, timeline2;
        t = new Timeline;
        timeline = new Tween({
          duration: 100
        });
        timeline2 = new Tween({
          duration: 1000
        });
        t.add(timeline);
        t.timelines.push(timeline2);
        t.recalcDuration();
        return expect(t.props.time).toBe(1000);
      });
    });
    describe('start method ->', function() {
      it('should get the start time', function() {
        var t;
        t = new Timeline;
        t.start();
        expect(t.props.startTime).toBeDefined();
        return expect(t.props.endTime).toBe(t.props.startTime + t.props.repeatTime);
      });
      it('should call the setStartTime method', function() {
        var t, time;
        t = new Timeline;
        spyOn(t, 'setStartTime');
        time = 0;
        t.start(time);
        return expect(t.setStartTime).toHaveBeenCalledWith(time);
      });
      it('should start every timeline', function() {
        var t;
        it('should update the current time on every timeline', function() {});
        t = new Timeline;
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(new Tween({
          duration: 500,
          delay: 100
        }));
        spyOn(t.timelines[0], 'start');
        spyOn(t.timelines[1], 'start');
        t.start();
        expect(t.timelines[0].start).toHaveBeenCalledWith(t.props.startTime);
        return expect(t.timelines[1].start).toHaveBeenCalledWith(t.props.startTime);
      });
      it('should add itself to tweener', function() {
        var t;
        t = new Timeline;
        spyOn(tweener, 'add');
        t.start();
        return expect(tweener.add).toHaveBeenCalled();
      });
      it('should not add itself to tweener if time was passed', function() {
        var t;
        t = new Timeline;
        spyOn(tweener, 'add');
        t.start(10239123);
        return expect(tweener.add).not.toHaveBeenCalled();
      });
      return it('should set state to "play"', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        return expect(t.state).toBe('play');
      });
    });
    describe('removeFromTweener method ->', function() {
      return it('should call t.remove method with self', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        t.removeFromTweener();
        return expect(tweener.tweens.length).toBe(0);
      });
    });
    describe('pause method ->', function() {
      it('should call t.remove method with self', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        spyOn(t, 'removeFromTweener');
        t.pause();
        return expect(t.removeFromTweener).toHaveBeenCalled();
      });
      return it('should set state to "pause"', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        t.pause();
        return expect(t.state).toBe('pause');
      });
    });
    describe('stop method ->', function() {
      it('should call t.removeFromTweener method with self', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        spyOn(t, 'removeFromTweener');
        t.stop();
        return expect(t.removeFromTweener).toHaveBeenCalled();
      });
      it('should reset progress to 0', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        spyOn(t, 'setProgress');
        t.stop();
        return expect(t.setProgress).toHaveBeenCalledWith(0);
      });
      return it('should set state to "stop"', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        t.stop();
        return expect(t.state).toBe('stop');
      });
    });
    describe('restart method ->', function() {
      it('should call stop method', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        spyOn(t, 'stop');
        t.restart();
        return expect(t.stop).toHaveBeenCalled();
      });
      return it('should call start method', function() {
        var t, timeline;
        tweener.tweens = [];
        t = new Timeline;
        timeline = new Tween({
          duration: 2000
        });
        t.add(timeline);
        t.start();
        spyOn(t, 'start');
        t.restart();
        return expect(t.start).toHaveBeenCalled();
      });
    });
    describe('onReverseComplete callback ->', function() {
      it('should be defined', function() {
        var t;
        t = new Timeline({
          onReverseComplete: function() {}
        });
        return expect(t.o.onReverseComplete).toBeDefined();
      });
      it('should call onReverseComplete callback', function() {
        var t;
        t = new Timeline({
          onReverseComplete: function() {}
        });
        t.add(new Tween({
          duration: 10
        }));
        spyOn(t.o, 'onReverseComplete');
        t.start();
        t.setProgress(.5);
        t.setProgress(0);
        return expect(t.o.onReverseComplete).toHaveBeenCalled();
      });
      return it('should not be called on start', function() {
        var t;
        t = new Timeline({
          onReverseComplete: function() {}
        });
        t.add(new Tween({
          duration: 10
        }));
        spyOn(t.o, 'onReverseComplete');
        t.start();
        t.setProgress(0);
        return expect(t.o.onReverseComplete).not.toHaveBeenCalled();
      });
    });
    describe('onComplete callback ->', function() {
      it('should be defined', function() {
        var t;
        t = new Timeline({
          onComplete: function() {}
        });
        return expect(t.o.onComplete).toBeDefined();
      });
      it('should call onComplete callback', function(dfr) {
        var t;
        t = new Timeline({
          onComplete: function() {}
        });
        t.add(new Tween({
          duration: 10
        }));
        spyOn(t.o, 'onComplete');
        t.start();
        return setTimeout(function() {
          expect(t.o.onComplete).toHaveBeenCalled();
          return dfr();
        }, 200);
      });
      it('should call onComplete callback just once', function() {
        var t, t0;
        t0 = new Timeline({
          repeat: 5,
          delay: 400
        });
        t = new Timeline({
          onComplete: function() {}
        });
        t.add(new Tween);
        t0.add(t);
        t0.setStartTime();
        spyOn(t.o, 'onComplete');
        t0.update(t0.props.startTime - 250);
        t0.update(t0.props.startTime);
        t0.update(t0.props.startTime + 16);
        t0.update(t0.props.startTime + 32);
        t0.update(t0.props.endTime);
        t0.update(t0.props.startTime - 250);
        t0.update(t0.props.startTime);
        t0.update(t0.props.startTime + 16);
        t0.update(t0.props.startTime + 32);
        t0.update(t0.props.endTime);
        return expect(t.o.onComplete.calls.count()).toBe(2);
      });
      it('should have the right scope', function(dfr) {
        var isRightScope, t;
        isRightScope = false;
        t = new Timeline({
          onComplete: function() {
            return isRightScope = this instanceof Timeline;
          }
        });
        t.add(new Tween({
          duration: 20
        }));
        t.start();
        return setTimeout((function() {
          expect(isRightScope).toBe(true);
          return dfr();
        }), 100);
      });
      it('should fire after the last onUpdate', function(dfr) {
        var proc, tween;
        proc = 0;
        tween = new Timeline({
          onUpdate: function(p) {
            return proc = p;
          },
          onComplete: function() {
            expect(proc).toBe(1);
            return dfr();
          }
        });
        tween.add(new Tween({
          duration: 20
        }));
        tween.start();
        return tween.update(tween.props.startTime + 22);
      });
      return it('should reset flags', function() {
        var duration, t;
        t = new Timeline({
          onComplete: function() {}
        });
        duration = 500;
        t.add(new Tween({
          duration: duration
        }));
        t.update(t.props.startTime + duration / 2);
        t.update(t.props.endTime);
        expect(t.isStarted).toBe(false);
        return expect(t.isCompleted).toBe(true);
      });
    });
    describe('onUpdate callback ->', function() {
      it('should be defined', function() {
        var t;
        t = new Timeline({
          onUpdate: function() {}
        });
        return expect(t.onUpdate).toBeDefined();
      });
      it('should call onUpdate callback', function(dfr) {
        var t;
        t = new Timeline({
          onUpdate: function() {}
        });
        t.add(new Tween({
          duration: 20
        }));
        spyOn(t, 'onUpdate');
        t.start();
        return setTimeout(function() {
          expect(t.onUpdate).toHaveBeenCalled();
          return dfr();
        }, 100);
      });
      it('should have the right scope', function(dfr) {
        var isRightScope, t;
        isRightScope = false;
        t = new Timeline({
          onUpdate: function() {
            return isRightScope = this instanceof Timeline;
          }
        });
        t.add(new Tween({
          duration: 20
        }));
        t.start();
        return setTimeout((function() {
          expect(isRightScope).toBe(true);
          return dfr();
        }), 100);
      });
      it('should pass the current progress', function() {
        var t;
        t = new Timeline({
          onUpdate: function() {}
        });
        t.add(new Tween({
          duration: 20
        }));
        spyOn(t, 'onUpdate');
        t.start();
        t.update(t.props.startTime + 10);
        return expect(t.onUpdate).toHaveBeenCalledWith(.5);
      });
      it('should not run if time is less then startTime', function() {
        var t;
        t = new Timeline({
          onUpdate: function() {}
        });
        t.add(new Tween({
          duration: 20
        }));
        spyOn(t, 'onUpdate');
        t.start();
        t.update(t.props.startTime - 10);
        return expect(t.onUpdate).not.toHaveBeenCalled();
      });
      return it('should run if time is greater then endTime', function() {
        var t;
        t = new Timeline({
          onUpdate: function() {}
        });
        t.add(new Tween({
          duration: 20
        }));
        spyOn(t, 'onUpdate');
        t.start();
        t.update(t.props.startTime + 25);
        return expect(t.onUpdate).toHaveBeenCalledWith(1);
      });
    });
    describe('onStart callback ->', function() {
      it('should be defined', function() {
        var t;
        t = new Timeline({
          onStart: function() {}
        });
        return expect(t.o.onStart).toBeDefined();
      });
      it('should call onStart callback', function() {
        var t;
        t = new Timeline({
          onStart: function() {}
        });
        t.add(new Tween({
          duration: 500
        }));
        spyOn(t.o, 'onStart');
        t.start();
        t.update(t.props.startTime + 10);
        expect(t.o.onStart).toHaveBeenCalled();
        return expect(t.isStarted).toBe(true);
      });
      it('should call onStart callback only once', function() {
        var t;
        t = new Timeline({
          onStart: function() {}
        });
        t.add(new Tween({
          duration: 500
        }));
        spyOn(t.o, 'onStart');
        t.start();
        t.update(t.props.startTime + 10);
        t.update(t.props.startTime + 15);
        return expect(t.o.onStart.calls.count()).toBe(1);
      });
      it('should have the right scope', function() {
        var isRightScope, t;
        isRightScope = false;
        t = new Timeline({
          onStart: function() {
            return isRightScope = this instanceof Timeline;
          }
        });
        t.add(new Tween({
          duration: 20
        }));
        t.start();
        t.update(t.props.startTime + 10);
        return expect(isRightScope).toBe(true);
      });
      return it('should be called just once when nested', function(dfr) {
        var tm, tm0, tw1;
        tm0 = new Timeline({
          repeat: 2,
          delay: 50
        });
        tm = new Timeline({
          onStart: function() {}
        });
        tw1 = new Tween({
          duration: 50
        });
        tm.add(tw1);
        tm0.add(tm, tw1);
        spyOn(tm.o, 'onStart').and.callThrough();
        tm0.start();
        return setTimeout(function() {
          expect(tm.o.onStart.calls.count()).toBe(3);
          return dfr();
        }, 500);
      });
    });
    describe('update method ->', function() {
      it('should update the current time on every timeline', function() {
        var t, time;
        t = new Timeline;
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(new Tween({
          duration: 500,
          delay: 100
        }));
        t.start();
        spyOn(t.timelines[0], 'update');
        spyOn(t.timelines[1], 'update');
        t.update(time = performance.now() + 200);
        expect(t.timelines[0].update).toHaveBeenCalledWith(time, true);
        return expect(t.timelines[1].update).toHaveBeenCalledWith(time, true);
      });
      it('should return true is ended', function() {
        var t;
        t = new Timeline;
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(new Tween({
          duration: 500,
          delay: 100
        }));
        t.start();
        return expect(t.update(performance.now() + 2000)).toBe(true);
      });
      it('should not go further then endTime', function() {
        var t;
        t = new Timeline;
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.start();
        t.update(t.props.startTime + 1000);
        return expect(t.prevTime).toBe(t.props.endTime);
      });
      it('should work with tweens', function() {
        var t, t1, t2, ti1, ti2, ti3, ti4, time;
        t = new Timeline;
        t1 = new Timeline;
        t2 = new Timeline;
        ti1 = new Tween({
          duration: 500,
          delay: 200
        });
        spyOn(ti1, 'update');
        ti2 = new Tween({
          duration: 500,
          delay: 100
        });
        spyOn(ti2, 'update');
        ti3 = new Tween({
          duration: 100,
          delay: 0
        });
        spyOn(ti3, 'update');
        ti4 = new Tween({
          duration: 800,
          delay: 500
        });
        spyOn(ti4, 'update');
        t1.add(ti1);
        t1.add(ti2);
        t2.add(ti3);
        t2.add(ti4);
        t.add(t1);
        t.add(t2);
        t.start();
        t.update(time = t.props.startTime + 300);
        expect(ti1.update).toHaveBeenCalledWith(time, true);
        expect(ti2.update).toHaveBeenCalledWith(time, true);
        expect(ti3.update).toHaveBeenCalledWith(time, true);
        return expect(ti4.update).toHaveBeenCalledWith(time, true);
      });
      return it('should save _previousUpdateTime', function() {
        var t, time;
        t = new Timeline;
        time = performance.now();
        t.update(time);
        return expect(t._previousUpdateTime).toBe(time);
      });
    });
    describe('_updateTimelines method ->', function() {
      it('should set time to timelines', function() {
        var t, time;
        t = new Timeline;
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(new Tween({
          duration: 500,
          delay: 100
        }));
        t.setStartTime();
        time = t.props.startTime + 200;
        spyOn(t.timelines[0], 'update');
        spyOn(t.timelines[1], 'update');
        t._updateTimelines(time);
        expect(t.timelines[0].update).toHaveBeenCalledWith(time, true);
        return expect(t.timelines[1].update).toHaveBeenCalledWith(time, true);
      });
      it('should pass the endTime if the progress is much further', function() {
        var t, time;
        t = new Timeline;
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(new Tween({
          duration: 500,
          delay: 100
        }));
        t.setStartTime();
        time = t.props.startTime + 200;
        spyOn(t.timelines[0], 'update');
        spyOn(t.timelines[1], 'update');
        t._updateTimelines(time + (5 * t.props.time));
        expect(t.timelines[0].update).toHaveBeenCalledWith(t.props.endTime, true);
        return expect(t.timelines[1].update).toHaveBeenCalledWith(t.props.endTime, true);
      });
      it('should pass the endTime if the progress is in delay period', function() {
        var t, time, timeAfterPeriod, timeAtOne;
        t = new Timeline({
          delay: 200
        });
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(new Tween({
          duration: 500,
          delay: 100
        }));
        t.setStartTime();
        spyOn(t.timelines[0], 'update');
        spyOn(t.timelines[1], 'update');
        time = t.props.startTime - 100;
        timeAfterPeriod = t.props.startTime + t.props.delay + t.props.time - 100;
        t._updateTimelines(timeAfterPeriod);
        timeAtOne = t.props.startTime + t.props.time;
        expect(t.timelines[0].update).toHaveBeenCalledWith(timeAtOne, true);
        return expect(t.timelines[1].update).toHaveBeenCalledWith(timeAtOne, true);
      });
      it('should pass the endTime if the progress is in subsequent delay period', function() {
        var endTime, t, time;
        t = new Timeline({
          delay: 200,
          repeat: 2
        });
        t.add(new Tween({
          duration: 500
        }));
        t.setStartTime();
        time = t.props.startTime + t.props.time + 100;
        spyOn(t.timelines[0], 'update');
        t._updateTimelines(time);
        endTime = t.props.startTime + t.props.time;
        return expect(t.timelines[0].update).toHaveBeenCalledWith(endTime, true);
      });
      it('should pass false as second parameter if the new time is smaller', function() {
        var t, time;
        t = new Timeline({
          delay: 200,
          repeat: 2
        });
        t.add(new Tween({
          duration: 500
        }));
        t.setStartTime();
        time = t.props.startTime + 300;
        t._updateTimelines(time);
        spyOn(t.timelines[0], 'update');
        t._updateTimelines(time - 10);
        return expect(t.timelines[0].update).toHaveBeenCalledWith(time - 10, false);
      });
      it('should set time to timelines with respect to repeat option', function() {
        var arg0, arg1, t, time;
        t = new Timeline({
          repeat: 1
        });
        t.add(new Tween({
          delay: 200,
          duration: 500
        }));
        t.add(new Tween({
          delay: 100,
          duration: 500
        }));
        t.setStartTime();
        spyOn(t.timelines[0], 'update');
        spyOn(t.timelines[1], 'update');
        time = t.props.startTime + 5;
        t._updateTimelines(time + t.props.time);
        arg0 = t.timelines[0].update.calls.mostRecent().args[0];
        arg1 = t.timelines[1].update.calls.mostRecent().args[0];
        expect(arg0).toBeCloseTo(time, 5);
        return expect(arg1).toBeCloseTo(time, 5);
      });
      it('should set time to timelines with repeat and delay option', function(dfr) {
        var arg0, arg1, t, time;
        tweener.removeAll();
        t = new Timeline({
          repeat: 1,
          delay: 500
        });
        t.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(new Tween({
          duration: 500,
          delay: 100
        }));
        t.setStartTime();
        spyOn(t.timelines[0], 'update');
        spyOn(t.timelines[1], 'update');
        time = t.props.startTime;
        t._updateTimelines(time + t.props.time + t.props.delay + 5);
        arg0 = t.timelines[0].update.calls.mostRecent().args[0];
        arg1 = t.timelines[1].update.calls.mostRecent().args[0];
        expect(arg0).toBeCloseTo(time + 5, 5);
        expect(arg1).toBeCloseTo(time + 5, 5);
        return dfr();
      });
      it('should pass thru the isGrow param', function() {
        var t, time, tw;
        t = new Timeline({
          repeat: 1,
          delay: 500
        });
        tw = new mojs.Tween;
        t.add(tw);
        t.setStartTime();
        spyOn(tw, 'update');
        time = t.props.startTime + 100;
        t._updateTimelines(time, false);
        return expect(tw.update).toHaveBeenCalledWith(time, false);
      });
      return it('should not be called if the timeline was completed', function() {
        var tm, tm1, tm2;
        tm = new mojs.Timeline;
        tm1 = new mojs.Timeline({
          isIt: true
        });
        tm1.add(new mojs.Tween({
          duration: 1000
        }));
        tm2 = new mojs.Timeline({
          delay: 1000
        });
        tm2.add(new mojs.Tween);
        tm.add(tm1, tm2);
        tm.setStartTime();
        tm.update(tm.props.startTime + 100);
        tm.update(tm.props.startTime + 200);
        tm.update(tm.props.startTime + 800);
        tm.update(tm.props.startTime + 1000);
        spyOn(tm1, '_updateTimelines').and.callThrough();
        spyOn(tm1, '_checkCallbacks').and.callThrough();
        tm.update(tm.props.startTime + 1200);
        expect(tm1._updateTimelines).not.toHaveBeenCalled();
        return expect(tm1._checkCallbacks).not.toHaveBeenCalled();
      });
    });
    describe('setProgress method ->', function() {
      it('should call the update on every child with progress time', function() {
        var t, t1, t2, ti1, ti2, ti3, ti4, time;
        t = new Timeline;
        t1 = new Timeline;
        t2 = new Timeline;
        ti1 = new Tween({
          duration: 500,
          delay: 200
        });
        spyOn(ti1, 'update');
        ti2 = new Tween({
          duration: 500,
          delay: 100
        });
        spyOn(ti2, 'update');
        ti3 = new Tween({
          duration: 100,
          delay: 0
        });
        spyOn(ti3, 'update');
        ti4 = new Tween({
          duration: 800,
          delay: 500
        });
        spyOn(ti4, 'update');
        t1.add(ti1, ti2);
        t2.add(ti3, ti4);
        t.add(t1, t2);
        t.setStartTime();
        t.setProgress(.5);
        time = t.props.startTime + 650;
        expect(ti1.update).toHaveBeenCalledWith(time, true);
        expect(ti2.update).toHaveBeenCalledWith(time, true);
        expect(ti3.update).toHaveBeenCalledWith(time, true);
        return expect(ti4.update).toHaveBeenCalledWith(time, true);
      });
      it('should call setStartTime if there is no @props.startTime', function() {
        var t;
        t = new Timeline;
        spyOn(t, 'setStartTime');
        t.setProgress(.5);
        return expect(t.setStartTime).toHaveBeenCalled();
      });
      it('should call self update', function() {
        var t, t1, t2, ti1, ti2, ti3, ti4;
        t = new Timeline;
        t1 = new Timeline;
        t2 = new Timeline;
        ti1 = new Tween({
          duration: 500,
          delay: 200
        });
        ti2 = new Tween({
          duration: 500,
          delay: 100
        });
        ti3 = new Tween({
          duration: 100,
          delay: 0
        });
        ti4 = new Tween({
          duration: 800,
          delay: 500
        });
        t1.add(ti1);
        t1.add(ti2);
        t2.add(ti3);
        t2.add(ti4);
        t.add(t1);
        t.add(t2);
        t.setStartTime();
        spyOn(t, 'update');
        t.setProgress(.5);
        return expect(t.update).toHaveBeenCalledWith(t.props.startTime + 650);
      });
      it('should not set the progress more then 1', function() {
        var t, t1;
        t = new Timeline;
        t1 = new Timeline;
        t1.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(t1);
        t.setStartTime();
        spyOn(t, 'update');
        t.setProgress(1.5);
        return expect(t.update).toHaveBeenCalledWith(t.props.startTime + t.props.repeatTime);
      });
      return it('should not set the progress less then 0', function() {
        var t, t1;
        t = new Timeline;
        t1 = new Timeline;
        t1.add(new Tween({
          duration: 500,
          delay: 200
        }));
        t.add(t1);
        t.setStartTime();
        spyOn(t, 'update');
        t.setProgress(-1.5);
        return expect(t.update).toHaveBeenCalledWith(t.props.startTime);
      });
    });
    describe('setStartTime method', function() {
      return it('should call startTimelines methods', function() {
        var t, t1, time;
        t = new Timeline;
        t1 = new Timeline;
        t1.add(new Tween({
          duration: 500,
          delay: 200
        }));
        spyOn(t, 'startTimelines');
        time = 0;
        t.setStartTime(time);
        return expect(t.startTimelines).toHaveBeenCalledWith(time);
      });
    });
    describe('startTimelines method ->', function() {
      it('should add self shiftTime to child timelines', function() {
        var shift, t, time;
        t = new Timeline;
        t.add(new Tween({
          duration: 500
        }));
        time = 0;
        shift = 500;
        t.setProp({
          'shiftTime': shift
        });
        t.setStartTime(time);
        return expect(t.timelines[0].props.startTime).toBe(time + shift);
      });
      return it('should set time to startTime if no time was passed', function() {
        var t;
        t = new Timeline;
        t.add(new Tween({
          duration: 500
        }));
        spyOn(t.timelines[0], 'start');
        t.setStartTime(null);
        return expect(t.timelines[0].start).toHaveBeenCalledWith(t.props.startTime);
      });
    });
    describe('time track ->', function() {
      return it('should save the current time track', function() {
        var t;
        t = new Timeline;
        t.add(new Tween({
          duration: 500
        }));
        t.setProgress(.5);
        return expect(t.prevTime).toBe(t.props.startTime + 250);
      });
    });
    describe('recalcDuration method ->', function() {
      it('should recalc duration', function() {
        var t;
        t = new Timeline;
        t.add(new Tween({
          duration: 500
        }));
        t.recalcDuration();
        expect(t.props.time).toBe(500);
        return expect(t.props.repeatTime).toBe(500);
      });
      return it('should recalc duration with parallel tweens', function() {
        var repeatTime, t, time, tm1, tm2, tm3, tm4;
        t = new Timeline;
        tm1 = new Tween({
          duration: 500
        });
        tm2 = new Tween({
          delay: 500,
          duration: 700
        });
        tm3 = new Tween({
          duration: 800
        });
        tm4 = new Tween({
          delay: 1500,
          duration: 500
        });
        t.add(tm1, [tm2, tm3], tm4);
        time = t.props.time;
        repeatTime = t.props.repeatTime;
        t.recalcDuration();
        expect(t.props.time).toBe(time);
        return expect(t.props.repeatTime).toBe(repeatTime);
      });
    });
    describe('delay option ->', function() {
      return it('should increase repeatTime', function() {
        var t;
        t = new Timeline({
          repeat: 4,
          delay: 2000
        });
        t.add(new Tween({
          duration: 600
        }));
        return expect(t.props.repeatTime).toBe(13000);
      });
    });
    describe('getDimentions method ->', function() {
      it('should set startTime and endTime', function() {
        var t;
        t = new Timeline;
        t.add(new Tween);
        t.getDimentions();
        expect(t.props.startTime).toBeDefined();
        return expect(t.props.endTime).toBeDefined();
      });
      return it('should have time option to start from', function() {
        var t, time;
        t = new Timeline({
          delay: 600
        });
        t.add(new Tween);
        time = performance.now() + 500;
        t.getDimentions(time);
        return expect(t.props.startTime).toBe(time + 600);
      });
    });
    return describe('nested timelines ->', function() {
      it('should work with nested timelines', function() {
        var tm0, tm1, tm2, tw1, tw2;
        tm0 = new mojs.Timeline;
        tm1 = new mojs.Timeline;
        tm2 = new mojs.Timeline;
        tw1 = new mojs.Tween({
          duration: 100,
          onUpdate: function(p) {}
        });
        tm1.add(tw1);
        tw2 = new mojs.Tween({
          duration: 400,
          onUpdate: function(p) {}
        });
        tm2.add(tw2);
        tm0.add(tm1);
        tm0.append(tm2);
        tm0.setProgress(.5);
        return expect(tw2.progress).toBeCloseTo(.375, 5);
      });
      it('should set right endTime times', function() {
        var tm0, tm1, tm2, tw1, tw2;
        tm0 = new mojs.Timeline;
        tm1 = new mojs.Timeline;
        tm2 = new mojs.Timeline;
        tw1 = new mojs.Tween({
          duration: 100,
          onUpdate: function(p) {}
        });
        tm1.add(tw1);
        tw2 = new mojs.Tween({
          duration: 400,
          onUpdate: function(p) {}
        });
        tm2.add(tw2);
        tm0.add(tm1);
        tm0.append(tm2);
        tm0.setStartTime();
        expect(tm0.props.endTime).toBeCloseTo(tm0.props.startTime + 500, 3);
        expect(tm2.props.endTime).toBeCloseTo(tm0.props.startTime + 500, 3);
        return expect(tm2.props.startTime).toBeCloseTo(tm0.props.startTime + 100, 3);
      });
      it('should set right endTime times', function() {
        var tm0, tm1, tm2, tw1, tw2;
        tm0 = new mojs.Timeline({
          repeat: 2
        });
        tm1 = new mojs.Timeline;
        tm2 = new mojs.Timeline;
        tw1 = new mojs.Tween({
          duration: 100,
          onUpdate: function(p) {}
        });
        tm1.add(tw1);
        tw2 = new mojs.Tween({
          duration: 400,
          onUpdate: function(p) {}
        });
        tm2.add(tw2);
        tm0.add(tm1);
        tm0.append(tm2);
        tm0.setStartTime();
        return expect(tm2.props.shiftedRepeatTime).toBe(500);
      });
      it('should calculate right dimentions', function() {
        var tm0, tm1, tm2, tm2EndTime, tm2StartTime, tw1, tw2;
        tm0 = new mojs.Timeline;
        tm1 = new mojs.Timeline;
        tm2 = new mojs.Timeline({
          delay: 1000
        });
        tw1 = new mojs.Tween;
        tm1.add(tw1);
        tw2 = new mojs.Tween;
        tm2.add(tw2);
        tm0.add(tm1);
        tm0.append(tm2);
        tm0.setStartTime();
        expect(tm0.props.repeatTime).toBe(2200);
        expect(tm2.props.repeatTime).toBe(1600);
        expect(tm2.props.shiftedRepeatTime).toBe(1200);
        expect(tm2.props.shiftTime).toBe(600);
        expect(tm2.props.startTime).toBe(tw2.props.startTime);
        tm2StartTime = tm0.props.startTime + tm1.props.repeatTime + tm2.props.delay;
        expect(tm2.props.startTime).toBe(tm2StartTime);
        tm2EndTime = tm2.props.startTime + tm2.props.repeatTime - tm2.props.delay;
        expect(tm2.props.endTime).toBe(tm2EndTime);
        return expect(tm0.props.endTime).toBe(tm2.props.endTime);
      });
      it('should set nesed tween progress to 1 at the end', function() {
        var tm0, tm1, tw1, tw2;
        tm0 = new mojs.Timeline;
        tm1 = new mojs.Timeline;
        tw1 = new mojs.Tween;
        tm1.add(tw1);
        tw2 = new mojs.Tween;
        tm0.add(tm1);
        tm0.append(tw2);
        tm0.setStartTime();
        tm0.update(tm0.props.endTime - 20);
        tm0.update(tm0.props.endTime);
        expect(tw2.progress).toBe(1);
        expect(tm0.props.repeatTime).toBe(1200);
        expect(tw2.props.repeatTime).toBe(600);
        expect(tw2.props.startTime).toBe(tm0.props.startTime + tm1.props.repeatTime);
        return expect(tw2.props.endTime).toBe(tm0.props.startTime + tm0.props.repeatTime);
      });
      return it('should set nesed tween inside timeline progress to 1 at the end', function() {
        var tm0, tm1, tm2, tw1, tw2;
        tm0 = new mojs.Timeline;
        tm1 = new mojs.Timeline;
        tm2 = new mojs.Timeline({
          delay: 1000
        });
        tw1 = new mojs.Tween;
        tm1.add(tw1);
        tw2 = new mojs.Tween;
        tm2.add(tw2);
        tm0.add(tm1);
        tm0.append(tm2);
        tm0.setStartTime();
        tm0.update(tm0.props.endTime - 20);
        tm0.update(tm0.props.endTime);
        return expect(tw2.progress).toBe(1);
      });
    });
  });

}).call(this);
