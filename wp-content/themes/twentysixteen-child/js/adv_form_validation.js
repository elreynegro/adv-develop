(function ($) {
	function setErrorClass($e) {
		return $e.addClass('aez-form-item--error');
	}
	function removeErrorClass($e) {
		return $e.removeClass('aez-form-item--error');
	}
	var forms = document.querySelectorAll('form');
	function replaceValidationUI(form) {
		var submitButton = form.querySelector('button:not([type=button]), input[type=submit]');
		var $menuForm = $(form).parents('.menu-item').find('form');
		if (submitButton !== null && $menuForm.length <= 0) {
			// addErrorContainer(form);
			submitButton.addEventListener('click', function (evt) {
				var invalidFields = form.querySelectorAll(':invalid');
				var $formItems = $(form).find('.aez-form-item');
				$formItems.each(function () {
					return removeErrorClass($(this));
				});
				[].forEach.call(invalidFields, function (invalidField) {
					var $parentElement = $(invalidField).parents('.aez-form-item');
					return setErrorClass($parentElement);
				});

			});
		}
	}
	[].forEach.call(forms, function (form) {
		return replaceValidationUI(form);
	});

	$('.aez-form-item').on('input',  function () {
		// form = $(this).closest('form');
		if($(this).find('.aez-form-item__input').length > 0) {
			var thisItem = $(this).find('.aez-form-item__input');
			var invalidField = $(thisItem)["0"].checkValidity();
			if(invalidField == false) {
				return $(this).addClass('aez-form-item--error');
			}
			else {
				return $(this).removeClass('aez-form-item--error');
			}
		}

	});

})(jQuery);