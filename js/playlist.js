

$(function(){

	//获取所有歌曲
	var $playList=$('.play-list');
	var type=location.search.split('=')[1];
	$.ajax({
		type:'GET',
		url:'http://115.28.238.193:8080/music/music?page=0&limit=30',
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
		}
	});

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
});