

$(function(){
	//专辑滚动
	var $preDisk=$('#pre-disk');
	var $nextDisk=$('#next-disk');
	var $diskGroup=$('.disk-group');
	var diskPosArr=[-645,0,645];
	var diskIndex=0;
	var oldIndex=1;
	initPos();
	$preDisk.click(function(){
		diskIndex--;
		diskIndex=(diskIndex+diskPosArr.length)%diskPosArr.length;
		$diskGroup.eq(diskIndex).css('left',diskPosArr[0]);
		$diskGroup.eq((diskIndex+diskPosArr.length-1)%diskPosArr.length).animate({
			left:diskPosArr[2]
		},700,'linear');
		$diskGroup.eq((diskIndex+diskPosArr.length+1)%diskPosArr.length).animate({
			left:diskPosArr[1]
		},700,'linear');
		console.log(diskIndex);
	});
	$nextDisk.click(function(){
		diskIndex++;
		diskIndex=(diskIndex+diskPosArr.length)%diskPosArr.length;
		$diskGroup.eq(diskIndex).animate({
			left:diskPosArr[0]
		},700,'swing');
		$diskGroup.eq((diskIndex+diskPosArr.length+1)%diskPosArr.length).animate({
			left:diskPosArr[1]
		},700,'swing');
		$diskGroup.eq((diskIndex+diskPosArr.length-1)%diskPosArr.length).css('left',diskPosArr[2]);
		
		console.log(diskIndex);
	});
	function initPos(){
		$diskGroup.each(function(i){
			$(this).css('left',diskPosArr[i]);
		});
	}

	//弹出登录框
	var $showLog=$('#show-log');
	var $showLog2=$('#show-log2');
	var $userHome=$('#user-home')
	var $logBox=$('#logbox');
	var $mask=$('#mask');
	$showLog.click(function(){
		$mask.show();
		$logBox.show();
	});
	$showLog2.click(function(){
		$mask.show();
		$logBox.show();
	});
	var $showRegist=$('.log-regist');
	var $regBox=$('#regbox');
	var $yzmBox=$('#yzmbox');
	$showRegist.click(function(){
		$logBox.hide();
		$regBox.show();
	});
	var $goLog=$('.go-log');
	$goLog.click(function(){
		$logBox.show();
		$regBox.hide();
		$yzmBox.hide();
	});
	$mask.click(function(){
		$(this).hide();
		$logBox.hide();
		$regBox.hide();
	});
	//登录相关
	var $doLogin=$('#do-login');
	var $logPhone=$('#log-phone');
	var $logPass=$('#log-pass');
	var $logPhoneErr=$('.log-phone-error');
	var $logPassErr=$('.log-pass-error');
	var $logArea=$('.log-area');
	var utoken='';
	var uid='';
	setLog();
	$doLogin.click(function(){
		if(checkLog()){
			$.ajax({
				type:'POST',
				url:'http://115.28.238.193:8080/music/user/validation?phone='+$logPhone.val()+'&password='+$logPass.val(),
				success:function(data){
					if(data.status==200){
						$logBox.hide();
						$showLog.hide();
						$mask.hide();
						$userHome.show().html(data.data.name);
						$logArea.html('<p>亲爱的<span class="user-name">'+data.data.name+'：</span><br /><br />欢迎来到智能推荐云音乐!!!</p>');
						utoken=data.data.accessToken;
						uid=data.data.uid;
						setCookie('name',data.data.name,7);
						setCookie('token',utoken,7);
						setCookie('uid',uid,7);
						$('.bd-list').undelegate('.add-col','click');
						$('.bd-list').delegate('.add-col','click',function(ev){
							var mid=$(this).attr('data-id');
							var tar=ev.target;
							setCol(uid,mid,utoken,tar);
						});
						location.reload();
					}else{
						$logPassErr.show().html('密码不正确，请重新输入');
					}
				}
			});
		}
	});
	function checkLog(){
		var flag=true;
		if($logPass.val().length>16||$logPass.val().length<6){
			flag=false;
			$logPassErr.show();
		}else{
			$logPassErr.hide();
		}
		if(!checkPhone($logPhone.val())){
			$logPhoneErr.show().html('请输入11位手机号');
			flag=false;
		}else{
			$.ajax({
				type:'GET',
				url:'http://115.28.238.193:8080/music/tcaptcha/isPhoneRegistered?phone='+$logPhone.val(),
				async:false,
				success:function(data){
					if(!data.status){
						$logPhoneErr.show().html('该用户不存在，请注册');
						flag=false;
					}else{
						$logPhoneErr.hide();
					}
				}
			});	
		}
		return flag;
	}
	var $toExit=$('#to-exit');
	$toExit.click(function(){
		clearCookie('name');
		clearCookie('token');
		clearCookie('uid');
		console.log(123);
		location.reload();
	});
	$userHome.hover(function(){
		console.log(123);
		$('.exit').show();
	});

	//注册相关
	var $goYzm=$('.go-yzm');
	var $regName=$('#reg-name');
	var $regSex=$("input[name='sex']:checked");
	var $regPhone=$('#reg-phone');
	var $regPass=$('#reg-pass');
	var $regYzm=$('#reg-yzm');
	var $yzmErr=$('.yzm-error');
	var $nameErr=$('.name-error');
	var $phoneErr=$('.phone-error');
	var $passErr=$('.pass-error');
	var $lastTime=$('.last-time');
	var $getYz=$('.get-yz');
	var $zcSucc=$('#zc-succ');
	var captcha=0;
	var userdata={};
	$goYzm.click(function(){
		$regSex=$("input[name='sex']:checked");
		userdata.name=$regName.val();
		userdata.phone=$regPhone.val();
		userdata.password=$regPass.val();
		userdata.sex=$regSex.val();
		if(checkall()){
			getYz(true);
		}
	});
	$getYz.click(function(){
		$getYz.hide();
		$lastTime.show();
		getYz();
	});
	
	//获取验证码及完整注册
	function getYz(first){
		$.ajax({
			type:'POST',
			url:'http://115.28.238.193:8080/music/tcaptcha?phone='+userdata.phone,
			success:function(data){
				captcha=data.captcha;
				var timer=null;
				var time=59;
				var str='';
				if(first){
					$regBox.hide();
					$yzmBox.show();
				}
				timer=setInterval(function(){
					if(time!=0){
						time--;
						str=time<10?('00:0'+time):('00:'+time);
						$lastTime.html(str);
					}else{
						clearInterval(timer);
						$lastTime.hide().html('00:59');
						$getYz.show();
					}
				},1000);
				$zcSucc.click(function(){
					if($regYzm.val()!=captcha){
						$yzmErr.show();
					}else{
						$yzmErr.hide();
						$.ajax({
							type:'POST',
							url:'http://115.28.238.193:8080/music/user?captcha='+captcha,
							contentType: "application/json",
							dataType:"json",
							data:JSON.stringify(userdata),
							success:function(data){
								if(data.status==200){
									$yzmBox.hide();
									$showLog.hide();
									$mask.hide();
									$userHome.show().html(userdata.name);
								}
							}
						});
					}
				});
			}
		});
	}
	function checkall(){
		var flag=true;
		if($regName.val()==''){
			$nameErr.show();
			flag=false;
		}else{
			$nameErr.hide();
		}
		
		if($regPass.val().length>16||$regPass.val().length<6){
			$passErr.show();
			flag=false;
		}else{
			$passErr.hide();
		}
		if(!checkPhone($regPhone.val())){
			$phoneErr.show().html('请输入11位手机号');
			flag=false;
		}else{
			$.ajax({
				type:'GET',
				url:'http://115.28.238.193:8080/music/tcaptcha/isPhoneRegistered?phone='+$regPhone.val(),
				async:false,
				success:function(data){
					if(data.status){
						$phoneErr.show().html('该用户已注册，请登录');
						flag=false;
					}else{
						$phoneErr.hide();
					}
				}
			});	
		}
		return flag;
	}

	function checkPhone(str){
		var re=/^1\d{10}$/;
		if(re.test(str)){
			return true;
		}
		return false;
	}

	//banner广告
	var $preBanner=$('#pre-banner');
	var $nextBanner=$('#next-banner');
	var $banner=$('#banner');
	var imgArr=[];
	var nowIndex=0;
	var $adsIcon=$('.ads-i');
	var timer=null;
	getBanner();
	function getBanner(){
		$.ajax({
				type:'GET',
				url:'http://115.28.238.193:8080/music/banner',
				success:function(data){
					imgArr=data.data;
					setBanner();
				}
			});
	}
	function setBanner(){
		$preBanner.click(function(){
			setFocus('prev');
		});
		$nextBanner.click(function(){
			setFocus('next');
		});
		timer=setInterval(function(){
			setFocus('next');
		},5000);
		$banner.eq(0).css('backgroundImage','url('+imgArr[0]['bannerPic']+')');
		function setFocus(dir){
			$adsIcon.eq(nowIndex).removeClass('active');
			dir=='next'?nowIndex++:nowIndex--;
			nowIndex=(nowIndex+imgArr.length)%imgArr.length;
			$banner.css('backgroundImage','url('+imgArr[nowIndex]['bannerPic']+')');
			$adsIcon.eq(nowIndex).addClass('active');
		}
	}

	//歌手信息获取
	var $singerList=$('#singer-list');

	getSinger();
	function getSinger(){
		var str='';
		$.get('http://115.28.238.193:8080/music/singer?page=0&limit=10',function(data){
			if(data.status==200){
				for(var i=0;i<data.data.length;i++){
					str+='<li>\
							<a href="player.html?id='+data.data[i].singerId+'">\
								<div class="singer-img">\
									<img src='+data.data[i].singerPic+'>\
								</div>\
								<div class="singer-info">\
									<h2>'+data.data[i].singerName+'</h2>\
									<p>'+data.data[i].singerDescription+'</p>\
								</div>\
							</a>\
						</li>';
				}
				$singerList.html(str);
			}
		});
	}

	//热门推荐获取
	var $rcmdList=$('#rcmd-list');
	getRcmd();
	function getRcmd(){
		var str='';
		$.get('http://115.28.238.193:8080/music/album/hot?page=0&limit=8',function(data){
			if(data.status==200){
				for(var i=0;i<data.data.length;i++){
					str+='<li class="rcmd-item">\
						<div class="list-cover">\
							<img src='+data.data[i].albumPic+' alt="">\
							<div class="bottom">\
								<i class="fa fa-headphones fa-lg" aria-hidden="true"></i>\
								<i class="fa fa-play-circle fa-lg" aria-hidden="true"></i>\
							</div>\
						</div>\
						<p class="song-info">'+data.data[i].singer.singerName+'</p>\
					   </li>';
				}
				$rcmdList.html(str);
			}
		});
	}

	//专辑数据获取
	var $disk1=$('#disk-group1');
	var $disk2=$('#disk-group2');
	var $disk3=$('#disk-group3');
	getAlbum();
	function getAlbum(){
		var str1='';
		var str2='';
		var str3='';
		$.get('http://115.28.238.193:8080/music/album/new?page=0&limit=15',function(data){
			if(data.status==200){
				for(var i=0;i<data.data.length;i++){
					if(i<5){
						str1+='<li class="disk-item">\
									<a href="songlist.html?id='+data.data[i].albumId+'">\
										<img src='+data.data[i].albumPic+' alt="">\
									</a>\
									<p class="song-info">'+data.data[i].albumName+'</p>\
									<p class="song-author">'+data.data[i].singer.singerName+'</p>\
								</li>';
					}else if(i<10){
						str2+='<li class="disk-item">\
									<a href="songlist.html?id='+data.data[i].albumId+'">\
										<img src='+data.data[i].albumPic+' alt="">\
									</a>\
									<p class="song-info">'+data.data[i].albumName+'</p>\
									<p class="song-author">'+data.data[i].singer.singerName+'</p>\
								</li>';
					}else{
						str3+='<li class="disk-item">\
									<a href="songlist.html?id='+data.data[i].albumId+'">\
										<img src='+data.data[i].albumPic+' alt="">\
									</a>\
									<p class="song-info">'+data.data[i].albumName+'</p>\
									<p class="song-author">'+data.data[i].singer.singerName+'</p>\
								</li>';
					}
				}
				$disk1.html(str1);
				$disk2.html(str2);
				$disk3.html(str3);
			}
		});
	}

	//榜单数据获取
	var $bdHot=$('#bd-hot');
	var $bdNew=$('#bd-new');
	getBd();
	function getBd(){
		var str1='';
		var str2='';
		var token=getCookie('token');
		var uid=getCookie('uid');
		$.get('http://115.28.238.193:8080/music/music/hot?page=0&limit=10',function(data){
			if(data.status==200){
				var mid=data.data[0].musicId;
				var index=1;
				var musicName=data.data[0].musicName;
				var musicId=data.data[0].musicId;
				
				if(token!=""){
					setData(index,musicName,musicId);
				}else{
					for(var i=0;i<data.data.length;i++){
						str1+='<p class="bd-con-i">\
									<span class="song-num">'+(i+1)+'</span>\
									<span class="song-name">'+data.data[i].musicName+'</span>\
									<span class="song-operate">\
										<i class="fa fa-play-circle-o fa-lg to-play" aria-hidden="true" data-id='+data.data[i].musicId+'></i>\
										<i class="fa fa-plus fa-lg" aria-hidden="true"></i>\
										<i class="fa fa-heart-o fa-lg add-col" aria-hidden="true" data-id='+data.data[i].musicId+'></i>\
									</span>\
								</p>';
					}
					$bdHot.html(str1);
				}
				function setData(index,musicName,musicId){
					$.get('http://115.28.238.193/music/collect/'+uid+'/'+musicId+'?accessToken='+token,function(d){
						if(d.data.status){
							var col='fa fa-heart fa-lg add-col';
						}else{
							var col='fa fa-heart-o fa-lg add-col';
						}
						str1+='<p class="bd-con-i">\
									<span class="song-num">'+index+'</span>\
									<span class="song-name">'+musicName+'</span>\
									<span class="song-operate">\
										<i class="fa fa-play-circle-o fa-lg to-play" aria-hidden="true" data-id='+musicId+'></i>\
										<i class="fa fa-plus fa-lg" aria-hidden="true"></i>\
										<i class="'+col+'" aria-hidden="true" data-id='+musicId+'></i>\
									</span>\
								</p>';
						index++;
						if(index>data.data.length){
							$bdHot.html(str1);
							return;
						}else{
							setData(index,data.data[index-1].musicName,data.data[index-1].musicId);
						}
					});
				}
			};
		});
		$.get('http://115.28.238.193:8080/music/music/type/new?page=0&limit=10',function(data){
			if(data.status==200){
				var mid=data.data[0].musicId;
				var index=1;
				var musicName=data.data[0].musicName;
				var musicId=data.data[0].musicId;
				
				if(token!=""){
					setData(index,musicName,musicId);
				}else{
					for(var i=0;i<data.data.length;i++){
						str2+='<p class="bd-con-i">\
									<span class="song-num">'+(i+1)+'</span>\
									<span class="song-name">'+data.data[i].musicName+'</span>\
									<span class="song-operate">\
										<i class="fa fa-play-circle-o fa-lg to-play" aria-hidden="true" data-id='+data.data[i].musicId+'></i>\
										<i class="fa fa-plus fa-lg" aria-hidden="true"></i>\
										<i class="fa fa-heart-o fa-lg add-col" aria-hidden="true" data-id='+data.data[i].musicId+'></i>\
									</span>\
								</p>';
					}
					$bdNew.html(str2);
				}
				function setData(index,musicName,musicId){
					$.get('http://115.28.238.193/music/collect/'+uid+'/'+musicId+'?accessToken='+token,function(d){
						if(d.data.status){
							var col='fa fa-heart fa-lg add-col';
						}else{
							var col='fa fa-heart-o fa-lg add-col';
						}
						str2+='<p class="bd-con-i">\
									<span class="song-num">'+index+'</span>\
									<span class="song-name">'+musicName+'</span>\
									<span class="song-operate">\
										<i class="fa fa-play-circle-o fa-lg to-play" aria-hidden="true" data-id='+musicId+'></i>\
										<i class="fa fa-plus fa-lg" aria-hidden="true"></i>\
										<i class="'+col+'" aria-hidden="true" data-id='+musicId+'></i>\
									</span>\
								</p>';
						index++;
						if(index>data.data.length){
							$bdNew.html(str2);
							return;
						}else{
							setData(index,data.data[index-1].musicName,data.data[index-1].musicId);
						}
					});
				}
			};
		});
	}
	function setCol(u,m,t,el){
		var $el=$(el);
		if(!t){
			alert('请登录');
		}else{
			if($el.hasClass('fa-heart')){
				$.ajax({
					type:'PUT',
					url:'http://115.28.238.193/music/collect/'+u+'/'+m+'?accessToken='+t,
					success:function(data){
						if(data.status==200){
							$el.removeClass('fa-heart').addClass('fa-heart-o');
						}else{
							alert('取消收藏失败');
						}
					}
				});
			}else{
				$.ajax({
					type:'POST',
					url:'http://115.28.238.193/music/collect/'+u+'/'+m+'?accessToken='+t,
					success:function(data){
						if(data.status==200){
							$el.removeClass('fa-heart-o').addClass('fa-heart');
						}else{
							alert('收藏失败');
						}
					}
				});
			}
			
		}
	}
	$('.bd-list').delegate('.add-col','click',function(ev){
		var mid=$(this).attr('data-id');
		var uid=getCookie('uid');
		var token=getCookie('token');
		var tar=ev.target;
		setCol(uid,mid,token,tar);
	});
	$('.bd-list').delegate('.to-play','click',function(){
		var mid=$(this).attr('data-id');
		var t=getCookie('token');
		if(t!=""){
			$.ajax({
				type:"POST",
				url:"http://115.28.238.193/music/musicCount/"+mid+"?accessToken="+t,
				success:function(data){
				}
			})
		}
	});
	function setLog(){
		var uname=getCookie('name');
		if(uname!=""){
			$showLog.hide();
			$userHome.show().html(uname);
			$logArea.html('<p>亲爱的<span class="user-name">'+uname+'：</span><br /><br />欢迎来到智能推荐云音乐!!!</p>');
		}
	}
});