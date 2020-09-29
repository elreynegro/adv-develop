<?php

include_once('AdvRez_ShortCodeScriptLoader.php');
 
class AdvRez_CompleteShortcode extends AdvRez_ShortCodeScriptLoader {

	public $display_complete;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_register_script( 'adv_accordion_menu', plugins_url('js/adv_accordion_menu.js', __FILE__), array('jquery', 'main'), null, true);
             wp_register_script('adv_complete', plugins_url('js/adv_complete.js', __FILE__), array('jquery', 'main'), '1.0', true);
            wp_register_script('adv_login', plugins_url('/adv_login/js/adv_login.js'), array('jquery', 'main', 'select2'),  null, true );
            $scripts = array('jquery', 'adv_accordion_menu','adv_complete', 'adv_login');

            wp_enqueue_script($scripts);
 
            wp_localize_script( 'adv_login', 'ADV_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advReservetNonce' => wp_create_nonce( 'advreserve-nonce' )
        		)
        	);
         }
    }

	public function handleShortcode($atts) {

        $this->api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $confirmation_number = (isset($_SESSION['complete']['ConfirmNum'])) ? $_SESSION['complete']['ConfirmNum'] : '';

        $vehicle_picked = $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']];

        $class_image_url = $vehicle_picked['ClassImageURL'];
        $category = $vehicle_picked['Category'];
        $class_code = $vehicle_picked['ClassCode'];
        $type = $vehicle_picked['Type'];
        $ac = $vehicle_picked['AC'];
        $passengers = $vehicle_picked['Passengers'];
        $luggage = $vehicle_picked['Luggage'];
        $transmission = $vehicle_picked['Transmission'];
        $MPGCity = $vehicle_picked['MPGCity'];
        $MPGHighway = $vehicle_picked['MPGHighway'];
        $description = $vehicle_picked['ModelDesc'];

        // $class_image_url = (isset($_POST['class_image_url'])) ? $_POST['class_image_url'] : '';
        // $category = (isset($_POST['category'])) ? $_POST['category'] : '';
        // $class_code = (isset($_POST['class_code'])) ? $_POST['class_code'] : '';
        // $ac = (isset($_POST['ac'])) ? $_POST['ac'] : '';
        // $passengers = (isset($_POST['passengers'])) ? $_POST['passengers'] : '';
        // $luggage = (isset($_POST['luggage'])) ? $_POST['luggage'] : '';

        $pickup_day = intval(substr($_SESSION['search']['pickup_date_time'], 2, 2));
        $pickup_month = intval(substr($_SESSION['search']['pickup_date_time'], 0, 2));
        $pickup_year = intval(substr($_SESSION['search']['pickup_date_time'], 4, 4));
        $pickup_time = substr($_SESSION['search']['pickup_date_time'], -8);

        $dropoff_day = intval(substr($_SESSION['search']['dropoff_date_time'], 2, 2));
        $dropoff_month = intval(substr($_SESSION['search']['dropoff_date_time'], 0, 2));
        $dropoff_year = intval(substr($_SESSION['search']['dropoff_date_time'], 4, 4));
        $dropoff_time = substr($_SESSION['search']['dropoff_date_time'], -8);

        // $pickup_day = (isset($_POST['pickup_day'])) ? $_POST['pickup_day'] : '';
        // $pickup_month = (isset($_POST['pickup_month'])) ? $_POST['pickup_month'] : '';
        // $pickup_year = (isset($_POST['pickup_year'])) ? $_POST['pickup_year'] : '';
        // $pickup_time = (isset($_POST['pickup_time'])) ? $_POST['pickup_time'] : '';

        // $dropoff_day = (isset($_POST['dropoff_day'])) ? $_POST['dropoff_day'] : '';
        // $dropoff_month = (isset($_POST['dropoff_month'])) ? $_POST['dropoff_month'] : '';
        // $dropoff_year = (isset($_POST['dropoff_year'])) ? $_POST['dropoff_year'] : '';
        // $dropoff_time = (isset($_POST['dropoff_time'])) ? $_POST['dropoff_time'] : '';

        // $rental_location_name = (isset($_POST['rental_location_name'])) ? $_POST['rental_location_name'] : '';
        // $rental_location_street = (isset($_POST['rental_location_street'])) ? $_POST['rental_location_street'] : '';
        // $rental_location_city = (isset($_POST['rental_location_city'])) ? $_POST['rental_location_city'] : '';
        // $rental_location_state = (isset($_POST['rental_location_state'])) ? $_POST['rental_location_state'] : '';
        // $rental_location_zip = (isset($_POST['rental_location_zip'])) ? $_POST['rental_location_zip'] : '';

        // $return_location_name = (isset($_POST['return_location_name'])) ? $_POST['return_location_name'] : $_POST['rental_location_name'];
        // $return_location_street = (isset($_POST['return_location_street'])) ? $_POST['return_location_street'] : $_POST['rental_location_street'];
        // $return_location_city = (isset($_POST['return_location_city'])) ? $_POST['return_location_city'] : $_POST['rental_location_city'];
        // $return_location_state = (isset($_POST['return_location_state'])) ? $_POST['return_location_state'] : $_POST['rental_location_state'];
        // $return_location_zip = (isset($_POST['rental_location_zip'])) ? $_POST['rental_location_zip'] : $_POST['rental_location_zip'];

        // $rate_charge = (isset($_POST['rate_charge'])) ? $_POST['rate_charge'] : '';
        // $total_taxes = (isset($_POST['total_taxes'])) ? $_POST['total_taxes'] : '';
        // $total_charges = (isset($_POST['total_charges'])) ? $_POST['total_charges'] : '';
        if ($_SESSION['confirm']['payment_type'] == 'prepaid') {
            $rate_amount = $vehicle_picked['PRateAmount'];
            $rate_charge = $vehicle_picked['PRateCharge'];
            $total_taxes = $vehicle_picked['PTotalTaxes'];
            $total_extras = $vehicle_picked['PTotalExtras'];
            $total_charges = $vehicle_picked['PTotalCharges'];
            $vehicle_discount = sprintf('%01.2f', strval($vehicle_picked['PRateDiscount']));

        } else {

            $rate_amount = $vehicle_picked['RRateAmount'];
            $rate_charge = $vehicle_picked['RRateCharge'];
            $total_taxes = $vehicle_picked['RTotalTaxes'];
            $total_extras = $vehicle_picked['RTotalExtras'];
            $total_charges = $vehicle_picked['RTotalCharges'];
            $vehicle_discount = sprintf('%01.2f', strval($vehicle_picked['RRateDiscount']));
        }

        $discount_percent = $vehicle_picked['DiscountPercent'];

        if ($_SESSION['confirm']['payment_type'] == 'prepaid') {

            $card_name = (isset($_SESSION['complete']['card_name'])) ? $_SESSION['complete']['card_name'] : '';
            // $card_exp_month = (isset($_SESSION['complete']['card_exp_month'])) ? $_SESSION['complete']['card_exp_month'] : '';
            // $card_exp_year = (isset($_SESSION['complete']['card_exp_year'])) ? $_SESSION['complete']['card_exp_year'] : '';
            $card_exp = (isset($_SESSION['complete']['card_exp'])) ? $_SESSION['complete']['card_exp'] : '';
            $last_4_card_number = (isset($_SESSION['complete']['card_number'])) ? $_SESSION['complete']['card_number'] : '';
            $card_exp_month_year =  $card_exp;

            $street_address_1 = (isset($_SESSION['complete']['street_address_1'])) ? $_SESSION['complete']['street_address_1'] : '';
            $street_address_2 = (isset($_SESSION['complete']['street_address_2'])) ? $_SESSION['complete']['street_address_2'] : '';
            $postal_code = (isset($_SESSION['complete']['postal_code'])) ? $_SESSION['complete']['postal_code'] : '';
            $city = (isset($_SESSION['complete']['city'])) ? $_SESSION['complete']['city'] : '';
            $state = (isset($_SESSION['complete']['state'])) ? $_SESSION['complete']['state'] : '';
            
            if(isset($_SESSION['confirm']['cc_holder_name'])) {
                $card_name =  $_SESSION['confirm']['cc_holder_name'];
                $last_4_card_number =  $_SESSION['confirm']['cc_last_four'];
                $card_exp_month_year =  $_SESSION['confirm']['card_exp'];
                
                $street_address_1 = $_SESSION['renter']['renter_address1'];
                $street_address_2 = $_SESSION['renter']['renter_address2'];
                $city = $_SESSION['renter']['renter_city'];
                $state = $_SESSION['renter']['renter_state'];
                $postal_code = $_SESSION['renter']['renter_zip'];        
            }

            $payment_display = '                        <h4 class="aez-all-caps -blue">Credit Card</h4>
                        <p class="aez-info-text">
                            Name: ' . $card_name . '<br>
                            Ends in: ' . $last_4_card_number . '<br>
                            Exp. Date: ' . $card_exp_month_year . '
                        </p>
';
            $billing_address = '                        <h4 class="aez-all-caps -blue">Billing Address</h4>
                        <p class="aez-info-text">
                            ' . $street_address_1 . ' ' . $street_address_2 . '<br />
                            ' . $city . ', ' . $state . ' ' . $postal_code . '
                        </p>
';

            $payment_block = '<div class="aez-info-block-container">
                                    <h3>Payment</h3>
                                    <div class="aez-info-block">
                                        <div class="aez-info-section">' . $payment_display . ' 
                                        </div>

                                        <div class="aez-info-section">' . $billing_address . '
                                        </div>
                                    </div>
                                </div>';

        } else {
            $payment_display = '                        <h4 class="aez-all-caps -blue">Pay at the Counter</h4>
';
            $billing_address = '                        <h4 class="aez-all-caps -blue">Pay Amount Above</h4>
';
            $payment_block = '';
        }

        // Check if RatePlan is weekly or daily. 
        if (strtoupper($vehicle_picked['RatePlan']) == 'WEEKLY') {
            $days = "week";
            $days_ly = "weekly";
        } else {
            $days = "day";
            $days_ly = "daily";
        }

        // Get the currency symbol for the country
        $currency_symbol =  AdvRez_Helper::getAdvCurrency($vehicle_picked['CurrencyCode']);

        //get the popup only when login status is not set
        if(!isset($_SESSION['adv_login'])) {
        $isMemberCheck = Adv_login_Helper::isMemberForBrand($_SESSION['renter']['renter_email_address']);
        }
        else { ?>
            <input type="hidden" name="status_complete" id="status_complete" value="Loyalty Member" />'; 
        <?php }

        //set display_options to the DisplayOptions session array 
        
        $display_options = $_SESSION['DisplayOptions'];

        // Loop though the display options and set the display variables.
        for ($x=0; $x < count($display_options); $x++) {
            
            switch ($display_options[$x]['name']) {
                case 'Transmission':
                    $display_transmission = $display_options[$x]['name'];
                    break;
                case 'Luggage':
                    $display_luggage = $display_options[$x]['name'];
                    break;
                case 'Passengers':
                    $display_passengers = $display_options[$x]['name'];
                    break;
                case 'MPG':
                    $display_mpg = $display_options[$x]['name'];
                    break;
            } // End switch

        } // End for loop

        // ****************************************************************************
        // BEGINNING OF THE CODE TO UPDATE TRACKING INFORMATION INTO THE tracking table
        // ****************************************************************************
        if (isset($confirmation_number) && $confirmation_number !== "") {
            if (isset($_SESSION['tracking_db_id']) && $_SESSION['tracking_db_id'] !== "") {
                $time_reservation_made = date('Y-m-d H:i:s');
                try {
                    // Update tracking table with Confirmation number and Time of reservation
                    global $wpdb;
                    $sql = $wpdb->prepare("UPDATE wp_adv_tracking SET ReservationNumber = '%s', TimeReservationMade = '%s', VehicleRentalPrice = '%s', TaxesFeesTotal = '%s', ExtrasTotal = '%s', TotalPrice = '%s' WHERE ID = '%d'", $confirmation_number, $time_reservation_made, $rate_amount, $total_taxes, $total_extras, $total_charges, $_SESSION['tracking_db_id']);
                    $wpdb->query($sql);
                    //Unset the tracking_db_id session since we no longer need it.
                    unset($_SESSION['tracking_db_id']);
                    if ($wpdb->last_error !== '') {
                        $error_message = $wpdb->last_error;
                        $message = "Error Updating wp_adv_tracking table. SQL : ".trim($sql);
                        $file = __FILE__;
                        $function = __FUNCTION__;
                        $line = __LINE__;
                        Adv_login_Helper::saveToLog($message, $error_message, $file, $function, $line);
                    }
                } catch (Exception $e) {
                    $message = "Try/catch caught an error.Error updating wp_adv_tracking table.";
                    $file = __FILE__;
                    $function = __FUNCTION__;
                    $line = __LINE__;
                    Adv_login_Helper::saveToLog($message, $e->getMessage(), $file, $function, $line);
                }
            }
        }
        // **********************************************************************
        // END OF THE CODE TO UPDATE TRACKING INFORMATION INTO THE tracking table
        // **********************************************************************

        // ****************************************************************************************
        // BEGINNING OF THE CODE TO INSERT TRACKING INFORMATION INTO THE reservation tracking table
        // ****************************************************************************************
         function getUserIpAddr(){
            if (!empty($_SERVER['HTTP_CLIENT_IP'])){
                //ip from share internet
                $ip = $_SERVER['HTTP_CLIENT_IP'];
            } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                //ip pass from proxy
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } else {
                $ip = $_SERVER['REMOTE_ADDR'];
            }
            return $ip;
        }

        if (isset($confirmation_number) && $confirmation_number !== "") {
            try {
                    $date_time = date('Y-m-d H:i:s');

                    $ip_address = getUserIpAddr();
                    // $ip_address = (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '' );

                    $obj = new ADV_OS_BR();
                    $browser = $obj->showInfo('browser');
                    $browser_version = $obj->showInfo('version');
                    $operating_system = $obj->showInfo('os');
                    $browser_info = $browser. ' '. $browser_version . ', '. $operating_system;

                    if ($_SESSION['confirm']['payment_type'] == 'prepaid') {
                        $prepaid = true;
                        $counter = false;
                        ?>
                        <input type="hidden" name="payment" id="payment" value="prepaid" />
                        <?php

                    } else {
                        $counter = true;
                        $prepaid = false;
                        ?>
                        <input type="hidden" name="payment" id="payment" value="counter" />
                        <?php
                    }

                    $age = $_SESSION['search']['age'];

                    $pickup_location = $_SESSION['search']['rental_location_name'];
                    $dropoff_location = $_SESSION['search']['return_location_name'];

                    global $wpdb;
                    $sql = $wpdb->prepare("INSERT INTO wp_adv_reservation_tracking ( ConfirmationNumber , PickupLocation, DropoffLocation, TimeReservationMade, Age, CarClass, Browser, IP, Prepaid, Counter, VehicleRentalPrice, TaxesFeesTotal, ExtrasTotal, TotalPrice) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", $confirmation_number, $pickup_location, $dropoff_location, $date_time, $age, $class_code, $browser_info, $ip_address, $prepaid, $counter, $rate_amount, $total_taxes, $total_extras, $total_charges);

                    $wpdb->query($sql);

                    if ($wpdb->last_error !== '') {
                        $error_message = $wpdb->last_error;
                        $message = "Error inserting into wp_adv_reservation_tracking SQL : ".trim($sql);
                        $file = __FILE__;
                        $function = __FUNCTION__;
                        $line = __LINE__;
                        Adv_login_Helper::saveToLog($message, $error_message, $file, $function, $line);

                    }

                } catch (Exception $e) {
                    $message = "Try/catch caught an error.Error inserting into wp_adv_reservation_tracking";
                    $file = __FILE__;
                    $function = __FUNCTION__;
                    $line = __LINE__;
                    Adv_login_Helper::saveToLog($message, $e->getMessage(), $file, $function, $line);
                }
            }
            // **********************************************************************************
            // END OF THE CODE TO INSERT TRACKING INFORMATION INTO THE reservation tracking table
            // **********************************************************************************


