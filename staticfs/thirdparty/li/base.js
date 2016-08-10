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
		    // return out;
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