<?php 
//login popup button show only in the home page form
$uri_segments = array();
$uri_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri_segments = explode('/', $uri_path); 
$url_length = strlen($_SERVER['REQUEST_URI']);
?>
<?php
    AdvLocations_Helper::getAllLocations();
    
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

    //set base site url
    $site_url = get_site_url();
    ?>
    <script>
        var site_base_url = "<?php echo $site_url; ?>/";
    </script>
<?php
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
            // case 'promo_codes':
            //  $promo_codes[0] = $value;
            //  break;
        }
    }
}

$today_date = date('Ymd');
$pick_date = date('Ymd', strtotime($pickup_date));
$drop_date = date('Ymd', strtotime($dropoff_date));
if(isset($_SESSION['search']['age'])) {
    $renter_age = $_SESSION['search']['age'];
}


//pre populate registered user information 
$e_check_flag = 0;
if (isset($_SESSION['adv_login'])) {
    $profile_data = Adv_login_Helper::getAdvFullUser();
    if ($rental_location == '' && $profile_data['PreferredRentalLocationCode'] != '') {
        $rental_location = $profile_data['PreferredRentalLocationCode'];
        $loc_arr = AdvLocations_Helper::getLocationInfo($rental_location);
        $rental_location_name = explode(";", $loc_arr['L']);
        $rental_location_name = $rental_location_name[0];

        $return_location = ($profile_data['PreferredDropoffLocationCode'] != '') ? $profile_data['PreferredDropoffLocationCode'] : $profile_data['PreferredRentalLocationCode'];
        $loc_arr = AdvLocations_Helper::getLocationInfo($return_location);
        $return_location_name = explode(";", $loc_arr['L']);
        $return_location_name = $return_location_name[0];
    }

    if ($profile_data['CarSpecification'] != '' && $profile_data['PreferredRentalLocationCode'] != '' && $profile_data['AdditionalOption'] != '') {
        $e_check_flag = 1;
    }
}

if (isset($is_location_page) && $is_location_page == 1) {
    $rental_location = $location_data['LocationCode'];
    $loc_arr = AdvLocations_Helper::getLocationInfo($rental_location);
    $rental_location_name = explode(";", $loc_arr['L']);
    $rental_location_name = $rental_location_name[0];
    $return_location_name = explode(";", $loc_arr['L']);
    $return_location_name = $return_location_name[0];
}

if (isset($_SESSION['adv_login']->user['FirstName'])) { 
    $expressway_user = $_SESSION['adv_login']->user['FirstName'];
}


//Calculate profile dob age
if (isset($_SESSION['adv_login']->user['DOB'])) { 
    $dob_users = $_SESSION['adv_login']->user['DOB'];

    if ($pick_date < $today_date || empty($pickup_date)) {
        $pickup_date = date('m/d/Y', strtotime('+ 1 day'));
    }

    $profile_dob_age =   Adv_login_Helper::calcDobHomePage($dob_users, $pickup_date);
}

//Pre-select renter age based on profile dob
$age_selected = '';
if(!isset($_SESSION['search']['age'])) {
    if(($profile_dob_age == 'under25') || ($renter_age == '21') ) {
         $age_selected = '21';
    }else if(($profile_dob_age == 'under21') || ($profile_dob_age == 'over25') || ($profile_dob_age == 'under18') || (empty($renter_age)) || ($renter_age == '') || ($renter_age == '25+')  ) {
         $age_selected = '25+';
    }      
}
else {
    $age_selected = ($_SESSION['search']['age'] == '21')?'21':'25+';          
}
?>

    <form id="adv_rez" class="aez-form home-container" role="form" method="POST" name="adv_rez" action="/choose">
        <input
            type="hidden"
            name="api_provider"
            value="TSD"
            />
			
