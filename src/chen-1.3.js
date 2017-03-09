/*chen.js是一个开源免费的javascript库,意在使web开发更快捷，更高效。目前包含dom节点选择，dom节点操作，事件操作，浏览器检测，ajax，动画，存储，工具函数，canvas等功能。
作者：陈浩
版本：1.3
项目地址：https://github.com/chenhaozhi/chen.js
QQ群:535484409
微博:http://weibo.com/u/5840549439
* */
;(function(){
//设置标识符，前台调用
window.$ = window.Chen = function $(_this){
	return new Chen(_this);
};

//基础类库
function Chen(args){
	//创建数组，用来保存节点和节点数组
	this.elements = [];

	Selector.call(this);
	ChenClient.call(this);
	SelectNode.call(this);
	HandelNode.call(this);
	ChenEvent.call(this);
	State.call(this);
	Transition.call(this);
	Canvas.call(this);
	Storage.call(this);

	switch(typeof args){
		case 'function':
			domLoaded(args);
			break;
		case 'string':
			this.selector(args);
			break;
		case 'object':
			if(args != undefined){
				this.elements[0] = args;
			}
			break;
	}
	
}

//插件入口
Chen.prototype.extend = function(name,callback){
	Chen.prototype.name = callback;
};
//each 遍历
Chen.prototype.each = function (fn) {
   for(var i = 0, n = this.elements[i].length; i < n; i++){
       fn.call(this.elements[i], i, this.elements[i]);
   }
   return this;
};
//自定义工具函数扩展
Chen.enlarge = function(obj){
	for(var i in obj){
		if(!obj.hasOwnProperty(i)) continue;
		$[i] = obj[i];
	}
};
//自定义方法扩展
Chen.fns = {};
Chen.fns.enlarge = function(obj){
	for(var i in obj){
		if(!obj.hasOwnProperty(i)) continue;
		Chen.prototype[i] = obj[i];
	}
};

Chen.enlarge({
	//字符串相关
	trim:trim,
	atrim:atrim,
	ltrim:ltrim,
	rtrim:rtrim,
    hasUp:hasUp,
    hasLow:hasLow,
    hasNum:hasNum,

	//类型检测
	type: type,
	isFunction:isFunction,
	isArray: isArray,
	isString: isString,
	isObject: isObject,
	toArray: toArray,
	inArray: inArray,
	joinArray: joinArray,

	isEqual:isEqual,
	compare: compare,
	repeatObj: repeatObj,
	// objToMap: objToMap,
	// mapToObj: mapToObj,

	//浏览器，页面相关
	page:page,

	//存储
	cookie: cookie,
	local: local,
	session: session,

	//ajax
	ajax:ajax,
	jsonp: jsonp
});

//浏览器检测
function ChenClient(){
	var ua = navigator.userAgent;

	//引擎
	this.engine = {
		trident: false,
		edge: false,
		gecko: false,
		webkit: false,
		opera: false,
		//引擎版本
		version: 0,
		//引擎通用名称
		name: null
	};

	//浏览器
	this.browser = {
		ie: false,
		edge: false,
		firefox: false,
		chrome: false,
		safari: false,
		opera: false,
		//浏览器版本
		version: 0,
		//浏览器通用名称
		name: null
	};

	//检测引擎与浏览器
	if(/Edge\/(\S)/.test(ua)){    //Edge引擎
		this.engine.edge = this.browser.edge = true;
    	this.engine.version = this.browser.version = RegExp.$1;
    	this.engine.name = this.browser.name = 'Edge';
	}else if(/OPR\/(\S+)/.test(ua)){   //opera引擎
		this.engine.opera = this.browser.opera = true;
		this.engine.version = this.browser.version = RegExp.$1;
        this.engine.name = this.browser.name = 'opera';
	}else if(/AppleWebKit\/(\S)/g.test(ua)){    //webkit引擎
		this.engine.webkit = true;
		this.engine.version = RegExp.$1;
        this.engine.name = 'AppleWebKit';
        if(/Version\/(\S+)/.test(ua)){
        	this.browser.safari = true;
        	this.browser.version = RegExp.$1;
        	this.browser.name = 'Safari';
        }else if(/Chrome\/(\S+)/.test(ua)){
        	this.browser.chrome = true;
        	this.browser.version = RegExp.$1;
        	this.browser.name = 'Chrome';
        }
	}else if(/rv:([^\)]+)\) Gecko\/\d{8}/g.test(ua)){   //gecko引擎
		this.engine.gecko = true;
		this.engine.version = RegExp.$1;
        this.engine.name = 'Gecko';
        if(/Firefox\/(\S+)/.test(ua)){
            this.browser.firefox = true;
            this.browser.version = RegExp.$1;
            this.browser.name = 'Firefox';
        }
	}else if(/MSIE ([^;]+)/.test(ua)){   //Trident引擎
        this.browser.ie = true;
        this.browser.version = RegExp.$1;
        this.browser.name = 'Internet Explorer';
        if(/Trident\/([0-9]|\.+)/.test(ua)){
        	this.engine.trident = true;
			this.engine.version = RegExp.$1;
            this.engine.name = 'Trident';
        }
    }

    return {
    	engine: this.engine,
    	browser: this.browser
    }
}

