
//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
function email_test(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
let unlock = true;
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
	for (let index = 0; index < forms.length; index++) {
		const el = forms[index];
		el.addEventListener('submit', form_submit);
	}
}
async function form_submit(e) {
	let btn = e.target;
	console.log(btn);
	let form = btn.closest('form');
	console.log(form);
	let error = form_validate(form);
	if (error == 0) {
		let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
		let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
		const message = form.getAttribute('data-message');
		const ajax = form.getAttribute('data-ajax');
		const test = form.getAttribute('data-test');

		//SendForm
		if (ajax) {
			e.preventDefault();
			let formData = new FormData(form);
			form.classList.add('_sending');
			let response = await fetch(formAction, {
				method: formMethod,
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				form.classList.remove('_sending');
				if (message) {
					popup_open(message + '-message');
				}
				form_clean(form);
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		}
		// If test
		if (test) {
			e.preventDefault();
			popup_open(message + '-message');
			form_clean(form);
			console.log('Sended');
		}
	} else {
		let form_error = form.querySelectorAll('._error');
		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}
		e.preventDefault();
	}
}
function form_validate(form) {
	let error = 0;
	let form_req = form.querySelectorAll('._req');
	console.log(form_req);
	if (form_req.length > 0) {
		for (let index = 0; index < form_req.length; index++) {
			const el = form_req[index];
			if (!_is_hidden(el)) {
				error += form_validate_input(el);
			}
		}
	}
	return error;
}
function form_validate_input(input) {
	let error = 0;
	let input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			let em = input.value.replace(" ", "");
			input.value = em;
		}
		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}
	return error;
}
function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
	let input_error_text = input.getAttribute('data-error');
	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}
