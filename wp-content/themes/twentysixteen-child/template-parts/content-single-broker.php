<?php
/**
 * The template part for displaying single broker posts
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen_Child
 * @since Twenty Sixteen 1.0
 */

AdvLocations_Helper::getAllLocations();

wp_register_style( 'broker-pages-css', get_stylesheet_directory_uri() . '/css/broker-pages.css' );
wp_enqueue_style(array('broker-pages-css'));

wp_enqueue_script('custom-types', '/wp-content/themes/twentysixteen-child/js/custom-types.js', array('jquery'), null, true);

global $post;
$post_values = get_post_custom($post->ID);

$broker_banner_image = get_post_meta($post->ID, 'wpcf-broker-banner-img', true);

if(is_array($broker_banner_image) && count($broker_banner_image) < 2) {
	$broker_banner_image = $broker_banner_image[0]['guid'];
} elseif (is_array($broker_banner_image) && count($broker_banner_image) > 2) {
	$broker_banner_image = $broker_banner_image['guid'];
} elseif ($broker_banner_image == '') {
	$broker_banner_image = $post_values['wpcf-broker-banner-img'][0];
}

$broker_logo_image = get_post_meta($post->ID, 'wpcf-broker-logo-img', true);

if(is_array($broker_logo_image) && count($broker_logo_image) < 2) {
	$broker_logo_image = $broker_logo_image[0]['guid'];
} elseif (is_array($broker_logo_image) && count($broker_logo_image) > 2) {
	$broker_logo_image = $broker_logo_image['guid'];
} elseif ($broker_logo_image == '') {
	$broker_logo_image = $post_values['wpcf-broker-logo-img'][0];
}

$broker_content_title = get_post_meta($post->ID, 'wpcf-broker-content-title', true);

// Promo Code 1
$broker_promo_code_one = get_post_meta($post->ID, 'wpcf-broker-promo-code-one', true);
$verbiage_promocode_1 = get_post_meta($post->ID, 'wpcf-broker-verbiage-promo-code-field-1', true);

// Display The Second Promo Code
$display_second_promo_code = get_post_meta($post->ID, 'wpcf-broker-display-second-promo-code', true);

// Promo Code 2
$broker_promo_code_two = get_post_meta($post->ID, 'wpcf-broker-promo-code-two', true);
$verbiage_promocode_2 = get_post_meta($post->ID, 'wpcf-broker-verbiage-promo-code-field-2', true);

$broker_disclaimer = get_post_meta($post->ID, 'wpcf-broker-disclaimer', true);

$broker_post_content = $post->post_content;
$broker_post_title = $post->post_title;


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

// If the dropoff_date is not equal to today's date or the dropoff_date doesn't exist, 
// then set the default day to today's date plus two days
if ($dropoff_date < date('mdY') || empty($dropoff_date)) {
    $dropoff_date = date('m/d/Y', strtotime('+ 3 day'));
}

// Fill in the promo code is there's only one. If there's 2 promo codes then don't pre-populate one
if ($display_second_promo_code !== "yes") {
	$pre_populate_promo_code = $broker_promo_code_one;
} else {
	$pre_populate_promo_code = "";
}

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

<?php 

$find_a_car_html = '
	<div>
		<div class="aez-partners-feature">
			<div class="aez-partners-feature__hero">
				<img src="'.$broker_banner_image.'" class="aez-partners-feature__hero">
				<div class="aez-partners-feature__hero-gradient"></div>
				 <div class="aez-partners-feature__hero-content">
				<h2>'.$broker_post_title.'</h2>
			</div>
		</div>

		<div class="aez-partners-feature__container">
			<div class="aez-partners-feature__form aez-partners--primary-bg-color">
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
									value="'. $pre_populate_promo_code .'"
								/>
							</div>
							<span class="aez-add-btn" data-number="1"></span>
						</div> 
					</div>
					<div class="aez-form-block" style="margin-bottom: 1%;">
						<h4 class="age_header aez-form-block__header">Renter Age
							<select id="renter_age" name="renter_age" class="age_select">
								<option class="select" value="21" '. ($renter_age == '21' ? 'selected=selected' : '' ) . '>21-24</option>
								<option class="select" value="25+" '. (($renter_age == '25+' || (empty($renter_age)) || $renter_age == '' ) ? 'selected=selected' : '' ) . '>25+</option>
							</select>   
							<div>
								<i data-toggle="tooltip" data-placement="bottom" title="Additional fees apply for drivers under 25 years old." class="fa fa-question-circle" style="font-size: 1.3em; color: #fff;"></i>
							</div>
						</h4>
					</div>
					<div class="aez-form-block">
						<button id="adv_rez_submit" type="submit" class="aez-btn aez-btn--filled-green">Search</button>
					</div>
					<span class="close -blue">Close</span>
					<input type="hidden" name="reference" value="'.$reference.'">
				</form>

			</div>

			<div class="aez-partners-feature__content">';
				if ($broker_logo_image != "") {
					$find_a_car_html .=' <img class="aez-partners-feature__content-logo" src="'.$broker_logo_image.'" alt="Logo Image">';
				}
			$find_a_car_html .=' 
				<h3 class="aez-partners-feature__content-title">'.$broker_content_title.'</h3>
				<p class="aez-partners-feature__content-copy">'.$broker_post_content.'</p>
				<a href="#" id="arrow1">
					<div class="aez-partners-feature__content-promo">
						<div class="code aez-partners--promo-bg-color aez-partners--arrow-promo-bg-color">
							<span id="promocode1">'.$broker_promo_code_one.'</span>
						</div>
						<p>'.$verbiage_promocode_1.'</p>
					</div>
				</a>';

			if ($display_second_promo_code == "yes") {
				$find_a_car_html .='
				<a href="#" id="arrow2">
					<div class="aez-partners-feature__content-promo">
						<div class="code aez-partners--promo-bg-color aez-partners--arrow-promo-bg-color">
							<span id="promocode2">'.$broker_promo_code_two.'</span>
						</div>
						<p>'.$verbiage_promocode_2.'</p>
					</div>
				</a>';
			}

			$find_a_car_html .=' 
			</div>';
			if ($broker_disclaimer !== ""  && $broker_logo_image == "") {
				$find_a_car_html .=' <div class="broker-disclaimer-no-image">'.$broker_disclaimer.'</div>';
			} elseif ($broker_disclaimer !== ""  && $broker_logo_image !== "") {
				$find_a_car_html .=' <div class="broker-disclaimer">'.$broker_disclaimer.'</div>';
			} elseif ($broker_disclaimer == ""  && $broker_logo_image !== "") {
				$find_a_car_html .=' <div class="broker-disclaimer-blank">&nbsp</div>';
			} elseif ($broker_disclaimer == ""  && $broker_logo_image == "") {
				$find_a_car_html .=' <div class="broker-disclaimer-logo-blank">&nbsp</div>';
			}
			$find_a_car_html .='
		</div>
	</div>
	';
	echo $find_a_car_html;
	?>
	
</article><!-- #post-## -->

