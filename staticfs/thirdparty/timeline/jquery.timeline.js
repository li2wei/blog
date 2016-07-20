/*
*插件中的this指向当前jquery对象，并不是一个dom对象
*/
;(function($){
	//定义构造函数
	var BlogTime = function(obj,options){  //默认属性
		var defaults = {
			size:'3',  //每栏显示的默认最大篇数
			leftCont:$('.leftnav'),  //时间轴
			// rightCont:$('.blogs')  //具体内容展示区
		}
		this.obj = obj;		//当前对象
		this.options = $.extend({},defaults,options);
		// this.init();
	}
	BlogTime.prototype = {
		init:function(){
			this.judgeTerminal();
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
		mouseEvent:function(){
			//主要是滚动
			//包括懒加载和侧边栏的滚动
		},
		mouseScroll:function(){
			//鼠标滚动事件，判断是否开始进行加载，加载栏数、篇数、包括render、事件绑定
		},
		monthDetail:function(){
			//显示当前年／月包含的具体月／日
			// 监听滚动事件
		},
		loadBlogs:function(){
			//加载博客
		},
		renderBlog:function(){

		},
		blogsEvent:function(){
			//每篇博客上的事件绑定
		},
		blogTemplate:function(template,data){
			//统一的博客展示模版
		}
	};
	$.fn.timeline = function(options){
		// options = $.extend({},defaults,options);
		var timeline = new BlogTime(this,options);
		// return this.each(function(){
		// 	methods.init();
		// });
		return timeline;
	}
})(jQuery);