<?php 
if (!empty($expressway_user)) { ?>
            <h3 class="aez-find-a-car__heading">Hi <?php echo $expressway_user; ?></h3>

<?php } ?>
        <h3 class="aez-find-a-car__heading">Find A Car Worldwide</h3>
        <div class="aez-form-block">
            <div class="aez-form-item">
                <label for="pickupValue" class="aez-form-item__label aez-form-item__label--hidden">Rent From</label>
                <input 
                    type="search"
                    id="pickupValue"
                    name="pickupValue"
                    class="aez-select2-search aez-form-item__dropdown"
                    placeholder="Rent From"
                    style= "border-color:transparent;" 
                    spellcheck="false"
                    value="<?php echo $rental_location_name; ?>"
                    required
    >

				<?php
					// If the pickup_date is not equal to today's date or the pickup_date doesn't exist, then set the default day to today's date plus one day
					if ($pick_date < $today_date || empty($pickup_date)) {
						$pickup_date = date('m/d/Y', strtotime('+ 1 day'));
					}

				// If the dropoff_date is not equal to today's date or the dropoff_date doesn't exist, then set the default day to today's date plus two days
					if ($drop_date < $today_date || empty($dropoff_date)) {
						$dropoff_date = date('m/d/Y', strtotime('+ 3 day'));
					}
				?>	
				
                <label for="rental_location_id" class="aez-form-item__label--hidden">Rent From</label>
                <input id="rental_location_id" 
                       name="rental_location_id" 
                       style="display: none;" 
                       class="aez-select2-search aez-form-item__dropdown"
                       value="<?php echo $rental_location; ?>"
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
                    style= "border-color:transparent;"
                    spellcheck="false"
                    value="<?php echo $return_location_name; ?>"
                    required
                    >
                <label for="return_location_id" class="aez-form-item__label aez-form-item__label--hidden">Return To</label>
                <input id="return_location_id" 
                       class="aez-select2-search aez-form-item__dropdown" 
                       name="return_location_id"
                       style="display: none;"
                       value="<?php echo $return_location; ?>"
                       >	
            </div>
        </div>
        <div class="aez-form-block">
            <h4 class="aez-form-block__header">Rental Date</h4>
            <div class="aez-form-block--side-by-side">
                <div class="aez-form-item aez-form-item--date">
                    <label for="pickup_date" class="aez-form-item__label"><i class="fa fa-calendar" style="color: #036;"></i></label>
                    <input type="text" 
                           id="pickup_date"
                           class="aez-form-item__input aez-form-item__input--date calendar"
                           placeholder="MM/DD/YYYY"
                           name="pickup_date"
                           value="<?php echo $pickup_date; ?>"
                           readonly="true"
                           required
                           >
                </div>
                <div class="aez-form-item aez-form-item--dropdown">
                    <label for="pickup_time" class="aez-form-item__label aez-form-item__label--hidden">Rental Time</label>
                    <select id="pickup_time" class="aez-form-item__dropdown aez-form-item__dropdown--full-width" name="pickup_time" required >
                        <option value="12:00AM" <?php echo ($pickup_time == '12:00AM') ? 'selected=selected' : ''; ?>>12:00 AM</option><option value="12:30AM" <?php echo ($pickup_time == '12:30AM') ? 'selected=selected' : ''; ?>>12:30 AM</option><option value="01:00AM" <?php echo ($pickup_time == '01:00AM') ? 'selected=selected' : ''; ?>>1:00 AM</option><option value="01:30AM" <?php echo ($pickup_time == '01:30AM') ? 'selected=selected' : ''; ?>>1:30 AM</option><option value="02:00AM" <?php echo ($pickup_time == '02:00AM') ? 'selected=selected' : ''; ?>>2:00 AM</option><option value="02:30AM" <?php echo ($pickup_time == '02:30AM') ? 'selected=selected' : ''; ?>>2:30 AM</option><option value="03:00AM" <?php echo ($pickup_time == '03:00AM') ? 'selected=selected' : ''; ?>>3:00 AM</option><option value="03:30AM" <?php echo ($pickup_time == '03:30AM') ? 'selected=selected' : ''; ?>>3:30 AM</option><option value="04:00AM" <?php echo ($pickup_time == '04:00AM') ? 'selected=selected' : ''; ?>>4:00 AM</option><option value="04:30AM" <?php echo ($pickup_time == '04:30AM') ? 'selected=selected' : ''; ?>>4:30 AM</option><option value="05:00AM" <?php echo ($pickup_time == '05:00AM') ? 'selected=selected' : ''; ?>>5:00 AM</option><option value="05:30AM" <?php echo ($pickup_time == '05:30AM') ? 'selected=selected' : ''; ?>>5:30 AM</option><option value="06:00AM" <?php echo ($pickup_time == '06:00AM') ? 'selected=selected' : ''; ?>>6:00 AM</option><option value="06:30AM" <?php echo ($pickup_time == '06:30AM') ? 'selected=selected' : ''; ?>>6:30 AM</option><option value="07:00AM" <?php echo ($pickup_time == '07:00AM') ? 'selected=selected' : ''; ?>>7:00 AM</option><option value="07:30AM" <?php echo ($pickup_time == '07:30AM') ? 'selected=selected' : ''; ?>>7:30 AM</option><option value="08:00AM" <?php echo ($pickup_time == '08:00AM') ? 'selected=selected' : ''; ?>>8:00 AM</option><option value="08:30AM" <?php echo ($pickup_time == '08:30AM') ? 'selected=selected' : ''; ?>>8:30 AM</option><option value="09:00AM" <?php echo ($pickup_time == '09:00AM' || empty($pickup_time)) ? 'selected=selected' : ''; ?>>9:00 AM</option><option value="09:30AM" <?php echo ($pickup_time == '09:30AM') ? 'selected=selected' : ''; ?>>9:30 AM</option><option value="10:00AM" <?php echo ($pickup_time == '10:00AM') ? 'selected=selected' : ''; ?>>10:00 AM</option><option value="10:30AM" <?php echo ($pickup_time == '10:30AM') ? 'selected=selected' : ''; ?>>10:30 AM</option><option value="11:00AM" <?php echo ($pickup_time == '11:00AM') ? 'selected=selected' : ''; ?>>11:00 AM</option><option value="11:30AM" <?php echo ($pickup_time == '11:30AM') ? 'selected=selected' : ''; ?>>11:30 AM</option><option value="12:00PM" <?php echo ($pickup_time == '12:00PM') ? 'selected=selected' : ''; ?>>12:00 PM</option><option value="12:30PM" <?php echo ($pickup_time == '12:30PM') ? 'selected=selected' : ''; ?>>12:30 PM</option><option value="01:00PM" <?php echo ($pickup_time == '01:00PM') ? 'selected=selected' : ''; ?>>1:00 PM</option><option value="01:30PM" <?php echo ($pickup_time == '01:30PM') ? 'selected=selected' : ''; ?>>1:30 PM</option><option value="02:00PM" <?php echo ($pickup_time == '02:00PM') ? 'selected=selected' : ''; ?>>2:00 PM</option><option value="02:30PM" <?php echo ($pickup_time == '02:30PM') ? 'selected=selected' : ''; ?>>2:30 PM</option><option value="03:00PM" <?php echo ($pickup_time == '03:00PM') ? 'selected=selected' : ''; ?>>3:00 PM</option><option value="03:30PM" <?php echo ($pickup_time == '03:30PM') ? 'selected=selected' : ''; ?>>3:30 PM</option><option value="04:00PM" <?php echo ($pickup_time == '04:00PM') ? 'selected=selected' : ''; ?>>4:00 PM</option><option value="04:30PM" <?php echo ($pickup_time == '04:30PM') ? 'selected=selected' : ''; ?>>4:30 PM</option><option value="05:00PM" <?php echo ($pickup_time == '05:00PM') ? 'selected=selected' : ''; ?>>5:00 PM</option><option value="05:30PM" <?php echo ($pickup_time == '05:30PM') ? 'selected=selected' : ''; ?>>5:30 PM</option><option value="06:00PM" <?php echo ($pickup_time == '06:00PM') ? 'selected=selected' : ''; ?>>6:00 PM</option><option value="06:30PM" <?php echo ($pickup_time == '06:30PM') ? 'selected=selected' : ''; ?>>6:30 PM</option><option value="07:00PM" <?php echo ($pickup_time == '07:00PM') ? 'selected=selected' : ''; ?>>7:00 PM</option><option value="07:30PM" <?php echo ($pickup_time == '07:30PM') ? 'selected=selected' : ''; ?>>7:30 PM</option><option value="08:00PM" <?php echo ($pickup_time == '08:00PM') ? 'selected=selected' : ''; ?>>8:00 PM</option><option value="08:30PM" <?php echo ($pickup_time == '08:30PM') ? 'selected=selected' : ''; ?>>8:30 PM</option><option value="09:00PM" <?php echo ($pickup_time == '09:00PM') ? 'selected=selected' : ''; ?>>9:00 PM</option><option value="09:30PM" <?php echo ($pickup_time == '09:30PM') ? 'selected=selected' : ''; ?>>9:30 PM</option><option value="10:00PM" <?php echo ($pickup_time == '10:00PM') ? 'selected=selected' : ''; ?>>10:00 PM</option><option value="10:30PM" <?php echo ($pickup_time == '10:30PM') ? 'selected=selected' : ''; ?>>10:30 PM</option><option value="11:00PM" <?php echo ($pickup_time == '11:00PM') ? 'selected=selected' : ''; ?>>11:00 PM</option><option value="11:30PM" <?php echo ($pickup_time == '11:30PM') ? 'selected=selected' : ''; ?>>11:30 PM</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="aez-form-block">
            <h4 class="aez-form-block__header">Return Date</h4>
            <div class="aez-form-block--side-by-side">
                <div class="aez-form-item aez-form-item--date">
                    <label for="dropoff_date" class="aez-form-item__label"><i class="fa fa-calendar" style="color: #036;"></i></label>
                    <input id="dropoff_date" type="text" class="aez-form-item__input aez-form-item__input--date" name="dropoff_date" placeholder="MM/DD/YYYY" value="<?php echo $dropoff_date; ?>" readonly="true" required >
                </div>
                <div class="aez-form-item aez-form-item--dropdown">
                    <label for="dropoff_time" class="aez-form-item__label aez-form-item__label--hidden">Return Time</label>
                    <select id="dropoff_time" class="aez-form-item__dropdown aez-form-item__dropdown--full-width" name="dropoff_time" required >
                        <option value="12:00AM" <?php echo ($dropoff_time == '12:00AM') ? 'selected=selected' : ''; ?>>12:00 AM</option><option value="12:30AM" <?php echo ($dropoff_time == '12:30AM') ? 'selected=selected' : ''; ?>>12:30 AM</option><option value="01:00AM" <?php echo ($dropoff_time == '01:00AM') ? 'selected=selected' : ''; ?>>1:00 AM</option><option value="01:30AM" <?php echo ($dropoff_time == '01:30AM') ? 'selected=selected' : ''; ?>>1:30 AM</option><option value="02:00AM" <?php echo ($dropoff_time == '02:00AM') ? 'selected=selected' : ''; ?>>2:00 AM</option><option value="02:30AM" <?php echo ($dropoff_time == '02:30AM') ? 'selected=selected' : ''; ?>>2:30 AM</option><option value="03:00AM" <?php echo ($dropoff_time == '03:00AM') ? 'selected=selected' : ''; ?>>3:00 AM</option><option value="03:30AM" <?php echo ($dropoff_time == '03:30AM') ? 'selected=selected' : ''; ?>>3:30 AM</option><option value="04:00AM" <?php echo ($dropoff_time == '04:00AM') ? 'selected=selected' : ''; ?>>4:00 AM</option><option value="04:30AM" <?php echo ($dropoff_time == '04:30AM') ? 'selected=selected' : ''; ?>>4:30 AM</option><option value="05:00AM" <?php echo ($dropoff_time == '05:00AM') ? 'selected=selected' : ''; ?>>5:00 AM</option><option value="05:30AM" <?php echo ($dropoff_time == '05:30AM') ? 'selected=selected' : ''; ?>>5:30 AM</option><option value="06:00AM" <?php echo ($dropoff_time == '06:00AM') ? 'selected=selected' : ''; ?>>6:00 AM</option><option value="06:30AM" <?php echo ($dropoff_time == '06:30AM') ? 'selected=selected' : ''; ?>>6:30 AM</option><option value="07:00AM" <?php echo ($dropoff_time == '07:00AM') ? 'selected=selected' : ''; ?>>7:00 AM</option><option value="07:30AM" <?php echo ($dropoff_time == '07:30AM') ? 'selected=selected' : ''; ?>>7:30 AM</option><option value="08:00AM" <?php echo ($dropoff_time == '08:00AM') ? 'selected=selected' : ''; ?>>8:00 AM</option><option value="08:30AM" <?php echo ($dropoff_time == '08:30AM') ? 'selected=selected' : ''; ?>>8:30 AM</option><option value="09:00AM" <?php echo ($dropoff_time == '09:00AM' || empty($dropoff_time)) ? 'selected=selected' : ''; ?>>9:00 AM</option><option value="09:30AM" <?php echo ($dropoff_time == '09:30AM') ? 'selected=selected' : ''; ?>>9:30 AM</option><option value="10:00AM" <?php echo ($dropoff_time == '10:00AM') ? 'selected=selected' : ''; ?>>10:00 AM</option><option value="10:30AM" <?php echo ($dropoff_time == '10:30AM') ? 'selected=selected' : ''; ?>>10:30 AM</option><option value="11:00AM" <?php echo ($dropoff_time == '11:00AM') ? 'selected=selected' : ''; ?>>11:00 AM</option><option value="11:30AM" <?php echo ($dropoff_time == '11:30AM') ? 'selected=selected' : ''; ?>>11:30 AM</option><option value="12:00PM" <?php echo ($dropoff_time == '12:00PM') ? 'selected=selected' : ''; ?>>12:00 PM</option><option value="12:30PM" <?php echo ($dropoff_time == '12:30PM') ? 'selected=selected' : ''; ?>>12:30 PM</option><option value="01:00PM" <?php echo ($dropoff_time == '01:00PM') ? 'selected=selected' : ''; ?>>1:00 PM</option><option value="01:30PM" <?php echo ($dropoff_time == '01:30PM') ? 'selected=selected' : ''; ?>>1:30 PM</option><option value="02:00PM" <?php echo ($dropoff_time == '02:00PM') ? 'selected=selected' : ''; ?>>2:00 PM</option><option value="02:30PM" <?php echo ($dropoff_time == '02:30PM') ? 'selected=selected' : ''; ?>>2:30 PM</option><option value="03:00PM" <?php echo ($dropoff_time == '03:00PM') ? 'selected=selected' : ''; ?>>3:00 PM</option><option value="03:30PM" <?php echo ($dropoff_time == '03:30PM') ? 'selected=selected' : ''; ?>>3:30 PM</option><option value="04:00PM" <?php echo ($dropoff_time == '04:00PM') ? 'selected=selected' : ''; ?>>4:00 PM</option><option value="04:30PM" <?php echo ($dropoff_time == '04:30PM') ? 'selected=selected' : ''; ?>>4:30 PM</option><option value="05:00PM" <?php echo ($dropoff_time == '05:00PM') ? 'selected=selected' : ''; ?>>5:00 PM</option><option value="05:30PM" <?php echo ($dropoff_time == '05:30PM') ? 'selected=selected' : ''; ?>>5:30 PM</option><option value="06:00PM" <?php echo ($dropoff_time == '06:00PM') ? 'selected=selected' : ''; ?>>6:00 PM</option><option value="06:30PM" <?php echo ($dropoff_time == '06:30PM') ? 'selected=selected' : ''; ?>>6:30 PM</option><option value="07:00PM" <?php echo ($dropoff_time == '07:00PM') ? 'selected=selected' : ''; ?>>7:00 PM</option><option value="07:30PM" <?php echo ($dropoff_time == '07:30PM') ? 'selected=selected' : ''; ?>>7:30 PM</option><option value="08:00PM" <?php echo ($dropoff_time == '08:00PM') ? 'selected=selected' : ''; ?>>8:00 PM</option><option value="08:30PM" <?php echo ($dropoff_time == '08:30PM') ? 'selected=selected' : ''; ?>>8:30 PM</option><option value="09:00PM" <?php echo ($dropoff_time == '09:00PM') ? 'selected=selected' : ''; ?>>9:00 PM</option><option value="09:30PM" <?php echo ($dropoff_time == '09:30PM') ? 'selected=selected' : ''; ?>>9:30 PM</option><option value="10:00PM" <?php echo ($dropoff_time == '10:00PM') ? 'selected=selected' : ''; ?>>10:00 PM</option><option value="10:30PM" <?php echo ($dropoff_time == '10:30PM') ? 'selected=selected' : ''; ?>>10:30 PM</option><option value="11:00PM" <?php echo ($dropoff_time == '11:00PM') ? 'selected=selected' : ''; ?>>11:00 PM</option><option value="11:30PM" <?php echo ($pickup_time == '11:30PM') ? 'selected=selected' : ''; ?>>11:30 PM</option>
                    </select>
                </div>
            </div>
            <div> </div>
        </div>
        <div class="aez-form-block">
            <h4 class="aez-form-block__header">Promo or Corporate Code</h4>