//获取id
function getId(id){
	return document.getElementById(id);
}
//获取className
function getClass(className,parentName) {
	var node = null;
	var temps = [];
	if(parentName != undefined){
		node = parentName;
	}else {
		node = document;
	}
	var names = node.getElementsByTagName('*');
	for(var i=0; i<names.length; i++){
		if(names[i].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)','g'))){
			temps.push(names[i]);
		}
	}
	return temps;
}
//获取tag标签
function getTag(tag,parentName) {
	var node = null;
	var temps = [];
	if(parentName != undefined){
		node = parentName;
	}else if(arguments.length == 1){
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
	for(var i=0; i<tags.length; i++) {
		temps.push(tags[i]);
	}
	return temps;
}
//获取name节点
function getNames(name, parentName) {
    var node = null;
    var temps = [];
    if(parentName != undefined){
        node = parentName;
    }else if(arguments.length == 1){
        node = document;
    }
    var tags = node.getElementsByTagName(name);
    for(var i=0; i<tags.length; i++) {
        temps.push(tags[i]);
    }
    return temps;
}
//获取属性，包含等式
function getAttr(pNodes,attr,value,fix){
	var arr = [],temps=null;
	if(pNodes == document){
		temps = document.getElementsByTagName('*');
	}else{
		temps = pNodes;
	}
	var matchAttr = [];  //临时的匹配数组
	for(var i=0; i<temps.length; i++){
		if(arguments.length == 2){
			if(temps[i].getAttribute(attr)){
				arr.push(temps[i]);
			}
		}else if(arguments.length == 3){
			if(temps[i].getAttribute(attr) == value){
				arr.push(temps[i]);
			}
		}else if((arguments.length == 4)){
			if(temps[i].getAttribute(attr)){
				matchAttr.push(temps[i]);
				for(var j=0; j<matchAttr.length; j++){
					switch(fix){
						case '^':
							if(matchAttr[j].getAttribute(attr).match(new RegExp(('^')+value,'g'))){
								arr.push(matchAttr[j]);
							}	
							break;
						case '$':
							if(matchAttr[j].getAttribute(attr).match(new RegExp(value+('$'),'g'))){
								arr.push(matchAttr[j]);
							}
							break;
						case '*':
							if(matchAttr[j].getAttribute(attr).match(new RegExp(('^.*')+value+('.*$'),'g'))){
								arr.push(matchAttr[j]);
							}
							break;
						case '!':
							if(!matchAttr[j].getAttribute(attr).match(new RegExp(('^')+value+('$'),'g'))){
								arr.push(matchAttr[j]);
							}
							break;
					}
				}
			}
		}
	}
	return arr;
}

//元素选择器
function Selector(){
	//选取单独的参数，id,class,tag
	function selectOnly(args,parentElems){
		var elems = [];
		parentElems = parentElems?parentElems:document;
		switch(args.charAt(0)){
			case '#':
				elems.push(getId(args.substring(1)));
				break;
			case '.':
				elems = getClass(args.substring(1),parentElems);
				break;
			default :
				elems = getTag(args,parentElems);
		}
		return elems;
	}
	//选取带有空格的参数
	function selectSpace(args){
		var elements = args.split(' '),
			childElements = [],
			node = [],
			temps = [];
		for (var i = 0; i < elements.length; i ++) {
			if (node.length == 0) node.push(document);		//如果默认没有父节点，就把document放入
			if(elements[i].match(/(:)/g)){
				childElements = [];
				for (var j = 0; j < node.length; j ++) {
					temps = selectColon(elements[i], node[j]);
					for (var k = 0; k < temps.length; k ++) {
						childElements.push(temps[k]);
					}
				}
				node = childElements;
			}else if(elements[i].match(/(\[)/g)){
				childElements = [];
				for(var m=0; m<node.length; m++){
					temps = selectAttr(elements[i],node[m]);
					for(var n=0; n<temps.length;n++){
						childElements.push(temps[n]);
					}
				}
				node = childElements;
			}else{
				switch (elements[i].charAt(0)) {
					case '#' :
						childElements = [];
						childElements.push(getId(elements[i].substring(1)));
						node = childElements;
						break;
					case '.' :
						childElements = [];
						for (var o = 0; o < node.length; o ++) {
							temps = getClass(elements[i].substring(1), node[o]);
							for (var p = 0; p < temps.length; p ++) {
								childElements.push(temps[p]);
							}
						}
						node = childElements;
						break;
					default :
						childElements = [];
						for (var u = 0; u < node.length; u ++) {
							temps = getTag(elements[i], node[u]);
							for (var v = 0; v < temps.length; v ++) {
								childElements.push(temps[v]);
							}
						}
						node = childElements;
				}
			}
		}
		return childElements;
	}
	//选取带有冒号的参数
	function selectColon(args,parentNodes){
		parentNodes = parentNodes?parentNodes:document;
		var elems = args.split(':');
		var prevModel = elems[0];
		var oldSelectModel = elems[1];
		var selectModel = elems[1].match(/first|last|even|odd|eq|lt|nlt|gt|ngt|empty|input|button|checkbox|color|date|datetime|datetime-local|email|file|hidden|image|month|number|password|range|radio|reset|search|submit|text|time|url|week/g).toString();
		// var attrModel = elems[1].match(/checked|selected|disable|readonly|placeholder|draggle|contenteditable|list/).toString();
		var childElems = [];
		var sel = [], i= 0, j= 0, item=0;
		switch(selectModel){
			case 'first':
				sel = selectOnly(prevModel,parentNodes);
				childElems.push(sel[0]);
				break;
			case 'last':
				sel = selectOnly(prevModel,parentNodes);
				childElems.push(sel[sel.length-1]);
				break;
			case 'even':   //偶数
				sel = selectOnly(prevModel,parentNodes);
				for(; i<sel.length; i++){
					if(i%2 == 0){
						childElems.push(sel[i]);
					}
				}
				break;
			case 'odd':   //奇数
				sel = selectOnly(prevModel,parentNodes);
				for(; i<sel.length; i++){
					if(i%2 != 0){
						childElems.push(sel[i]);
					}
				}
				break;
			case 'empty':    //节点内容为空
				sel = selectOnly(prevModel,parentNodes);
				for(; i<sel.length; i++){
					if(sel[i].innerHTML == ''){
						childElems.push(sel[i]);
					}
				}
				break;
			case 'eq':       //节点索引
				item = parseInt(oldSelectModel.match(/\d/g).toString());
				sel = selectOnly(prevModel,parentNodes);
				childElems.push(sel[item]);
				break;
			case 'lt':       //小于某个节点
				item = parseInt(oldSelectModel.match(/\d/g).toString());
				sel = selectOnly(prevModel,parentNodes);
				for(; i<item; i++){
					childElems.push(sel[i]);
				}
				break;
			case 'nlt':      //不小于某个节点
				item = parseInt(oldSelectModel.match(/\d/g).toString());
				sel = selectOnly(prevModel,parentNodes);
				for(; i<=item; i++){
					childElems.push(sel[i]);
				}
				break;
			case 'gt':       //大于某个节点
				item = parseInt(oldSelectModel.match(/\d/g).toString());
				sel = selectOnly(prevModel,parentNodes);
				for(i=item+1; i<sel.length; i++){
					childElems.push(sel[i]);
				}
				break;
			case 'ngt':      //不大于某个节点
				item = parseInt(oldSelectModel.match(/\d/g).toString());
				sel = selectOnly(prevModel,parentNodes);
				for(i=item; i<sel.length; i++){
					childElems.push(sel[i]);
				}
				break;
			default:    //表单元素input类型
				sel = getTag(selectModel);
				for(; j<sel.length; j++){
					childElems.push(sel[j]);
				}
				break;
		}
		return childElems;
	}
	//选取带有[attr=val]的属性选择的参数
	function selectAttr(args,parentNodes){
		parentNodes = parentNodes?parentNodes:document;
		var arr = [],arg,attr,value,fix,c1,c2,pre;
		if(/^\[[^=]+]$/.test(args)){    //1,只有单纯的属性器，如[type]
			arr = getAttr(parentNodes,args.substring(1,args.length-1));
		}else if(/^\[[^=\^\$\*!]+=[^=]+]$/g.test(args)){   //2，属性,等号[title=app]
			arg = args.substring(1,args.length-1).split('=');
			arr = getAttr(parentNodes,arg[0], arg[1]);
		}else if(/^\[([^=]+)(\^|\$|\*|!)(=)([^=]+)]$/g.test(args)){   //3，属性,选择符,等号
			attr = RegExp.$1;
			value=RegExp.$4;
			fix=RegExp.$2;
			arr = getAttr(parentNodes,attr, value, fix);
		}else {   //4，标签加属性选择
			c1 = args.split('[')[0];
			c2 = '['+args.split('[')[1];
			pre = selectOnly(c1);
			if(/^\[[^=]+]$/.test(c2)){    //1,只有单纯的属性器，如[type]
				arr = getAttr(pre,c2.substring(1,c2.length-1));
			}else if(/^\[[^=\^\$\*!]+=[^=]+]$/g.test(c2)){   //2，属性,等号[title=app]
				c2 = c2.substring(1,c2.length-1).split('=');
				arr = getAttr(pre,c2[0], c2[1]);
			}else if(/^\[([^=]+)(\^|\$|\*|!)(=)([^=]+)]$/g.test(c2)){   //3，属性,选择符,等号
				attr = RegExp.$1;
				value=RegExp.$4;
				fix=RegExp.$2;
				arr = getAttr(pre,attr, value, fix);
			}
		}
		return arr;
	}
	this.selector = function(args){
		//args = trim(args);  //去除选择符的左右空格
		if(args.indexOf(' ') != -1){    //元素选择，有空格
			this.elements = selectSpace(args);
		}else if(args.indexOf(' ') == -1){   //元素选择，无空格
			if(args.match(/(:)|(\[)/g)){
				if(args.match(/:/g)){    //带':'的选择器
					this.elements = selectColon(args);
				}else if(args.match(/\[/g)){
					this.elements = selectAttr(args);
				}
			}else if(!args.match(/(:)|(\[)/g)){   //单纯的元素选择器，'.','#',tagName
				this.elements = selectOnly(args);
			}
		}
	};
}

/*获取dom节点对象开始
*get,eq,index,gt,ngt,nlt,lt,between,notIn,first,last,next,nextAll,prev,prevAll,sibling,parent,find,length
*新方法：between(start,end)从start到end的节点,notIn(start,end)从start到end的节点
*random()节点位置随机
*/
function SelectNode(){
	function s(elem){
		var index = 0,
			temps = [],
			cNodes = elem[0].parentNode.children;
		for(var i=0; i<cNodes.length; i++){
			temps.push(cNodes[i]);
			if(elem[0] == cNodes[i]) index = i;
		}
		return {
			temps:temps,
			index:index
		};
	}
	//获取节点的当前下标
	this.index = function(){
		var cNodes = this.elements[0].parentNode.children;
		for(var i=0; i<cNodes.length; i++){
			if(this.elements[0] == cNodes[i]) return i;
		}
	};
	//获取某个节点，返回当前对象
	this.get = function(item){
		item = parseInt(item);
		return this.elements[item];
	};
	//获取节点数组中的某一个,返回全局对象
	this.eq = function(item) {
		item = parseInt(item);
		var element = this.elements[item];
		this.elements = [];
		this.elements[0] = element;
		return this;
	};
	//从start到end之间的节点
	this.between = function(start, end){
		this.elements = this.elements.slice(start, end+1);
		return this;
	};
	//从start到end之外的节点
	this.notIn = function(start, end){
		this.elements.splice(start, end-1);
		return this;
	};
	//随机获取节点位置
	this.random = function(){
		var index = Math.floor(Math.random()*this.elements.length);
		var element = this.elements[index];
		this.elements = [];
		this.elements[0] = element;
		return this;
	};
	//获取第一个节点
	this.first = function(){
		var first = this.elements[0];
		this.elements = [];
		this.elements[0] = first;
		return this;
	};
	//获取最后一个节点
	this.last = function(){
		var last = this.elements[this.elements.length-1];
		this.elements = [];
		this.elements[0] = last;
		return this;
	};
	//获取上一个节点
	this.prev = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i] = this.elements[i].previousSibling;
			if(this.elements[i] == null) throw new Error('无法获取下一个同级节点！');
			if(this.elements[i].nodeType == 3) this.prev();
		}
		return this;
	};
	//获取元素之后的所有同胞元素
	this.prevAll = function(){
		this.elements = s(this.elements).temps.slice(0,s(this.elements).index);
		return this;
	};
	//获取下一个节点
	this.next = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i] = this.elements[i].nextSibling;
			if(this.elements[i] == null) throw new Error('无法获取下一个同级节点！');
			if(this.elements[i].nodeType == 3) this.next();
		}
		return this;
	};
	//获取元素之后的所有同胞元素
	this.nextAll = function(){
		this.elements = s(this.elements).temps.slice(s(this.elements).index+1);
		return this;
	};
	//获取兄弟节点
	this.siblings = function(){
		var t = s(this.elements);
		t.temps.splice(t.index,1);
		this.elements = t.temps;
		return this;
	};
	//获得父级节点
	this.parent = function(){
		var temps = [];
		for(var i=0; i<this.elements.length; i++){
			temps.push(this.elements[i].parentNode);
		}
		this.elements = temps;
		return this;
	};
	//获取子节点
	this.children = function(){
		var temps = [];
		for(var i=0; i<this.elements.length; i++){
			var e = removeWhiteNodes(this.elements[i].childNodes);
			for(var j=0; j< e.length; j++){
				temps.push(e[j]);
			}
		}
		this.elements = temps;
		return this;
	};
	//小于某个节点
	this.lt = function(item){
		item = parseInt(item);
		this.elements.splice(item, this.elements.length);
		return this;
	};
	//大于某个节点
	this.gt = function(item) {
		this.elements.splice(0, parseInt(item));
		return this;
	};
	//查询某一个节点
	this.find = function(elem){
		var children = [], all=[], i= 0;
		for(; i<this.elements.length; i++){
			switch(elem.charAt(0)){
				case '#':
					children.push(document.getElementById(elem.substring(1)));
					break;
				case '.':
					var k=0;
					all = this.elements[i].getElementsByTagName('*');
					for(; k<all.length; k++){
						if(all[k].className == elem.substring(1)){
							children.push(all[k]);
						}
					}
					break;
				default:
					var l = 0;
					all = this.elements[i].getElementsByTagName(elem);
					for(; l<all.length; l++){
						children.push(all[l]);
					}
					break;
			}
		}
		this.elements = children; 
		return this;
	};
	//获取一组节点对象的长度
	this.length = function(){
		return this.elements.length;
	}
}
//获取dom节点对象结束

