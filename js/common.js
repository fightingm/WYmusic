



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
	return all;
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