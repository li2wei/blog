/*
*插件中的this指向当前jquery对象，并不是一个dom对象
*/
;(function($){
	//定义构造函数
	var BlogTime = function(obj,options){  //默认属性
		var defaults = {
			size:'3',  //每栏显示的默认最大篇数
			layzeHeight:200,  //预加载高度
			leftCont:$('.leftnav'),  //时间轴
			container:$('.content'),
			template:'<div></div>',
			rightCont:$('.blogs'),  //具体内容展示区
			topbar:473,
			// getblogs:  获取文章列表接口
			// timeTem:
			iScroll:true,   //是否可以执行滚动事件,防止一次滚动多次加载
			iPage:1,
			iSize:3
		}
		this.obj = obj;		//当前对象
		this.options = $.extend({},defaults,options);
		// this.init();
	}
	BlogTime.prototype = {
		init:function(){
			this.terminal = this.judgeTerminal();
			this.loadBlogs();
			this.mouseEvent();
		},
		judgeTerminal:function(){
			//web端和移动端不同的展现方式  type类型
			// console.log('judge');
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
 
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                // location.href = "Mobile/login.html";
                return 'mobile';
            } else {
 				return 'pc';
            }
		},
		mouseEvent:function(){  //鼠标事件
			//主要是滚动
			//包括懒加载和侧边栏的滚动
			var that = this;
			$(window).on('scroll',function(){
				var  scrollTop = $(window).scrollTop();  
				if(that.options.iScroll){   //加载博客
					that.scrollEvent();	
				}
				console.log(this.time);
			})
		},
		scrollEvent:function(event){
			//鼠标滚动事件，判断是否开始进行加载，加载栏数、篇数、包括render   只包括加载 
			//事件执行函数
			var that = this;
			var scrollTop = $(window).scrollTop();   //重排
			// $('body').css('pointer-events','none');   //pointer-events禁止鼠标事件，可以提高滚动时的性能，达到60fps(每秒60次)？？？？？？
			//无限加载
			if(scrollTop+$(window).height()+this.options.layzeHeight + this.options.topbar>= $(document).height()){  //预100高度加载
				// console.log("scrollTop:"+$(window).scrollTop(),"windowheight:"+$(window).height(),"left:"+(parseInt($(window).scrollTop())+parseInt($(window).height())),"documentheight:"+$(document).height() );
				if(this.options.getblogs){	
					this.options.iScroll = false;
					this.loadBlogs();
					// window.requestAnimationFrame(this.loadBlogs); 	//获取文章列表  requestanimationfram提高性能和精确度，可控度下降
				}	
			}
		},
		monthDetail:function(){
			//显示当前年／月包含的具体月／日
			// 监听滚动事件
		},
		loadBlogs:function(){
			//加载博客
			var that = this;
			// var url = that.options.getblogs+'?size='+ that.options.iSize+'&page='+that.options.iPage;
			// window.getArticles = function(data){}  //使用jsonp跨域请求数据，需要在ajax请求的外面定义一个函数名与后台返回函数名相同的函数，以对数据进行处理
			$.ajax({
				type:'GET',
				url:that.options.getblogs+'?size='+ this.options.iSize+'&page='+this.options.iPage,
				// crossDomain: true,
				// async:false,
				// dataType:'jsonp',
				// jsonpCallback:'getArticles',
				data:null,
				// contentType: "application/json;utf-8", 
				success:function(data){
					var _data = data.data;
					if(_data.length!=0){
						that.parseDate(_data);
						for(var i =0 ;i<_data.length;i++){
							that.drawBlogs(_data[i]);	
						}
						that.options.iScroll = true;
						that.options.iPage +=1;	
					}else{
						//提示没有更多了
					}
				},
				error:function(error){
					console.log(error);
				}
			});
		},
		blogsEvent:function(){
			//每篇博客上的事件绑定
		},
		drawBlogs:function(data){
			//统一的博客展示模版
			var docHeight,ol;
			var that = this;
			var options = this.options;
			var template = options.template;
			_.each(options.Date,function(date){
				if(date.id == data.id){
					//添加月份的ol
					//后续完善
					if(options.container.find("[data-year="+date.year+"]").length!=0){
						var _year = options.container.find("[data-year="+date.year+"]");
						var _month = _.find(_year,function(Y){
							return $(Y).data('month') == date.month;
						});
						if(_.isUndefined(_month)){
							ol = that.addRightBlog(date);
						}else ol = $(_month);
					}else{
						ol = that.addRightBlog(date);
					}
					var t = _.template(template,{thumb:data.thumb,title:data.title,time:data.updated_at,read:data.hits,day:date.day});
					ol.append(t);
				}
			});
			docHeight = $(document).height();
			options.rightCont.find(".line").css('height',docHeight+'px');
		},
		addRightBlog:function(date){   //添加月博客模块
			var ol,cicle,_top;
			var that = this;
			ol = $("<ol data-month='"+date.month+"' data-year='"+date.year+"'></ol>");
			this.options.container.append(ol);
			_top = ol.offset().top;
			cicle = "<span style='top:"+(_top+50)+"px' data-year='"+date.year+"' data-month='"+date.month+"'><i></i></span>";
			this.options.rightCont.find('.line').append(cicle);
			this.time = setInterval(that.circleEvent($(cicle)),1000);
			return ol;
		},
		circleEvent:function(obj){
			//为原点绑定事件
			//显示正确的年月时间轴  当某个月到达一点，刷新时间轴
			var scrollTop = $(window).scrollTop();
			var offsetTop = $(obj).offset().top;
			var top2Window = offsetTop - scrollTop;  //距离窗口顶部的距离	
			if(top2Window <= 100){  //更新时间轴
				var year = obj.data('year');
				var month = obj.data('month');
				var _target = this.options.leftCont.find("li[data-year='"+year+"']");
				this.options.leftCont.find('li').removeClass('active isactive');
				_target.addClass("isactive");
				_target.find("li[data-month='"+month+"']").addClass("active");
			}	
		},
		redrawTime:function(){
			//重绘左侧的时间轴   slideToggle(隐藏切换)
			var options = this.options ;
			var timeT = options.timeTem;
			_.each(options.Date,function(date){
				if(options.leftCont.find("[data-year="+date.year+"]").length ==0){  //添加年份
					var t = _.template(timeT,{year:date.year,month:date.month});
				 	options.leftCont.find('ul:first').append(t);
				 }else if(options.leftCont.find("[data-year="+date.year+"]").find("[data-month="+date.month+"]").length == 0){  //添加月份
				 	var _month = "<li data-month = '"+date.month+"'>"+date.month+"月</li>";
				 	options.leftCont.find("[data-year="+date.year+"]").find('ul:first').append(_month);
				 }
			});
		},
		parseDate:function(data){
			data = _.map(data,function(_d){  //日期数据
				return _.pick(_d,['updated_at','id']);
			});  
			//解析数据,包括年、月、日   2015-09-10 08:24:44
			var reg = /\b\d{4}[-]?\d{2}[-]?\d{2}/g;   //获取年月日的正则
			// if(!this.options.Date) this.options.Date =[];  //存放解析后的数据
			this.options.Date =[];
			for(var i=0;i<data.length;i++){
				var date = data[i].updated_at.match(reg);  //2015-09-10
				var year = Number(date[0].match(/\b\d{4}/g));  //2015
				var month = Number(date[0].split('-')[1]);   //09
				var day = Number(date[0].split('-')[2]);   //10
				this.options.Date.push({
					id: data[i].id,
					year: year,
					month: month,
					day: day	
				});
			}
			this.redrawTime();
		}
	};
	$.fn.timeline = function(options){
		var timeline = new BlogTime(this,options);
		return timeline;
	}
})(jQuery);