/*dom节点操作对象开始
样式设置，css,html,text,attr,val,opacity,addClass,removeClass,replaceClass,addRule，removeRule,
remove元素，replace，has
*/
function HandelNode(){
	//是否存在某个class值
	function hasClass(elem, className){
		return elem.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
	}
	/*设置css样式
	* 1,键值对形式传值，可以传递三个参数
	* @para attr:属性名称
	* @para value:属性值
	* @para arg:false/true,注意false只针对transform属性其效果，false表示不替换原有的transform样式，true则替换，默认为true
	* 2，对象形式传值，可以传递两个参数
	* @para attr  {'width':'20em'}
	* @para value:false/true,注意false只针对transform属性其效果，false表示不替换原有的transform样式，true则替换，默认为true
	* */
	this.css = function(attr, value,arg) {
		for(var i=0; i<this.elements.length; i++){
			if(arguments.length == 0){
				throw new Error('css方法：没有传递任何属性值！');
			}
			var tranK = [], tranV = [], otherK = [], otherV = [], old, vals;
			if(typeof attr == 'object'){   //以对象形式传参
				for(var j in attr){
					if(!attr.hasOwnProperty(j)) continue;
					if(j.match(/transform/)){
						if(getComputedStyle(box,null)['transform']){
							old = getComputedStyle(box,null)['transform'];
							vals = (arguments.length == 2 && value === false)?(attr[j] + ' ' +old):attr[j];
							tranK.unshift(j);
							tranV.unshift(vals);
						}
					}
					if(!j.match(/transform/)){
						otherK.unshift(j);
						otherV.unshift(attr[j]);
					}
				}
				for(var k=0; k<otherK.length; k++){
					this.elements[i].style[otherK[k]] = otherV[k];
				}
				for(var m=0; m<tranV.length; m++){
					this.elements[i].style[tranK[m]] = tranV[m];
				}
			}else{   //以键值对形式传参
				if(arguments.length == 2) {
					this.elements[i].style[attr] = value;
				}else if(arguments.length == 1){
					if(typeof window.getComputedStyle != 'undefined'){     //w3c
						return window.getComputedStyle(this.elements[i],null)[attr];
					}else if(typeof this.elements[i].currentStyle != 'undefined'){    //ie8及其以下浏览器
						return this.elements[i].currentStyle[attr];
					}
				}else if(arguments.length == 3){
					if(getComputedStyle(box,null)['transform']){
						old = getComputedStyle(box,null)['transform'];
						vals = (arg === false)?(value + ' ' +old):value;
						this.elements[i].style[attr] = vals;
					}
				}
			}
		}
		return this;
	};
	
	//获取，设置html内容
	this.html = function(str) {
		for(var i=0; i<this.elements.length; i++) {
			if(arguments.length == 0) {
				return this.elements[i].innerHTML;
			}
			this.elements[i].innerHTML = str;
		}
		return this;
	};
	//获取，设置节点文本
	this.text = function(text){
		for(var i=0; i<this.elements.length; i++){
			if(arguments.length == 0) {
				return this.elements[i].innerText || this.elements[i].textContent;
			}else if(arguments.length == 1){
				if(this.elements[i].innerText){
					this.elements[i].innerText = text;
				}else{
					this.elements[i].textContent = text;
				}
			}
		}
		return this;
	};
	//获取属性
	this.attr = function(attr,str){
		for(var i=0; i<this.elements.length; i++) {
			if(arguments.length == 2){
				this.elements[i].setAttribute(attr,str);
			}else if(arguments.length == 1){
				return this.elements[i].getAttribute(attr);
			}else if(arguments.length == 0){
				throw new Error('attr方法：没有传递任何属性值！');
			}
		}
		return this;
	};
	//获取value值
	this.val = function(str){
		var elems = this.elements;
		for(var i=0; i<elems.length; i++){
			if(arguments.length == 1){
				var oldStr = elems[i].getAttribute('value');
				elems[i].setAttribute(oldStr,str);
			}else if(arguments.length == 0){
				if(elems[i].nodeName.match(/INPUT|TEXTAREA|SELECT|RADIO|CHECKBOX/)){
					return elems[i].value;
				}
				return elems[i].getAttribute('value');
			}
		}
		return this;
	};
	//获取和设置节点的透明度,ie8及其以下浏览器需要设置透明度才能获取到
	this.opacity = function(num){
		for(var i=0; i<this.elements.length; i++){
			if(!num){
				return window.getComputedStyle?(window.getComputedStyle(this.elements[i],null)['opacity']):(this.elements[i].currentStyle['opacity']);
			}else{
				this.elements[i].style.opacity = num/100;
				this.elements[i].style.filter = 'alpha(opacity='+num+')';
			}
		}
		return this;
	};
	//添加class
	this.addClass = function(className){
		for(var i=0; i<this.elements.length; i++){
			if(typeof document.querySelectorAll == 'function'){   //html5新增js API
				this.elements[i].classList.add(className);
			}else{
				if(!hasClass(this.elements[i],className)){
					this.elements[i].className += ' ' + className;
				}else{
					throw new Error('addClass方法：class名称未填写！');
				}
			}
		}
		return this;
	};
	//移除class
	this.removeClass = function(className) {
		for(var i=0; i<this.elements.length; i++) {
			if(arguments.length == 0){
				this.elements[i].className = '';
			}else if(arguments.length == 1){
				if(hasClass(this.elements[i],className)){
					this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),'');
				}else{
					throw new Error('removeClass方法：被删除的class名称不存在！');
				}
			}
		}
		return this;
	};
	//替换class
	this.replaceClass = function(oldName, newName) {
		for (var i=0; i<this.elements.length; i++) {
			if(arguments.length == 2){
				if(hasClass(this.elements[i],oldName)){
					this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)'+oldName+'(\\s|$)'), newName);
				}else{
					throw new Error('replaceClass方法：被替换的class名称不存在！');
				}
			}else if(arguments.length == 1){
				if(!newName){
					throw new Error('replaceClass方法：替换的class名称不存在！');
				}
			}else if(arguments.length == 0){
				throw new Error('replaceClass方法：需要传递两个参数，oldName, newName');
			}
		}
		return this;
	};
	//添加link或style的css规则
	this.addRule = function(item,selectorText,cssText,position) {
		item = parseInt(item);
		position = parseInt(position);
		var sheet = document.styleSheets[item];
		if(typeof sheet.insertRule != 'undefined') {    //w3c
			sheet.insertRule(selectorText+'{'+cssText+'}',position);
		}else if(typeof sheet.addRule != 'undefined') {  //ie8及其以下浏览器
			sheet.addRule(selectorText,'{'+cssText+'}',position);
		}
		return this;
	};
	// 删除link或style的css规则
	this.removeRule = function(item) {
		var sheet = document.styleSheets[parseInt(item)];
		if(typeof sheet.deleteRule != 'undefined') {    //w3c
			sheet.deleteRule(item);
		}else if(typeof sheet.removeRule != 'undefined') {   ////ie8及其以下浏览器
			sheet.removeRule(item);
		}
	};
	//删除节点
	this.remove = function(index){
		for (var i=0; i<this.elements.length; i++) {
			if(index >= 0){
				this.elements[i].removeChild(removeWhiteNodes(this.elements[i].childNodes)[index]);
			}else{
				throw new Error('remove方法：需要传递移除的节点下标，且下标为整数');
			}
		}
		return this;
	};
	//添加节点,1.1版本支持双标签
	this.append = function(str){
		for (var i=0; i<this.elements.length; i++) {
			var stag = str.match(/<[a-zA-Z]+>/g);
			var tag = stag.toString().substring(1,stag.toString().length-1);
			str.match(/<[a-zA-Z]+>(.*)<\/[a-zA-Z]>/g);
			var inn = RegExp.$1;
			var node = document.createElement(tag);
			node.innerHTML = inn;
			this.elements[i].appendChild(node);
		}
		return this;
	};

}
//节点操作对象结束

