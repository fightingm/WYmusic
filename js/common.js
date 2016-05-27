



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