<?php
// echo $promoCode;
// Check if the promocode from the get url is set
if (0 && !empty($promoCode)) {
    // Check if the array count is 1 (doesn't mean there's anything in the array yet).
    if (count($promo_codes[0]) == 1) {
        // If the array value at 0 index is empty, add the promocode to the value of the 0 index
        if (empty($promo_codes[0][0])) {
            $promo_codes[0][0] = $promoCode;
        } else {
            // If the the 0 index promocode isn't empty that means it has a promocode in it, so add the new 
            // promocode from the get url to the #1 index.
            $promo_codes[0][1] = $promoCode;
        }
        // If the promocode count is 4 (which means all 4 promocodes exist), overwrite the last one.
    } elseif (count($promo_codes[0]) == 4) {
        $promo_codes[0][3] = $promoCode;
        // Put the promocode at the end of the array for the 2 & 3 promo_code index.
    } else {
        array_push($promo_codes[0], $promoCode);
    }
}

$promo_codes = array();
if (isset($_SESSION['search']['promo_codes'])) {
    $promo_codes[0] = $_SESSION['search']['promo_codes'];
}
// There is no promo code add the html for the input box

if (!empty($promoCode)) {
    //echo $promoCode;
    $promo_codes[0] = array($promoCode);
    $_SESSION['search']['promo_codes'] = $promo_codes[0];
}

