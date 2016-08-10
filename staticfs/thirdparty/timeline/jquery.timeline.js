/*
*插件中的this指向当前jquery对象，并不是一个dom对象
*/
;(function($){
	//定义构造函数
	var BlogTime = function(obj,options){  //默认属性
		var defaults = {
			size:'3',  //每栏显示的默认最大篇数
			layzeHeight:10,  //预加载高度
			leftCont:$('.leftnav'),  //时间轴
			container:$('.content'),
			template:'<div></div>',
			rightCont:$('.blogs'),  //具体内容展示区
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
				if(that.options.iScroll){
					that.scrollEvent();
				}  
			})
		},
		scrollEvent:function(event){
			//鼠标滚动事件，判断是否开始进行加载，加载栏数、篇数、包括render、事件绑定(去掉)
			//事件执行函数
			var that = this;
			if($(window).scrollTop()+$(window).height()+this.options.layzeHeight >$(document).height()){  //预100高度加载
				if(this.options.getblogs){	
					this.options.iScroll = false;
					this.loadBlogs(); 	//获取文章列表
				}	
			}

		},
		monthDetail:function(){
			//显示当前年／月包含的具体月／日
			// 监听滚动事件
		},
		loadBlogs:function(callback){
			//加载博客
			var that = this;
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
					data = data.data;
					that.parseDate(data);
					for(var i =0 ;i<data.length;i++){
						that.drawBlogs(data[i]);	
					}
					that.options.iScroll = true;
					// that.options.iPage +=1;
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
			var options = this.options ;
			var template = options.template;
			_.each(options.Date,function(date){
				if(date.id == data.id){
					// var _monthCon = options.container.find("[data-year="+date.year+"]").data()
					if(options.container.find("[data-year="+date.year+"]").length!=0){
						var _year = options.container.find("[data-year="+date.year+"]");
						var _month = _.find(_year,function(Y){
							return Y.data('month') == date.month;
						});
						if(_.isUndefined(_month)){
							var ol = $("<ol data-month='"+date.month+"data-year="+date.year+"'></ol>");
							options.container.append(ol);
						}else var ol = $(_month[0]);

					}else{
						var ol = $("<ol data-month='"+date.month+"data-year="+date.year+"'></ol>");
						options.container.append(ol);
					}
					var t = _.template(template,{thumb:data.thumb,title:data.title,time:data.updated_at,read:data.hits,month:date.month});
					ol.append(t);
				}
			})
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
				 	options.leftCont.find("[data-year="+date.year+"]").find('ul:first').append("<li class='active' data-month = '"+date.month+"'>"+date.month+"月</li>");
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