/*
事件绑定对象开始
on,off,hover,click,scroll,resize,toggle
*/
function ChenEvent(){
	/*on绑定事件
	*键值对形式绑定一个事件对象，对象形式可以绑定多个事件
	*/
	this.on = function(type, callback){
		for(var i=0; i<this.elements.length; i++){
			if((arguments.length == 2) && (typeof type == 'string') && (typeof callback == 'function')){
				addEvent(this.elements[i],type,callback);
			}else if((arguments.length == 1) && (typeof type == 'object')){
				for(var j in type){
					if(!type.hasOwnProperty(j)) continue;
					addEvent(this.elements[i],j,type[j]);
				}
			}
		}
		return this;
	};
	/*off解除事件绑定
	*键值对形式解绑一个事件对象，对象形式可以解绑多个事件
	*/
	this.off = function(type,callback){
		for(var i=0; i<this.elements.length; i++){
			if((arguments.length == 2) && (typeof type == 'string') && (typeof callback == 'function')){
				removeEvent(this.elements[i],type,callback);
			}else if((arguments.length == 1) && (typeof type == 'object')){
				for(var j in type){
					if(!type.hasOwnProperty(j)) continue;
					removeEvent(this.elements[i],j,type[j]);
				}
			}
		}
		return this;	
	};
	//设置hover事件
	this.hover = function(hover, out) {
		for(var i=0; i<this.elements.length; i++) {
			var obj = this.elements[i];
			if(isFunction(hover)){
				addEvent(obj,'mouseover',hover);
			}else{
				throw new Error('hover方法：没有传递回调函数');
			}
			if(isFunction(out)){
				addEvent(obj,'mouseout',out);
			}
		}
		return this;
	};
	//设置单击事件
	this.click = function(callback) {
		for(var i=0; i<this.elements.length; i++){
			addEvent(this.elements[i],'click',callback);
		}
		return this;
	};
	//设置点击切换方法
	this.toggle = function(){
		for (var i = 0; i < this.elements.length; i ++) {
			(function (element, args) {
				var count = 0;
				addEvent(element, 'click', function () {
					args[count++ % args.length].call(this);
				});
			})(this.elements[i], arguments);
		}
		return this;
	};
	//窗口滚动事件
	this.scroll = function(callback){
		for(var i=0; i<this.elements.length; i++){
			addEvent(this.elements[i],'scroll',callback);
		}
		return this;
	};
	//浏览器窗口缩放事件
	this.resize = function(callback){
		for(var i=0; i<this.elements.length; i++){
			var element = this.elements[i];
			var offsetLeft = element.offsetLeft;
			var offsetWidth = element.offsetWidth;
			var offsetTop = element.offsetTop;
			var offsetHeight = element.offsetHeight;
			addEvent(window,'resize',function(){
				callback();
				if(offsetLeft >= page().width-offsetWidth){
					offsetLeft = page().width-offsetWidth;
				}
				if(offsetTop >= page().height-offsetHeight){
					offsetTop = page().height-offsetHeight;
				}
			});
		}
		return this;
	}
}
//事件绑定对象结束