?>
<script type="text/javascript">	
(function(d) { 
    if (document.addEventListener) document.addEventListener('ltkAsyncListener', d);
        else {
            e = document.documentElement; 
            e.ltkAsyncProperty = 0; 
            e.attachEvent('onpropertychange', function (e) {
                if (e.propertyName == 'ltkAsyncProperty'){
                    d();
                }
            });
        }
})
(function($) {
    /********** Begin Custom Code **********/
        /** COMPLETE RESERVATION **/
    var $ls_email =  '<?php echo $_SESSION['renter']['renter_email_address'];?>';
    var $ls_fn = '<?php echo $_SESSION['renter']['renter_first'];?>';
    var $ls_ln = '<?php echo $_SESSION['renter']['renter_last'];?>';
    var $ls_confirmNum = '<?php echo $_SESSION['complete']['ConfirmNum'];?>';
    var $ls_vehicleTotal = '<?php echo sprintf('%01.2f', strval($rate_amount));?>';
    var $ls_extras = '<?php echo sprintf('%01.2f', strval($total_extras));?>';
    var $ls_itemTotal = +$ls_vehicleTotal + +$ls_extras;
    var $ls_surcharge = 0;
    var $ls_taxes = '<?php echo sprintf('%01.2f', strval($total_taxes));?>';
    var $ls_license = 0;
    var $ls_total = '<?php echo sprintf('%01.2f', strval($total_charges));?>';
    var $vehicle_picked = '<?php echo $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']];?>';
    
    var $ls_descp = '<?php echo $vehicle_picked['ModelDesc'];?>';

    _ltk.Order.SetCustomer($ls_email, $ls_fn, $ls_ln);
    _ltk.Order.OrderNumber = [$ls_confirmNum];
    _ltk.Order.ItemTotal = [$ls_itemTotal];
    _ltk.Order.ShippingTotal = [$ls_surcharge];
    _ltk.Order.TaxTotal = [$ls_taxes];
    _ltk.Order.HandlingTotal = [$ls_license];
    _ltk.Order.OrderTotal = [$ls_total];
    _ltk.Order.AddItem([$ls_descp], [1], [$ls_vehicleTotal]); // one line per item reserved
    var $numOptions = 0;
    if ("<?php echo isset($_SESSION['confirm']['DailyExtra'][0]);?>") {
        $numOptions = '<?php echo count($_SESSION['confirm']['DailyExtra']);?>';
    }
    // Loop through the extras and display them
    if($numOptions >= 1) {
    <?php 
    for ($extras_count_val=0; $extras_count_val < count($_SESSION['confirm']['DailyExtra']); $extras_count_val++) {
    $_SESSION['$loop_value'] = $extras_count_val ; ?>
            var $ls_extra = '<?php echo $_SESSION['confirm']['DailyExtra'][$_SESSION['$loop_value']]['ExtraDesc'];?>';
            var $ls_extraRate ='<?php echo sprintf('%01.2f', strval($_SESSION['confirm']['DailyExtra'][$_SESSION['$loop_value']]['ExtraAmount']));?>';
            _ltk.Order.AddItem([$ls_extra], [1], [$ls_extraRate]); // one line per item reserved
     <?php } 
     unset ($_SESSION['$loop_value']);
     ?>
    }
    _ltk.Order.Submit();
    /********** End Custom Code **********/
    (function() {
    /********** Begin Custom Code **********/ 
    /** Handle ORDER **/ 
        _ltk.Order.SetCustomer($ls_email, $ls_fn, $ls_ln); 
        _ltk.Order.OrderNumber = [$ls_confirmNum]; 
        _ltk.Order.ItemTotal = [$ls_itemTotal]; 
        _ltk.Order.ShippingTotal = [$ls_surcharge];
        _ltk.Order.TaxTotal = [$ls_taxes]; 
        _ltk.Order.HandlingTotal = [$ls_license]; 
        _ltk.Order.OrderTotal = [$ls_total]; 
        _ltk.Order.AddItem([$ls_descp], [1], [$ls_vehicleTotal]);
        if ("<?php echo isset($_SESSION['confirm']['DailyExtra'][0]);?>") {
            $numOptions = '<?php echo count($_SESSION['confirm']['DailyExtra']);?>';
        }
        // Loop through the extras and display them
        if($numOptions >= 1) {
        <?php 
        for ($extras_count_val=0; $extras_count_val < count($_SESSION['confirm']['DailyExtra']); $extras_count_val++) {
        $_SESSION['$loop_value'] = $extras_count_val ; ?>
                var $ls_extra = '<?php echo $_SESSION['confirm']['DailyExtra'][$_SESSION['$loop_value']]['ExtraDesc'];?>';
                var $ls_extraRate ='<?php echo sprintf('%01.2f', strval($_SESSION['confirm']['DailyExtra'][$_SESSION['$loop_value']]['ExtraAmount']));?>';
                _ltk.Order.AddItem([$ls_extra], [1], [$ls_extraRate]); // one line per item reserved
        <?php } 
        unset ($_SESSION['$loop_value']);
        ?>
        } 
        // one line per item ordered 
        _ltk.Order.Submit(); 
        _ltk.SCA.SetCustomer($ls_email, $ls_fn, $ls_ln); 
        _ltk.SCA.OrderNumber = [$ls_confirmNum]; 
        _ltk.SCA.Submit(); 
    /********** End Custom Code **********/ 
    });
});
</script>

