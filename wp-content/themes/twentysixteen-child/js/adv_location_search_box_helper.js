/*
 *	Location Policy Script
 */

(function($) {
    
    // Create the AJAX call that calls activeBookingLocations
    // which sends back the $_SESSION["ActiveBookingLocations"] data 
    // for the To and From drop down locations.
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

    /*
    *	Location search box helper
    */

   function getLocations() {
       var arr = [];
       for (myLoc in locationsData) {
           if (locationsData.hasOwnProperty(myLoc)) {
               var loc = locationsData[myLoc].L;
               var alias_value= loc.split(";");
               var locToPush = new Array();
               locToPush[0] = locationsData[myLoc].C;
               locToPush.value = loc;
               locToPush.label = alias_value[0];
               arr.push(locToPush);
           }
       }
       return arr;
   }        

    $('.location-searcbox-autocomplete').autocomplete({
        maxShowItems: 10,
        minLength: 2,
        source: getLocations(),
        select: function (event, ui) {
                ui.item.value =ui.item.label;
                var value = ui.item.value;
                $("#locations-dropdown-selected").val(ui.item[0]);
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
        }).data('uiAutocomplete')._renderItem = function( ul, item ) {
                var label = item.label;
                var term = $('.location-searcbox-autocomplete').val();
                return $( '<li></li>' )
                .data( 'item.autocomplete', item )
                .append( '<a>' + label + '</a>' )
                .appendTo( ul );
    };
        
         
        
})(jQuery);