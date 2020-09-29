(function ($) {
	$(function () {$('[data-toggle="tooltip"]').tooltip()})
	$('ul.ui-autocomplete').removeAttr('style');
	var pickupval = document.getElementById('pickupValue');
    var dropval = document.getElementById('dropoffValue');
    $('.collapsed-faqs').click(function (e) {
        e.preventDefault();
        var expand_faq = $(this).next('.expanding-faq');
        expand_faq.toggle();
        $(this).toggleClass('collapsed-faqs');
    });
    // Hide the reservation FAQ answers
    $('.expanding-faq').hide();
	var locationsData;
	locationsData = $.ajax({
			url: ADV_Rez_Ajax.ajaxurl,
			method: 'POST',
			data: {
				action: 'activeBookingLocations',
			},
			async: false,
			dataType: 'json'
		})
		$.when(locationsData).done(function (response) {
			locationsData = response;
		});
	$("#adv_rez_submit").click(function () {
		$("#toggle_return").css('display', 'block');
	});
	if (pickupval) {
		if ($('#pickupValue').val().length != 0) {
			$("#toggle_return").css('display', 'block');
		}
	}
	// console.log(locationsData);
	function getLocations() {
		var arr = [];
		for (myLoc in locationsData) {
			if (locationsData.hasOwnProperty(myLoc)) {
				var loc = locationsData[myLoc].L;
				var alias_value = loc.split(";");
				var locToPush = new Array();
				locToPush[0] = locationsData[myLoc].C;
				locToPush.value = loc;
				locToPush.label = alias_value[0];
				arr.push(locToPush);
			}
		}
		return arr;
	}
	String.prototype.replaceAllOcc = function (valToReplace, replacingVal) {
		return this.split(valToReplace).join(replacingVal);
	};
	function cleanCode(arrVal) {
		return arrVal.replaceAllOcc(/[^a-zA-Z\d]/g, "");
	}
	$.ui.autocomplete.filter = function (array, term) {
		term = cleanCode(term);
		var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), 'i');
		return $.grep(array, function (arrVal) {
			var arrRowValue = cleanCode(arrVal.value);
			return matcher.test(arrRowValue) || matcher.test(arrVal);
		});
	};
	if (pickupval || dropval) {
		$('#pickupValue').autocomplete({
			maxShowItems: 10,
			minLength: 2,
			source: getLocations(),
			select: function (event, ui) {
				ui.item.value = ui.item.label;
				var value = ui.item.value;
				$("#rental_location_id").val(ui.item[0]);
				$("#toggle_return").css('display', 'block');
				$("#dropoffValue").val(ui.item.value);
				$("#return_location_id").val(ui.item[0]);
			},
			response: function (event, ui) {
				if (!ui.content.length) {
					var noResult = {
						value: "",
						label: "No locations found"
					};
					ui.content.push(noResult);
				}
			}
		}).focus(function () {
			$(this).select();
			$(this).autocomplete('search', $(this).val())
			$(this).attr('placeholder', 'Please start typing')
			var save_this = $(this);
			window.setTimeout(function () {
				save_this.select();
			}, 100);
		}).blur(function () {
			$(this).attr('placeholder', 'Rent from')
		}).data('ui-autocomplete')._renderItem = function (ul, item) {
			var srchTerm = $.trim(this.term).split(/\s+/).join('|');
			var label = item.label;
			return $('<li></li>').data('ui-autocomplete-item', item).append('<a>' + label + '</a>').appendTo(ul);
		};
		$('#pickupValue').autocomplete({
			url: "index.php",
			sortResults: false
		});
		$('#dropoffValue').autocomplete({
			url: "index.php",
			sortResults: false
		});
		$('#dropoffValue').autocomplete({
			maxShowItems: 10,
			minLength: 2,
			source: getLocations(),
			select: function (event, ui) {
				ui.item.value = ui.item.label;
				var value = ui.item.value;
				$("#return_location_id").val(ui.item[0]);
			},
			response: function (event, ui) {
				if (!ui.content.length) {
					var noResult = {
						value: "",
						label: "No locations found"
					};
					ui.content.push(noResult);
				}
			}
		}).focus(function () {
			$(this).select();
			$(this).autocomplete('search', $(this).val())
			$(this).attr('placeholder', 'Please start typing')
			var save_this = $(this);
			window.setTimeout(function () {
				save_this.select();
			}, 100);
		}).blur(function () {
			$(this).attr('placeholder', 'Return to')
		}).data('uiAutocomplete')._renderItem = function (ul, item) {
			var term = $('#dropoffValue').val();
			var label = item.label;
			return $('<li></li>').data('item.autocomplete', item).append('<a>' + label + '</a>').appendTo(ul);
		};
		jQuery.ui.autocomplete.prototype._resizeMenu = function () {
			var ul = this.menu.element;
			ul.outerWidth(this.element.outerWidth());
		}
		$(window).resize(function () {
			var isMobile = false;
			try {
				document.createEvent("TouchEvent");
				isMobile = true;
			} catch (e) {
				isMobile = false;
			}
			if (!isMobile) {
				$('#pickupValue').blur();
				$('#dropoffValue').blur();
			}
		});
	}
})(jQuery);
jQuery(function () {
	var dateFormat = "mm/dd/yy";
	var pickup_date = jQuery("#pickup_date").datepicker({
			numberOfMonths: 1,
			minDate: 0,
			showButtonPanel: true,
			showOtherMonths: true,
			selectOtherMonths: false,
			currentText: "Today",
			closeText: "x",
			changeMonth: true,
			changeYear: true,
			maxDate: "1y",
			defaultDate: +1
		}).on("change", function () {
			dropoff_date.datepicker("option", "minDate", getDate(this));
			var date2 = jQuery('#pickup_date').datepicker('getDate');
			date2.setDate(date2.getDate() + 2);
			jQuery("#dropoff_date").datepicker('setDate', date2);
		});
	var dropoff_date = jQuery("#dropoff_date").datepicker({
			numberOfMonths: 1,
			changeMonth: true,
			minDate: 0,
			changeYear: true,
			showButtonPanel: true,
			showOtherMonths: true,
			selectOtherMonths: false,
			maxDate: "+1y",
			currentText: "Today",
			closeText: "x",
			defaultDate: +3
		});
	jQuery("#adv_rez.aez-form").scroll(function () {
		dropoff_date.datepicker('hide');
		jQuery('#dropoff_date').blur();
		pickup_date.datepicker('hide');
		jQuery('#pickup_date').blur();
	});
	jQuery(window).resize(function () {
		dropoff_date.datepicker('hide');
		jQuery('#dropoff_date').blur();
		pickup_date.datepicker('hide');
		jQuery('#pickup_date').blur();
	});
	jQuery.datepicker._gotoToday = function (id) {
		var target = jQuery(id);
		var inst = this._getInst(target[0]);
		if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		} else {
			var date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
			this._setDateDatepicker(target, date);
			this._selectDate(id, this._getDateDatepicker(target));
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	}
	function getDate(element) {
		var date;
		try {
			date = jQuery.datepicker.parseDate(dateFormat, element.value);
		} catch (error) {
			date = null;
		}
		return date;
	}
});