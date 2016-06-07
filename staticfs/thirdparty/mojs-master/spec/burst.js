(function() {
  var Burst, Swirl, Transit, t;

  Transit = mojs.Transit;

  Swirl = mojs.Swirl;

  Burst = mojs.Burst;

  t = mojs.tweener;

  describe('Burst ->', function() {
    beforeEach(function() {
      return t.removeAll();
    });
    describe('extension ->', function() {
      it('should extend Transit class', function() {
        var burst;
        burst = new Burst;
        return expect(burst instanceof Transit).toBe(true);
      });
      it('should have its own defaults', function() {
        var burst;
        burst = new Burst;
        expect(burst.skipProps.childOptions).toBe(1);
        expect(burst.defaults.degree).toBe(360);
        expect(burst.defaults.count).toBe(5);
        expect(burst.defaults.opacity).toBe(1);
        expect(burst.defaults.randomAngle).toBe(0);
        expect(burst.defaults.randomRadius).toBe(0);
        expect(burst.defaults.x).toBe(100);
        expect(burst.defaults.y).toBe(100);
        expect(burst.defaults.shiftX).toBe(0);
        expect(burst.defaults.shiftY).toBe(0);
        expect(burst.defaults.radius[25]).toBe(75);
        expect(burst.defaults.angle).toBe(0);
        expect(burst.defaults.size).toBe(null);
        expect(burst.defaults.sizeGap).toBe(0);
        expect(burst.defaults.onStart).toBe(null);
        expect(burst.defaults.onComplete).toBe(null);
        expect(burst.defaults.onCompleteChain).toBe(null);
        return expect(burst.defaults.onUpdate).toBe(null);
      });
      it('should have childDefaults', function() {
        var burst;
        burst = new Burst;
        expect(burst.childDefaults.radius[7]).toBe(0);
        expect(burst.childDefaults.points).toBe(3);
        expect(burst.childDefaults.angle).toBe(0);
        expect(burst.childDefaults.onStart).toBe(null);
        expect(burst.childDefaults.onComplete).toBe(null);
        expect(burst.childDefaults.onUpdate).toBe(null);
        expect(burst.childDefaults.duration).toBe(500);
        expect(burst.childDefaults.delay).toBe(0);
        expect(burst.childDefaults.repeat).toBe(0);
        expect(burst.childDefaults.yoyo).toBe(false);
        expect(burst.childDefaults.easing).toBe('Linear.None');
        expect(burst.childDefaults.type).toBe('circle');
        expect(burst.childDefaults.fill).toBe('deeppink');
        expect(burst.childDefaults.fillOpacity).toBe(1);
        expect(burst.childDefaults.stroke).toBe('transparent');
        expect(burst.childDefaults.strokeWidth).toBe(0);
        expect(burst.childDefaults.strokeDasharray).toBe('');
        expect(burst.childDefaults.strokeDashoffset).toBe('');
        expect(burst.childDefaults.strokeLinecap).toBe(null);
        expect(burst.childDefaults.isSwirl).toBe(false);
        expect(burst.childDefaults.swirlSize).toBe(10);
        return expect(burst.childDefaults.swirlFrequency).toBe(3);
      });
      return it('should have optionsIntersection object', function() {
        var burst;
        burst = new Burst;
        expect(burst.optionsIntersection.radius).toBe(1);
        expect(burst.optionsIntersection.radiusX).toBe(1);
        expect(burst.optionsIntersection.radiusY).toBe(1);
        expect(burst.optionsIntersection.opacity).toBe(1);
        expect(burst.optionsIntersection.angle).toBe(1);
        expect(burst.optionsIntersection.onUpdate).toBe(1);
        expect(burst.optionsIntersection.onStart).toBe(1);
        expect(burst.optionsIntersection.onComplete).toBe(1);
        return expect(Object.keys(burst.optionsIntersection).length).toBe(8);
      });
    });
    describe('initialization ->', function() {
      it('should create transits', function() {
        var burst;
        burst = new Burst;
        expect(burst.transits.length).toBe(5);
        return expect(burst.transits[0] instanceof Swirl).toBe(true);
      });
      it('should pass indexes to transits', function() {
        var burst;
        burst = new Burst;
        expect(burst.transits.length).toBe(5);
        expect(burst.transits[0].o.index).toBe(0);
        expect(burst.transits[1].o.index).toBe(1);
        expect(burst.transits[2].o.index).toBe(2);
        expect(burst.transits[3].o.index).toBe(3);
        return expect(burst.transits[4].o.index).toBe(4);
      });
      it('should pass properties to transits', function() {
        var burst;
        burst = new Burst({
          stroke: 'red',
          strokeWidth: {
            10: 0
          },
          strokeOpacity: {
            1: 0
          },
          strokeDasharray: '200 10 0',
          strokeDashoffset: '50',
          strokeLinecap: 'round',
          fill: 'deeppink',
          fillOpacity: .5,
          type: 'rect',
          swirlSize: 20,
          swirlFrequency: 'rand(10,20)',
          count: 6,
          isSwirl: true,
          radius: {
            'rand(10,20)': 100
          },
          childOptions: {
            stroke: ['deeppink', 'yellow', null],
            strokeWidth: [null, null, 20],
            strokeOpacity: [null, 1, null],
            fill: ['#fff', null],
            type: ['circle', null, 'polygon'],
            swirlSize: [10, null],
            swirlFrequency: [null, 3],
            radius: [
              {
                20: 50
              }, 20, '500'
            ],
            strokeDasharray: [
              '10 20', null, {
                '40': '10'
              }
            ],
            strokeDashoffset: ['200', null, null],
            fillOpacity: [null, 1],
            strokeLinecap: ['butt', null],
            points: [10, null, 10]
          }
        });
        expect(burst.transits[0].o.radius[20]).toBe(50);
        expect(burst.transits[1].o.radius).toBe(20);
        expect(burst.transits[2].o.radius).toBe('500');
        expect(burst.transits[3].o.radius[20]).toBe(50);
        expect(burst.transits[4].o.radius).toBe(20);
        expect(burst.transits[1].o.stroke).toBe('yellow');
        expect(burst.transits[2].o.stroke).toBe('red');
        expect(burst.transits[3].o.stroke).toBe('deeppink');
        expect(burst.transits[3].o.strokeWidth[10]).toBe(0);
        expect(burst.transits[1].o.strokeWidth[10]).toBe(0);
        expect(burst.transits[2].o.strokeWidth).toBe(20);
        expect(burst.transits[0].o.fill).toBe('#fff');
        expect(burst.transits[1].o.fill).toBe('deeppink');
        expect(burst.transits[0].o.fillOpacity).toBe(.5);
        expect(burst.transits[1].o.fillOpacity).toBe(1);
        expect(burst.transits[0].o.isSwirl).toBe(true);
        expect(burst.transits[0].o.swirlSize).toBe(10);
        expect(burst.transits[1].o.swirlSize).toBe(20);
        expect(burst.transits[0].o.swirlFrequency).toBe('rand(10,20)');
        expect(burst.transits[1].o.swirlFrequency).toBe(3);
        expect(burst.transits[0].o.type).toBe('circle');
        expect(burst.transits[1].o.type).toBe('rect');
        expect(burst.transits[2].o.type).toBe('polygon');
        expect(burst.transits[0].o.strokeOpacity[1]).toBe(0);
        expect(burst.transits[1].o.strokeOpacity).toBe(1);
        expect(burst.transits[2].o.strokeOpacity[1]).toBe(0);
        expect(burst.transits[0].o.strokeDasharray).toBe('10 20');
        expect(burst.transits[1].o.strokeDasharray).toBe('200 10 0');
        expect(burst.transits[2].o.strokeDasharray['40']).toBe('10');
        expect(burst.transits[0].o.strokeDashoffset).toBe('200');
        expect(burst.transits[1].o.strokeDashoffset).toBe('50');
        expect(burst.transits[2].o.strokeDashoffset).toBe('50');
        expect(burst.transits[0].o.strokeLinecap).toBe('butt');
        expect(burst.transits[1].o.strokeLinecap).toBe('round');
        expect(burst.transits[2].o.strokeLinecap).toBe('butt');
        expect(burst.transits[0].o.points).toBe(10);
        expect(burst.transits[1].o.points).toBe(3);
        return expect(burst.transits[2].o.points).toBe(10);
      });
      it('should keep the bit angle', function() {
        var burst;
        burst = new Burst({
          cound: 2,
          childOptions: {
            angle: [10, null]
          }
        });
        expect(burst.transits[0].o.angle).toBe(100);
        return expect(burst.transits[1].o.angle).toBe(162);
      });
      it('should keep the bit angle if delta passed', function() {
        var burst;
        burst = new Burst({
          cound: 2,
          childOptions: {
            angle: [
              {
                200: 10
              }, null
            ]
          }
        });
        expect(burst.transits[0].o.angle[290]).toBe(100);
        return expect(burst.transits[1].o.angle).toBe(162);
      });
      it('should not keep the bit angle if isResetAngles is passed', function() {
        var burst;
        burst = new Burst({
          cound: 2,
          isResetAngles: true,
          childOptions: {
            angle: [
              {
                200: 10
              }, null
            ]
          }
        });
        expect(burst.transits[0].o.angle[200]).toBe(10);
        return expect(burst.transits[1].o.angle).toBe(0);
      });
      return it('should pass x/y to transits', function() {
        var burst, center;
        burst = new Burst({
          radius: {
            50: 75
          },
          count: 2
        });
        center = burst.props.center;
        expect(burst.transits[0].o.x).toBe(center);
        expect(burst.transits[0].o.y[center - 50]).toBe(center - 75);
        expect(burst.transits[1].o.x).toBe(center);
        return expect(burst.transits[1].o.y[center + 50]).toBe(center + 75);
      });
    });
    describe('fillTransform method ->', function() {
      return it('return tranform string of the el', function() {
        var burst;
        burst = new Burst({
          shiftX: 100,
          shiftY: 100,
          angle: 50
        });
        return expect(burst.fillTransform()).toBe('rotate(50deg) translate(100px, 100px)');
      });
    });
    describe('isNeedsTransform method ->', function() {
      return it('return boolean if fillTransform needed', function() {
        var burst;
        burst = new Burst({
          shiftX: 100,
          shiftY: 100,
          angle: 50
        });
        return expect(burst.isNeedsTransform()).toBe(true);
      });
    });
    describe('getOption method ->', function() {
      it('should return an option obj based on i ->', function() {
        var burst, option0, option1, option7;
        burst = new Burst({
          childOptions: {
            radius: [
              {
                20: 50
              }, 20, '500'
            ]
          }
        });
        option0 = burst.getOption(0);
        option1 = burst.getOption(1);
        option7 = burst.getOption(7);
        expect(option0.radius[20]).toBe(50);
        expect(option1.radius).toBe(20);
        return expect(option7.radius).toBe(20);
      });
      it('should try to fallback to childDefaiults first ->', function() {
        var burst, option0, option1, option7, option8;
        burst = new Burst({
          duration: 2000,
          childOptions: {
            radius: [200, null, '500']
          }
        });
        option0 = burst.getOption(0);
        option1 = burst.getOption(1);
        option7 = burst.getOption(7);
        option8 = burst.getOption(8);
        expect(option0.radius).toBe(200);
        expect(option1.radius[7]).toBe(0);
        expect(option7.radius[7]).toBe(0);
        return expect(option8.radius).toBe('500');
      });
      it('should fallback to parent prop if defined  ->', function() {
        var burst, option0, option1, option7, option8;
        burst = new Burst({
          duration: 2000,
          childOptions: {
            duration: [200, null, '500']
          }
        });
        option0 = burst.getOption(0);
        option1 = burst.getOption(1);
        option7 = burst.getOption(7);
        option8 = burst.getOption(8);
        expect(option0.duration).toBe(200);
        expect(option1.duration).toBe(2000);
        expect(option7.duration).toBe(2000);
        return expect(option8.duration).toBe('500');
      });
      it('should fallback to parent default ->', function() {
        var burst, option0, option1, option7, option8;
        burst = new Burst({
          childOptions: {
            duration: [200, null, '500']
          }
        });
        option0 = burst.getOption(0);
        option1 = burst.getOption(1);
        option7 = burst.getOption(7);
        option8 = burst.getOption(8);
        expect(option0.duration).toBe(200);
        expect(option1.duration).toBe(500);
        expect(option7.duration).toBe(500);
        return expect(option8.duration).toBe('500');
      });
      it('should have all the props filled ->', function() {
        var burst, option0, option1, option7, option8;
        burst = new Burst({
          childOptions: {
            duration: [200, null, '500']
          }
        });
        option0 = burst.getOption(0);
        option1 = burst.getOption(1);
        option7 = burst.getOption(7);
        option8 = burst.getOption(8);
        expect(option0.radius[7]).toBe(0);
        expect(option1.radius[7]).toBe(0);
        expect(option7.radius[7]).toBe(0);
        return expect(option8.radius[7]).toBe(0);
      });
      return it('should have parent only options ->', function() {
        var burst, option0;
        burst = new Burst({
          radius: {
            'rand(10,20)': 100
          },
          angle: {
            50: 0
          },
          onUpdate: function() {},
          onStart: function() {},
          onComplete: function() {}
        });
        option0 = burst.getOption(0);
        expect(option0.radius[7]).toBe(0);
        expect(option0.angle).toBe(0);
        expect(option0.onUpdate).toBe(null);
        expect(option0.onStart).toBe(null);
        return expect(option0.onComplete).toBe(null);
      });
    });
    describe('getBitAngle method ->', function() {
      it('should get angle by i', function() {
        var burst;
        burst = new Burst({
          radius: {
            'rand(10,20)': 100
          }
        });
        expect(burst.getBitAngle(0, 0)).toBe(90);
        expect(burst.getBitAngle(0, 1)).toBe(162);
        expect(burst.getBitAngle(0, 2)).toBe(234);
        expect(burst.getBitAngle(90, 2)).toBe(234 + 90);
        expect(burst.getBitAngle(0, 3)).toBe(306);
        expect(burst.getBitAngle(90, 3)).toBe(306 + 90);
        expect(burst.getBitAngle(0, 4)).toBe(378);
        return expect(burst.getBitAngle(50, 4)).toBe(378 + 50);
      });
      return it('should get delta angle by i', function() {
        var burst;
        burst = new Burst({
          radius: {
            'rand(10,20)': 100
          }
        });
        expect(burst.getBitAngle({
          180: 0
        }, 0)[270]).toBe(90);
        expect(burst.getBitAngle({
          50: 20
        }, 3)[356]).toBe(326);
        return expect(burst.getBitAngle({
          50: 20
        }, 4)[428]).toBe(398);
      });
    });
    describe('getPropByMod method ->', function() {
      it('should return the prop from @o based on i ->', function() {
        var burst, opt0, opt1, opt2, opt8;
        burst = new Burst({
          childOptions: {
            radius: [
              {
                20: 50
              }, 20, '500'
            ]
          }
        });
        opt0 = burst.getPropByMod({
          key: 'radius',
          i: 0
        });
        opt1 = burst.getPropByMod({
          key: 'radius',
          i: 1
        });
        opt2 = burst.getPropByMod({
          key: 'radius',
          i: 2
        });
        opt8 = burst.getPropByMod({
          key: 'radius',
          i: 8
        });
        expect(opt0[20]).toBe(50);
        expect(opt1).toBe(20);
        expect(opt2).toBe('500');
        return expect(opt8).toBe('500');
      });
      it('should the same prop if not an array ->', function() {
        var burst, opt0, opt1, opt8;
        burst = new Burst({
          childOptions: {
            radius: 20
          }
        });
        opt0 = burst.getPropByMod({
          key: 'radius',
          i: 0
        });
        opt1 = burst.getPropByMod({
          key: 'radius',
          i: 1
        });
        opt8 = burst.getPropByMod({
          key: 'radius',
          i: 8
        });
        expect(opt0).toBe(20);
        expect(opt1).toBe(20);
        return expect(opt8).toBe(20);
      });
      return it('should work with another options object ->', function() {
        var burst, from, opt0, opt1, opt8;
        burst = new Burst({
          radius: 40,
          childOptions: {
            radius: 20
          }
        });
        from = burst.o;
        opt0 = burst.getPropByMod({
          key: 'radius',
          i: 0,
          from: from
        });
        opt1 = burst.getPropByMod({
          key: 'radius',
          i: 1,
          from: from
        });
        opt8 = burst.getPropByMod({
          key: 'radius',
          i: 8,
          from: from
        });
        expect(opt0).toBe(40);
        expect(opt1).toBe(40);
        return expect(opt8).toBe(40);
      });
    });
    describe('randomness ->', function() {
      describe('random angle ->', function() {
        it('should have randomAngle option ->', function() {
          var burst;
          burst = new Burst;
          expect(burst.props.randomAngle).toBeDefined();
          return expect(burst.props.randomAngle).toBe(0);
        });
        return it('should calculate angleRand for every transit ->', function() {
          var burst;
          burst = new Burst({
            randomAngle: true
          });
          expect(burst.transits[0].o.angleShift).toBeDefined();
          return expect(burst.transits[1].o.angleShift).toBeDefined();
        });
      });
      return describe('random radius ->', function() {
        it('should have randomRadius option ->', function() {
          var burst;
          burst = new Burst;
          expect(burst.props.randomRadius).toBeDefined();
          return expect(burst.props.randomRadius).toBe(0);
        });
        return it('should calculate radiusRand for every transit ->', function() {
          var burst;
          burst = new Burst({
            randomRadius: true
          });
          expect(burst.transits[0].o.radiusScale).toBeDefined();
          return expect(burst.transits[1].o.radiusScale).toBeDefined();
        });
      });
    });
    describe('size calculations calcSize method ->', function() {
      it('should calculate size based on largest transit + self radius', function() {
        var burst;
        burst = new Burst({
          radius: 50,
          childOptions: {
            radius: [
              {
                20: 50
              }, 20
            ],
            strokeWidth: 20
          }
        });
        expect(burst.props.size).toBe(240);
        return expect(burst.props.center).toBe(120);
      });
      it('should calculate size based on largest transit + self radius #2', function() {
        var burst;
        burst = new Burst({
          radius: 50,
          radiusX: 100,
          childOptions: {
            radius: [
              {
                20: 50
              }, 20
            ],
            strokeWidth: 20
          }
        });
        expect(burst.props.size).toBe(340);
        return expect(burst.props.center).toBe(170);
      });
      it('should calculate size based on largest transit + self radius #3', function() {
        var burst;
        burst = new Burst({
          radius: {
            20: 50
          },
          radiusX: 20,
          childOptions: {
            radius: [
              {
                20: 50
              }, 20
            ],
            strokeWidth: 20
          }
        });
        expect(burst.props.size).toBe(240);
        return expect(burst.props.center).toBe(120);
      });
      it('should calculate size based on largest transit + self radius #4', function() {
        var burst;
        burst = new Burst({
          radius: 50,
          radiusY: {
            20: 100
          },
          childOptions: {
            radius: [
              {
                20: 50
              }, 20
            ],
            strokeWidth: 20
          }
        });
        expect(burst.props.size).toBe(340);
        return expect(burst.props.center).toBe(170);
      });
      it('should calculate size based on largest transit + self radius #5', function() {
        var burst;
        burst = new Burst({
          childOptions: {
            radius: [
              {
                20: 50
              }, 20
            ],
            strokeWidth: 20
          }
        });
        expect(burst.props.size).toBe(290);
        return expect(burst.props.center).toBe(145);
      });
      it('should call the calcSize of every transit', function() {
        var burst;
        burst = new Burst({
          childOptions: {
            radius: [
              {
                20: 50
              }, 20
            ],
            strokeWidth: 20
          }
        });
        spyOn(burst.transits[0], 'calcSize');
        spyOn(burst.transits[1], 'calcSize');
        burst.calcSize();
        expect(burst.transits[0].calcSize).toHaveBeenCalled();
        return expect(burst.transits[1].calcSize).toHaveBeenCalled();
      });
      it('should call addBitOptions method', function() {
        var burst;
        burst = new Burst;
        spyOn(burst, 'addBitOptions');
        burst.calcSize();
        return expect(burst.addBitOptions).toHaveBeenCalled();
      });
      return it('should work with sizeGap', function() {
        var burst;
        burst = new Burst({
          sizeGap: 20,
          childOptions: {
            radius: [
              {
                20: 50
              }, 20
            ],
            strokeWidth: 20
          }
        });
        expect(burst.props.size).toBe(330);
        return expect(burst.props.center).toBe(burst.props.size / 2);
      });
    });
    describe('addBitOptions method ->', function() {
      it('should set x/y on every transit', function() {
        var burst;
        burst = new Burst({
          radius: {
            0: 120
          }
        });
        return expect(typeof burst.transits[1].o.x).toBe('object');
      });
      it('should work if end radius is 0', function() {
        var burst, keys, x;
        burst = new Burst({
          radius: {
            120: 0
          }
        });
        x = burst.transits[1].o.x;
        keys = Object.keys(x);
        return expect(x[keys[0]] + '').not.toBe(keys[0]);
      });
      it('should work with radiusX', function() {
        var burst;
        burst = new Burst({
          radius: {
            120: 0
          },
          radiusX: 30
        });
        return expect(parseInt(burst.transits[1].o.x, 10)).toBe(155);
      });
      it('should work with radiusY', function() {
        var burst, center, keys;
        burst = new Burst({
          radius: {
            120: 0
          },
          radiusY: {
            30: 0
          }
        });
        keys = Object.keys(burst.transits[1].o.y);
        center = burst.props.center;
        return expect(burst.transits[1].o.y[keys[0]]).toBe(center);
      });
      it('should increase angle and position delta on angleShift', function() {
        var burst1, burst2;
        burst1 = new Burst({
          radius: {
            120: 0
          },
          count: 2
        });
        burst2 = new Burst({
          radius: {
            120: 0
          },
          count: 2,
          randomAngle: .5
        });
        return expect(burst2.transits[1].o.angle).toBe(burst1.transits[1].o.angle + burst2.transits[1].props.angleShift);
      });
      it('should increase angle and position delta on angleShift for deltas', function() {
        var burst1, burst2, end1, end2, start1, start2;
        burst1 = new Burst({
          radius: {
            120: 0
          },
          count: 2,
          childOptions: {
            angle: {
              25: 50
            }
          }
        });
        burst2 = new Burst({
          radius: {
            120: 0
          },
          count: 2,
          randomAngle: 1,
          childOptions: {
            angle: {
              25: 50
            }
          }
        });
        start2 = burst2.transits[1].deltas.angle.start;
        end2 = burst2.transits[1].deltas.angle.start;
        start1 = burst1.transits[1].deltas.angle.start;
        end1 = burst1.transits[1].deltas.angle.start;
        expect(start2).toBe(start1 + burst2.transits[1].props.angleShift);
        return expect(end2).toBe(end1 + burst2.transits[1].props.angleShift);
      });
      it('should increase position', function() {
        var burst1, burst2;
        burst1 = new Burst({
          radius: 50,
          count: 2
        });
        burst2 = new Burst({
          radius: 50,
          count: 2,
          randomAngle: .5
        });
        expect(burst2.transits[1].o.x).not.toBe(burst1.transits[1].o.x);
        return expect(burst2.transits[1].o.y).not.toBe(burst1.transits[1].o.y);
      });
      return it('should keep degreeCnt not less than 1', function() {
        var burst;
        burst = new Burst({
          radius: {
            0: 120
          },
          degree: 270,
          count: 1
        });
        return expect(burst.degreeCnt).toBe(1);
      });
    });
    describe('createTween method ->', function() {
      it('should create tween', function() {
        var burst;
        burst = new Burst;
        return expect(burst.timeline).toBeDefined();
      });
      it('should add tweens to timeline', function() {
        var burst;
        burst = new Burst;
        return expect(burst.timeline.timelines.length).toBe(6);
      });
      it('should call startTween method', function() {
        var burst;
        burst = new Burst;
        spyOn(burst, 'startTween');
        burst.createTween();
        return expect(burst.startTween).toHaveBeenCalled();
      });
      return it('should not call startTween method if isRunLess', function() {
        var burst;
        burst = new Burst({
          isRunLess: true
        });
        spyOn(burst, 'startTween');
        burst.createTween();
        return expect(burst.startTween).not.toHaveBeenCalled();
      });
    });
    describe('onStart callback ->', function() {
      it('should run onStart callback', function(dfr) {
        var burst;
        burst = new Burst({
          isRunLess: true,
          onStart: function() {}
        });
        spyOn(burst.props, 'onStart');
        burst.run();
        return setTimeout(function() {
          expect(burst.props.onStart).toHaveBeenCalled();
          return dfr();
        }, 300);
      });
      return it('should have the scope of burst', function(dfr) {
        var burst, isRightScope;
        isRightScope = null;
        burst = new Burst({
          onStart: function() {
            return isRightScope = this instanceof Burst;
          }
        });
        return setTimeout(function() {
          expect(isRightScope).toBe(true);
          return dfr();
        }, 300);
      });
    });
    describe('onComplete callback ->', function() {
      it('should run onComplete callback', function(dfr) {
        var burst;
        t.removeAll();
        return burst = new Burst({
          duration: 20,
          onComplete: function() {
            expect(true).toBe(true);
            return dfr();
          }
        });
      });
      return it('should have the scope of burst', function(dfr) {
        var burst, isRightScope;
        t.removeAll();
        isRightScope = false;
        burst = new Burst({
          duration: 20,
          onComplete: function() {
            return isRightScope = this instanceof Burst;
          }
        });
        return setTimeout(function() {
          expect(isRightScope).toBe(true);
          return dfr();
        }, 300);
      });
    });
    describe('onUpdate callback ->', function() {
      t.removeAll();
      it('should run onUpdate callback', function(dfr) {
        var burst;
        burst = new Burst({
          isRunLess: true,
          duration: 20,
          onUpdate: function() {}
        });
        spyOn(burst, 'onUpdate');
        burst.run();
        return setTimeout(function() {
          expect(burst.onUpdate).toHaveBeenCalledWith(1);
          return dfr();
        }, 300);
      });
      return it('should have the scope of burst', function(dfr) {
        var burst, isRightScope;
        t.removeAll();
        isRightScope = false;
        burst = new Burst({
          duration: 20,
          onUpdate: function() {
            return isRightScope = this instanceof Burst;
          }
        });
        burst.run();
        return setTimeout((function() {
          expect(isRightScope).toBe(true);
          return dfr();
        }), 300);
      });
    });
    describe('then method ->', function() {
      return it('should call the h.error method', function() {
        var burst;
        burst = new Burst;
        spyOn(burst.h, 'error');
        burst.then();
        return expect(burst.h.error).toHaveBeenCalled();
      });
    });
    describe('run method ->', function() {
      it('should call extendDefaults', function() {
        var burst, o;
        burst = new Burst({
          radius: {
            20: 50
          }
        });
        spyOn(burst, 'extendDefaults');
        o = {
          radius: 10
        };
        burst.run(o);
        return expect(burst.extendDefaults).toHaveBeenCalledWith(o);
      });
      it('should not call extendDefaults if no obj passed', function() {
        var burst;
        burst = new Burst({
          radius: {
            20: 50
          }
        });
        spyOn(burst, 'extendDefaults');
        burst.run();
        return expect(burst.extendDefaults).not.toHaveBeenCalled();
      });
      it('should recieve new options', function() {
        var burst;
        burst = new Burst({
          radius: {
            20: 50
          }
        });
        burst.run({
          radius: 10
        });
        expect(burst.props.radius).toBe(10);
        return expect(burst.deltas.radius).not.toBeDefined();
      });
      it('should recieve new child options', function() {
        var burst;
        burst = new Burst({
          radius: {
            20: 50
          },
          duration: 400
        });
        burst.run({
          duration: 500,
          childOptions: {
            duration: [null, 1000, null]
          }
        });
        expect(burst.o.childOptions).toBeDefined();
        expect(burst.transits[0].o.duration).toBe(500);
        expect(burst.transits[1].o.duration).toBe(1000);
        return expect(burst.transits[2].o.duration).toBe(500);
      });
      it('should extend old childOptions', function() {
        var burst, newDuration;
        burst = new Burst({
          duration: 400,
          childOptions: {
            fill: 'deeppink'
          }
        });
        newDuration = [null, 1000, null];
        burst.run({
          duration: 500,
          childOptions: {
            duration: newDuration
          }
        });
        expect(burst.o.childOptions.fill).toBe('deeppink');
        return expect(burst.o.childOptions.duration).toBe(newDuration);
      });
      it('should call recalcDuration on tween', function() {
        var burst, newDuration;
        burst = new Burst({
          duration: 400,
          childOptions: {
            fill: 'deeppink'
          }
        });
        newDuration = [null, 1000, null];
        spyOn(burst.timeline, 'recalcDuration');
        burst.run({
          duration: 500,
          childOptions: {
            duration: newDuration
          }
        });
        return expect(burst.timeline.recalcDuration).toHaveBeenCalled();
      });
      it('should start timeline', function() {
        var burst;
        burst = new Burst;
        spyOn(burst, 'startTween');
        burst.run({
          duration: 500
        });
        return expect(burst.startTween).toHaveBeenCalled();
      });
      it('should call generateRandomAngle method if randomAngle was passed', function() {
        var burst;
        burst = new Burst({
          randomAngle: .1
        });
        spyOn(burst, 'generateRandomAngle');
        burst.run();
        return expect(burst.generateRandomAngle).toHaveBeenCalled();
      });
      it('should not call generateRandomAngle method', function() {
        var burst;
        burst = new Burst;
        spyOn(burst, 'generateRandomAngle');
        burst.run();
        return expect(burst.generateRandomAngle).not.toHaveBeenCalled();
      });
      it('should call generateRandomRadius method if randomAngle was passed', function() {
        var burst;
        burst = new Burst({
          randomRadius: .1
        });
        spyOn(burst, 'generateRandomRadius');
        burst.run();
        return expect(burst.generateRandomRadius).toHaveBeenCalled();
      });
      it('should not call generateRandomRadius method', function() {
        var burst;
        burst = new Burst;
        spyOn(burst, 'generateRandomRadius');
        burst.run();
        return expect(burst.generateRandomRadius).not.toHaveBeenCalled();
      });
      it('should warn if count was passed', function() {
        var burst;
        burst = new Burst;
        spyOn(burst.h, 'warn');
        burst.run({
          count: 10
        });
        return expect(burst.h.warn).toHaveBeenCalled();
      });
      it('should keep angles on run', function() {
        var burst;
        burst = new Burst({
          isRunLess: true
        });
        burst.run({
          count: 10
        });
        return expect(burst.transits[3].o.angle).toBe(306);
      });
      it('should recieve new angle options', function() {
        var burst;
        burst = new Burst({
          isRunLess: true
        });
        burst.run({
          childOptions: {
            angle: 90
          }
        });
        expect(burst.transits[3].o.angle).toBe(396);
        return expect(burst.transits[4].o.angle).toBe(468);
      });
      it('should recieve new angle delta options', function() {
        var burst;
        burst = new Burst({
          isRunLess: true
        });
        burst.run({
          childOptions: {
            angle: {
              90: 0
            }
          }
        });
        expect(burst.transits[3].o.angle[396]).toBe(306);
        return expect(burst.transits[4].o.angle[468]).toBe(378);
      });
      return it('should skip circular shape angle on isResetAngles', function() {
        var burst;
        burst = new Burst({
          isRunLess: true
        });
        burst.run({
          isResetAngles: true,
          childOptions: {
            angle: {
              90: 0
            }
          }
        });
        expect(burst.transits[3].o.angle[90]).toBe(0);
        return expect(burst.transits[4].o.angle[90]).toBe(0);
      });
    });
    describe('generateRandomAngle method ->', function() {
      it('should generate random angle based on randomness', function() {
        var angle, burst;
        burst = new Burst({
          randomAngle: .5
        });
        angle = burst.generateRandomAngle();
        expect(angle).toBeGreaterThan(-1);
        return expect(angle).not.toBeGreaterThan(180);
      });
      return it('should generate random angle based on randomness #2', function() {
        var angle, burst;
        burst = new Burst({
          randomAngle: .75
        });
        angle = burst.generateRandomAngle();
        expect(angle).toBeGreaterThan(-1);
        return expect(angle).not.toBeGreaterThan(270);
      });
    });
    describe('generateRandomRadius method ->', function() {
      return it('should generate random radius based on randomness', function() {
        var burst, radius;
        burst = new Burst({
          randomRadius: .75
        });
        radius = burst.generateRandomRadius();
        expect(radius).toBeGreaterThan(.24);
        return expect(radius).not.toBeGreaterThan(1);
      });
    });
    describe('draw method ->', function() {
      it('should not call drawEl method', function() {
        var burst;
        burst = new Burst;
        spyOn(burst, 'drawEl');
        burst.draw();
        return expect(burst.drawEl).toHaveBeenCalled();
      });
      return it('should call fillTransform method', function() {
        var burst;
        burst = new Burst({
          radius: 25
        });
        spyOn(burst, 'fillTransform');
        burst.draw();
        return expect(burst.fillTransform).toHaveBeenCalled();
      });
    });
    describe('getSideRadius method ->', function() {
      return it('should return the side\'s radius, radiusX and radiusY', function() {
        var burst, sides;
        burst = new Burst({
          radius: {
            5: 25
          },
          radiusX: {
            10: 20
          },
          radiusY: {
            30: 10
          }
        });
        sides = burst.getSideRadius('start');
        expect(sides.radius).toBe(5);
        expect(sides.radiusX).toBe(10);
        return expect(sides.radiusY).toBe(30);
      });
    });
    describe('getSidePoint method ->', function() {
      return it('should return the side\'s point', function() {
        var burst, point;
        burst = new Burst({
          radius: {
            5: 25
          },
          radiusX: {
            10: 20
          },
          radiusY: {
            30: 10
          }
        });
        point = burst.getSidePoint('start', 0);
        expect(point.x).toBeDefined();
        return expect(point.y).toBeDefined();
      });
    });
    describe('getRadiusByKey method ->', function() {
      return it('should return the key\'s radius', function() {
        var burst, radius, radiusX, radiusY;
        burst = new Burst({
          radius: {
            5: 25
          },
          radiusX: {
            10: 20
          },
          radiusY: {
            30: 20
          }
        });
        radius = burst.getRadiusByKey('radius', 'start');
        radiusX = burst.getRadiusByKey('radiusX', 'start');
        radiusY = burst.getRadiusByKey('radiusX', 'end');
        expect(radius).toBe(5);
        expect(radiusX).toBe(10);
        return expect(radiusY).toBe(20);
      });
    });
    return describe('getDeltaFromPoints method ->', function() {
      it('should return the delta', function() {
        var burst, delta;
        burst = new Burst;
        delta = burst.getDeltaFromPoints('x', {
          x: 10,
          y: 20
        }, {
          x: 20,
          y: 40
        });
        return expect(delta[10]).toBe(20);
      });
      return it('should return one value if start and end positions are equal', function() {
        var burst, delta;
        burst = new Burst;
        delta = burst.getDeltaFromPoints('x', {
          x: 10,
          y: 20
        }, {
          x: 10,
          y: 40
        });
        return expect(delta).toBe(10);
      });
    });
  });

}).call(this);
