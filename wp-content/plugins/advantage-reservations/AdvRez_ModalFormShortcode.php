<?php

    include_once('AdvRez_ShortCodeScriptLoader.php');
 
class AdvRez_ModalFormShortcode extends AdvRez_ShortCodeScriptLoader {

	public $rez_box_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;

            // needs select2, pikaday, moment

            wp_enqueue_script('adv_modal_form', plugins_url('js/adv_modal_form.js', __FILE__), array('jquery', 'main'), '1.0', true);
            wp_enqueue_script('promo-code-add-remove', get_stylesheet_directory_uri() . '/js/promo-code-add-remove.js', array('jquery', 'main'), '1.0', true);
 
            wp_localize_script( 'adv_modal_form', 'ADV_Rez_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
        		)
        	);
        }
    }

	public function handleShortcode($atts) {

        function formatDate($dateValue) {
            try {
                $dateValue = substr($dateValue, 0, 2) . '/' . substr($dateValue, 2, 2) . '/' . substr($dateValue, 4, 4);
                $today_date = new DateTime();
                $pick_date = new DateTime($pickup_date);
                $drop_date = new DateTime($dropoff_date);
            } catch (Exception $e) {
                $dateValue = date('m/d/Y', strtotime('+1 day'));
            }
            return $dateValue;
        }

        // Check if cookie exists or not
        $action = "";
        $rental_location = "";
        $return_location = "";
        $rental_location_name = "";
        $return_location_name = "";
        $pickup_date = "";
        $pickup_time = "";
        $dropoff_date = "";
        $dropoff_time = "";
       // $promo_codes[] = "";

        if (isset($_COOKIE['adv_userbookmark'])) {
            // Remove the slashes
            $json = stripslashes($_COOKIE['adv_userbookmark']);
           
            // Decode the json
            $json = json_decode(base64_decode($json));

            foreach ($json as $key => $value) {

                switch (strtolower($key)) {
                    case 'action':
                        $action = $value;
                        break;
                    case 'rental_location_id':
                        $rental_location = $value;
                        break;
                    case 'return_location_id':
                        $return_location = $value;
                        break;
                    case 'rental_location_name': 
                        $rental_location_name = $value;
                        break;
                    case 'return_location_name':
                        $return_location_name = $value;
                        break;
                    case 'pickup_date':
                        $pickup_date = formatDate($value);
                        break;
                    case 'pickup_time':
                        $pickup_time = $value;
                        break;
                    case 'dropoff_date':
                        $dropoff_date = formatDate($value);
                        break;
                    case 'dropoff_time':
                        $dropoff_time = $value;
                        break;
                    // This is commented out since we don't need to use the promocode saved in the cookie.
                    // Use the promocodes from the search session.
                    // case 'promo_codes':
                    //     $promo_codes[0] = $value;
                    //     break;
                }
            }
        }

        function checkTime($var, $value) {
            return ($var == $value) ? 'selected' : '';
        }

   

        $rental_location_option = ($rental_location !== "") ? '<option value="' . $rental_location . '" selected="selected">' . $rental_location_name . '</option>' : '';
       
        $return_location_option = ($return_location !== "") ? '<option value="' . $return_location . '" selected="selected">' . $return_location_name . '</option>' : '';

        $is_checked_status = ($rental_location == $return_location) ? 'checked' : '';

        $this->rez_modal = '
                <script type="text/javascript">var locationsData =  '.$_SESSION["ActiveBookingLocations"].';</script>
                
                <div class="aez-modal aez-reservation-summary-modal">' .
            '<div class="aez-modal-dialog">' .
                '<i class="fa fa-close aez-modal-dialog__close"></i>' .
                '<form
                    id="update_rez"
                    class="aez-form"
                    role="form"
                    method="post"
                    data-visible="false"
                    action="/choose"
                >' .
                    '<h3 class="aez-find-a-car__heading">Modify Dates & Locations</h3>' .
                    '<input
                        type="hidden"
                        aria-hidden="true"
                        name="api_provider"
                        value="TSD"
                    />' .
                    '<div class="aez-form-block">' .
                        '<div class="aez-form-item aez-form-item--white">' .
                            '<label for="rental_location_id" class="aez-form-item__label aez-form-item__label--hidden">Rent From</label> 
                                
                                <input type="search" name="modify_search_pickup_loc" id="modify_search_pickup_loc" class="aez-select2-search aez-form-item__input" placeholder="Rent From" value="'.$rental_location_name.'" required >
				<input type="hidden" name="rental_location_id" id="rental_location_id" value="'.$rental_location.'" />
							
                               ' .
                        '</div>' .
                        '<div class="aez-form-item aez-form-item--white">' .
                            '<label for="return_location_id" class="aez-form-item__label aez-form-item__label--hidden">Return To</label> 
                            <input type="search" name="modify_search_return_loc" id="modify_search_return_loc" class="aez-select2-search aez-form-item__input" placeholder="Rent To" value="'.$return_location_name.'" required >
                            <input type="hidden" name="return_location_id" id="return_location_id" value="'.$return_location.'" />
                            ' .
                        '</div>' .
                        '<div class="aez-form-item--checkbox-cont">'.
                             '<input
                                id="return_to_same"
                                type="checkbox"
                                class="aez-form-item__checkbox aez-form-item__checkbox--white"'
                                . $is_checked_status .
                            '/>' .
                            '<label for="return_to_same" class="aez-form-item__label">Return to same location</label>' .
                        '</div>' .
                    '</div>' .
                    '<div class="aez-form-block">' .
                        '<h4 class="aez-form-block__header">Rental Date</h4>' .
                        '<div class="aez-form-block--side-by-side">' .
                            '<div class="aez-form-item aez-form-item--date aez-form-item--white">' .
                                '<label for="pickup_date" class="aez-form-item__label"><i class="fa fa-calendar"></i></label>' .
                                '<input
                                    id="pickup_date"
                                    type="text"
                                    class="aez-form-item__input aez-form-item__input--date"
                                    name="pickup_date"
                                    placeholder="MM/DD/YYYY"
                                    value="' . $pickup_date . '"
                                    readonly="true"
                                    required
                                />' .
                            '</div>' .
                            '<div class="aez-form-item aez-form-item--dropdown aez-form-item--white">' .
                                '<label for="pickup_time" class="aez-form-item__label aez-form-item__label--hidden">Rental Time</label>' .
                                '<select
                                    id="pickup_time"
                                    class="aez-form-item__dropdown aez-form-item__dropdown--full-width"
                                    name="pickup_time"
                                    required
                                >' .
                                    '<option value="12:00AM"' . checkTime($pickup_time, '12:00AM') . '>12:00 AM</option>' .
                                    '<option value="12:30AM"' . checkTime($pickup_time, '12:30AM') . '>12:30 AM</option>' .
                                    '<option value="01:00AM"' . checkTime($pickup_time, '01:00AM') . '>1:00 AM</option>' .
                                    '<option value="01:30AM"' . checkTime($pickup_time, '01:30AM') . '>1:30 AM</option>' .
                                    '<option value="02:00AM"' . checkTime($pickup_time, '02:00AM') . '>2:00 AM</option>' .
                                    '<option value="02:30AM"' . checkTime($pickup_time, '02:30AM') . '>2:30 AM</option>' .
                                    '<option value="03:00AM"' . checkTime($pickup_time, '03:00AM') . '>3:00 AM</option>' .
                                    '<option value="03:30AM"' . checkTime($pickup_time, '03:30AM') . '>3:30 AM</option>' .
                                    '<option value="04:00AM"' . checkTime($pickup_time, '04:00AM') . '>4:00 AM</option>' .
                                    '<option value="04:30AM"' . checkTime($pickup_time, '04:30AM') . '>4:30 AM</option>' .
                                    '<option value="05:00AM"' . checkTime($pickup_time, '05:00AM') . '>5:00 AM</option>' .
                                    '<option value="05:30AM"' . checkTime($pickup_time, '05:30AM') . '>5:30 AM</option>' .
                                    '<option value="06:00AM"' . checkTime($pickup_time, '06:00AM') . '>6:00 AM</option>' .
                                    '<option value="06:30AM"' . checkTime($pickup_time, '06:30AM') . '>6:30 AM</option>' .
                                    '<option value="07:00AM"' . checkTime($pickup_time, '07:00AM') . '>7:00 AM</option>' .
                                    '<option value="07:30AM"' . checkTime($pickup_time, '07:30AM') . '>7:30 AM</option>' .
                                    '<option value="08:00AM"' . checkTime($pickup_time, '08:00AM') . '>8:00 AM</option>' .
                                    '<option value="08:30AM"' . checkTime($pickup_time, '08:30AM') . '>8:30 AM</option>' .
                                    '<option value="09:00AM"' . checkTime($pickup_time, '09:00AM') . '>9:00 AM</option>' .
                                    '<option value="09:30AM"' . checkTime($pickup_time, '09:30AM') . '>9:30 AM</option>' .
                                    '<option value="10:00AM"' . checkTime($pickup_time, '10:00AM') . '>10:00 AM</option>' .
                                    '<option value="10:30AM"' . checkTime($pickup_time, '10:30AM') . '>10:30 AM</option>' .
                                    '<option value="11:00AM"' . checkTime($pickup_time, '11:00AM') . '>11:00 AM</option>' .
                                    '<option value="11:30AM"' . checkTime($pickup_time, '11:30AM') . '>11:30 AM</option>' .
                                    '<option value="12:00PM"' . checkTime($pickup_time, '12:00PM') . '>12:00 PM</option>' .
                                    '<option value="12:30PM"' . checkTime($pickup_time, '12:30PM') . '>12:30 PM</option>' .
                                    '<option value="01:00PM"' . checkTime($pickup_time, '01:00PM') . '>1:00 PM</option>' .
                                    '<option value="01:30PM"' . checkTime($pickup_time, '01:30PM') . '>1:30 PM</option>' .
                                    '<option value="02:00PM"' . checkTime($pickup_time, '02:00PM') . '>2:00 PM</option>' .
                                    '<option value="02:30PM"' . checkTime($pickup_time, '02:30PM') . '>2:30 PM</option>' .
                                    '<option value="03:00PM"' . checkTime($pickup_time, '03:00PM') . '>3:00 PM</option>' .
                                    '<option value="03:30PM"' . checkTime($pickup_time, '03:30PM') . '>3:30 PM</option>' .
                                    '<option value="04:00PM"' . checkTime($pickup_time, '04:00PM') . '>4:00 PM</option>' .
                                    '<option value="04:30PM"' . checkTime($pickup_time, '04:30PM') . '>4:30 PM</option>' .
                                    '<option value="05:00PM"' . checkTime($pickup_time, '05:00PM') . '>5:00 PM</option>' .
                                    '<option value="05:30PM"' . checkTime($pickup_time, '05:30PM') . '>5:30 PM</option>' .
                                    '<option value="06:00PM"' . checkTime($pickup_time, '06:00PM') . '>6:00 PM</option>' .
                                    '<option value="06:30PM"' . checkTime($pickup_time, '06:30PM') . '>6:30 PM</option>' .
                                    '<option value="07:00PM"' . checkTime($pickup_time, '07:00PM') . '>7:00 PM</option>' .
                                    '<option value="07:30PM"' . checkTime($pickup_time, '07:30PM') . '>7:30 PM</option>' .
                                    '<option value="08:00PM"' . checkTime($pickup_time, '08:00PM') . '>8:00 PM</option>' .
                                    '<option value="08:30PM"' . checkTime($pickup_time, '08:30PM') . '>8:30 PM</option>' .
                                    '<option value="09:00PM"' . checkTime($pickup_time, '09:00PM') . '>9:00 PM</option>' .
                                    '<option value="09:30PM"' . checkTime($pickup_time, '09:30PM') . '>9:30 PM</option>' .
                                    '<option value="10:00PM"' . checkTime($pickup_time, '10:00PM') . '>10:00 PM</option>' .
                                    '<option value="10:30PM"' . checkTime($pickup_time, '10:30PM') . '>10:30 PM</option>' .
                                    '<option value="11:00PM"' . checkTime($pickup_time, '11:00PM') . '>11:00 PM</option>' .
                                    '<option value="11:30PM"' . checkTime($pickup_time, '11:30PM') . '>11:30 PM</option>' .
                                '</select>' . 
                            '</div>' .
                        '</div>' .
                    '</div>' .
                    '<div class="aez-form-block">' .
                        '<h4 class="aez-form-block__header">Return Date</h4>' .
                        '<div class="aez-form-block--side-by-side">' .
                            '<div class="aez-form-item aez-form-item--date aez-form-item--white">' .
                                '<label for="dropoff_date" class="aez-form-item__label"><i class="fa fa-calendar"></i></label>' .
                                '<input
                                    id="dropoff_date"
                                    type="text"
                                    class="aez-form-item__input aez-form-item__input--date"
                                    name="dropoff_date"
                                    placeholder="MM/DD/YYYY"
                                    value="' . $dropoff_date . '"
                                    readonly="true"
                                    required
                                />' .
                            '</div>' .
                            '<div class="aez-form-item aez-form-item--dropdown aez-form-item--white">' .
                                '<label for="dropoff_time" class="aez-form-item__label aez-form-item__label--hidden">Return Time</label>' .
                                '<select
                                    id="dropoff_time"
                                    class="aez-form-item__dropdown aez-form-item__dropdown--full-width"
                                    name="dropoff_time"
                                    required
                                >' .
                                    '<option value="12:00AM"' . checkTime($dropoff_time, '12:00AM') . '>12:00 AM</option>' .
                                    '<option value="12:30AM"' . checkTime($dropoff_time, '12:30AM') . '>12:30 AM</option>' .
                                    '<option value="01:00AM"' . checkTime($dropoff_time, '01:00AM') . '>1:00 AM</option>' .
                                    '<option value="01:30AM"' . checkTime($dropoff_time, '01:30AM') . '>1:30 AM</option>' .
                                    '<option value="02:00AM"' . checkTime($dropoff_time, '02:00AM') . '>2:00 AM</option>' .
                                    '<option value="02:30AM"' . checkTime($dropoff_time, '02:30AM') . '>2:30 AM</option>' .
                                    '<option value="03:00AM"' . checkTime($dropoff_time, '03:00AM') . '>3:00 AM</option>' .
                                    '<option value="03:30AM"' . checkTime($dropoff_time, '03:30AM') . '>3:30 AM</option>' .
                                    '<option value="04:00AM"' . checkTime($dropoff_time, '04:00AM') . '>4:00 AM</option>' .
                                    '<option value="04:30AM"' . checkTime($dropoff_time, '04:30AM') . '>4:30 AM</option>' .
                                    '<option value="05:00AM"' . checkTime($dropoff_time, '05:00AM') . '>5:00 AM</option>' .
                                    '<option value="05:30AM"' . checkTime($dropoff_time, '05:30AM') . '>5:30 AM</option>' .
                                    '<option value="06:00AM"' . checkTime($dropoff_time, '06:00AM') . '>6:00 AM</option>' .
                                    '<option value="06:30AM"' . checkTime($dropoff_time, '06:30AM') . '>6:30 AM</option>' .
                                    '<option value="07:00AM"' . checkTime($dropoff_time, '07:00AM') . '>7:00 AM</option>' .
                                    '<option value="07:30AM"' . checkTime($dropoff_time, '07:30AM') . '>7:30 AM</option>' .
                                    '<option value="08:00AM"' . checkTime($dropoff_time, '08:00AM') . '>8:00 AM</option>' .
                                    '<option value="08:30AM"' . checkTime($dropoff_time, '08:30AM') . '>8:30 AM</option>' .
                                    '<option value="09:00AM"' . checkTime($dropoff_time, '09:00AM') . '>9:00 AM</option>' .
                                    '<option value="09:30AM"' . checkTime($dropoff_time, '09:30AM') . '>9:30 AM</option>' .
                                    '<option value="10:00AM"' . checkTime($dropoff_time, '10:00AM') . '>10:00 AM</option>' .
                                    '<option value="10:30AM"' . checkTime($dropoff_time, '10:30AM') . '>10:30 AM</option>' .
                                    '<option value="11:00AM"' . checkTime($dropoff_time, '11:00AM') . '>11:00 AM</option>' .
                                    '<option value="11:30AM"' . checkTime($dropoff_time, '11:30AM') . '>11:30 AM</option>' .
                                    '<option value="12:00PM"' . checkTime($dropoff_time, '12:00PM') . '>12:00 PM</option>' .
                                    '<option value="12:30PM"' . checkTime($dropoff_time, '12:30PM') . '>12:30 PM</option>' .
                                    '<option value="01:00PM"' . checkTime($dropoff_time, '01:00PM') . '>1:00 PM</option>' .
                                    '<option value="01:30PM"' . checkTime($dropoff_time, '01:30PM') . '>1:30 PM</option>' .
                                    '<option value="02:00PM"' . checkTime($dropoff_time, '02:00PM') . '>2:00 PM</option>' .
                                    '<option value="02:30PM"' . checkTime($dropoff_time, '02:30PM') . '>2:30 PM</option>' .
                                    '<option value="03:00PM"' . checkTime($dropoff_time, '03:00PM') . '>3:00 PM</option>' .
                                    '<option value="03:30PM"' . checkTime($dropoff_time, '03:30PM') . '>3:30 PM</option>' .
                                    '<option value="04:00PM"' . checkTime($dropoff_time, '04:00PM') . '>4:00 PM</option>' .
                                    '<option value="04:30PM"' . checkTime($dropoff_time, '04:30PM') . '>4:30 PM</option>' .
                                    '<option value="05:00PM"' . checkTime($dropoff_time, '05:00PM') . '>5:00 PM</option>' .
                                    '<option value="05:30PM"' . checkTime($dropoff_time, '05:30PM') . '>5:30 PM</option>' .
                                    '<option value="06:00PM"' . checkTime($dropoff_time, '06:00PM') . '>6:00 PM</option>' .
                                    '<option value="06:30PM"' . checkTime($dropoff_time, '06:30PM') . '>6:30 PM</option>' .
                                    '<option value="07:00PM"' . checkTime($dropoff_time, '07:00PM') . '>7:00 PM</option>' .
                                    '<option value="07:30PM"' . checkTime($dropoff_time, '07:30PM') . '>7:30 PM</option>' .
                                    '<option value="08:00PM"' . checkTime($dropoff_time, '08:00PM') . '>8:00 PM</option>' .
                                    '<option value="08:30PM"' . checkTime($dropoff_time, '08:30PM') . '>8:30 PM</option>' .
                                    '<option value="09:00PM"' . checkTime($dropoff_time, '09:00PM') . '>9:00 PM</option>' .
                                    '<option value="09:30PM"' . checkTime($dropoff_time, '09:30PM') . '>9:30 PM</option>' .
                                    '<option value="10:00PM"' . checkTime($dropoff_time, '10:00PM') . '>10:00 PM</option>' .
                                    '<option value="10:30PM"' . checkTime($dropoff_time, '10:30PM') . '>10:30 PM</option>' .
                                    '<option value="11:00PM"' . checkTime($dropoff_time, '11:00PM') . '>11:00 PM</option>' .
                                    '<option value="11:30PM"' . checkTime($dropoff_time, '11:30PM') . '>11:30 PM</option>' .
                                '</select>' .
                            '</div>' .
                        '</div>' .
                    '</div>' .
                    '<div class="aez-form-block modify-option-promos">' ;
                            $this->rez_modal.= AdvRez_Helper::modifyoptionsPopup_promocodesection();
                  $this->rez_modal.=  '</div>' ;
                   $this->rez_modal.=  '<button id="update_rez_submit" class="aez-btn aez-btn--filled-green" type="submit">Update</button>' .
                '</form>'.
            '</div>'.
        '</div>';

        return $this->rez_modal;
	}
}