import Web3 from "web3";

$(document).ready(function(){

	if (window.web3 && window.web3.eth) {
		checkNetwork();
	}

	window.addEventListener("ajax:before", (e) => {
		$(".loading-gif").show();
		$('body').css('overflow','hidden');
	});

	window.addEventListener("ajax:complete", (e) => {
		$(".loading-gif").hide();
		$('body').css('overflow','auto');
	});

	$(document).on("change", ".localeChange", function () {
		window.location.href = "/?locale=" + $(".localeChange option:selected").val()
	})


	function readURL(input, previewId) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();
	        reader.onload = function(e) {
	            $(previewId).css('background-image', 'url('+e.target.result +')');
	            $(previewId).hide();
	            $(previewId).fadeIn(650);
	        }
	        reader.readAsDataURL(input.files[0]);
	    }
	}
	
	$("#imageUpload").change(function() {
	  readURL(this, '#imagePreview');
	});

	$("#bannerUpload").change(function() {
		readURL(this, '#bannerPreview');
	});

	function readURLSingle(input, file, previewSection, imagePreview, closePreviewBtn, placeholder, fileId, chooseFile, coverImg) {
		var ftype = file.type;
		var fsize = file.size / 1024 / 1024; // in MBs
    if (fsize > 30) {
			return toastr.error('Invalid file size!. Must be less than 30MB');
		}
		var imgExt = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
		var audExt = ['audio/mp3', 'audio/webm', 'audio/mpeg'];
		var vidExt = ['video/mp4', 'video/webm'];
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				if (imgExt.includes(ftype)) {
					previewSection.css('background-image', 'url('+e.target.result +')');
					previewSection.css({ 
						'width': '100%', 
						'height': '225px',
						'border-radius': '15px', 
						'background-size': 'cover',
						'background-repeat': 'no-repeat',
						'background-position': 'center',
						'margin-left': 'auto',
						'margin-right': 'auto',
					});
					previewSection.hide();
					previewSection.fadeIn(650);
					imagePreview.css('background-image', 'url('+e.target.result +')');
					imagePreview.css({ 'height': '225px' });
				} else if (coverImg) {
					return toastr.error('Invalid file type!');
				} else if (audExt.includes(ftype)) {
					$('.coverUpload').removeClass("hide");
					$('#file-2').prop('required', true);
					previewSection.hide();
					previewSection.fadeIn(650);
					imagePreview.html('<audio width="300" height="300" controls><source src="mov_bbb.mp4" id="audio_here"> </audio>');
					imagePreview.css({ 'height': '55px' });
					$('#audio_here')[0].src = URL.createObjectURL(input.files[0]);
					$('#audio_here').parent()[0].load();
				} else if (vidExt.includes(ftype)) {
					$('.coverUpload').removeClass("hide");
					$('#file-2').prop('required', true);
					previewSection.hide();
					previewSection.fadeIn(650);
					imagePreview.html('<video width="300" height="200" controls><source src="mov_bbb.mp4" id="video_here"> </video>');
					imagePreview.css({ 'height': '225px' });
					$('#video_here')[0].src = URL.createObjectURL(input.files[0]);
					$('#video_here').parent()[0].load();
				} else {
					return toastr.error('Invalid file type!');
				}
				imagePreview.css({ 
					'width': '300px', 
					'background-size': 'cover',
					'background-repeat': 'no-repeat',
					'background-position': 'center',
					'margin-left': 'auto',
					'margin-right': 'auto',
					'border-radius': '15px'
				});
				closePreviewBtn.css('display', 'inline-block');
				placeholder.fadeOut(100);
				fileId.fadeOut(100);
				chooseFile.fadeOut(100);
				imagePreview.hide();
				imagePreview.fadeIn(650);
			}

			reader.readAsDataURL(input.files[0]);
		}
	}

	$("#file-1").change(function(e) {
		var file = e.currentTarget.files[0];
		var previewSection = $('#my-preview-section');
		var imagePreview = $('#imagePreviewRes');
		var closePreviewBtn = $('#close-preview-button');
		var placeholder = $('#placeholder');
		var fileId = $('#file-1');
		var chooseFile = $('#choose_file_selected');
		readURLSingle(this, file, previewSection, imagePreview, closePreviewBtn, placeholder, fileId, chooseFile, false);
	});

	$("#file-2").change(function(e) {
		var file = e.currentTarget.files[0];
		var previewSection = $('#my-preview-section');
		var imagePreview = $('#imagePreviewRes2');
		var closePreviewBtn = $('#close-preview-button2');
		var placeholder = $('#placeholder2');
		var fileId = $('#file-2');
		var chooseFile = $('#choose_file_selected2');
		readURLSingle(this, file, previewSection, imagePreview, closePreviewBtn, placeholder, fileId, chooseFile, true);
	});

	function closePreview(previewSection, imagePreview, closePreviewBtn, placeholder, fileId, chooseFile) {
		fileId.val('');
		placeholder.fadeIn(100);
		fileId.fadeIn(100);
		chooseFile.fadeIn(100);
		chooseFile.html('Choose file');
		imagePreview.css({ 
			'width': 'auto', 
			'height': 'auto', 
			'background-size': 'cover',
			'background-repeat': 'no-repeat',
			'background-position': 'center',
			'margin-left': 'auto',
			'margin-right': 'auto'
		});
		closePreviewBtn.css('display', 'none');
		imagePreview.css('background-image', 'none');
		imagePreview.html('');
		previewSection.css('background-image', 'none');
		previewSection.html('');
	}

	$('#close-preview-button').click(function(){
		var previewSection = $('#my-preview-section');
		var imagePreview = $('#imagePreviewRes');
		var closePreviewBtn = $('#close-preview-button');
		var placeholder = $('#placeholder');
		var fileId = $('#file-1');
		var chooseFile = $('#choose_file_selected');
		closePreview(previewSection, imagePreview, closePreviewBtn, placeholder, fileId, chooseFile);
		$('.coverUpload').addClass("hide");
		$('#file-2').prop('required', false);
	});

	$('#close-preview-button2').click(function(){
		var previewSection = $('#my-preview-section');
		var imagePreview = $('#imagePreviewRes2');
		var closePreviewBtn = $('#close-preview-button2');
		var placeholder = $('#placeholder2');
		var fileId = $('#file-2');
		var chooseFile = $('#choose_file_selected2');
		closePreview(previewSection, imagePreview, closePreviewBtn, placeholder, fileId, chooseFile);
	});


	$('#token-maximize').click(function(){
		$('.token-section').addClass('main-div-js-element');
		$('.display-section-heart-maximize').css('display','none');
		$('.display-section-heart-minimize').css('display','block');
		$('.heading-token-details-mm').css('display','block');
		$('.token-image').addClass('img-div-js-element');
		$('.token-image img').addClass('img-js-element');
		$('.image_get_attachment').addClass('height-auto-token');
	});

	$('#token-minimize').click(function(){
		$('.token-section').removeClass('main-div-js-element');
		$('.display-section-heart-maximize').css('display','flex');
		$('.display-section-heart-minimize').css('display','none');
		$('.heading-token-details-mm').css('display','none');
		$('.token-image').removeClass('img-div-js-element');
		$('.token-image img').removeClass('img-js-element');
		$('.image_get_attachment').removeClass('height-auto-token');
	});

	
	$('#header-carousel').owlCarousel({
		loop: false,
		margin: 10,
		dots: false,
		nav: true,
		responsive: {
			0: {
				items: 1
			},
			600: {
				items: 1
			},
			1000: {
				items: 1
			}
		}
	});

	async function checkNetwork(){
		if (window.web3 && window.web3.eth) {
			var network = await web3.eth.net.getNetworkType()
			if (network === 'main'){
				$(".loading-gif-network").hide();
				loadBalance()
			} else {
				$(".loading-gif-network").show();
			}
		}
	}

	function loadBalance() {
		if (window.web3 && window.web3.eth) {
			window.updateEthBalance()
		}
	}

	window.clearToastr = async function clearToastr() {
		$('.toast').remove();
	}

	setInterval(function() {
		checkNetwork()
	}, 10000);

});
