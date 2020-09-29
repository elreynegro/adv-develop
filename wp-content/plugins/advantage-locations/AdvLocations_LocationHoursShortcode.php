<?php

include_once('AdvLocations_ShortCodeScriptLoader.php');
 
class AdvLocations_LocationHoursShortcode extends AdvLocations_ShortCodeScriptLoader {

	public $display_complete;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;

            
            
            wp_enqueue_script('locations-anchor', plugins_url() . '/advantage-locations/js/adv_locations_anchor.js', array('jquery', 'select2'), '1.0', true);

            /*
            wp_localize_script( 'adv_reserve', 'ADV_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advReservetNonce' => wp_create_nonce( 'advreserve-nonce' )
        		)
        	);
            */
         }
    }

	public function handleShortcode($atts) {

        $location_data = AdvLocations_Helper::getLocation();
        $loc_flag = ($location_data['Country'] == 'US' || $location_data['Country'] == 'PR')?1:2;
        $_SESSION['loc_nav_flag'] = $loc_flag;
        
        $hours_data = AdvLocations_Helper::getLocationHours($location_data['LocationCode']);
         $phone_replace = str_replace($phone, "", $location_data['Phone1']);
        $location_value = $location_data['LocationName'] . " (" . $location_data['City'] . ", " . $location_data['State'] . " " . $location_data['CountryName'] . ") - " . $location_data['LocationCode'];
        if($location_data['Phone1'] !== "")
        {        
                if (isset($location_data['Country']) && $location_data['Country'] == 'US') {
                    $phone_number = "+1" . preg_replace("/[^0-9]/","",$location_data['Phone1']);
                    $phone_number_display = $location_data['Phone1'];
                } else {
                    $phone_number = "+" . preg_replace("/[^0-9]/","",$location_data['Phone1']);
                    $phone_number_display = $location_data['Phone1'];
                }
        }
        else
        {
               if (isset($location_data['Country']) && $location_data['Country'] == 'US') {
                    $phone_number = "+1" . preg_replace("/[^0-9]/","",$location_data['Phone2']);
                    $phone_number_display = $location_data['Phone2'];
                } else {
                    $phone_number = "+" . preg_replace("/[^0-9]/","",$location_data['Phone2']);
                    $phone_number_display = $location_data['Phone2'];
                }
        }

        if (is_array($location_data) && array_key_exists('LocationName', $location_data)) {

            $this->display_complete ='  <div class="aez-locations__us">
                                            <div class="location-usa-wrapper">
                                                <div class="aez-info-block-container">
                                                    <div class="aez-info-block">
                                                        <div class="aez-info-section">
                                                            <h4 class="aez-all-caps -blue"><i class="fa fa-map-marker -green" aria-hidden="true"></i> Address:</h4>
                                                            <p class="aez-info-text">' . $location_data['AddLine1'] .
                                                            (! empty($location_data['AddLine2']) ? '<br>' . $location_data['AddLine2'] : '') .
                                                            '<br>'. $location_data['City'] ." " . $location_data['State'] . " " . $location_data['PostalCode'] . " " .$location_data['Country'] .
                                                            '<br>';

                                                            if ($location_data['Phone1'] !== "" || $location_data['Phone2'] !== "") {
                                                                $this->display_complete .='
                                                                <i class="fa fa-phone -blue" aria-hidden="true"></i><a href="tel:'. $phone_number . '">' . $phone_number_display . '</a>'; 
                                                            }

                                                        $this->display_complete .='
                                                        </p></div><br>
                                                        <div class="aez-info-section">
                                                            <h4 class="aez-all-caps -blue"><i class="fa fa-clock-o -green" aria-hidden="true"></i> Hours</h4>';
                            
                                                            $opening_time = "";
                                                            $closing_time = "";

                                                            if ( (count($hours_data) == 0 ) || (isset($hours_data['Status']) && $hours_data['Status'] == 'ERROR') ) {
                                                                        $this->display_complete .= '<div class="aez-info-time">Contact location for hours.</div>';
                                                                        $hours_css = "check_avail_no_hours";
                                                            } else {
                                                                $hours_css = "check_avail";
                                                                // Loop through the location hours
                                                                foreach ($hours_data as $key => $value) {
                                                                    // Explode the time to get the open and closing time of the location
                                                                    $time = explode ("-", $value);
                                                                    if (!empty($time[0])) {
                                                                        $opening_time = $time[0];
                                                                    }
                                                                    if (!empty($time[1])) {
                                                                        $closing_time = $time[1];
                                                                    }
                                                          
                                                                    if ($key == 'Mon') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Monday:</div> <div class="aez-info-time">'. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Tues') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Tuesday:</div> <div class="aez-info-time">'. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Wed') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Wednesday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Thurs') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Thursday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Fri') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Friday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Sat') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Saturday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                    if ($key == 'Sun') {
                                                                        $this->display_complete .= '<div class="aez-hours-text">Sunday:</div> <div class="aez-info-time"> '. date("g:i a", strtotime($opening_time)) . '-' . date("g:i a", strtotime($closing_time)) . '</div><br>';
                                                                    }
                                                                }
                                                            }
            $this->display_complete .='                  </div><div class="loc_check_avail_btn '. $hours_css .'">'
                    . '                                 <p class="aez-body">'
                    . '                                 <button id="check_availability_id" type="button" name="button" value="'. $location_value .'" class="aez-btn aez-btn--filled-green __location find-a-car-menu-item" onclick="goToAnchor()">Check Availability
                                                        </button></p>
                                                    </div>
                                                    
                                                </div>
                                               ';

        } else {

            $this->display_complete = '     <div class="aez-locations__us">
                                                <div class="aez-secondary-header" style="background-image: url(/wp-content/plugins/advantage-locations/assets/maps-general.png);">
                                                    <h1 class="-blue" style="color: #06A;">Location not found</h1>
                                                </div>
                                                <div class="location-usa-wrapper">
                                                        <div class="aez-info-block-container">
                                                <div class="aez-info-block">
                                                    <h3>Sorry about that.</h3>
                                                     </div>
                                                </div>
                                            </div>
                                        </div>';
        }

        return $this->display_complete;

	}

}