<?php
//FB pixel code

        $pick_date_fb = (string)$_SESSION['search']['pickup_date'];
        $arr = str_split($pick_date_fb, 4);
        $arr2 = str_split($arr[0], 2);
        array_shift($arr);
        $pick_date = implode("-", array_merge($arr, $arr2)); 
       
        $drop_date_fb = (string)$_SESSION['search']['dropoff_date'];
        $arr3 = str_split($drop_date_fb, 4);
        $arr4 = str_split($arr3[0], 2);
        array_shift($arr3);
        $drop_date = implode("-", array_merge($arr3, $arr4)); 
		
?>
		<script>

		fbq('track', 'Purchase', {
			content_type: '["destination", "car"]',
			content_ids: '<?php echo $_SESSION['enhance']['ClassCode'];?>',
			departing_departure_date: '<?php echo $pick_date;?>',
			returning_departure_date: '<?php echo $drop_date;?>',
			origin_airport: '<?php echo $_SESSION['search']['rental_location_name'];?>',
			destination_airport: '<?php echo $_SESSION['search']['return_location_name'];?>',
			city: '<?php echo $_SESSION['search']['rental_location_city'];?>',
			region: '<?php echo $_SESSION['search']['rental_location_state'];?>',
			country: '<?php echo $_SESSION['search']['rental_location_country'];?>',
            value: '<?php echo sprintf('%01.2f', strval($total_charges));?>',
			currency: '<?php echo $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']]['CurrencyCode'];?>',
		});
		</script>

