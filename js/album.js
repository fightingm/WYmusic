

$(function(){

	//获取所有歌曲
	var $playList=$('.play-list');
	var $mPage=$('#m-page');
	var $pageI=$('.page-i');
	var $pagePrev=$('.page-prev');
	var $pageNext=$('.page-next');
	var type=location.search.split('=')[1];
	var totalLen=0;
	var eachPage=35;
	var allPage=1;
	var curPage=1;
	var flag=true;
	var $showLog=$('#show-log');
	var $userHome=$('#user-home');
	setLog();
	$.get('http://115.28.238.193:8080/music/album/new/length',function(data){
		totalLen=data.data.length;
		allPage=Math.ceil(totalLen/eachPage);
		setPage(1,allPage);
		if(totalLen){
			$mPage.delegate('.page-i','click',function(ev){
				curPage=$(this).text();
				console.log(curPage);
				setPage(curPage,allPage);
			});
			$mPage.delegate('.page-prev','click',function(ev){
				if(flag){
					curPage--;
					if(curPage<1){
						curPage=1;
						return;
					}
				}
				setPage(curPage,allPage);
			});
			$mPage.delegate('.page-next','click',function(ev){
				if(flag){
					curPage++;
					if(curPage>allPage){
						curPage=allPage;
						return;
					}
					setPage(curPage,allPage);
				}
			});
		}
	});
	

	//歌曲分页		
	function setPage(cur,all){
		var pageHtml=showPages(cur,all);
		getData(cur);
		$mPage.html(pageHtml);
	}
	function getData(cur){
		flag=false;
		$.ajax({
			type:'GET',
			url:'http://115.28.238.193:8080/music/album/new?page='+(cur-1)+'&limit=35',
			success:function(data){
				var str='';
				for(var i=0;i<data.data.length;i++){
					str+='<li class="rcmd-item">\
							<div class="list-cover">\
								<img src='+data.data[i].albumPic+' alt="">\
							</div>\
							<p class="song-info">'+data.data[i].albumName+'</p>\
							<p class="song-info">'+data.data[i].singer.singerName+'</p>\
						   </li>';
				}
				$playList.html(str);
				flag=true;
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