if (count($promo_codes[0]) == 0) {
    ?>

                <div class="aez-form-item--with-btn promo-code-section-dynamic">
                    <div class="aez-form-item">
                        <label for="promo_codes1" class="aez-form-item__label"><span class="fa-stack fa-lg"><i class="fa fa-certificate fa-stack-2x"></i><i class="fa fa-tags fa-stack-1x fa-inverse promo-code-image"></i></span></label>		
                        <input id="promo_codes1" type="text" class="aez-form-item__input" name="promo_codes[]" data-number="1" placeholder="Enter Code" />
                    </div>
                    <span class="aez-add-btn" data-number="1"></span><div class="">&nbsp;</div>
                </div>

    <?php
} else {
	$api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
    // Loop though all the promo codes
    for ($x = 0; $x < count($promo_codes[0]); $x++) {
        // If the promocode that is shown is the abandonment promocode, don't display it.
        if (strtolower(trim($promo_codes[0][$x])) == strtolower(trim($api_url_array['abandonment_promocode']))) {
            unset($promo_codes[0]);
            $class = "aez-add-btn";
        // If the current code is the last code in the array and is 2 promo codes or less, 
        // add the  "+" button, else add the "-" button. 
        } elseif ($x == (count($promo_codes[0]) - 1) && (count($promo_codes[0])) < 2) {
            $class = "aez-add-btn";
        } else {
            $class = "aez-remove-btn";
        }
        ?>
                    <div class="aez-form-item--with-btn promo-code-section-dynamic">
                        <div class="aez-form-item">
                            <label for="promo_codes1" class="aez-form-item__label"><span class="fa-stack fa-lg"><i class="fa fa-certificate fa-stack-2x"></i><i class="fa fa-tags fa-stack-1x fa-inverse promo-code-image"></i></span></label>
                            <input id="promo_codes1" type="text" class="aez-form-item__input" name="promo_codes[]" data-number="1" placeholder="Enter Code" value="<?php echo (isset($promo_codes[0][$x])) ? $promo_codes[0][$x] : ''; ?>"
                                   />
                        </div>
                        <span class="<?php echo $class; ?>" data-number="1"></span><div class="">&nbsp;</div>
                    </div>
        <?php
    } // End for
} // End if
?>  
    </div>
        

        <div class="aez-form-block">
                <h4 class="age_header aez-form-block__header">Renter Age
                    <select id="renter_age" name="renter_age" class="age_select">
                        <option class="select" value="21" <?php echo ($age_selected == '21')?'selected="selected"':'';?> >21-24</option>
			            <option class="select" value="25+" <?php echo ($age_selected == '25+')?'selected="selected"':'';?> >25+</option>
                    </select>   
                <div>
                    <i data-toggle="tooltip" data-placement="bottom" title="Additional fees apply for drivers under 25 years old." class="fa fa-question-circle" style="font-size: 1.3em; color: #fff;"></i>
                </div>
            </h4>
        </div>

            <?php if (empty($expressway_user)) { ?>
            <div class="aez-form-block">
                <div class="aez-form-block__header express-checkout-link" style="margin-top: 1%;">
                    <!--      <a id="express-checkout-detail-link" rel="modal:open" href="javascript:void(0);">-->
                <?php if (empty($expressway_user)) { ?> <span class="checkout_link fac-login-mobile">Expressway Members LOG IN for instant benefits</span> <?php } ?>
                    <div class="fac_login_btn_container">
                        <a id="home_login" class="hm-login-popup-btn aez-btn--filled-green fac_login_btn">LOG IN</a>
                    </div>
                    <?php // }?>
            </div>            
            </div> 
    <?php if (!empty($expressway_user)) { ?> <span>Expressway Members LOG IN for instant benefits</span> <?php } ?>		
<?php } ?>
        <!--member preference checking -->
