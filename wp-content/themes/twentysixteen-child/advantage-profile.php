<?php
/*
 * Template Name: Advantage profile
 */


Adv_login_Auth::login_check('/login');
get_header();

?>
<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>
<?php
// echo '<h2>here again </h2>';

// Start the loop.
while ( have_posts() ) : the_post();

    // Include the page content template.
    get_template_part( 'template-parts/content', 'page' );


    // End of the loop.
endwhile;


include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
<link src="./js/jquery-ui.min.css"/>

<script>
	$(document).ready(function() {
		$('ul.ui-autocomplete').removeAttr('style');
		var locationsData =  <?= $_SESSION["ActiveBookingLocations"] ?>;
		
//show return location field along with error msgs
		$( "#adv_rez_submit" ).click(function() {
	          $("#toggle_return").css('display', 'block');
	  	});

//show return_to on page reload.
		//console.log($('#pickupValue').val().length);
		if($('#pickupValue').val().length != 0)
		{
			$("#toggle_return").css('display', 'block');
		}

//To retrieve locations from TSD
	    function getLocations() {
	        var arr = [];
	        for (myLoc in locationsData) {
	            if (locationsData.hasOwnProperty(myLoc)) {
	                var loc = locationsData[myLoc].L;
	                			/*LocationName 
	                			+ ' (' + locationsData[myLoc].City + ', ' 
	                			+ locationsData[myLoc].State + ' '
	                			+ locationsData[myLoc].CountryName 
	                			+  ') - '
	                			+ locationsData[myLoc].LocationCode;*/

            		var locToPush = new Array();
					locToPush[0] = locationsData[myLoc].C;
					locToPush.value = loc;
					locToPush.label = loc;
	                arr.push(locToPush);
	            }
	        }
	        return arr;
	    }

//Autocomplete for PickUp
	    $('#pickupValue').autocomplete({
	    	maxShowItems: 10,
	    	minLength: 2,
	        source: getLocations(),
	        select: function (event, ui) {
			        var value = ui.item.value;
			        $("#rental_location_id").val(ui.item[0]);
			        $("#toggle_return").css('display', 'block');
			        $("#dropoffValue").val(ui.item.value);
			        $("#return_location_id").val(ui.item[0]);
	        }, 
// To display "no results found" message if there're no matches
	        response: function(event, ui) {
        			if (!ui.content.length) {
			            var noResult = { value:"",label:"No locations found"};
			            ui.content.push(noResult);
        			}
    		}
		    }).focus(function() {
				$(this).select();
			    		$(this).autocomplete('search', $(this).val())
			    		$(this).attr('placeholder', 'Please start typing')
			}).blur(function() {
			    		$(this).attr('placeholder', 'Rent from')
		});

//Autocomplete for DropOff
	    $('#dropoffValue').autocomplete({
	    	maxShowItems: 10,
	    	minLength: 2,
	        source: getLocations(),
	        select: function (event, ui) {          
	          var value = ui.item.value;
	          $("#return_location_id").val(ui.item[0]);
	        },
// To display "no results found" message if there're no matches
	        response: function(event, ui) {
        				if (!ui.content.length) {
	            			var noResult = { value:"",label:"No locations found" };
	            			ui.content.push(noResult);
        			}
    		}	      
		    }).focus(function() {
				$(this).select();
			    		$(this).autocomplete('search', $(this).val())
			    		$(this).attr('placeholder', 'Please start typing')
			}).blur(function() {
			    		$(this).attr('placeholder', 'Return to')
		});

//adjusting the autocomplete dropdown to the size of the input field
	    jQuery.ui.autocomplete.prototype._resizeMenu = function () {
			  var ul = this.menu.element;
			  ul.outerWidth(this.element.outerWidth());
		}

//closing the list on resizing the window
	    $(window).resize(function() {
			var isMobile = false;
			try{ document.createEvent("TouchEvent");  isMobile = true;}
			catch(e){ isMobile = false; }
			
			if(!isMobile)
			{
				$('#pickupValue').blur();
				$('#dropoffValue').blur();
			}
		});
}); 


$( function() {
	 	 var dateFormat = "mm/dd/yy";

//Datepicker for PickupDate
		var pickup_date = $( "#pickup_date" ).datepicker({
          	numberOfMonths: 1,
	        minDate: 0,
          	showButtonPanel: true,
          	showOtherMonths: true,
		  	selectOtherMonths: false,
         	currentText:"Today",
          	closeText: "x",
          	changeMonth: true,
          	changeYear: true,
          	maxDate: "1y",
          	defaultDate: +1
        })
    	.on( "change", function() {
		      	dropoff_date.datepicker( "option", "minDate", getDate(this));
		      	var date2 = $('#pickup_date').datepicker('getDate');
		    	date2.setDate(date2.getDate()+2);
		      	$("#dropoff_date").datepicker('setDate', date2);
    	});

//Datepicker for DropOff Date
      	var dropoff_date = $( "#dropoff_date" ).datepicker({
	        numberOfMonths: 1,
	        changeMonth: true,
	        minDate:0,
	        changeYear: true,
	        showButtonPanel: true,
	        showOtherMonths: true,
			selectOtherMonths: false,
	        maxDate: "+1y",
	        currentText:"Today",
	        closeText: "x",
	        defaultDate: +3
      	});

		$("#adv_rez.aez-form").scroll(function() {
			  dropoff_date.datepicker('hide');
			  $('#dropoff_date').blur();
			   pickup_date.datepicker('hide');
			  $('#pickup_date').blur();
		});

//closing the datepicker on resizing the window
		$(window).resize(function() {
			  dropoff_date.datepicker('hide');
			  $('#dropoff_date').blur();
			   pickup_date.datepicker('hide');
			  $('#pickup_date').blur();
		});

// populating the input field and closing the calendar onclick of Today button
	    $.datepicker._gotoToday = function(id) {
	    var target = $(id);
	    var inst = this._getInst(target[0]);
	    if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
	            inst.selectedDay = inst.currentDay;
	            inst.drawMonth = inst.selectedMonth = inst.currentMonth;
	            inst.drawYear = inst.selectedYear = inst.currentYear;
	    }
	    else {
	            var date = new Date();
	            inst.selectedDay = date.getDate();
	            inst.drawMonth = inst.selectedMonth = date.getMonth();
	            inst.drawYear = inst.selectedYear = date.getFullYear();
	            // the below two lines are new
	            this._setDateDatepicker(target, date);
	            this._selectDate(id, this._getDateDatepicker(target));
	    }
	    this._notifyChange(inst);
	    this._adjustDate(target);
		}

//retrieving current elements value
   		function getDate( element ) {
	      	var date;
	  		try {
	    	date = $.datepicker.parseDate( dateFormat, element.value );
		    } 
		    catch( error ) {
		    date = null;
		    }
			return date;
    	}
  
});

</script>