function form_remove_error(input) {
	input.classList.remove('_error');
	input.parentElement.classList.remove('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
}
function form_clean(form) {
	let inputs = form.querySelectorAll('input,textarea');
	for (let index = 0; index < inputs.length; index++) {
		const el = inputs[index];
		el.parentElement.classList.remove('_focus');
		el.classList.remove('_focus');
		el.value = el.getAttribute('data-value');
	}
	let checkboxes = form.querySelectorAll('.checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
	let selects = form.querySelectorAll('select');
	if (selects.length > 0) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}

//BodyLock
function body_lock(delay) {
	let body = document.querySelector("body");
	if (body.classList.contains('_lock')) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}
function body_lock_remove(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			body.classList.remove("_lock");
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
function body_lock_add(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapping').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapping').offsetWidth + 'px';
		body.classList.add("_lock");

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
	if (inputs.length > 0) {
		for (let index = 0; index < inputs.length; index++) {
			const input = inputs[index];
			const input_g_value = input.getAttribute('data-value');
			input_placeholder_add(input);
			if (input.value != '' && input.value != input_g_value) {
				input_focus_add(input);
			}
			input.addEventListener('focus', function (e) {
				if (input.value == input_g_value) {
					input_focus_add(input);
					input.value = '';
				}
				if (input.getAttribute('data-type') === "pass" && !input.parentElement.querySelector('.form__viewpass').classList.contains('_active')) {
					input.setAttribute('type', 'password');
				}
				if (input.classList.contains('_date')) {
					/*
					input.classList.add('_mask');
					Inputmask("99.99.9999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
					*/
				}
				if (input.classList.contains('_phone')) {
					//'+7(999) 999 9999'
					//'+38(999) 999 9999'
					//'+375(99)999-99-99'
					input.classList.add('_mask');
					Inputmask("+375 (99) 9999999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				if (input.classList.contains('_digital')) {
					input.classList.add('_mask');
					Inputmask("9{1,}", {
						"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				form_remove_error(input);
			});
			input.addEventListener('blur', function (e) {
				if (input.value == '') {
					input.value = input_g_value;
					input_focus_remove(input);
					if (input.classList.contains('_mask')) {
						input_clear_mask(input, input_g_value);
					}
					if (input.getAttribute('data-type') === "pass") {
						input.setAttribute('type', 'text');
					}
				}
			});
			if (input.classList.contains('_date')) {
				const calendarItem = datepicker(input, {
					customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
					customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
					overlayButton: 'Применить',
					overlayPlaceholder: 'Год (4 цифры)',
					startDay: 1,
					formatter: (input, date, instance) => {
						const value = date.toLocaleDateString()
						input.value = value
					},
					onSelect: function (input, instance, date) {
						input_focus_add(input.el);
					}
				});
				const dataFrom = input.getAttribute('data-from');
				const dataTo = input.getAttribute('data-to');
				if (dataFrom) {
					calendarItem.setMin(new Date(dataFrom));
				}
				if (dataTo) {
					calendarItem.setMax(new Date(dataTo));
				}
			}
		}
	}
}
function input_placeholder_add(input) {
	const input_g_value = input.getAttribute('data-value');
	if (input.value == '' && input_g_value != '') {
		input.value = input_g_value;
	}
}
function input_focus_add(input) {
	input.classList.add('_focus');
	input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
	input.classList.remove('_focus');
	input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
	input.inputmask.remove();
	input.value = input_g_value;
	input_focus_remove(input);
}



//IsHidden
function _is_hidden(el) {
	return (el.offsetParent === null)
}
//=================
//Popups
let popup_link = document.querySelectorAll('._popup-link');
let popups = document.querySelectorAll('.popup');
for (let index = 0; index < popup_link.length; index++) {
	const el = popup_link[index];
	el.addEventListener('click', function (e) {
		if (unlock) {
			let item = el.getAttribute('href').replace('#', '');
			let video = el.getAttribute('data-video');
			popup_open(item, video);
		}
		e.preventDefault();
	})
}
for (let index = 0; index < popups.length; index++) {
	const popup = popups[index];
	popup.addEventListener("click", function (e) {
		if (!e.target.closest('.popup__body')) {
			popup_close(e.target.closest('.popup'));
		}
	});
}
function popup_open(item, video = '') {
	let activePopup = document.querySelectorAll('.popup._active');
	if (activePopup.length > 0) {
		popup_close('', false);
	}
	let curent_popup = document.querySelector('.popup_' + item);
	console.log(curent_popup);
	if (curent_popup && unlock) {
		if (video != '' && video != null) {
			let popup_video = document.querySelector('.popup_video');
			popup_video.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}
		if (!document.querySelector('.menu__body._active')) {
			body_lock_add(500);
		}
		curent_popup.classList.add('_active');
		history.pushState('', '', '#' + item);
	}
}
function popup_close(item, bodyUnlock = true) {
	if (unlock) {
		if (!item) {
			for (let index = 0; index < popups.length; index++) {
				const popup = popups[index];
				let video = popup.querySelector('.popup__video');
				if (video) {
					video.innerHTML = '';
				}
				popup.classList.remove('_active');
			}
		} else {
			let video = item.querySelector('.popup__video');
			if (video) {
				video.innerHTML = '';
			}
			item.classList.remove('_active');
		}
		if (!document.querySelector('.menu__body._active') && bodyUnlock) {
			body_lock_remove(500);
		}
		history.pushState('', '', window.location.href.split('#')[0]);
	}
}
let popup_close_icon = document.querySelectorAll('.popup__close,._popup-close');
if (popup_close_icon) {
	for (let index = 0; index < popup_close_icon.length; index++) {
		const el = popup_close_icon[index];
		el.addEventListener('click', function () {
			popup_close(el.closest('.popup'));
		})
	}
}
document.addEventListener('keydown', function (e) {
	if (e.code === 'Escape') {
		popup_close();
	}
});
//=====================================================;

$('#image').change(function() {
	var input = $(this)[0];
	if ( input.files && input.files[0] ) {
	  if ( input.files[0].type.match('image.*') ) {
		var reader = new FileReader();
		reader.onload = function(e) { 
			$('#image_preview').attr('src', e.target.result); 
			$("#image_preview").siblings("source").attr('srcset', e.target.result);
			$('.form-sell__image-preview').css('display', 'block');
		}
		reader.readAsDataURL(input.files[0]);
	  } else console.log('is not image mime type');
	} else console.log('not isset files data or files API not supordet');
  });

$(document).ready(function () {

	


	// -------------------- lk --------------------------

	$(".lk-info .reset").on("click", function () {
		$(this).text('Отмена');
		$(this).parents('.lk-info').toggleClass('active');

		$(this).parents('.lk-info').find('.form-input').prop("disabled",

			function (i, val) {
				return !val;
			});

	});


	// -------------------- checkbox --------------------------


	// -------------------- header --------------------------

	$(window).scroll(function () {
		if ($(this).scrollTop() > 1) {
			$('header').addClass('sticky');
		}
		else {
			$('header').removeClass('sticky');
		}

	});


	// -------------------- password --------------------------

	$('body').on('click', '.show', function () {
		if ($(this).siblings('.form-input').attr('type') == 'password') {
			$(this).addClass('view');
			$(this).siblings('.form-input').attr('type', 'text');
		} else {
			$(this).removeClass('view');
			$(this).siblings('.form-input').attr('type', 'password');
		}
		return false;
	});

	// -------------------------search----------------------
	$('.search-form input').focus(function () {
		$(this).parents('.head-search').addClass('active');
		$('.overlay-search').addClass('active');
		$('.no-rezult').addClass('active');
	});

	jQuery(function ($) {
		$(document).mouseup(function (e) { // событие клика по веб-документу
			var div = $('.head-search'); // тут указываем ID элемента
			if (!div.is(e.target) // если клик был не по нашему блоку
				&& div.has(e.target).length === 0) { // и не по его дочерним элементам
				div.removeClass('active'); // скрываем его
				$('.overlay-search').removeClass('active');
				$('.search-result').removeClass('active');
			}
		});
	});

	$('.search-form input').on('keyup', function () {
		var $this = $(this),
			val = $this.val();

		if (val.length >= 1) {

			$('.remove-search').addClass('active');
			$('.no-rezult').removeClass('active');
			$('.rezults').addClass('active');
		} else {

			$('.remove-search').removeClass('active');
			$('.no-rezult').addClass('active');
			$('.rezults').removeClass('active');
		}

	});

	$(".remove-search").on("click", function () {
		$('.search-form input').val('').focus();
		$('.no-rezult').addClass('active');
		$('.rezults').removeClass('active');
	});

	$(".popular-search li").on("click", function () {
		var text = $(this).text();
		$('.search-form input').val(text).focus();
		$('.no-rezult').removeClass('active');
		$('.rezults').addClass('active');
		$('.remove-search').addClass('active');

	});
	// -------------------------menu----------------------
	$('.cat-toggle').on('click', function () {
		$(this).toggleClass('active');
		$('.menu').toggleClass('active');
		$('.overlay-menu').toggleClass('active');
		$('.toggle').toggleClass('active');
	});
	$('.toggle').on('click', function () {
		$(this).toggleClass('active');
		$('.menu').toggleClass('active');
		$('.overlay-menu').toggleClass('active');
		$('.cat-toggle').toggleClass('active');
	});
	$('.overlay-menu').on('click', function () {
		$(this).removeClass('active');
		$('.menu').removeClass('active');
		$('.cat-toggle').removeClass('active');
		$('.toggle').removeClass('active');
	});
	// -------------------------modal----------------------

	$('.to-state').on('click', function (event) {
		event.preventDefault();
		$('.state').removeClass('active');
		var state = $(this).attr('data-state');
		$('.state[data-state=' + state + ']').addClass('active');
	});
	$('.state .close').on('click', function (event) {
		$(this).parents().removeClass('active');
	});
	jQuery(function ($) {
		$(document).mouseup(function (e) { // событие клика по веб-документу
			var div = $(".state-box"); // тут указываем ID элемента
			if (!div.is(e.target) // если клик был не по нашему блоку
				&& div.has(e.target).length === 0) { // и не по его дочерним элементам
				div.parents().removeClass('active'); // скрываем его
				$('body').removeClass('modal-open');
			}
		});
	});

		// -------------------- wihlist --------------------------
	
	$('.add-wishlist').on('click', function () {
		$(this).addClass('added-wishlist').html('<i class="icon icon-favorite"></i>');
		$(this).parents('.block').find('.wislist-added').html('<i class="icon icon-favorite"></i>');
	});
	// -------------------- rating --------------------------

	$(".rating").each(function () {

		var agregate = $(this).find('.rating-agregate').text();
		var fulles = 5;
		var rightes = (agregate / fulles) * 100;
		$(this).find('.progress').css("width", rightes + '%');
	});

	$(".reviews-total .item").each(function () {

		var count = $(this).find('.count').text();
		var reviews = $('.reviews-total').find('.rating-count').text();;
		var bg = (count / reviews) * 100;

		$(this).find('.progress').css("width", bg + '%');
	});

	// -------------------- quantity --------------------------

	$('.minus').on('click', function () {
		let $input = $(this).next('.quantity-input');
		let inputValue = $input.val();
		if (inputValue > 0) {
			inputValue--;
			$input.val(inputValue)
		}
	});

	$('.plus').on('click', function () {
		let $input = $(this).prev('.quantity-input');
		let inputValue = $input.val();
		inputValue++;
		$input.val(inputValue);

	});

	// ------------- accordion ---------------------
	$('.accordion-box .top').on('click', function () {

		$(this).parent('.accordion-box').toggleClass('active');
	});

	// ----------------- carousel ----------------------

	$('.topproduct').owlCarousel({
		loop: true,
		nav: true,
		navText: ['', ''],
		dots: false,
		autoplay: false,
		autoplayTimeout: 3000,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2,
			},
			640: {
				items: 2
			},
			992: {
				items: 5,
			},
			1220: {
				items: 6,
			}
		}
	});

	$('.shops__items').owlCarousel({
		loop: true,
		nav: true,
		navText: ['', ''],
		dots: false,
		autoplay: false,
		autoplayTimeout: 3000,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2,
			},
			640: {
				items: 2
			},
			992: {
				items: 4,
			},
			1220: {
				items: 4,
			}
		}
	});

	$('.crossproduct').owlCarousel({
		loop: true,
		nav: true,
		navText: ['', ''],
		dots: false,
		autoplay: false,
		autoplayTimeout: 3000,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2,
			},
			640: {
				items: 2
			},
			992: {
				items: 4
			}
		}
	});
	$('.newproduct').owlCarousel({
		loop: true,
		nav: true,
		navText: ['', ''],
		dots: false,
		autoplay: false,
		autoplayTimeout: 3000,
		owl2row: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2,
			},
			991: {
				items: 3,
			},
			1220: {
				items: 4,
			}
		}
	});
	$('.recomproduct').owlCarousel({
		loop: true,
		nav: true,
		navText: ['', ''],
		dots: false,
		autoplay: false,
		autoplayTimeout: 3000,
		owl2row: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2,
			},
			991: {
				items: 3,
			},
			1220: {
				items: 4,
			}
		}
	});
	$('.popular-product').owlCarousel({
		loop: true,
		nav: true,
		navText: ['', ''],
		dots: false,
		autoplay: false,
		autoplayTimeout: 3000,
		owl2row: true,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2,
			},
			991: {
				items: 3,
			},
			1220: {
				items: 3,
			}
		}
	});

	$(".sliders").owlCarousel({
		loop: true,
		items: 1,
		nav: false,
		navText: ['', ''],
		dots: true,
		autoplay: false,
		autoplayTimeout: 3000
	});



	// -------------------------slider----------------------

	$('.slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		infinite: false,
		fade: true,
		slidesToScroll: 1,
		asNavFor: '.slider-nav',
		prevArrow: '<button type="button" class="slick-prev"></button>',
		nextArrow: '<button type="button" class="slick-next"></button>',
		responsive: [
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 1,
				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	});
	$('.slider-nav').slick({
		slidesToShow: 7,
		slidesToScroll: 1,
		infinite: false,
		asNavFor: '.slider',
		focusOnSelect: true,
		prevArrow: '<button type="button" class="slick-prev"></button>',
		nextArrow: '<button type="button" class="slick-next"></button>',
		vertical: true,
		responsive: [
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 7,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 7,
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 7,
				}
			}
		]
	});
	// -------------------------filter----------------------

	$('.filter-box .top').on('click', function () {
		$(this).parent('.filter-box').toggleClass('active');
	});

	$('.filter-toggle').on('click', function () {
		$('.sidebar').toggleClass('active');
	});

	let itemsBig = $('.filter .body');
	hideBig(itemsBig);

	function hideBig($itemBig) {
		$itemBig.each(function (indx, list) {
			let $liArray = $(list).find("input");
			let liQnt = $liArray.length;
			if (liQnt > 7) { // сколько чебоксов открыто в блоке фильтра
				$(list).append('<div class="itemMore"><i class="icon icon-donload"></i> <span>Показать все<span></div>');
				closeBig(list);

			}
		});
	}

	function closeBig(list) {
		let $liArray = $(list).find("input");
		$liArray.each(function (indx, items) {
			if (indx > 6) { $(items).parent("label").hide(); } // сюда тоже но -1
		});
	}

	function openBig(list) {
		let $liArray = $(list).find("input");
		$liArray.each(function (indx, items) {
			$(items).parent("label").show();
		});
	}

	let $itemMore = $('.itemMore');
	$itemMore.on('click', function () {
		let list = $(this).parent();
		let $liArray = $(list).find("input");



		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).html('<i class="icon icon-donload"></i> <span>Показать все<span>');
			closeBig(list);
		} else {
			$(this).addClass('active');
			$(this).html('<i class="icon icon-donload"></i> <span>Свернуть<span>');
			openBig(list);
		}
	});

	// ------------------- Range-sliders -----------------------

	// Price -------------

	var $range = $(".js-range-slider"),
		$inputFrom = $(".js-input-from"),
		$inputTo = $(".js-input-to"),
		instance,
		min = 220,
		max = 1998,
		from = 220,
		to = 1998;

	$range.ionRangeSlider({
		skin: "round",
		type: "double",
		min: min,
		max: max,
		from: from,
		to: to,
		onStart: updateInputs,
		onChange: updateInputs
	});
	instance = $range.data("ionRangeSlider");

	function updateInputs(data) {
		from = data.from;
		to = data.to;

		$inputFrom.prop("value", from);
		$inputTo.prop("value", to);
	}

	$inputFrom.on("input", function () {
		var val = $(this).prop("value");

		// validate
		if (val < min) {
			val = min;
		} else if (val > to) {
			val = to;
		}

		instance.update({
			from: val
		});
	});

	$inputTo.on("input", function () {
		var val = $(this).prop("value");

		// validate
		if (val < from) {
			val = from;
		} else if (val > max) {
			val = max;
		}

		instance.update({
			to: val
		});
	});

	// 1 ---------------

	var $range1 = $(".js-range-slider-1"),
		$inputFrom1 = $(".js-input-from-1"),
		$inputTo1 = $(".js-input-to-1"),
		instance1,
		min1 = 35,
		max1 = 2800,
		from1 = 35,
		to1 = 2800;

	$range1.ionRangeSlider({
		skin: "round",
		type: "double",
		min: min1,
		max: max1,
		from: from1,
		to: to1,
		onStart: updateInputs1,
		onChange: updateInputs1
	});
	instance1 = $range1.data("ionRangeSlider");

	function updateInputs1(data) {
		from = data.from;
		to = data.to;

		$inputFrom1.prop("value", from);
		$inputTo1.prop("value", to);
	}

	$inputFrom1.on("input", function () {
		let val = $(this).prop("value");

		// validate
		if (val < min1) {
			val = min1;
		} else if (val > to) {
			val = to;
		}

		instance1.update({
			from: val
		});
	});

	$inputTo1.on("input", function () {
		let val = $(this).prop("value");

		// validate
		if (val < from) {
			val = from;
		} else if (val > max1) {
			val = max1;
		}

		instance1.update({
			to: val
		});
	});

	// -------------------- Tabs -------------------------
	$('.all-link').on('click', function () {
		$('.tabs').children("div").children("div").hide();
		$('.tabs').children("div").children("div").eq(1).show();
		$('.tabs').children("ul").children("li").removeClass("active");
		$('.tabs').children("ul").children("li").eq(1).addClass("active");
	});

	$(".product-page").on("click", "a.all-link", function (event) {
		//отменяем стандартную обработку нажатия по ссылке
		event.preventDefault();

		//забираем идентификатор бока с атрибута href
		var id = $(this).attr('href'),

			//узнаем высоту от начала страницы до блока на который ссылается якорь
			top = $(id).offset().top;

		//анимируем переход на расстояние - top за 1500 мс
		$('body,html').animate({ scrollTop: top - 130 }, 700);
	});

	(function ($) {
		jQuery.fn.lightTabs = function (options) {

			var createTabs = function () {
				tabs = this;
				i = 0;

				showPage = function (i) {
					$(tabs).children("div").children("div").hide();
					$(tabs).children("div").children("div").eq(i).show();
					$(tabs).children("ul").children("li").removeClass("active");
					$(tabs).children("ul").children("li").eq(i).addClass("active");
				}

				showPage(0);

				$(tabs).children("ul").children("li").each(function (index, element) {
					$(element).attr("data-page", i);
					i++;
				});

				$(tabs).children("ul").children("li").click(function () {
					showPage(parseInt($(this).attr("data-page")));
				});
			};
			return this.each(createTabs);
		};
	})(jQuery);

	$('.tabs').lightTabs();


	$('select').styler();

	//end
});
