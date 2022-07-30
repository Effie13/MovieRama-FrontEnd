!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);

$(document).ready( function () {
	
	var c; 
	if( (!isMobile.any) && (window.matchMedia("(hover: hover)  and (pointer: fine)").matches) ){
		$('body').addClass('desktop');
		c=true;	
	}else{
		$('body').addClass('mobile');
		c=false;
	}
	window.desktop = c;
	
	// Nav Overlay and Menu Effects & Events
   
	$('a[href="#"]').click(function(event) {
		event.preventDefault();
	});

	var nav = $("#nav-overlay");
	$(".button a").on( 'click',function(){
		nav.toggleClass('nav-open');
		$('body').toggleClass('stop-scrolling');
		$(this).parent().fadeOut( 50, function () {
			$(this).toggleClass('btn-open').toggleClass('btn-close');
		}).delay(70).fadeIn(50);
	}); 		
	
	
	// On click Menu Open // Mobile Navigation
	
	/*$('#menu-main-navigation li.menu-item-has-children').on('click',function(e) {
			if( $(this).children('.sub-menu').css('display') == 'none' ){ 
				$('.sub-menu',$(this)).slideDown(300);	
				$(this).siblings().find('.sub-menu').slideUp(300);
			}else{
				$('.sub-menu',$(this)).slideUp();	
				$(this).siblings().find('.sub-menu').slideDown(300);
			}
	});		*/
			
	// Animate Header
	var header = $('header'), btn = $('.button');
	if ( $(document).scrollTop() > 10 ){
		header.addClass('scroll');
		$('.button').addClass('scroll-btn');
	}
	// On Scroll Changes
	document.addEventListener('scroll' ,scrollHandler, { passive: true });
	function scrollHandler(){
		var top = $(document).scrollTop();
	}
});
		
/*var $root = $('html, body');
$('.anchor').click(function () {
	$root.animate({
		scrollTop: $( $.attr(this, 'href') ).offset().top - 200
	}, 500);
	return false;
});*/