/*元素和页面的状态信息与设置
*该对象包含的属性有：hide,show,width,height,center,lock,unlock,drag
* */
function State(){
	// 设置元素隐藏
	this.hide = function(timer) {
		if(timer && typeof timer == 'number') {
			for(var i=0; i<this.elements.length; i++) {
				var el =  this.elements[i];
				el.style.display = 'none';
				setTimeout(function(){
					el.style.display = 'block';
				},timer);
			}
		}else if(!timer){
			for(var i=0; i<this.elements.length; i++) {
				this.elements[i].style.display = 'none';
			}
		}
		return this;
	};
	// 设置元素显示
	this.show = function(timer) {
		if(timer && typeof timer == 'number') {
			for(var i=0; i<this.elements.length; i++) {
				var el =  this.elements[i];
				el.style.display = 'block';
				setTimeout(function(){
					el.style.display = 'none';
				},timer);
			}
		}else if(!timer){
			for(var i=0; i<this.elements.length; i++) {
				this.elements[i].style.display = 'block';
			}
		}
		return this;
	};
	//元素宽度
	this.width = function(attr){
		if(attr){
			for(var i=0; i<this.elements.length; i++){
				this.elements[i].style.width = attr;
			}
		}
		return this.elements[i].offsetWidth;
	};
	//元素高度
	this.height = function(attr){
		if(attr){
			for(var i=0; i<this.elements.length; i++){
				this.elements[i].style.height = attr;
			}
		}
		return this.elements[i].offsetHeight;
	};

	//设置元素居中显示
	this.center = function() {
		for(var i=0; i<this.elements.length; i++){
			var left = (page().width - this.elements[i].offsetWidth)/2;
			var top = (page().height - this.elements[i].offsetHeight)/2;
			this.elements[i].style.left = left + 'px';
			this.elements[i].style.top = top + 'px';
			if(!this.elements[i].style.position){    //如果元素没有设置相对定位，就添加一个
				this.elements[i].style.position = 'absolute';
			}
		}
		return this;
	};
	//设置半透明背景锁屏，有两个参数，zIndex表示元素层级，默认99；alpha表示透明度，默认0.3
	this.lock = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].style.width = page().width + 'px';
			this.elements[i].style.height = page().height + 'px';
			this.elements[i].style.display = 'block';
			document.documentElement.style.overflow = 'hidden';
		}
		return this;
	};
	//清理遮罩
	this.unlock = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].style.width = 0 + 'px';
			this.elements[i].style.height = 0 + 'px';
			this.elements[i].style.display = 'none';
			document.documentElement.style.overflow = 'auto';
		}
		return this;
	};

	//元素拖拽
	this.drag = function(){
		for(var i=0; i<this.elements.length; i++){
			addEvent(this.elements[i],'mousedown',function(e){
				if(atrim(this.innerHTML).length == 0){e.preventDefault();}
				var _this = this;
				var oleft = e.clientX - _this.offsetLeft;
				var otop = e.clientY - _this.offsetTop;
				addEvent(document,'mousemove',move);
				addEvent(document,'mouseup',up);
				function move(e){
					var left = e.clientX - oleft;
					var top = e.clientY - otop;
					if(left<0){
						left=0;
					}else if(left>page().width-_this.offsetWidth){
						left = page().width-_this.offsetWidth;
					}
					if(top<0){
						top=0;
					}else if(top>page().height-_this.offsetHeight){
						top = page().height - _this.offsetHeight;
					}
					_this.style.left = left + 'px';
					_this.style.top = top + 'px';
				}
				function up(){
					this.onmousedown = null;
					removeEvent(document,'mousemove',move);
				}
			});
		}
		return this;
	};
}
//状态处理结束

/*attr,dur,type,callback
transition动画，包含attr,dur,type,callback四个参数,分为两种类型。1，运动时间与方式在对象内，Chen.transition({'width':'200 1s ease-in-out 1s'},type),运动方式按照css3定义的,此时只能传递三个参数。如果type为true,则动画按原路径返回。2，对象内只有属性名称和值，Chen.transition({'width':'200'},'all 1s ease-in',type,callback)。此时可以传递四个参数,type为回调函数，如果callback为true,则动画按原路径返回。
普通类型动画，包含attr,dur,type,callback四个参数
@para attr:以对象形式传入属性名称和值 {width:200}。
@para dur:动画持续时间
@para type: tween运动函数的类型
@para callback:回调函数
* */
function Transition(){
	//获取及设置css属性值
	function css(obj,attr,val){
		if(obj.nodeType != 1) return;
		attr = attr.replace(/^\s+|\s+$/,'');
		if(arguments.length == 2){    //获取属性
			if(attr == 'opacity'){
				return 100*parseInt(obj.currentStyle ? (obj.currentStyle[attr] || 1) : (window.getComputedStyle(obj,null)[attr] || 1));
			}
			if(attr=='width' || attr=='height' || attr=='top' || attr=='left'){
				var str = 'offset'+attr.replace(attr.charAt(0),attr.charAt(0).toUpperCase());
				return obj[str];
			}
			return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj,null)[attr];
		}
		if(arguments.length == 3){   //设置属性
			switch(attr){
				case 'width':
				case 'height':
				case 'top':
				case 'left':
					obj.style[attr] = val + 'px';
					break;
				case 'opacity':
					obj.style[attr] = val/100;
					obj.style.filter = 'alpha(opacity='+val+')';
					break;
				default:
					obj.style[attr] = val;
			}
		}
	}

	this.transition = function(attr,dur,type,callback){
		for(var i=0; i<this.elements.length; i++){
			//css3 transition类型的动画
			var obj = this.elements[i],at = [],oAttr=[],oVals=[],oTimes=[],k=0;
			var sys = ['transition','webkitTransition','mozTransition','msTransition','oTransition']; 
			for(var h in attr){  //获取原有的属性值
				if(!attr.hasOwnProperty(h)) continue;
				oVals.push(window.getComputedStyle(obj,null)[h]);
				oAttr.push(h);
				oTimes.push(Math.max.apply(null,attr[h].match(/\d/g)));
			}
			oTimes = Math.max.apply(null,oTimes);
            for(var j in attr){
                if(!attr.hasOwnProperty(j)) continue;
                if(attr[j].indexOf(' ') != -1){    //运动时间与方式在对象内
                    obj.style[j] = attr[j].split(' ')[0];
                    at.push(j + ' '+ attr[j].split(' ').slice(1).join(' '));
					for(; k<sys.length; k++){
						obj.style[sys[k]] = at.join();
						if((arguments.length == 2) && (typeof dur == 'function')){   //此时dur相当于回掉函数
							for(var m=0; m<sys.length; m++){
								addEvent(obj,sys[m]+'end',dur);
							}
						}
						if((arguments.length == 2) && (dur === true)){   //此时type对是否返回初始状态进行判断
							setTimeout(function(){
								for(var j=0; j<oVals.length; j++){
							 		obj.style[oAttr[j]] = oVals[j];
							 	}
							},oTimes*1000);
						}
						if((arguments.length == 3) && (typeof dur == 'function') && (type === true)){
							addEvent(obj,sys[k]+'end',type);
							setTimeout(function(){
								for(var j=0; j<oVals.length; j++){
							 		obj.style[oAttr[j]] = oVals[j];
							 	}
							},oTimes*1000);
						}
					}
					
                }else{  //对象内只有属性名称和值,Chen.transition({'width':'50px','height':'100px'},'all 2s');
                	if((typeof dur != 'number') && dur.match(/all \d+s/)){
                		obj.style[j] = attr[j];
	                	for(; k<sys.length; k++){
							obj.style[sys[k]] = dur;
							if((arguments.length == 3) && (typeof type == 'function')){   //此时type相当于回掉函数
								addEvent(obj,sys[k]+'end',type);
							}
							if((arguments.length == 3) && (type === true)){   //此时type对是否返回初始状态进行判断
								addEvent(obj,sys[k]+'end',function(){
									for(var j=0; j<oVals.length; j++){
								 		obj.style[oAttr[j]] = oVals[j];
								 	}
								});
							}
							if((arguments.length == 4) && (typeof type == 'function') && (callback === true)){
								addEvent(obj,sys[k]+'end',type);
								addEvent(obj,sys[k]+'end',function(){
									for(var j=0; j<oVals.length; j++){
								 		obj.style[oAttr[j]] = oVals[j];
								 	}
								});
							}
						}
						obj.style['transition'] = dur;
						if((arguments.length == 3) && (typeof type == 'function')){   //此时type相当于回掉函数
							addEvent(obj,'transitionend',type);
						}
                	}else if(typeof dur == 'number'){
				        //普通类型的动画，压入队列
						Queue.queue(obj,'fx',function(){
							//starts:属性起始值，steps：帧频，times：运行的时间，tween：运动函数，callfun:回调函数
							var starts = [],
								steps = [],
								times = 0,tween,callfun;
							//参数判断
							if(arguments.length==3){
								if(type.length>=4){
									tween=type;
									callfun=null;
								}else{
									tween= Tween.Quad.easeIn;
									callfun=type;
								}
							}else{
								tween=type?type: Tween.Quad.easeIn;
								callfun=callback?callback:null;
							}

							//传递多个属性值，获取节点开始值与结束值
							for(var i in attr){
								if(!attr.hasOwnProperty(i)) continue;
								starts[i] = css(obj,i);
								steps[i] = attr[i] - starts[i];
							}
							//动画执行
							var timer = setInterval(function(){
								var stop = true;
								if(times < dur){
									stop = false;
									for(var j in attr){
										if(!attr.hasOwnProperty(j)) continue;
										css(obj,j,tween(times,starts[j],steps[j],dur));
									}
								}
								times += 60;
								if(times >= dur){
									if(stop){
										for(var i in attr){
											if(!attr.hasOwnProperty(i)) continue;
											css(obj,i,attr[i]);
										}

										if(callfun){   //动画完成以后执行的回调函数
											callfun();
										}
										clearInterval(timer);
										//取出队列的第一个参数
										Queue.delqueue(obj,'fx');
									}
								}
							},60);
						});
                	}
                }
            }
            
		}
		return this;
	};
	this.stop = function(){
		for(var i=0; i<this.elements.length; i++){
			Queue.stop(this.elements[i],'fx');
		}
		return this;
	}
}

