

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
	var $userHome=$('#user-home')
	var $logBox=$('#logbox');
	var $mask=$('#mask');
	$showLog.click(function(){
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
						$userHome.show().html(captcha.name);
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
									$userHome.show().html(captcha.name);
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
	
});