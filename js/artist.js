

$(function(){



	//弹出登录框
	var $showLog=$('#show-log');
	var $showLog2=$('#show-log2');
	var $userHome=$('#user-home')
	var $logBox=$('#logbox');
	var $mask=$('#mask');
	var $showLog=$('#show-log');
	var $userHome=$('#user-home');
	setLog();
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
						$logArea.html('<p><span class="user-name">'+data.data.name+'</span>欢迎来到智能推荐云音乐!!!</p>');
						utoken=data.data.accessToken;
						uid=data.data.uid;
						$('.bd-list').undelegate('.add-col','click');
						$('.bd-list').delegate('.add-col','click',function(){
							var mid=$(this).attr('data-id');
							setCol(uid,mid,utoken);
						});
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

	function checkPhone(str){
		var re=/^1\d{10}$/;
		if(re.test(str)){
			return true;
		}
		return false;
	}

	//歌手信息获取
	var $playList=$('#play-list');

	getSinger();
	function getSinger(){
		var str='';
		$.get('http://115.28.238.193:8080/music/singer?page=0&limit=100',function(data){
			if(data.status==200){
				for(var i=0;i<data.data.length;i++){
					if(i<10){
						str+='<li class="rcmd-item">\
								<div class="list-cover">\
									<img src='+data.data[i].singerPic+'>\
								</div>\
								<p class="singer-info">'+data.data[i].singerName+'</p>\
							</li>';
					}else if(i==10){
						str+='<li class="line"></li>\
							<li class="sml">\
								<a href="javascript:;">'+data.data[i].singerName+'</a>\
							</li>';
					}else{
						str+='<li class="sml">\
								<a href="javascript:;">'+data.data[i].singerName+'</a>\
							</li>';
					}
					
				}
				$playList.html(str);
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