<!----- Sojern Tag v6_js, Pixel Version: 2 -->

<?php if (isset($this->api_url_array['sojern_flag']) && strtolower($this->api_url_array['sojern_flag']) == "y") { ?>
    <script>
        var payment = document.getElementById("payment").value;
        (function () {
        /* Please fill the following values. */
            var params = {
                rd1: "<?php echo $pick_date;?>", /* Pickup Date */
                rd2: "<?php echo $drop_date;?>", /* Dropoff Date */
                ra1: "<?php echo $_SESSION['search']['rental_location_name'];?>", /* Nearest Airport to Rental Pickup */
                rc1: "<?php echo $_SESSION['search']['rental_location_city'];?>", /* Pickup City */
                rs2: "<?php echo $_SESSION['search']['rental_location_state'];?>", /* Pickup State or Region */
                rn1: "<?php echo $_SESSION['search']['rental_location_country'];?>", /* Pickup Country */
                ra2: "<?php echo $_SESSION['search']['return_location_name'];?>", /* Nearest Airport to Rental Dropoff */
                rc2: "<?php echo $_SESSION['search']['return_location_city'];?>", /* Dropoff City */
                rs1: "<?php echo $_SESSION['search']['return_location_state'];?>", /* Dropoff State or Region */
                rn2: "<?php echo $_SESSION['search']['return_location_country'];?>", /* Dropoff Country */
                rc: "<?php echo $confirmation_number;?>", /* Vehicle Class */
                rp: "<?php echo $vehicle_picked['RRateAmount'];?>", /* Rental Rate */
                rconfno: "<?php echo $confirmation_number;?>", /* Confirmation Number */
                rdc: "<?php echo $_SESSION['search']['promo_codes'];?>", /* Discount Code */
                rpnow: payment, /* Time of Payment */
                pname: "complete", /* Page Name */
                pc: "reservation" /* Page Category */
            };

            /* Please do not modify the below code. */
            var cid = [];
            var paramsArr = [];
            var cidParams = [];
            var pl = document.createElement('script');
            var defaultParams = {"vid":"car","et":"rc"};
            for(key in defaultParams) { params[key] = defaultParams[key]; };
            for(key in cidParams) { cid.push(params[cidParams[key]]); };
            params.cid = cid.join('|');
            for(key in params) { paramsArr.push(key + '=' + encodeURIComponent(params[key])) };
            pl.type = 'text/javascript';
            pl.async = true;
            pl.src = 'https://beacon.sojern.com/pixel/p/10989?f_v=v6_js&p_v=4&' + paramsArr.join('&');
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(pl);
            // console.log("COMPLETE PAGE ");
            // console.log(params);
        })();
    </script>
    <!-- End Sojern Tag -->
    <?php } ?>

        <?php
        $this->display_complete = '
        <img src="https://fp.listrakbi.com/fp/qvlMNwqsZtmU.jpg" height="1" width="1" /><div class="complete" id="primary">
        <input type="hidden" id="memberCheck" name="memberCheck" value="'. $isMemberCheck['d']['Status'] . '">
    <div class="aez-confirmation">
        <div class="aez-print-row">
            <a href="javascript:window.print();" class="aez-print-text">Print <i class="fa fa-print aez-print-icon"></i>
        </a></div>
        <div class="aez-confirmation__heading">Your reservation has been confirmed!
        </div>
        <div class="aez-confirmation-number">
            <div class="aez-confirmation-number__heading">Confirmation Number:</div>
            <div class="aez-confirmation-number__number">' . $confirmation_number . '</div>
            <div class="aez-confirmation-number__message">A copy of your reservation has been sent to your email.</div>
            <div class="aez-confirmation-number__driver_age">To verify your age, you must provide acceptable documentation in the form of a state-issued driver\'s license, international driver\'s permit, or passport when you pick up your rental car to confirm your age. If you are under 25, additional fees will be applied when you pick up your rental car.</div>';
   
	if(isset($_SESSION['loyalty_member_profile_update_flag']) && $_SESSION['loyalty_member_profile_update_flag'] == 1) {
            $this->display_complete .='<div class="aez-confirmation-number__message">Profile has been updated successfully. <a href="/edit-profile"><span class="class="-green"">Click Here</span></a> to view profile.</div>';
            unset($_SESSION['loyalty_member_profile_update_flag']);            
        }
        
        $this->display_complete .='     
            </div>
        </div>';
	
	
	$this->display_complete .='
    <main id="main" role="main">
        <div class="aez-reservation">
            <div class="aez-selected-car">
                <!-- <a href="#">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </a> -->
                <div class="aez-vehicle-img">
                    <img src="' . $class_image_url . '" alt="car picture">
                </div>
                <div class="aez-vehicle-content aez-complete-selection">
                    <span class="aez-enhance-selection__selected">Selected:</span>
                    <span class="aez-enhance-selection__car-name">' . $description . '<span class="or_similar"> (or similar)</span></span>
                    <span class="aez-enhance-selection__car-type car-type">'. $category . ' ' . $type . ' <span class="aez-enhance-selection__car-code">(' . $class_code . ')</span></span>

                    <div class="aez-mini-details">';
                              if (isset($display_transmission)) {
                            $this->display_complete .= '
                            <span> 
                                <i class="fa fa-road" aria-hidden="true"></i>
                                <p>' . $transmission . '</p>
                            </span>';
                            }
                            if (isset($display_mpg)) {
                                $this->display_complete .= '
                                <span>
                                    <i class="fa fa-tachometer" aria-hidden="true"></i>
                                    <p>' . $MPGCity . '/' . $MPGHighway . ' mpg</p>
                                </span>';
                            }
                            if (isset($display_passengers)) {
                                $this->display_complete .= '
                                <span>
                                    <i class="fa fa-users" aria-hidden="true"></i>
                                    <p>' . $passengers . '</p>
                                </span>';
                            }
                            if (isset($display_luggage)) {
                                 $this->display_complete .= '
                                <span>
                                    <i class="fa fa-suitcase" aria-hidden="true"></i>
                                    <p>' . $luggage . '</p>
                                </span>';
                            }

                     $this->display_complete .= '</div>
                </div>
            </div> <!-- end aez-selected-car-container -->

            <div class="aez-info-block-container">
                <h3>Itinerary</h3>
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Pick Up</h4>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $pickup_month, $pickup_day, $pickup_year)) . ' | ' . strtolower($pickup_time) . '</h5>
                        <p class="aez-info-text">
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_name'])) . ' (' . $_SESSION['search']['rental_location_id'] . ')<br>
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_street'])) . '<br>
                            ' . ucwords(strtolower($_SESSION['search']['rental_location_city'])) . ', ' . $_SESSION['search']['rental_location_state'] . ' ' . $_SESSION['search']['rental_location_zip'] . '
                        </p>
                    </div>

                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Drop Off</h4>
                        <h5 class="aez-reservation-date">' . date("l - F j, Y", mktime(0, 0, 0, $dropoff_month, $dropoff_day, $dropoff_year)) . ' | ' . strtolower($dropoff_time) . '</h5>
                        <p class="aez-info-text">
                            ' . ucwords(strtolower($_SESSION['search']['return_location_name'])) . ' (' . $_SESSION['search']['return_location_id'] . ')<br>
                            ' . ucwords(strtolower($_SESSION['search']['return_location_street'])) . '<br>
                            ' . ucwords(strtolower($_SESSION['search']['return_location_city'])) . ', ' . $_SESSION['search']['return_location_state'] . ' ' . $_SESSION['search']['return_location_zip'] . '
                        </p>
                    </div>
                </div>
            </div>

            <div class="aez-list aez-list--summary aez-list--completed">
                <h3>Fees &amp; Options</h3>
                <ul>
                    <div class="list-items total-bottom-border">
                        <li>Vehicle Rental</li>
                        <li>'. $currency_symbol . sprintf('%01.2f', strval($rate_amount)) . '<span class="aez-sub -blue">/' . $days . '</span></li>
                    </div>';

                    // Display the discount if there is one.
                    if (isset($discount_percent)  && $discount_percent > 0) {

                        $discount = $discount_percent * 100;

                        $this->display_complete .= '
                        <div class="list-items total-bottom-border">
                            <li>Discount (' . $discount . '%)</li>
                            <li>
                                <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display"> ' . $currency_symbol . $vehicle_discount . '</span>
                            </li>
                        </div>';
                    }

                    // If the vehicle is US based then show "Taxes and Fees" title
                    if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {
                    
                         $this->display_complete .= '
                        <div class="list-items">
                            <li>Taxes and Fees</li>
                        </div>';

                    }

                     // If it's prepaid then display the prepaid taxes, if it's not prepaid then display 
                    // the pay later taxes.
                    if ($_SESSION['confirm']['payment_type'] == 'prepaid' ) {

                        // Number of taxes and fees that we need to loop though
                        $number = floor(count($vehicle_picked['Taxes']['Prepaid'])/5);

                        // Chunk the vehicle_picked array and create a new array with 5 elements per indexed array
                        if (is_array($vehicle_picked['Taxes']['Prepaid'])) {
                            $chunk_array = array_chunk($vehicle_picked['Taxes']['Prepaid'], 5);
                        }

                        // Loop through the taxes and fees and display them
                        for ($x=0; $x < $number; $x++) {
                            $this->display_complete .= '
                            <div class="list-items">
                                <li class="fee-breakdown">' .$chunk_array[$x][2] .'</li>
                                <li class="fee-breakdown">
                                    <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">'. $currency_symbol . sprintf('%01.2f', strval($chunk_array[$x][3])) .'</span></li>
                            </div>';
                        }

                    } else {

                        // Number of taxes and fees that we need to loop though
                        $number = floor(count($vehicle_picked['Taxes'])/5);

                        // Chunk the vehicle_picked array and create a new array with 5 elements per indexed array
                        if (is_array($vehicle_picked['Taxes'])) {
                            $chunk_array = array_chunk($vehicle_picked['Taxes'], 5);
                        }

                        // Loop through the taxes and fees and display them
                        for ($x=0; $x < $number; $x++) {
                            $this->display_complete .= '
                            <div class="list-items">
                                <li class="fee-breakdown">' .$chunk_array[$x][2] .'</li>
                                <li class="fee-breakdown">
                                    <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">'. $currency_symbol . sprintf('%01.2f', strval($chunk_array[$x][3])) .'</span></li>
                            </div>';
                        }

                    }

                    $this->display_complete .= '
                    <div class="list-items total-bottom-border">
                        <li>Taxes and Fees Total</li>
                        <li>'. $currency_symbol . sprintf('%01.2f', strval($total_taxes)) . '</li>
                    </div>';

                    // If the vehicle is US based then show "Extras" title
                    if (isset($_SESSION['search']['rental_location_country']) && $_SESSION['search']['rental_location_country'] == 'US') {

                        $this->display_complete .= '
                        <div class="list-items">
                            <li>Extras</li>
                        </div>';

                    }

                    // Get the number of extra's
                    $numOptions = 0;
                    if (isset($_SESSION['confirm']['DailyExtra'][0])) {
                        $numOptions = count($_SESSION['confirm']['DailyExtra']);
                    }

                    // Loop through the extras and display them
                    for ($x=0; $x < $numOptions; $x++) {
                            $this->display_complete .= '
                                <div class="list-items">
                                    <li class="fee-breakdown">' .$_SESSION['confirm']['DailyExtra'][$x]['ExtraDesc'] .'</li>
                                    <li class="fee-breakdown">
                                        <span class="aez-reserve-dolar-display aez-reserve-counter-dolar-display">'. $currency_symbol . sprintf('%01.2f', strval($_SESSION['confirm']['DailyExtra'][$x]['ExtraAmount'])) .' <span class="aez-sub -blue"></span></span></li>
                                </div>';
                    }

                    $this->display_complete .= '
                    <div class="list-items">
                        <li>Extras Total</li>
                        <li>'. $currency_symbol . sprintf('%01.2f', strval($total_extras)) . '</li>
                    </div>
                    <div class="list-items total">
                        <li>Total</li>
                        <li>'. $currency_symbol . sprintf('%01.2f', strval($total_charges)) . '</li>
                    </div>
                </ul>
            </div>';

            $this->display_complete .= $payment_block;

            // Tag Manager Data
            $promoCodes = "";
            if(isset($_SESSION['search']['promo_codes'])) {
                $promoCodes = implode(", ", $_SESSION['search']['promo_codes']);
            }

            if ($_SESSION['confirm']['payment_type'] == 'prepaid') {
                $reservation = "Now";
            } else {
                $reservation = "Later";
            }

            $this->display_complete .= '<div class="aez-info-block-container renter-info">
                <h3>Renter Information</h3>
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Profile</h4>
                        <p class="aez-info-text">
                            Name: ' . $_SESSION['renter']['renter_first'] . ' ' . $_SESSION['renter']['renter_last'] . '<br>';

                            // Check if the customer put in their address. If they did then display it.
                            // Otherwise just display the email address.
                            if (!empty($_SESSION['renter']['renter_address1'])) {
                                $this->display_complete .= '
                                Address: ' . $_SESSION['renter']['renter_address1'] . ((isset($_SESSION['renter']['renter_address2'])) && (trim(strlen($_SESSION['renter']['renter_address2'])) > 0) ? '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' . $_SESSION['renter']['renter_address2'] : '' ) .'<br>
                                ' . $_SESSION['renter']['renter_city'] . ', ' . $_SESSION['renter']['renter_state'] . ' ' . $_SESSION['renter']['renter_zip'] . ' ' . $_SESSION['renter']['renter_country'] . '';
                            } else {
                                 $this->display_complete .= 'Email: ' . $_SESSION['renter']['renter_email_address'];
                            }

                        $this->display_complete .= '
                        </p>
                    </div>';

                    if (!(isset($_SESSION['adv_login']))) {
                    $this->display_complete .= '<div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Expressway Status</h4>
                        <p class="aez-info-text">
                            Non-member
                        </p>
                        <p>
                            Simply add a username and password to start earning now!
                        </p>
                        <div class="aez-form-block aez-form-block--log-in-information">

<form id="adv_login" class="aez-form aez-login" action="/complete" role="form" method="POST" name="adv_login">
                <div class="aez-form-block">
                    <div class="aez-form-block__header">
                        <h3 class="aez-form-block__heading">Log In to Advantage Expressway</h3>
                        <i class="fa fa-info-circle aez-form-block__icon"></i>
                    </div>
                    <div class="aez-form-item">
                        <label for="user_name" class="aez-form-item__label">User Name</label>
                        <input
                            id="user_name"
                            type="email"
                            class="aez-form-item__input"
                            name="user_name"
                            placeholder="Email Address"
                        />
                    </div>
                    <div class="aez-form-item">
                        <label for="password" class="aez-form-item__label">Password</label>
                        <input
                            id="password"
                            type="password"
                            class="aez-form-item__input"
                            name="password"
                            placeholder="Password"
                        />
                    </div>
                    <input type="hidden" name="return_url" value="/complete">
                    <a href="/forgot-password-request" class="aez-awards-form__link aez-awards-form__link--forgot">Forgot Password?</a>
                    <button type="submit" class="aez-btn aez-btn--outline-blue aez-awards-form__submit aez-login__submit">Log In</button>
                    <a href="javascript:void(0);" class="aez-awards-form__link aez-awards-form__link--signup signup_menu">Not a member? Sign up now<i class="fa fa-angle-right"></i></a>
                </div>
            </form>
</div>
 <!--<div class="aez-form-block aez-form-block--log-in-information">
                            <div class="aez-form-item">
                                <label for="user_name" class="aez-form-item__label">User Name</label>
                                <input
                                    id="user_name"
                                    type="email"
                                    class="aez-form-item__input"
                                    name="user_name"
                                    placeholder="Email Address"
                                />
                            </div>
                            <div class="aez-form-item">
                                <label for="password" class="aez-form-item__label">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    class="aez-form-item__input"
                                    name="password"
                                    placeholder="Password"
                                />
                            </div>
                        </div>-->
                        <button id="add-log-in-info" type="button" name="button" class="aez-btn aez-btn--outline-blue">Add Log-in Information</button>
                    </div>';
} else {
    $this->display_complete .= '<div class="aez-info-section">
                        <div class="aez-info-section__header">
                            <h4 class="aez-all-caps -blue">Expressway Status:</h4>
                        </div>
                        <p class="aez-info-text">
                            Advantage Expressway Member
                        </p>
                        </div>';
}
                $this->display_complete .= '</div>
            </div>

        <div class="aez-extra aez-extra--confirmation">
            <div class="aez-extra-header aez-location-policies-dd">
                <h4>Location Rental Policy</h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </div>
            <div id="location-policy-drop-down" class="aez-extra-content">
                <div id="policies"><div class="policies_content"> Loading... </div></div>
                <input type="hidden" name="location" value="'. $_SESSION["search"]["rental_location_id"] .'">
            </div>
            <div id="terms-and-conditions-accordion-tab" class="aez-extra-header">
                <h4>Terms &amp; Conditions</h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </div>';

            if (isset($_SESSION['search']['BrandName']) && $_SESSION['search']['BrandName'] == 'Europcar') {
                $this->display_complete .= AdvRez_Helper::getEuropeCarTermsAndConditions();
            } else {
                $this->display_complete .= AdvRez_Helper::getTermsAndConditions();
            }

            // Random Number is used for the Kayak Pixel
            $random_number = rand(100000000, 999999999);

            // Only get the first 3 characters of the $currency_sybol.
            // Example: USD or GBP
            $currency_symbol = substr($currency_symbol, 0, 3);

            $this->display_complete .= '

        </div>';

        // If this is from Kayak then set the Kayak Pixel
        if (isset($_SESSION['enhance']['promo_primary'])) {
             $this->display_complete .= '
                <img src="https://www.kayak.com/s/kayakpixel/confirm/IARAC?kayakclickid='.$_SESSION['enhance']['kayakclickid'].'&price='.$rate_charge.'&currency='.$currency_symbol.'&confirmation='.$_SESSION['complete']['ConfirmNum'].'&rand='.$random_number.'"/>';
        }

        $this->display_complete .= '
    </main>