//队列
var Queue = {
	//压入队列
	queue:function(elem,key,val){
		key = key?key:'fx';
		var fn = Data.setData(elem,key);
		if(!val){
			return fn || [];
		}
		if(!fn){
			fn = Data.setData(elem,key,[]);
		}

		if(val instanceof Array){
			fn = Data.setData(elem,key,val);
		}else{
			fn.push(val);
		}

		if(key == 'fx' && fn[0] != 'mark'){
			this.delqueue(elem,key);
		}
		return fn;
	},
	//从队列里取出第一个元素
	delqueue:function(elem,key){
		key = key || 'fx';
		var queue = Data.setData(elem,key);
		var fn = queue.shift();
		if(fn == 'pause'){
			return;
		}
		if(fn == 'mark'){
			fn = queue.shift();
		}
		if(fn){
			if(key == 'fx'){
				queue.unshift('mark');
			}
			fn.call(elem);
		}
	},
	//延时
	delay:function(elem,key,num){
		this.queue(elem,key,function(){
			var t = setTimeout(function(){
				clearTimeout(t);
				this.delqueue(elem,key);
			},num);
		});
	},
	//暂停
	pause:function(elem,key){
		this.queue(elem,key).unshift('pause');
	},
	//停止
	stop:function(elem,key){
		this.queue(elem,key,[]);
	}
};

//缓存
var Data = {
	cache:{},
	uuid:0,
	expando:+new Date,
	setData:function(elem,key,val){
		var id = elem[this.expando];
		if(!id){
			id = ++this.uuid;
			elem[this.expando] = id;
		}
		if(!this.cache[id]){
			this.cache[id] = {};
		}
		if(val){
			this.cache[id][key] = val;
		}
		return this.cache[id][key];
	}
};

//canvas
function Canvas(){
	this.canvas = function(data){
		for(var i=0; i<this.elements.length; i++){
			//添加形状
			if(data.shape){
				switch(data.shape){
					case 'line':
						alert(123);
						break;
				}
			}
		}
		return this;
	};
	//绘制弧线
	this.drawArc = function(data){
		for(var i=0; i<this.elements.length; i++){
			var cxt = this.elements[i].getContext('2d');
			cxt.save();
			if(data.translate) cxt.translate(data.translate.split(' ')[0],data.translate.split(' ')[1]);
			if(data.rotate) cxt.rotate(data.rotate.split(' ')[0],data.rotate.split(' ')[1]);
			if(data.scale) cxt.scale(data.scale.split(' ')[0],data.scale.split(' ')[1]);
			cxt.beginPath();
			cxt.lineWidth = data.lineWidth;
			cxt.strokeStyle = data.strokeStyle;
			if(data.fill){
				cxt.fillStyle = data.fillStyle;
			}
			cxt.arc(data.x,data.y,data.r,data.start,data.end,false);
			cxt.stroke();
			if(data.fill){
				cxt.fill();
			}
			cxt.closePath();
			cxt.restore();
			//事件处理

		}
		return this;
	};
	//绘制矩形
	this.drawRect = function(data){
		for(var i=0; i<this.elements.length; i++){
			var cxt = this.elements[i].getContext('2d');
			cxt.save();
			cxt.beginPath();
			cxt.lineWidth = data.lineWidth;
			cxt.strokeStyle = data.strokeStyle;
			if(data.fill){
				cxt.fillStyle = data.fillStyle;
			}
			cxt.rect(data.x,data.y,data.w,data.h);
			cxt.stroke();
			if(data.fill){
				cxt.fill();
			}
			cxt.closePath();
			cxt.restore();
			//事件处理

		}
		return this;
	}

}

/*ajax方法
* @para type  get post put delete
* @para url
* @para data 对象形式传参
* @para timeout 毫秒，超出指定时间取消请求
* @para beforeSend
* @para success
* @para error
* @para complated
* @para async  true表示异步，false表示同步
* */
function ajax(conf){
	var xhr = (function(){
		if (typeof XMLHttpRequest != 'undefined') {
			return new XMLHttpRequest();
		} else if (typeof ActiveXObject != 'undefined') {
			var version = [
				'MSXML2.XMLHttp.6.0',
				'MSXML2.XMLHttp.3.0',
				'MSXML2.XMLHttp'
			];
			for (var i = 0; version.length; i ++) {
				try {
					return new ActiveXObject(version[i]);
				} catch (e) {
					//跳过
				}
			}
		} else {
			throw new Error('您的系统或浏览器不支持XHR对象！');
		}
	})();
	var requestDone = false;//标志请求是否完成
	//通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
	conf.url = conf.url + '?rand=' + Math.random();
	//将名值对转换成字符串
	conf.data = (function(data){
		var arr = [];
		for (var i in data) {
			if(!data.hasOwnProperty(i)) continue;
			arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
		}
		return arr.join('&');
	})(conf.data);

	if (conf.data !== '' && conf.method === 'get') {
		conf.url += conf.url.indexOf('?') == -1 ? '?' + conf.data : '&' + conf.data;
	}
	xhr.open(conf.method, conf.url, conf.async);
	setTimeout(function(){
		requestDone = true;
	}, conf.timeout);

	if (conf.async === true) {  //true表示异步，false表示同步
		xhr.onreadystatechange = function () {
			if(xhr.readyState == 2){
				conf.beforeSend();
			}
			if (xhr.readyState == 4 && !requestDone) {   //判断对象的状态是否交互完成
				callback();         //回调
			}
		};
	}
	if (conf.type === 'post') {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(conf.data);        //post方式将数据放在send()方法里
	}else if(conf.type === 'put' || conf.type === 'delete'){
		xhr.setRequestHeader('Content-Type', 'json');
		xhr.send(conf.data); 
	}else {
		xhr.send(null);        //get方式则填null
	}
	
	if (conf.async === false) {
		callback();
	}
	function callback() {
		if (xhr.status == 200) {  //判断http的交互是否成功，200表示成功
			if(conf.dataType == 'text' || conf.dataType == 'TEXT'){
				conf.success(xhr.responseText);
			}
			if(conf.dataType == 'xml' || conf.dataType == 'XML'){
				conf.success(xhr.responseXML);
			}
			if(conf.dataType == 'json' || conf.dataType == 'JSON'){
				conf.success(eval("("+xhr.responseText+")"));
			}

		} else {
			conf.error(xhr.status,xhr.statusText);    //失败
		}
		if(conf.complete) conf.complete();
		//避免内存泄漏，清理文档
		xhr = null;
	}

	return this;
}

/*jsonp方法
* @para url
* @para jsonp 
* @para jsonpCallback 
* @para callback
* */
function jsonp(conf){
	var script = document.createElement('script'),
		name = conf.jsonp,
		cbname = conf.jsonpCallback;

	if(conf.url.indexOf('?') == -1){
		conf.url += '?'+name+'='+cbname; 
	}else {
		conf.url += '&'+name+'='+cbname;
	}

	script.src = conf.url;
	document.getElementsByTagName('head')[0].appendChild(script);

	var scriptCb = document.createElement('script');
	scriptCb.id = 'cbname';
	try{
		scriptCb.innerHTML = conf.success;
		document.body.appendChild(scriptCb);
	}catch(e){
		console.log(e);
	}finally{
		delete this;
		document.body.removeChild(scriptCb);
	}
	
}


