(function ($) {
	var $locationsDropdown = $('#locations-dropdown');
	// var $americaTab = $('#america');
	// var $internationalTab = $('#international');
	var select2Placeholder = 'Enter a City or Country to find a location...';
	var services_url = '';
	var logging_url = '';
	var select2Ajax = (function () {
		var _formatQuery = function (params) {
			var query = {
				LocationBrands: 'Advantage,Europcar',
				LocationSearchString: params.term,
				page: params.page,
				HTTP_ORIGIN: window.location.origin,
				services_url: services_url,
				logging_url: logging_url,
			};
			return query;
		};
		var config = function (url) {
			return {
				url: url,
				dataType: 'json',
				delay: 500,
				data: _formatQuery,
			};
		};
		return {
			config: config,
		};
	})();
	// var getUrlParameter = function getUrlParameter(sParam) {
	// 	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	// 	sURLVariables = sPageURL.split('&'),
	// 	sParameterName,
	// 	i;
	// 	for (i = 0; i < sURLVariables.length; i++) {
	// 		sParameterName = sURLVariables[i].split('=');
	// 		if (sParameterName[0] === sParam) {
	// 			return sParameterName[1] === undefined ? true : sParameterName[1];
	// 		}
	// 	}
	// 	if (Loflag == 2) {
	// 		return 'international';
	// 	}
	// };
	// var tab = getUrlParameter('tab');
	// function handleAmericaTabClick() {
	// 	$("#international-tab").hide();
	// 	$("#international-title").hide();
	// 	$("#america-tab").show();
	// 	$("#america-title").show();
	// 	$('.aez-tab').removeClass("active");
	// 	$('span#america').addClass("active");
	// }
	// function handleInternationalTabClick() {
	// 	$("#international-tab").show();
	// 	$("#international-title").show();
	// 	$("#america-tab").hide();
	// 	$("#america-title").hide();
	// 	$('.aez-tab').removeClass("active");
	// 	$('span#international').addClass("active");
	// }
	// if (tab == 'international') {
	// 	handleInternationalTabClick();
	// } else {
	// 	handleAmericaTabClick();
	// }
	function handleLocationsDropdownChange(evt) {
                var location_selected_id = $.trim($("#locations-dropdown-selected").val());
                
                if(location_selected_id != '') {
                    $('body').append(createCarSpinnerGif());

                    $.ajax({
                            url: ADV_Rez_Ajax.ajaxurl,
                            method: 'POST',
                            data: {
                                    action: 'advGetLocationSlug',
                                    location_id: location_selected_id
                            },
                            dataType: 'json',
                            cache: false
                    }).done(function (data) {
                            if (data.slug == null) {
                                    window.location.href = '/location/' + location_selected_id;
                            } else {
                                    window.location.href = '/locations/' + data.slug;
                            }
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                            console.log("error");
                            console.log("jqXHR:" + jqXHR);
                            console.log(jqXHR);
                            console.log("Text Status:" + textStatus);
                            console.log("errorThrown:" + errorThrown);
                            return false;
                    });
                    return false;
                    removeCarSpinnerGif(15000);
            }
	}
	// $americaTab.on('click', handleAmericaTabClick);
	// $internationalTab.on('click', handleInternationalTabClick);
	$locationsDropdown.on('change', handleLocationsDropdownChange);
})(jQuery);