</div>';

        // Set the awards flag to true so if the customer goes back to the Expressway pages
        // the data will refresh.
        if (isset($_SESSION['adv_login']->memberNumber)) {
            $_SESSION['awards_flag'] = 'True';
        }
        
        //listrak api call start
        $listrak_req_data['ConfirmNum'] = $_SESSION['complete']['ConfirmNum'];  
        $listrak_req_data['search'] = $_SESSION['search'];  
        $listrak_req_data['choose'] = $_SESSION['choose'][$_SESSION['reserve']['vehicleIndex']];  
        $listrak_req_data['renter'] = $_SESSION['renter'];
        $listrak_response = AdvRez_Helper::callListrakToOderDataImport($listrak_req_data);
        //echo "===".$listrak_response;exit;
        //listrak api call end

        // Check if the Kayak session is set
        if (isset($_SESSION['enhance']['promo_primary'])) {
            // Unset the Kayak session so if the pages gets refreshed it won't fire again
            unset($_SESSION['enhance']['promo_primary']);
        }

        // Unset the abandoment_promocode session
        if (isset($_SESSION['abandonment']['abandonment_promocode'])) {
            unset($_SESSION['abandonment']['abandonment_promocode']);
        }

         // Unset the flag_reserve_popup session
        if (isset($_SESSION['flag_reserve_popup'])) {
            unset($_SESSION['flag_reserve_popup']);
        }

        // Set Free Pitstop Applied session to false
        $_SESSION['free_pitstop_applied'] == "False";
        // Set Free Pitstop Removed session to false
        $_SESSION['free_pitstop_removed'] = "False";

        return $this->display_complete;

	}

}