<?php if ($e_check_flag == 1 || $e_check_flag == 0 ) { ?>
            <div class="aez-form-block">
                <div class="aez-form-block__header express-checkout-link">
            <?php if (!empty($expressway_user)) { ?> <span class="checkout_link">Expressway Checkout with <a href="/profile" style="">Expressway Member Preferences</a> <i data-toggle="tooltip" data-placement="bottom" title="Expressway checkout available based on user profile preferences." class="fa fa-question-circle" style="font-size: 1.3em; margin-left: 1%; color: #fff;"></i></span> <?php } ?>
        
                    <?php if (!empty($expressway_user)) { ?> <div class="fac_login_btn_container"><label class="switch"> 
					<!-- switch button below the login popup -->
                            <input
                                id="express_checkout_option"
                                type="checkbox"
                                class="aez-form-item__checkbox"
                                name="express_checkout_option"
                                value="1"
        <?php echo ($e_check_flag == 0) ? 'disabled="disabled"' : '' ?>
        <?php echo ($e_check_flag == 1) ? 'checked="checked"' : '' ?>
                                />
                            <span class="slider round"></span>
                        </label></div>

                            <?php } ?>
                    </div>		 
            </div>
<?php } ?>
        <div class="aez-form-block">
            <input type="hidden" name="vehicle_page_car_class" id="vehicle_page_car_class" value="" />
            <button id="adv_rez_submit" type="submit" class="aez-btn aez-btn--filled-green">Search</button>
        </div>
        <span class="close -blue">Close</span>
    </form>
    <!-- <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <link src="./js/jquery-ui.min.css"/> -->
