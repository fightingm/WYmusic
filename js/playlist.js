 

$(function(){

	//获取所有歌曲
	var $playList=$('.play-list');
	var $mPage=$('#m-page');
	var $pageI=$('.page-i');
	var $pagePrev=$('.page-prev');
	var $pageNext=$('.page-next');
	var type=getProps(location.href,'type');
	var totalLen=0;
	var eachPage=35;
	var allPage=1;
	var curPage=1;
	var flag=true;
	var $showLog=$('#show-log');
	var $userHome=$('#user-home');
	var lengthUrl="";
	setLog();
	if(type==""){
		lengthUrl='http://115.28.238.193:8080/music/music/length';
	}else{
		lengthUrl='http://115.28.238.193:8080/music/music/type/length/'+type;
	}
	$.get(lengthUrl,function(data){
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
		var url="";
		if(type==''){
			url='http://115.28.238.193:8080/music/music?page='+(cur-1)+'&limit=35';
		}else{
			url='http://115.28.238.193:8080/music/music/type/'+type+'?page='+(cur-1)+'&limit=35';
		}
		$.ajax({
			type:'GET',
			url:url,
			success:function(data){
				var str='';
				for(var i=0;i<data.data.length;i++){
					str+='<li class="rcmd-item">\
							<div class="list-cover">\
								<img src='+data.data[i].musicAlbum.albumPic+' alt="">\
								<div class="bottom">\
									<i class="fa fa-headphones fa-lg" aria-hidden="true"></i>\
									<i class="fa fa-play-circle fa-lg" data-id='+data.data[i].musicId+' data-src='+data.data[i].musicAddress+' data-img='+data.data[i].musicSinger.singerPic+' data-song='+data.data[i].musicName+' data-author='+data.data[i].musicSinger.singerName+' aria-hidden="true"></i>\
								</div>\
							</div>\
							<p class="song-info">'+data.data[i].musicSinger.singerName+'</p>\
						   </li>';
				}
				$playList.html(str);
				setAudio();
				flag=true;
			}
		});
	}

	//歌曲点击播放
	var $audio=$('#audio');
	var audio=$audio[0];
	var $playingAuthorImg=$('#playing-author-img');
	var $playingSong=$('#playing-song');
	var $playingAuthorName=$('#playing-author-name');
	var $playingSongNow=$('#playing-song-now');
	var $playingSongLast=$('#playing-song-last');
	var $curPro=$('#cur-pro');
	var $pause=$('#pause');
	function setAudio(){
		var $toPlay=$('.fa-play-circle');
		var songInfo={};
		$toPlay.click(function(){
			var timer=null;
			clearInterval(timer);
			songInfo.msrc=$(this).attr('data-src');
			audio.src=songInfo.msrc;
			audio.oncanplay=function(){
				songInfo.mid=$(this).attr('data-id');
				songInfo.mimg=$(this).attr('data-img');
				songInfo.msong=$(this).attr('data-song');
				songInfo.mauthor=$(this).attr('data-author');
				songInfo.mtime=toTime(audio.duration);
				timer=setInterval(function(){
					if(audio.ended){
						clearInterval(timer);
					}else{
						setCurTime(audio.currentTime,audio.duration);
					}
				},1000);
				setPlayBar(songInfo,audio);
				setPV(songInfo.mid);
			}.bind(this);
			
		});
	}
	(function(){
		var $voiceShow=$('#voice-show');
		var $voiceControl=$('.voice-control');
		var flag=true;
		$voiceShow.click(function(){
			if(flag){
				$voiceControl.show();
			}else{
				$voiceControl.hide();
			}
			flag=!flag;
		});
	})();
	
	var $curVoice=$('#cur-voice');
	var $voiceFa=$('#voice-fa');
	startDrag({
		bar:$voiceFa.get(0),
		target:$voiceFa.get(0),
		dir:['top',0,84],
		callback:function(l,t){
			var n=Math.floor(t*100/84);
			var per=100-n;
			$curVoice.css('height',per+'%');
			audio.volume=per*0.01;
		}
	});
	function setPV(id){
		$.ajax({
			type:'POST',
			url:'http://115.28.238.193:8080/music/music/pv/count/'+id,
			success:function(){

			}
		});
		
	}
	function setPlayBar(data){
		$playingAuthorImg.attr('src',data.mimg);
		$playingSong.html(data.msong);
		$playingAuthorName.html(data.mauthor);
		$playingSongLast.html(data.mtime);
		$pause.removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');
		audio.play();
		$pause.off('click').click(function(){
			if(audio.paused){
				audio.play();
				$pause.removeClass('fa-play-circle-o').addClass('fa-pause-circle-o');
			}else{
				audio.pause();
				$pause.removeClass('fa-pause-circle-o').addClass('fa-play-circle-o');
			}
		});
	}
	
	function setCurTime(curtime,alltime){
		var procress=curtime*100/alltime+'%';
		$playingSongNow.html(toTime(curtime));
		$curPro.width(procress);
	}

	function setLog(){
		var uname=getCookie('name');
		if(uname!=""){
			$showLog.hide();
			$userHome.show().html(uname);
		}
	}
});