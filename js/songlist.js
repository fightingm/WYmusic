

$(function(){
	//数据获取

	var albumId=location.search.split('=')[1]||0;
	var $albumTit=$('#album-tit');
	var $singerName=$('#singer-name');
	var $ablumDesc=$('#album-desc');
	var $albumImg=$('#album-img');
	var $tableData=$('#table-data');
	var $showLog=$('#show-log');
	var $userHome=$('#user-home');
	setLog();
	getData();
	function getData(){
		$.get('http://115.28.238.193:8080/music/music/'+albumId,function(data){
			if(data.status==200){
				$albumTit.html(data.data[0].musicAlbum.albumName);
				$singerName.html(data.data[0].musicAlbum.singer.singerName);
				$ablumDesc.html(data.data[0].musicAlbum.albumDescription);
				$albumImg.attr('src',data.data[0].musicAlbum.albumPic);
				var str='';
				for(var i=0;i<data.data.length;i++){
					str+='<tr>\
							<td class="w1">\
								<div class="hd">\
									<span>'+(i+1)+'</span>\
									<span>\
										<i class="fa fa-play-circle-o fa-lg" aria-hidden="true"></i>\
									</span>\
								</div>\
							</td>\
							<td>'+data.data[i].musicName+'</td>\
							<td class="w2">'+data.data[i].musicAlbum.albumName+'</td>\
							<td class="w3">'+data.data[i].musicSinger.singerName+'</td>\
						</tr>';
				}
				$tableData.html(str);
			}
		});
	}
	function setLog(){
		var uname=getCookie('name');
		if(uname!=""){
			$showLog.hide();
			$userHome.show().html(uname);
		}
	}
});