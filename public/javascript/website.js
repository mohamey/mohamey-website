$(document).ready(function() {

	$('.profile-img').fadeIn(1500);
	$('.profile-caption').fadeIn(3000);

	$("#about-button").click(function() {
		$('html, body').scrollTo(document.getElementById('About-Me'), 1000);
		if($("#nav-togglerer").attr("aria-expanded")=="true")
			$("#nav-togglerer").click();
	});

	$("#experience-button").click(function() {
		$('html, body').scrollTo(document.getElementById('experience'), 1000);
		if($("#nav-togglerer").attr("aria-expanded")=="true")
			$("#nav-togglerer").click();
	});

	$("#skills-button").click(function() {
		$('html, body').scrollTo(document.getElementById('skills'), 1000);
		if($("#nav-togglerer").attr("aria-expanded")=="true")
			$("#nav-togglerer").click();
	});

	$("#contact-button").click(function() {
		$('html, body').scrollTo(document.getElementById('contact'), 1000);
		if($("#nav-togglerer").attr("aria-expanded")=="true")
			$("#nav-togglerer").click();
	});

	$("#landing-button").click(function() {
		$('html, body').scrollTo(document.getElementById('landing-banner'), 1000);
		if($("#nav-togglerer").attr("aria-expanded")=="true")
			$("#nav-togglerer").click();
	});

	$(".profile-caption").fitText();
});

function redirect(){
	window.location.href = "http://mohamey.me/thanks.php";
}