//添加transform属性
function addTransform(obj,str,arg){
	arg = arg?arg:false;
	var sys = ['transform','webkitTransform','mozTransform','msTransform','oTransform'], val=null;
	for(var k=0; k<sys.length; k++){
		if(arg) obj.style[sys[k]] = str;
		if(getComputedStyle(box,null)[sys[k]]){     //判断style样式里面是否含有transform属性，如果有则拼接属性
			var old = obj.style[sys[k]];
			val = joinArray(old,str).join(' ');
			obj.style[sys[k]] = val;
		}else{
			obj.style[sys[k]] = str;
		}
	}
}
// 字符串处理函数
function trim(str){   //去除左右空格
	return str.toString().replace(/(^\s*)|(\s*$)/g,'');
}
function atrim(str){   //去除所有空格
	return str.toString().replace(/\s*/g,'');
}
function ltrim(str){   //去除左空格
	return str.toString().replace(/(^\s*)/g,'');
}
function rtrim(str){  //去除右空格
	return str.toString().replace(/(\s*$)/g,'');
}
//判断字符串是否含有大写字母
function hasUp(text){
    if(!text || typeof text != 'string') return null;
    if(text.match(/([A-Z])/g)){
        return RegExp.$1;
    }
    return false;
}
//判断字符串是否含有小写字母
function hasLow(text){
    if(!text || typeof text != 'string') return null;
    if(text.match(/([a-z])/g)){
        return RegExp.$1;
    }
    return false;
}
//判断字符串是否含有数字
function hasNum(text){
    if(!text || typeof text != 'number') return null;
    if(text.match(/([0-9])/g)){
        return RegExp.$1;
    }
    return false;
}

//函数判断
/**
 * 判断数据类型
 */
function type(str){
	var toString = Object.prototype.toString,
		map = {
			'[object Boolean]' : 'boolean',
			'[object Number]'  : 'number',
			'[object String]'  : 'string',
			'[object Function]' : 'function',
			'[object Array]'  : 'array',
			'[object Date]'   : 'date',
			'[object RegExp]'  : 'regExp',
			'[object Undefined]': 'undefined',
			'[object Null]'   : 'null',
			'[object Object]'  : 'object',
			'[object Map]' : 'map',
			'[object Set]' : 'set',
			'[object Symbol]' : 'symbol'
		};
	return map[toString.call(str)];
}
function isFunction(fn){ 
	return fn instanceof Function;
}
function isArray(arr){
	return arr instanceof Array;
}
function isString(str){
	if(str.constructor == String) return true;
	return false;
}
function isObject(str){
	if(str.constructor == Object) return true;
	return false;
}
//判断一个元素是否在一个数组中
function inArray(arr, value){
	if(isArray(arr)){
		for(var i=0; i<arr.length; i++){
			if(arr[i] == value) return true;
		}
	}
	return false;
}
//对象转数组
function toArray(obj){
	var arr = [];
	for(var i in obj){
		if(!obj.hasOwnProperty(i)) continue;
		arr.push(obj[i]);
	}
	return arr;
}
//将多个元素拼接为数组
function joinArray(){
	if(arguments.length){
		var arr = [];
		for(var i=0; i<arguments.length; i++){
			arr.push(arguments[i]);
		}
	}else{
		throw new Error('joinArray方法错误：没有传入任何参数！');
	}
	return arr;
}

/**
 * 判断两个变量是否相等，只能匹配简单的数据类型
 * @param str1
 * @param str2
 * @returns {boolean}
 */
function isEqual (str1, str2) {
	return JSON.stringify(str1) === JSON.stringify(str2);
}

/**
 * 判断两个变量是否相等, 此方法用于相同数据类型的变量比较
 * @param a
 * @param b
 * @returns {boolean}
 */
function compare(a, b) {
	var pt = /undefined|number|string|boolean/, fn = /^(function\s*)(\w*\b)/, cr = "constructor", cn = "childNodes", pn = "parentNode";
	if (pt.test(typeof a) || pt.test(typeof b) || a === null || b === null) {
		return a === b || (isNaN(a) && isNaN(b));
	}
	if (a[cr] !== b[cr]) {
		return false;
	}
	switch (a[cr]) {
		case Date:
			return a.valueOf() === b.valueOf();
		case Function:
			return a.toString().replace(fn, '$1') === b.toString().replace(fn, '$1');
		case Array:
			if (a.length !== b.length) {
				return false;
			}
			for (var i = 0; i < a.length; i++) {
				if (a[i].toString() == b[i].toString()) { }
			}
			break;
		default:
			var alen = 0, blen = 0, d = void 0;
			if (a === b) {
				return true;
			}
			if (a[cn] || a[pn] || b[cn] || b[pn]) {
				return a === b;
			}
			for (d in a) {
				alen++;
			}
			for (d in b) {
				blen++;
			}
			if (alen !== blen) {
				return false;
			}
			for (d in a) {
				if (a[d].toString() != b[d].toString()) {
					return false;
				}
			}
			break;
	}
	return true;
}

/**
 * 字符串或函数的执行次数
 * @param obj:类型为Function, String
 */
function repeatObj(obj, manyTime) {
	if (type(manyTime) != 'number') {
		throw new Error('函数repeat的参数manyTime类型为number');
	}
	switch (type(obj)) {
		case 'string':
			return obj.repeat(manyTime);
		case 'function':
			var arr = new Array(manyTime);
			for (var i = 0; i < arr.length; i++) {
				obj();
			}
			break;
		default:
			return null;
	}
}

/**
 * 对象转map对象
 * @param obj
 * @returns {Map}
 */
// function objToMap(obj){
// 	if(type(obj) != 'object') return;
// 	let map = new Map();
// 	for(let i in obj){
// 		map.set(i, obj[i]);
// 	}
// 	return map;
// }

/**
 * map对象转普通对象
 * @param map
 * @returns {{}}
 */
// function mapToObj(map){
// 	if(type(map) != 'map') return;
// 	let obj = {}; 
// 	map.forEach((val ,key)=>{
// 		obj[key] = val;
// 	});
// 	return obj;
// }

//获取页面信息
function page(){
	if(typeof window.innerWidth != 'undefined'){   //w3c
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	}else if(typeof document.documentElement != 'undefined'){   //ie8及其以下浏览器
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
}

//删除空白节点
function removeWhiteNodes(node){
	for(var i = 0; i<node.length; i++){
		if(node[i].nodeType === 3 && /^\s+$/.test(node[i].nodeValue)){
			node[i].parentNode.removeChild(node[i]);
		}
	}
	return node;
}

//跨浏览器添加事件绑定
function addEvent(obj, type, fn) {
	if (typeof obj.addEventListener != 'undefined') {
		obj.addEventListener(type, fn, false);
	} else {
		//创建一个存放事件的哈希表(散列表)
		if (!obj.events) obj.events = {};
		//第一次执行时执行
		if (!obj.events[type]) {	
			//创建一个存放事件处理函数的数组
			obj.events[type] = [];
			//把第一次的事件处理函数先储存到第一个位置上
			if (obj['on' + type]) obj.events[type][0] = fn;
		} else {
			//同一个注册函数进行屏蔽，不添加到计数器中
			if (addEvent.same(obj.events[type], fn)) return false;
		}
		//从第二次开始我们用事件计数器来存储
		obj.events[type][addEvent.ID++] = fn;
		//执行事件处理函数
		obj['on' + type] = function (event) {
			var e = event || addEvent.fixEvent(window.event);
			var es = this.events[e.type];
			for (var i in es) {
				if(!es.hasOwnProperty(i)) continue;
				es[i].call(this, e);
			}
		}
	}
}
//为每个事件分配一个计数器
addEvent.ID = 1;
//同一个注册函数进行屏蔽
addEvent.same = function (es, fn) {
	for (var i =0; i<es.length; i++) {
		if (es[i] == fn) return true;
	}
	return false;
};
//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent = function (event) {
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	event.target = event.srcElement;
	return event;
};
//IE阻止默认行为
addEvent.fixEvent.preventDefault = function () {
	this.returnValue = false;
};
//IE取消冒泡
addEvent.fixEvent.stopPropagation = function () {
	this.cancelBubble = true;
};
//跨浏览器删除事件
function removeEvent(obj, type, fn) {
	if (typeof obj.removeEventListener != 'undefined') {
		obj.removeEventListener(type, fn, false);
	} else {
		if (obj.events) {
			for (var i =0; i<obj.events[type]; i++) {
				if (obj.events[type][i] == fn) {
					delete obj.events[type][i];
				}
			}
		}
	}
}

