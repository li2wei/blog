/*
*插件中的this指向当前jquery对象，并不是一个dom对象
*/
;(function($){
	var defaults = {  //默认属性
		size:'3',  //每栏显示的默认最大篇数
		leftCont:$('.leftnav')  //时间轴
		rightCont:$('.blogs')  //具体内容展示区
	};
	var method = {
		init:function(){

		},
		judgeTerminal:function(){
			//web端和移动端不同的展现方式  type类型
		}
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
		options = $.extend({},defaults,options);

	}
})(jQuery);