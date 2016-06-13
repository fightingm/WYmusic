



//将毫秒数转换成00:00格式
function toTime(iNum){
	iNum = Math.floor( iNum );
	var iM = Math.floor(iNum/60)>9?Math.floor(iNum/60):"0"+Math.floor(iNum/60);
	var iS = Math.floor(iNum%60)>9?Math.floor(iNum%60):"0"+Math.floor(iNum%60);
	return iM + ':' + iS;
}

//返回location中的键值对
function getProps(str,key){
	var ser=str.split('?')[1];
	if(ser){
		var arr1=ser.split('&');
		var all=[];
		for(var i in arr1){
			var o={};
			var arr=arr1[i].split('=');
			o.k=arr[0];
			o.v=arr[1];
			all.push(o);
		}
		for(var i in all){
			if(all[i].k==key){
				return all[i].v;
			}
		}
	}
	
	return "";
}

//分页													
function showPages(page,total){
	page=Number(page);
	total=Number(total);
	var pcls='';
	var fcls='';
	var ncls='';
	var lcls='';
	if(page==1){
		pcls='default';
		fcls='active';
	}
	if(page==total){
		ncls='default';
		lcls='active';
	}
	var str="<a class='page-prev "+pcls+"' href='javascript:;'>上一页</a>\
			<a class='page-i "+fcls+"' href='javascript:;'>1</a>";
	if(page-4>1){
		str+='...';
	}
	for (var i=page-3;i<=page+3;i++){
		if(i>1&&i<total){
			if(i==page){
				str+="<a class='page-i active' href='javascript:;'>"+i+"</a>";
			}else{
				str+="<a class='page-i' href='javascript:;'>"+i+"</a>";
			}
		}
	}
	if(page+4<total){
		str+='...';
	}
	if(total>1){
		str+="<a class='page-i "+lcls+"' href='javascript:;'>"+total+"</a>";
	}
	str+="<a class='page-next "+ncls+"' href='javascript:;'>下一页</a>";
	return str;
}

//get css
function getCss(o,key){
	return o.currentStyle?o.currentStyle[key]:document.defaultView.getComputedStyle(o,false)[key];
}

//拖拽
var params={
	left:0,
	top:0,
	currentX:0,
	currentY:0,
	w:0,
	h:0,
	flag:false
}
function startDrag(obj){
	if(getCss(obj.target,"left")!="auto"){
		params.left=getCss(obj.target,"left");
	}
	if(getCss(obj.target,"top")!="auto"){
		params.top=getCss(obj.target,"top");
	}
	obj.bar.onmousedown=function(event){
		event.stopPropagation();
		params.flag=true;
		if(!event){
			event=window.event;
			obj.bar.onselectstart=function(){
				return false;
			}
		}
		var e=event;
		params.currentX=e.clientX;
		params.currentY=e.clientY;
		params.w=obj.target.offsetWidth;
		params.h=obj.target.offsetHeight;
	};
	document.onmouseup=function(ev){
		params.flag=false;
		if(getCss(obj.target,"left")!="auto"){
			params.left=getCss(obj.target,"left");
		}
		if(getCss(obj.target,"top")!="auto"){
			params.top=getCss(obj.target,"top");
		}
		ev.stopPropagation();
	};
	document.onmousemove=function(event){
		var e=event?event:window.event;
		if(params.flag){
			var nowX=e.clientX,
				nowY=e.clientY,
				disX=nowX-params.currentX,
				disY=nowY-params.currentY,
				left=parseInt(params.left)+disX,
				top=parseInt(params.top)+disY;
			if(left<=0){
				left=0;
			}
			if(top<=0){
				top=0;
			}
			if(left>=document.documentElement.clientWidth-params.w){
				left=document.documentElement.clientWidth-params.w;
			}
			if(top>=document.documentElement.clientHeight-params.h){
				top=document.documentElement.clientHeight-params.h;
			}
			if(obj.dir){
				if(obj.dir[0]=='top'){
					if(top<=obj.dir[1]){
						top=obj.dir[1];
					}
					if(top>=obj.dir[2]){
						top=obj.dir[2];
					}
					obj.target.style.top=top+"px";
					if(typeof obj.callback=="function"){
						obj.callback(left,top);
					}
					return;
				}
			}
			obj.target.style.left=left+"px";
			obj.target.style.top=top+"px";
			
		}
		
	}
}

//cookie
function setCookie(c_name,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+"="+escape(value)+((expiredays==null)?"":";expires="+exdate.toGMTString());
}
function getCookie(c_name){
	if(document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name+"=")
		if(c_start!=-1){
			c_start=c_start+c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if(c_end==-1){
				c_end=document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}
function clearCookie(name) {  
    setCookie(name, "", -1);  
} 