//DOM加载
function domLoaded(fn){
	if(document.addEventListener){
		addEvent(document,'DOMContentLoaded',function(){
			fn();
			removeEvent(document,'DOMContentLoaded',arguments.callee);
		});
	}else{
		setInterval(function () {
			try {
				document.documentElement.doScroll('left');
				fn();
			} catch (e) {}
		});
	}
}

/*cookie获取与设置
*1,不传参数，返回搜索cookie
* 2,传递一个参数，返回对应的cookie值
* 3，传递一组数据：name:cookie名，value：cookie值，expires:过期时间，path：路径，domain:域名，secure:安全
* name与value为必填选项,  expires值为整数，负数表示取消cookie,0表示会话结束时取消，正数表示设置过期时间
* */
function cookie(data){
	if(!data)return document.cookie;
	if(data instanceof Object){
		var cookie = encodeURIComponent(data.name) + '='+ encodeURIComponent(data.value);
		if(data.expires && typeof data.expires == 'number' ) {
			var date=new Date();
			date.setDate(date.getDate()+data.expires);
			cookie += '; expires=' + date;
		}
		if(data.path) cookie += '; path=' + data.path;
		if(data.domain) cookie += '; domain=' + data.domain;
		if(data.secure) cookie += '; secure';
		document.cookie = cookie;
	}else{
		var cookieName = encodeURIComponent(data) + '=';
		var cookieStart = document.cookie.indexOf(cookieName);
		var cookieValue = null;
		if(cookieStart > -1){
			var cookieEnd = document.cookie.indexOf(';',cookieStart);
			if(cookieEnd == -1) cookieEnd = document.cookie.length;
			cookieValue = encodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
		}
		return cookieValue;
	}
}

/*storage存储
*/
function Storage(){
	//检查数据类型
	function check(type){
		if(type == 'localStorage' || type == 'sessionStorage') return true;
		return false;
	}
	function setType(t,k,v){
		switch(t){
			case 'localStorage':
				localStorage.setItem(k,v);
				break;
			case 'sessionStorage':
				sessionStorage.setItem(k,v);
				break;
		}
	}
	function getType(t,k){ 
		switch(t){
			case 'localStorage': 
				return localStorage.getItem(k);
				break;
			case 'sessionStorage':
				return sessionStorage.getItem(k);
				break;
		}
	}
	this.storage = {
		type: function(type){
			if(check(type)) return type;
			return '此数据类型当前不受支持！'
		},
		//type:localStorage,sessionStorage
		//obj: {key:val,key:val,...}，[{},{},...]
		set: function(type,obj){
			if(check(type)){
				if(isArray(obj)){
					for(var i=0; i<obj.length; i++){
						if(isObject(obj[i])){
							for(var j in obj[i]){
								setType(type,j,obj[i][j]);
							}
						}
					}
				}
				if(isObject(obj)){
					for(var i in obj){
						setType(type,i,obj[i]);
					}
				}
			}
		},
		//type:localStorage,sessionStorage
		//obj: key,或者 [key1,key2,...]
		get: function(type,obj) {
			if(check(type) && obj){
				if(isString(obj)){
					return getType(type,obj);
				}
				if(isArray(obj)){
					var arr = [], json='',jons2='';
					for(var i = 0; i<obj.length; i++){
						switch(type){
							case 'localStorage':
								arr.push({"key":obj[i],"value":localStorage.getItem(obj[i])});
								break;
							case 'sessionStorage':
								arr.push({"key":obj[i],"value":sessionStorage.getItem(obj[i])});
								break;
						}
					}
					for(var j=0; j<arr.length; j++){
						json += arr[j]['key']+':'+arr[j]['value']+',';
					}
					json2 = '{'+json.substring(0,json.lastIndexOf(","))+'}';
					return json2;
				}
			}else if(arguments.length == 1 && !obj){
				var arr = [], json='',jons2='', i=0;
				switch(type){
					case 'localStorage':
						for(; i<localStorage.length; i++){
							var key = localStorage.key(i);
							var value = localStorage.getItem(key);
							arr.push({"k":key,"v":value});
						}
						break;
					case 'sessionStorage':
						for(; i<sessionStorage.length; i++){
							var key = sessionStorage.key(i);
							var value = sessionStorage.getItem(key);
							arr.push({"k":key,"v":value});
						}
					break;
				}
				for(var j=0; j<arr.length; j++){
					json += arr[j]['k']+':'+arr[j]['v']+',';
				}
				json2 = '{'+json.substring(0,json.lastIndexOf(","))+'}';
				return json2;
			}	
		},
		//type:localStorage,sessionStorage
		//obj: [key1,key2,...]
		remove: function(type,obj){  
			if(check(type)) {
				if(isString(obj)){
					switch(type){
						case 'localStorage': 
							localStorage.removeItem(obj);
							break;
						case 'sessionStorage':
							sessionStorage.removeItem(obj);
							break;
					}
				}
				else if(isArray(obj)){
					switch(type){
						case 'localStorage': 
							for(var i=0; i<obj.length; i++){
								localStorage.removeItem(obj[i]);
							}
							break;
						case 'sessionStorage':
							for(var i=0; i<obj.length; i++){
								sessionStorage.removeItem(obj[i]);
							}
							break;
					}
				}
			}
		},
		clear: function(type){
			if(!type){
				localStorage.clear();
				sessionStorage.clear();
			}
			if(check(type)){
				switch(type){
					case 'localStorage':
						localStorage.clear();
						break;
					case 'sessionStorage':
						sessionStorage.clear();
						break;
				}
			}
		}
	}

	return {
		storage: this.storage
	}
}

/*localStorage存储
*key名称，value值。获取值$.local(key),设置值$.local(key,value),取消之$.local(key,'',false)
* */
function local(key, value, args){
	if(localStorage){
		if(key && arguments.length == 1){
			var v = localStorage.getItem(key) || localStorage.key;
			if(typeof v == 'function'){
				return 'undefined';
			}else{return v;}
		}else if(key && value && arguments.length == 2){
			localStorage.setItem(key, value);
			localStorage.key=value;
		}else if(key && value =='' && args == false){
			localStorage.removeItem(key);
		}
	}else{
		throw new Error('你的浏览器不支持localStorage!');
	}
}
/*sessionStorage存储
 *操作方式与localStorage相同
 * */
function session(key, value, args){
	if(sessionStorage){
		if(key && arguments.length == 1){
			var v = sessionStorage.getItem(key) || sessionStorage.key;
			if(typeof v == 'function'){
				return 'undefined';
			}else{return v;}
		}else if(key && value && arguments.length == 2){
			sessionStorage.setItem(key, value);
			sessionStorage.key=value;
		}else if(key && value =='' && args == false){
			sessionStorage.removeItem(key);
		}
	}else{
		throw new Error('你的浏览器不支持sessionStorage!');
	}
}

//tween运动
var Tween = {
	Linear: function(t,b,c,d){ return c*t/d + b; },
	Quad: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t + b;
		},
		easeOut: function(t,b,c,d){
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	},
	Cubic: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		}
	},
	Quart: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		}
	},
	Quint: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		}
	},
	Sine: {
		easeIn: function(t,b,c,d){
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOut: function(t,b,c,d){
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOut: function(t,b,c,d){
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		}
	},
	Expo: {
		easeIn: function(t,b,c,d){
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOut: function(t,b,c,d){
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}
	},
	Circ: {
		easeIn: function(t,b,c,d){
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOut: function(t,b,c,d){
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		}
	},
	Elastic: {
		easeIn: function(t,b,c,d,a,p){
			var s;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (!a || a < Math.abs(c)) { a=c; s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOut: function(t,b,c,d,a,p){
			var s;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (!a || a < Math.abs(c)) { a=c; s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
		},
		easeInOut: function(t,b,c,d,a,p){
			var s;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (!a || a < Math.abs(c)) { a=c; s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		}
	},
	Back: {
		easeIn: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOut: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOut: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158;
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		}
	},
	Bounce: {
		easeIn: function(t,b,c,d){
			return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
		},
		easeOut: function(t,b,c,d){
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOut: function(t,b,c,d){
			if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
			else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	}
};

})();