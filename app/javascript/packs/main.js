$(document).ready(function () {
	"use strict"; // start of use strict

	/*==============================
	Menu
	==============================*/
	$('.header__btn').on('click', function(e) {
		e.stopPropagation();
		$(this).addClass('header__btn--active');
		$('.header__menu').addClass('header__menu--active');
		if ($(this).hasClass('header__btn--active') == true) {
			$('body').css('overflow','hidden');
		} else {
			$('body').css('overflow','auto');
		}
	});
	$(document).click(function (e) {
		if ($('.header__btn').hasClass('header__btn--active') == true) {
			$('.header__menu').removeClass('header__menu--active');
			$('.header__btn').removeClass('header__btn--active');
			$('body').css('overflow','auto');
		}
	});

	$('.header__search .close, .header__action--search button').on('click', function() {
		$('.header__search').toggleClass('header__search--active');
	});

	/*==============================
	Multi level dropdowns
	==============================*/
	$('ul.dropdown-menu [data-toggle="dropdown"]').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();

		$(this).siblings().toggleClass('show');
	});

	$(document).on('click', function (e) {
		$('.dropdown-menu').removeClass('show');
	});

	/*==============================
	Carousel
	==============================*/
	$('.main__carousel--collections').owlCarousel({
		mouseDrag: true,
		touchDrag: true,
		dots: true,
		loop: true,
		autoplay: false,
		smartSpeed: 600,
		margin: 20,
		autoHeight: true,
		responsive: {
			0 : {
				items: 2,
			},
			576 : {
				items: 2,
			},
			768 : {
				items: 3,
				margin: 30,
			},
			992 : {
				items: 4,
				margin: 30,
			},
			1200 : {
				items: 5,
				margin: 30,
				mouseDrag: false,
				dots: false,
			},
		}
	});

	$('.main__carousel--live').owlCarousel({
		mouseDrag: true,
		touchDrag: true,
		dots: true,
		loop: true,
		autoplay: true,
		autoplayHoverPause: true,
		autoplayTimeout: 5000,
		smartSpeed: 600,
		margin: 20,
		autoHeight: true,
		responsive: {
			0 : {
				items: 1,
			},
			576 : {
				items: 2,
			},
			768 : {
				items: 3,
				margin: 30,
			},
			992 : {
				items: 4,
				margin: 30,
			},
			1200 : {
				items: 4,
				margin: 30,
				mouseDrag: false,
				dots: false,
			},
		}
	});

	$('.main__carousel--explore').owlCarousel({
		mouseDrag: true,
		touchDrag: true,
		dots: true,
		loop: true,
		autoplay: true,
		autoplayHoverPause: true,
		autoplayTimeout: 5000,
		smartSpeed: 600,
		margin: 20,
		autoHeight: true,
		responsive: {
			0 : {
				items: 1,
			},
			576 : {
				items: 2,
			},
			768 : {
				items: 3,
				margin: 30,
			},
			992 : {
				items: 4,
				margin: 30,
			},
			1200 : {
				items: 4,
				margin: 30,
				mouseDrag: false,
				dots: false,
			},
		}
	});

	$('.card__cover--carousel').owlCarousel({
		mouseDrag: true,
		touchDrag: true,
		dots: true,
		loop: true,
		autoplay: true,
		autoplayHoverPause: true,
		autoplayTimeout: 5000,
		autoplaySpeed: 800,
		smartSpeed: 800,
		margin: 20,
		items: 1,
	});

	/*==============================
	Navigation
	==============================*/
	$('.main__nav--prev').on('click', function() {
		var carouselId = $(this).attr('data-nav');
		$(carouselId).trigger('prev.owl.carousel');
	});
	$('.main__nav--next').on('click', function() {
		var carouselId = $(this).attr('data-nav');
		$(carouselId).trigger('next.owl.carousel');
	});

	/*==============================
	Partners
	==============================*/
	$('.partners').owlCarousel({
		mouseDrag: false,
		touchDrag: false,
		dots: false,
		loop: true,
		autoplay: true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
		smartSpeed: 600,
		margin: 20,
		responsive : {
			0 : {
				items: 2,
			},
			576 : {
				items: 3,
				margin: 20,
			},
			768 : {
				items: 4,
				margin: 30,
			},
			992 : {
				items: 4,
				margin: 30,
			},
			1200 : {
				items: 6,
				margin: 30,
			},
			1900 : {
				items: 8,
				margin: 30,
			},
		}
	});

	/*==============================
	Modal
	==============================*/
	$('.open-video, .open-map').magnificPopup({
		disableOn: 0,
		fixedContentPos: true,
		type: 'iframe',
		preloader: false,
		removalDelay: 300,
		mainClass: 'mfp-fade',
		closeOnBgClick: false ,
		enableEscapeKey: false,
	});

	$('.asset__img').magnificPopup({
		fixedContentPos: true,
		type: 'image',
		closeOnContentClick: true,
		closeBtnInside: false,
		mainClass: 'my-mfp-zoom-in',
		closeOnBgClick: false ,
		enableEscapeKey: false,
		image: {
			verticalFit: true
		},
		zoom: {
			enabled: true,
			duration: 400
		}
	});

	$('.open-modal').magnificPopup({
		fixedContentPos: true,
		fixedBgPos: true,
		overflowY: 'auto',
		type: 'inline',
		preloader: false,
		focus: '#username',
		modal: false,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in',
		closeOnBgClick: false ,
		enableEscapeKey: false,
	});

	$('.modal__close').on('click', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});

	/*==============================
	Select
	==============================*/
	$('.main__select').select2({
		minimumResultsForSearch: Infinity
	});

	/*==============================
	Section bg
	==============================*/
	$('.main__video-bg, .author__cover--bg, .main__author, .collection__cover').each(function(){
		if ($(this).attr('data-bg')){
			$(this).css({
				'background': 'url(' + $(this).data('bg') + ')',
				'background-position': 'center center',
				'background-repeat': 'no-repeat',
				'background-size': 'cover'
			});
		}
	});

	/*==============================
	Upload file
	==============================*/
	$('.sign__file-upload').on('change', function() {
		var videoLabel  = $(this).attr('data-name');

		if ($(this).val() != '') {
			$(videoLabel).text($(this)[0].files[0].name);
		} else {
			$(videoLabel).text('Upload file');
		}
	});

	/*==============================
	Countdown
	==============================*/
	$('.asset__clock').countdown('2022/12/01', function(event) {
		$(this).html(event.strftime('%D days %H:%M:%S'));
	});

    /*==============================
     Scrollbar
     ==============================*/
    var Scrollbar = window.Scrollbar;

    if ($('#asset__actions--scroll').length) {
        Scrollbar.init(document.querySelector('#asset__actions--scroll'), {
            damping: 0.1,
            renderByPixels: true,
            alwaysShowTracks: true,
            continuousScrolling: false,
        });
    }

    function readURLSingle(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#my-preview-section').html('<img id="img_prv" width="300" height="300" src="preview.img" controls/>')
                $('#img_prv')[0].src = URL.createObjectURL(input.files[0]);
                $('#my-preview-section').hide();
                $('#my-preview-section').fadeIn(650);
                }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function readURLSingleAudio(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
//	            $('#my-preview-section').css('background-image', 'url(/assets/audio-file-icon.png)');
                $('#my-preview-section').hide();
                $('#my-preview-section').fadeIn(650);

                $('#my-preview-section').html('<audio width="300" height="300" controls><source src="mov_bbb.mp4" id="audio_here"> </audio>')
                $('#audio_here')[0].src = URL.createObjectURL(input.files[0]);
                $('#audio_here').parent()[0].load();

                $('#imagePreviewRes').css({
                    'width': '100px',
                    'height': '100px',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'margin-left': 'auto',
                    'margin-right': 'auto',
                });
                $('#close-preview-button').css('display', 'inline-block');
                $('#imagePreviewRes').css('background-image', 'url(/assets/audio-file-icon.png)');
                $('#placeholder').fadeOut(100);
                $('#file-1').fadeOut(100);
                $('#choose_file_selected').fadeOut(100);
                $('#imagePreviewRes').hide();
                $('#imagePreviewRes').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function readURLSingleVideo(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {

//                $('#my-preview-section').css('background-image', 'url(/assets/video-file-icon.png)');
                $('#my-preview-section').hide();
                $('#my-preview-section').fadeIn(650);

                $('#my-preview-section').html('<video width="300" height="300" controls><source src="mov_bbb.mp4" id="video_here"> </video>')
                $('#video_here')[0].src = URL.createObjectURL(input.files[0]);
                $('#video_here').parent()[0].load();

                $('#imagePreviewRes').css({
                    'width': '100px',
                    'height': '100px',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'margin-left': 'auto',
                    'margin-right': 'auto',
                });
                $('#close-preview-button').css('display', 'inline-block');
                $('#imagePreviewRes').css('background-image', 'url(/assets/video-file-icon.png)');
                $('#placeholder').fadeOut(100);
                $('#file-1').fadeOut(100);
                $('#choose_file_selected').fadeOut(100);
                $('#imagePreviewRes').hide();
                $('#imagePreviewRes').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    // $("#file-1").change(function(e) {
    //     var file = e.currentTarget.files[0];
    //     if (file.type == "audio/mpeg") {
    //         readURLSingleAudio(this,'audio');
    //     }if (file.type == "video/mp4") {
    //         readURLSingleVideo(this,'audio');
    //     }else{
    //         readURLSingle(this);
    //     }

    // });

});


