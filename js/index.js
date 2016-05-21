

$(function(){
	//广告轮播
	var $preBanner=$('#pre-banner');
	var $nextBanner=$('#next-banner');
	var $banner=$('#banner');
	var imgArr=['ad01.jpg','ad02.jpg','ad03.jpg'];
	var nowIndex=0;
	var $adsIcon=$('.ads-i');
	var timer=null;
	$preBanner.click(function(){
		setFocus('prev');
	});
	$nextBanner.click(function(){
		setFocus('next');
	});
	timer=setInterval(function(){
		setFocus('next');
	},3000);
	function setFocus(dir){
		$adsIcon.eq(nowIndex).removeClass('active');
		dir=='next'?nowIndex++:nowIndex--;
		nowIndex=(nowIndex+imgArr.length)%imgArr.length;
		$banner.css('backgroundImage','url(imgs/'+imgArr[nowIndex]+')');
		$adsIcon.eq(nowIndex).addClass('active');
	}

	//专辑滚动
	var $preDisk=$('#pre-disk');
	var $nextDisk=$('#next-disk');
	var $diskGroup=$('.disk-group');
	var diskPosArr=[-645,0,645];
	var diskIndex=0;
	var oldIndex=1;
	initPos();
	$preDisk.click(function(){
		diskIndex++;
		diskIndex=(diskIndex+diskPosArr.length)%diskPosArr.length;
		$diskGroup.eq(0).css('left',diskPosArr[diskIndex]);
		$diskGroup.eq(1).css('left',diskPosArr[(diskIndex+diskPosArr.length+1)%diskPosArr.length]);
		$diskGroup.eq(2).css('left',diskPosArr[(diskIndex+diskPosArr.length-1)%diskPosArr.length]);
		console.log(diskIndex);
	});
	$nextDisk.click(function(){
		diskIndex--;
		diskIndex=(diskIndex+diskPosArr.length)%diskPosArr.length;
		$diskGroup.eq(0).css('left',diskPosArr[diskIndex]);
		$diskGroup.eq(1).css('left',diskPosArr[(diskIndex+diskPosArr.length+1)%diskPosArr.length]);
		$diskGroup.eq(2).css('left',diskPosArr[(diskIndex+diskPosArr.length-1)%diskPosArr.length]);
		console.log(diskIndex);
	});
	function initPos(){
		$diskGroup.each(function(i){
			$(this).css('left',diskPosArr[i]);
		});
	}
});