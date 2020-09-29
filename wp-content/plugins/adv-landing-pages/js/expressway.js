(function ($) {

	$('#expressway_pitstop').on('submit', function (event) {
		event.preventDefault();

		$('body').append(createCarSpinnerGif());
		var formData = {
				action: 'saveCampaignEnrollment',
				advlogin: ADV_Ajax.advlogintNonce
			};

		$.ajax({
			url: ADV_Rez_Ajax.ajaxurl,
			method: 'POST',
			data: formData,
			dataType: 'json'
		})
		.done(function(response) {
			if (typeof(response) == 'object') {
				var response_object = response;
			} else {
				var response_object = JSON.parse(response);
			}
			if (response_object.Status == "Failed") {
				var $cnt = 0;
				var $errObject = {};
				var $tmpObj = {};
				$tmpObj['title'] = "Campaign Registration Error.";
				$tmpObj['text'] = response_object.Error.ErrorMessage;
				$errObject['err_' + $cnt++] = $tmpObj;
				displayErrorMessage($errObject);
				removeCarSpinnerGif(0);
				return false;
			} else {
				removeSuccessMsg();
				removeErrMsg();
				var $cnt = 0;
				var $errObject = {};
				var $tmpObj = {};
				$tmpObj['title'] = 'You are now registered.';
				$tmpObj['text'] = 'Your free Pitstop Reward will automatically be applied to your next reservation.';
				$errObject['err_' + $cnt++] = $tmpObj;
				displaySuccessMessage($errObject);
				removeCarSpinnerGif(0);
				return true;
			}

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log("error");
			// console.log("jqXHR:" + jqXHR);
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);

			// Remove the car spinner gif on failed post
			// Function comes from main.js
			removeCarSpinnerGif(0);

			return false;
		});
		return true;
	});
}
(jQuery));