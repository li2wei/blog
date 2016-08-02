/*
*插件中的this指向当前jquery对象，并不是一个dom对象
*/
;(function($){
	//定义构造函数
	var BlogTime = function(obj,options){  //默认属性
		var defaults = {
			size:'3',  //每栏显示的默认最大篇数
			layzeHeight:100,  //预加载高度
			leftCont:$('.leftnav'),  //时间轴
			container:$('.content'),
			template:'<div></div>',
			rightCont:$('.blogs'),  //具体内容展示区
			// getblogs:  获取文章列表接口
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
		mouseEvent:function(){
			//主要是滚动
			//包括懒加载和侧边栏的滚动
			var that = this;
			$(window).on('scroll',function(){
				that.scrollEvent();
			})
		},
		scrollEvent:function(event){
			//鼠标滚动事件，判断是否开始进行加载，加载栏数、篇数、包括render、事件绑定(去掉)
			//滚动事件执行函数
			var that = this;
			if($(window).scrollTop()+$(window).height()+this.options.layzeHeight >$(document).height()){  //预100高度加载
				if(this.options.getblogs){	
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
			var getArticles;
			function getArticles(data){  //使用jsonp跨域请求数据，需要在ajax请求的外面定义一个函数名与后台返回函数名相同的函数，以对数据进行处理
				data = JSON.parse(that.base64decode(data));
				for(var i =0 ;i<data.length;i++){
					that.blogShows(data[i]);	
				}
			}
			$.ajax({
				type:'GET',
				url:that.options.getblogs,
				crossDomain: true,
				dataType:'jsonp',
				jsonpCallback:'getArticles',
				data:null,
				contentType: "application/json;utf-8", 
				success:function(data){
					getArticles(data);
				},
				error:function(error){
					console.log(error);
				}
			});
		},
		renderTemplate:function(template,data){  //待优化
			//自定义模版引擎
			//<%%> 模版的逻辑表达式
			//<%=%> 输出表达式 同_.underscore里面的值
			var reg =  /<%=\s*([^%>]+\S)\s*%>/;
			var match;
			//匹配不到则为null,循环则停止
	        while(match = reg.exec(template)){//exec匹配字符串中的正则表达式
	        	if(data[match[1]]!='undefined'){
	        		//替换
		         	template = template.replace(match[0],data[match[1]]);	
	        	}
	        	// else {}
		         
		      }
		      return template;//返回渲染值
		},
		blogsEvent:function(){
			//每篇博客上的事件绑定
		},
		blogShows:function(data){
			//统一的博客展示模版
			var that = this;
			var template = this.options.template;
			var t = that.renderTemplate(template,{thumb:data.thumb,title:data.title,time:data.updated_at,read:data.hits});
			this.options.container.append(t);
		},
		redrawTime:function(){
			//重绘左侧的时间轴
		},
		parseData:function(data){  //data: 2015-09-10 08:24:44
			//解析数据,包括年、月、日
			var reg = /\b\d{4}[-]?\d{2}[-]?\d{2}/g;   //获取年月日的正则
			if(!this.options.Data) this.options.Data ={};  //存放解析后的数据
			for(var i=0;i<data.length;i++){
				var _data = data[i];
			
				var date = _data.updated_at.match(reg);  //2015-09-10
				var year = date[0].match(/\b\d{4}/g);  //2015
				var month = date[0].split('-')[1];   //09
				var day = date[0].split('-')[2];   //10
				// this.options.Data[i]
			}
		},
		base64decode:function(str){
			var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
		    var c1, c2, c3, c4;
		    var i, len, out;
		    len = str.length;
		    i = 0;
		    out = "";
		    while (i < len) {
		        /* c1 */
		        do {
		            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		        }
		        while (i < len && c1 == -1);
		        if (c1 == -1) 
		            break;
		        /* c2 */
		        do {
		            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		        }
		        while (i < len && c2 == -1);
		        if (c2 == -1) 
		            break;
		        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		        /* c3 */
		        do {
		            c3 = str.charCodeAt(i++) & 0xff;
		            if (c3 == 61) 
		                return out;
		            c3 = base64DecodeChars[c3];
		        }
		        while (i < len && c3 == -1);
		        if (c3 == -1) 
		            break;
		        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		        /* c4 */
		        do {
		            c4 = str.charCodeAt(i++) & 0xff;
		            if (c4 == 61) 
		                return out;
		            c4 = base64DecodeChars[c4];
		        }
		        while (i < len && c4 == -1);
		        if (c4 == -1) 
		            break;
		        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		    }
		    return out;
		}
	};
	$.fn.timeline = function(options){
		// options = $.extend({},defaults,options);
		var timeline = new BlogTime(this,options);
		return timeline;
	}
})(jQuery);