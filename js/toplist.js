$(function(){
	var $tableData=$('#table-data');
	var $newTop=$('#newTop');
	var $hotTop=$('#hotTop');
	var $showLog=$('#show-log');
	var $userHome=$('#user-home');
	var curSel="hot";
	setLog();
	getBd();
	function getBd(){
		var str1='';
		var str2='';
		$.get('http://115.28.238.193:8080/music/music/hot?page=0&limit=500',function(data){
			if(data.status==200){
				for(var i=0;i<data.data.length;i++){
					str1+='<tr>\
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
				$tableData.html(str1);
				$hotTop.click(function(){
					if(curSel!="hot"){
						$tableData.html(str1);
						curSel="hot";
						$(this).addClass('active');
						$newTop.removeClass('active');
					}
				});
			}
		});
		$.get('http://115.28.238.193:8080/music/music/type/new?page=0&limit=500',function(data){
			if(data.status==200){
				for(var i=0;i<data.data.length;i++){
					str2+='<tr>\
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
				$newTop.click(function(){
					if(curSel!="new"){
						$tableData.html(str2);
						curSel="new";
						$(this).addClass('active');
						$hotTop.removeClass('active');
					}
				});
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