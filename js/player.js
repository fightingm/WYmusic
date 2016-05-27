$(function(){
	var tabIndex=0;
	var $tab=$('.m-tab a');
	var $mMain=$('.m-main');
	$tab.click(function(){
		$tab.eq(tabIndex).removeClass('active');
		$mMain.eq(tabIndex).removeClass('active');
		$mMain.eq($(this).index()).addClass('active');
		$(this).addClass('active');
		tabIndex=$(this).index();
	});
	var singerId=getProps(location.href,'id');
	var $tableData=$('#table-data');
	var $singerName=$('.singer-name');
	var $singerDesc=$('#singer-desc');
	var $singerImg=$('#singer-img');
	getData();
	function getData(){
		$.get('http://115.28.238.193:8080/music/singer/'+singerId,function(data){
			if(data.status==200){
				$singerName.html(data.data[0].musicSinger.singerName);
				$singerDesc.html(data.data[0].musicSinger.singerDescription);
				$singerImg.attr('src',data.data[0].musicSinger.singerPic);
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
});