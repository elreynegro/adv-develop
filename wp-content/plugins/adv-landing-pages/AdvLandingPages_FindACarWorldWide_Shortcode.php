<?php


    include_once('AdvLandingPages_ShortCodeScriptLoader.php');

class AdvLandingPages_FindACarWorldWide_Shortcode extends AdvLandingPages_ShortCodeScriptLoader {

	public $choose_list_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
        }
    }


    public function handleShortcode($atts) {
        function formatDate($dateValue)
        {
            try{
                $dateValue = substr($dateValue, 0, 2) . '/' . substr($dateValue, 2, 2) . '/' . substr($dateValue, 4, 4);
            }
            catch(Exception $e)
            {
                $dateValue = date('m/d/Y', strtotime('+1 day'));
            }
            return $dateValue;
        }
        extract( shortcode_atts( array(
            'reference' => '',
            'promocode' => ''
        ), $atts ) );

        $rental_location = "";
        $return_location = "";
        $pickup_date = "";
        $pickup_time = "";
        $dropoff_date = "";
        $dropoff_time = "";
        $promo_codes[] = "";

        // Check if cookie exists or not
        if (isset($_COOKIE['adv_userbookmark'])) {
            // Remove the slashes
            $json = stripslashes($_COOKIE['adv_userbookmark']);
           
            // Decode the json
            $json = json_decode(base64_decode($json));

            foreach ($json as $key => $value) {

                switch (strtolower($key)) {  
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
                     case 'promo_codes':
                        $promo_codes[0] = $promocode;
                        break;
                } // End Switch

            } // End For Each Loop

        } // End If\

        if ($pickup_date < date('mdY') || empty($pickup_date)) {
            $pickup_date = date('m/d/Y', strtotime('+ 1 day'));
        }

        // If the dropoff_date is not equal to today's date or the dropoff_date doesn't exist, then set the default day to today's date plus two days
        if ($dropoff_date < date('mdY') || empty($dropoff_date)) {
            $dropoff_date = date('m/d/Y', strtotime('+ 3 day'));
        }

$this->find_a_car_html = '
        <form id="adv_rez" class="aez-form" role="form" method="POST" name="adv_rez" action="/choose">
            <input
                type="hidden"
                name="api_provider"
                value="TSD"
            />
            <h3 class="aez-find-a-car__heading">Find A Car Worldwide</h3>
            <div class="aez-form-block">
                <div class="aez-form-item">
                        <label for="pickupValue" class="aez-form-item__label aez-form-item__label--hidden">Rent From</label>
            <input 
                type="search"
                id="pickupValue"
                name="pickupValue"
                pattern=".{15,}" 
                class="aez-select2-search aez-form-item__dropdown"
                placeholder="Rent From"
                style= "border-color:transparent;" 
                spellcheck="false"
                required
            >
            <label for="rental_location_id" class="aez-form-item__label--hidden"></label>
            <input id="rental_location_id" 
            name="rental_location_id" 
            style="display: none;" 
            class="aez-select2-search aez-form-item__dropdown" 
            >
                </div>
                <div class="aez-form-item" id="toggle_return" style="display:none;">
                   <label for="dropoffValue" class="aez-form-item__label aez-form-item__label--hidden">Return To</label>
            <input 
                type="search"
                id="dropoffValue"
                name="dropoffValue"
                class="aez-select2-search aez-form-item__dropdown"
                placeholder="Return To"
                pattern=".{15,}" 
                style= "border-color:transparent;"
                spellcheck="false"
                required
            >
            <label for="return_location_id" class="aez-form-item__label aez-form-item__label--hidden"></label>
            <input id="return_location_id" 
            class="aez-select2-search aez-form-item__dropdown" 
            name="return_location_id"
            style="display: none;" 
            >
                </div>
            </div>
            <div class="aez-form-block">
                <h4 class="aez-form-block__header">Rental Date</h4>
                <div class="aez-form-block--side-by-side">
                    <div class="aez-form-item aez-form-item--date">
                        <label for="pickup_date" class="aez-form-item__label"><i class="fa fa-calendar"></i></label>
                        <input
                            id="pickup_date"
                            type="text"
                            class="aez-form-item__input aez-form-item__input--date"
                            name="pickup_date"
                            placeholder="MM/DD/YYYY"
                            value="'.$pickup_date.'"
                            readonly="true"
                            required
                        />
                    </div>
                    <div class="aez-form-item aez-form-item--dropdown">
                        <label for="pickup_time" class="aez-form-item__label aez-form-item__label--hidden">Rental Time</label>
                        <select
                            id="pickup_time"
                            class="aez-form-item__dropdown aez-form-item__dropdown--full-width"
                            name="pickup_time"
                            required
                        >
                            <option value="12:00AM" '. ($pickup_time == '12:00AM' ? 'selected=selected' : '' ) . '>12:00 AM</option>
                            <option value="12:30AM" '. ($pickup_time == '12:30AM' ? 'selected=selected' : '' ) . '>12:30 AM</option>
                            <option value="01:00AM" '. ($pickup_time == '01:00AM' ? 'selected=selected' : '' ) . '>1:00 AM</option>
                            <option value="01:30AM" '. ($pickup_time == '01:30AM' ? 'selected=selected' : '' ) . '>1:30 AM</option>
                            <option value="02:00AM" '. ($pickup_time == '02:00AM' ? 'selected=selected' : '' ) . '>2:00 AM</option>
                            <option value="02:30AM" '. ($pickup_time == '02:30AM' ? 'selected=selected' : '' ) . '>2:30 AM</option>
                            <option value="03:00AM" '. ($pickup_time == '03:00AM' ? 'selected=selected' : '' ) . '>3:00 AM</option>
                            <option value="03:30AM" '. ($pickup_time == '03:30AM' ? 'selected=selected' : '' ) . '>3:30 AM</option>
                            <option value="04:00AM" '. ($pickup_time == '04:00AM' ? 'selected=selected' : '' ) . '>4:00 AM</option>
                            <option value="04:30AM" '. ($pickup_time == '04:30AM' ? 'selected=selected' : '' ) . '>4:30 AM</option>
                            <option value="05:00AM" '. ($pickup_time == '05:00AM' ? 'selected=selected' : '' ) . '>5:00 AM</option>
                            <option value="05:30AM" '. ($pickup_time == '05:30AM' ? 'selected=selected' : '' ) . '>5:30 AM</option>
                            <option value="06:00AM" '. ($pickup_time == '06:00AM' ? 'selected=selected' : '' ) . '>6:00 AM</option>
                            <option value="06:30AM" '. ($pickup_time == '06:30AM' ? 'selected=selected' : '' ) . '>6:30 AM</option>
                            <option value="07:00AM" '. ($pickup_time == '07:00AM' ? 'selected=selected' : '' ) . '>7:00 AM</option>
                            <option value="07:30AM" '. ($pickup_time == '07:30AM' ? 'selected=selected' : '' ) . '>7:30 AM</option>
                            <option value="08:00AM" '. ($pickup_time == '08:00AM' ? 'selected=selected' : '' ) . '>8:00 AM</option>
                            <option value="08:30AM" '. ($pickup_time == '08:30AM' ? 'selected=selected' : '' ) . '>8:30 AM</option>
                            <option value="09:00AM" '. ($pickup_time == '09:00AM' || empty($pickup_time) ? 'selected=selected' : '' ) . '>9:00 AM</option>
                            <option value="09:30AM" '. ($pickup_time == '09:30AM' ? 'selected=selected' : '' ) . '>9:30 AM</option>
                            <option value="10:00AM" '. ($pickup_time == '10:00AM' ? 'selected=selected' : '' ) . '>10:00 AM</option>
                            <option value="10:30AM" '. ($pickup_time == '10:30AM' ? 'selected=selected' : '' ) . '>10:30 AM</option>
                            <option value="11:00AM" '. ($pickup_time == '11:00AM' ? 'selected=selected' : '' ) . '>11:00 AM</option>
                            <option value="11:30AM" '. ($pickup_time == '11:30AM' ? 'selected=selected' : '' ) . '>11:30 AM</option>
                            <option value="12:00PM" '. ($pickup_time == '12:00PM' ? 'selected=selected' : '' ) . '>12:00 PM</option>
                            <option value="12:30PM" '. ($pickup_time == '12:30PM' ? 'selected=selected' : '' ) . '>12:30 PM</option>
                            <option value="01:00PM" '. ($pickup_time == '01:00PM' ? 'selected=selected' : '' ) . '>1:00 PM</option>
                            <option value="01:30PM" '. ($pickup_time == '01:30PM' ? 'selected=selected' : '' ) . '>1:30 PM</option>
                            <option value="02:00PM" '. ($pickup_time == '02:00PM' ? 'selected=selected' : '' ) . '>2:00 PM</option>
                            <option value="02:30PM" '. ($pickup_time == '02:30PM' ? 'selected=selected' : '' ) . '>2:30 PM</option>
                            <option value="03:00PM" '. ($pickup_time == '03:00PM' ? 'selected=selected' : '' ) . '>3:00 PM</option>
                            <option value="03:30PM" '. ($pickup_time == '03:30PM' ? 'selected=selected' : '' ) . '>3:30 PM</option>
                            <option value="04:00PM" '. ($pickup_time == '04:00PM' ? 'selected=selected' : '' ) . '>4:00 PM</option>
                            <option value="04:30PM" '. ($pickup_time == '04:30PM' ? 'selected=selected' : '' ) . '>4:30 PM</option>
                            <option value="05:00PM" '. ($pickup_time == '05:00PM' ? 'selected=selected' : '' ) . '>5:00 PM</option>
                            <option value="05:30PM" '. ($pickup_time == '05:30PM' ? 'selected=selected' : '' ) . '>5:30 PM</option>
                            <option value="06:00PM" '. ($pickup_time == '06:00PM' ? 'selected=selected' : '' ) . '>6:00 PM</option>
                            <option value="06:30PM" '. ($pickup_time == '06:30PM' ? 'selected=selected' : '' ) . '>6:30 PM</option>
                            <option value="07:00PM" '. ($pickup_time == '07:00PM' ? 'selected=selected' : '' ) . '>7:00 PM</option>
                            <option value="07:30PM" '. ($pickup_time == '07:30PM' ? 'selected=selected' : '' ) . '>7:30 PM</option>
                            <option value="08:00PM" '. ($pickup_time == '08:00PM' ? 'selected=selected' : '' ) . '>8:00 PM</option>
                            <option value="08:30PM" '. ($pickup_time == '08:30PM' ? 'selected=selected' : '' ) . '>8:30 PM</option>
                            <option value="09:00PM" '. ($pickup_time == '09:00PM' ? 'selected=selected' : '' ) . '>9:00 PM</option>
                            <option value="09:30PM" '. ($pickup_time == '09:30PM' ? 'selected=selected' : '' ) . '>9:30 PM</option>
                            <option value="10:00PM" '. ($pickup_time == '10:00PM' ? 'selected=selected' : '' ) . '>10:00 PM</option>
                            <option value="10:30PM" '. ($pickup_time == '10:30PM' ? 'selected=selected' : '' ) . '>10:30 PM</option>
                            <option value="11:00PM" '. ($pickup_time == '11:00PM' ? 'selected=selected' : '' ) . '>11:00 PM</option>
                            <option value="11:30PM" '. ($pickup_time == '11:30PM' ? 'selected=selected' : '' ) . '>11:30 PM</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="aez-form-block">
                <h4 class="aez-form-block__header">Return Date</h4>
                <div class="aez-form-block--side-by-side">
                    <div class="aez-form-item aez-form-item--date">
                        <label for="dropoff_date" class="aez-form-item__label"><i class="fa fa-calendar"></i></label>
                        <input
                            id="dropoff_date"
                            type="text"
                            class="aez-form-item__input aez-form-item__input--date"
                            name="dropoff_date"
                            placeholder="MM/DD/YYYY"
                            value="'.$dropoff_date.'"
                            readonly="true"
                            required
                        />
                    </div>
                    <div class="aez-form-item aez-form-item--dropdown">
                        <label for="dropoff_time" class="aez-form-item__label aez-form-item__label--hidden">Return Time</label>
                        <select
                            id="dropoff_time"
                            class="aez-form-item__dropdown aez-form-item__dropdown--full-width"
                            name="dropoff_time"
                            required
                        >
                            <option value="12:00AM" '. ($dropoff_time == '12:00AM' ? 'selected=selected' : '' ) . '>12:00 AM</option>
                            <option value="12:30AM" '. ($dropoff_time == '12:30AM' ? 'selected=selected' : '' ) . '>12:30 AM</option>
                            <option value="01:00AM" '. ($dropoff_time == '01:00AM' ? 'selected=selected' : '' ) . '>1:00 AM</option>
                            <option value="01:30AM" '. ($dropoff_time == '01:30AM' ? 'selected=selected' : '' ) . '>1:30 AM</option>
                            <option value="02:00AM" '. ($dropoff_time == '02:00AM' ? 'selected=selected' : '' ) . '>2:00 AM</option>
                            <option value="02:30AM" '. ($dropoff_time == '02:30AM' ? 'selected=selected' : '' ) . '>2:30 AM</option>
                            <option value="03:00AM" '. ($dropoff_time == '03:00AM' ? 'selected=selected' : '' ) . '>3:00 AM</option>
                            <option value="03:30AM" '. ($dropoff_time == '03:30AM' ? 'selected=selected' : '' ) . '>3:30 AM</option>
                            <option value="04:00AM" '. ($dropoff_time == '04:00AM' ? 'selected=selected' : '' ) . '>4:00 AM</option>
                            <option value="04:30AM" '. ($dropoff_time == '04:30AM' ? 'selected=selected' : '' ) . '>4:30 AM</option>
                            <option value="05:00AM" '. ($dropoff_time == '05:00AM' ? 'selected=selected' : '' ) . '>5:00 AM</option>
                            <option value="05:30AM" '. ($dropoff_time == '05:30AM' ? 'selected=selected' : '' ) . '>5:30 AM</option>
                            <option value="06:00AM" '. ($dropoff_time == '06:00AM' ? 'selected=selected' : '' ) . '>6:00 AM</option>
                            <option value="06:30AM" '. ($dropoff_time == '06:30AM' ? 'selected=selected' : '' ) . '>6:30 AM</option>
                            <option value="07:00AM" '. ($dropoff_time == '07:00AM' ? 'selected=selected' : '' ) . '>7:00 AM</option>
                            <option value="07:30AM" '. ($dropoff_time == '07:30AM' ? 'selected=selected' : '' ) . '>7:30 AM</option>
                            <option value="08:00AM" '. ($dropoff_time == '08:00AM' ? 'selected=selected' : '' ) . '>8:00 AM</option>
                            <option value="08:30AM" '. ($dropoff_time == '08:30AM' ? 'selected=selected' : '' ) . '>8:30 AM</option>
                            <option value="09:00AM" '. ($dropoff_time == '09:00AM' || empty($dropoff_time) ? 'selected=selected' : '' ) . '>9:00 AM</option>
                            <option value="09:30AM" '. ($dropoff_time == '09:30AM' ? 'selected=selected' : '' ) . '>9:30 AM</option>
                            <option value="10:00AM" '. ($dropoff_time == '10:00AM' ? 'selected=selected' : '' ) . '>10:00 AM</option>
                            <option value="10:30AM" '. ($dropoff_time == '10:30AM' ? 'selected=selected' : '' ) . '>10:30 AM</option>
                            <option value="11:00AM" '. ($dropoff_time == '11:00AM' ? 'selected=selected' : '' ) . '>11:00 AM</option>
                            <option value="11:30AM" '. ($dropoff_time == '11:30AM' ? 'selected=selected' : '' ) . '>11:30 AM</option>
                            <option value="12:00PM" '. ($dropoff_time == '12:00PM' ? 'selected=selected' : '' ) . '>12:00 PM</option>
                            <option value="12:30PM" '. ($dropoff_time == '12:30PM' ? 'selected=selected' : '' ) . '>12:30 PM</option>
                            <option value="01:00PM" '. ($dropoff_time == '01:00PM' ? 'selected=selected' : '' ) . '>1:00 PM</option>
                            <option value="01:30PM" '. ($dropoff_time == '01:30PM' ? 'selected=selected' : '' ) . '>1:30 PM</option>
                            <option value="02:00PM" '. ($dropoff_time == '02:00PM' ? 'selected=selected' : '' ) . '>2:00 PM</option>
                            <option value="02:30PM" '. ($dropoff_time == '02:30PM' ? 'selected=selected' : '' ) . '>2:30 PM</option>
                            <option value="03:00PM" '. ($dropoff_time == '03:00PM' ? 'selected=selected' : '' ) . '>3:00 PM</option>
                            <option value="03:30PM" '. ($dropoff_time == '03:30PM' ? 'selected=selected' : '' ) . '>3:30 PM</option>
                            <option value="04:00PM" '. ($dropoff_time == '04:00PM' ? 'selected=selected' : '' ) . '>4:00 PM</option>
                            <option value="04:30PM" '. ($dropoff_time == '04:30PM' ? 'selected=selected' : '' ) . '>4:30 PM</option>
                            <option value="05:00PM" '. ($dropoff_time == '05:00PM' ? 'selected=selected' : '' ) . '>5:00 PM</option>
                            <option value="05:30PM" '. ($dropoff_time == '05:30PM' ? 'selected=selected' : '' ) . '>5:30 PM</option>
                            <option value="06:00PM" '. ($dropoff_time == '06:00PM' ? 'selected=selected' : '' ) . '>6:00 PM</option>
                            <option value="06:30PM" '. ($dropoff_time == '06:30PM' ? 'selected=selected' : '' ) . '>6:30 PM</option>
                            <option value="07:00PM" '. ($dropoff_time == '07:00PM' ? 'selected=selected' : '' ) . '>7:00 PM</option>
                            <option value="07:30PM" '. ($dropoff_time == '07:30PM' ? 'selected=selected' : '' ) . '>7:30 PM</option>
                            <option value="08:00PM" '. ($dropoff_time == '08:00PM' ? 'selected=selected' : '' ) . '>8:00 PM</option>
                            <option value="08:30PM" '. ($dropoff_time == '08:30PM' ? 'selected=selected' : '' ) . '>8:30 PM</option>
                            <option value="09:00PM" '. ($dropoff_time == '09:00PM' ? 'selected=selected' : '' ) . '>9:00 PM</option>
                            <option value="09:30PM" '. ($dropoff_time == '09:30PM' ? 'selected=selected' : '' ) . '>9:30 PM</option>
                            <option value="10:00PM" '. ($dropoff_time == '10:00PM' ? 'selected=selected' : '' ) . '>10:00 PM</option>
                            <option value="10:30PM" '. ($dropoff_time == '10:30PM' ? 'selected=selected' : '' ) . '>10:30 PM</option>
                            <option value="11:00PM" '. ($dropoff_time == '11:00PM' ? 'selected=selected' : '' ) . '>11:00 PM</option>
                            <option value="11:30PM" '. ($dropoff_time == '11:30PM' ? 'selected=selected' : '' ) . '>11:30 PM</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="aez-form-block">
                <h4 class="aez-form-block__header">Promo or Corporate Code</h4>
                <div class="aez-form-item--with-btn">
                    <div class="aez-form-item">
                        <label for="promo_codes1" class="aez-form-item__label">Code</label>
                        
                        <input
                            id="promo_codes1"
                            type="text"
                            class="aez-form-item__input"
                            name="promo_codes[]"
                            data-number="1"
                            placeholder="Enter Code"
                            value="'. $promocode .'"
                        />
                    </div>
                    <span class="aez-add-btn" data-number="1"></span>
                </div> 
            </div>
            <div class="aez-form-block">
                <button id="adv_rez_submit" type="submit" class="aez-btn aez-btn--filled-green">Search</button>
            </div>
            <span class="close -blue">Close</span>
            <input type="hidden" name="reference" value="'.$reference.'">
        </form>';

        return $this->find_a_car_html;
	}

}