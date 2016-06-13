

$(function(){
	//弹出登录框
	var $notLog=$('.notLog');
	var $readyLog=$('.readyLog');
	var $showLog=$('#show-log');
	var $showLog2=$('#show-log2');
	var $userHome=$('#user-home');
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
						utoken=data.data.accessToken;
						uid=data.data.uid;
						setCookie('name',data.data.name,7);
						setCookie('token',utoken,7);
						setLog();
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
	//获取数据
	var $tableData=$('#table-data');
	var $albumImg=$('#album-img');
	var $singerName=$('#singer-name');
	var $songLen=$('#song-len');
	setLog();
	function getData(t){
		$.get('http://115.28.238.193/music/collect/get/all?accessToken='+t,function(data){
			if(data.status==200){
				var str='';
				$albumImg.attr('src',data.data[0].musicAlbum.albumPic);
				$songLen.html(data.data.length);
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
							<td class="w3">'+data.data[i].musicAlbum.singer.singerName+'</td>\
						</tr>';
				}
				$tableData.html(str);
			}
		});
	}

	var $listUl=$('#list-ul');
	function getList(t){
		$.get('http://115.28.238.193/music/musicCount/getSimilarity?accessToken='+t+'&type=1',function(data){
			if(data.status===200){
				var str="";
				for(var i=0;i<data.data.length;i++){
					str+='<li>\
							<div class="singer-img">\
								<img src="'+data.data[i].musicAlbum.albumPic+'" alt="">\
							</div>\
							<div class="singer-info">\
								<h2>'+data.data[i].musicName+'</h2>\
								<p>'+data.data[i].musicAlbum.singer.singerName+'</p>\
							</div>\
						</li>';
				}
				$listUl.html(str);
			}
		});
	}

	function checkPhone(str){
		var re=/^1\d{10}$/;
		if(re.test(str)){
			return true;
		}
		return false;
	}

	function setLog(){
		var uname=getCookie('name');
		var token=getCookie('token');
		if(uname!=""){
			$showLog.hide();
			$userHome.show().html(uname);
			$singerName.html(uname);
			$readyLog.show(); 
			getData(token);
			getList(token);
		}else{
			$notLog.show();
		}
	}
	
});