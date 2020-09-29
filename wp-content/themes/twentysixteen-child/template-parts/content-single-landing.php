<?php
/**
 * The template part for displaying single landing posts
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen_Child
 * @since Twenty Sixteen 1.0
 */

AdvLocations_Helper::getAllLocations();

wp_register_style( 'landing-pages-css', get_stylesheet_directory_uri() . '/css/landing-pages.css' );
wp_enqueue_style(array('landing-pages-css'));

wp_enqueue_script('custom-types', '/wp-content/themes/twentysixteen-child/js/custom-types.js', array('jquery'), null, true);


global $post;
$post_values = get_post_custom($post->ID);

$landing_content_title = get_post_meta($post->ID, 'wpcf-landing-content-title', true);
$landing_banner_image =  get_post_meta($post->ID, 'wpcf-landing-banner-img', true);

if(is_array($landing_banner_image) && count($landing_banner_image) < 2) {
	$landing_banner_image = $landing_banner_image[0]['guid'];
} elseif (is_array($landing_banner_image) && count($landing_banner_image) > 2) {
	$landing_banner_image = $landing_banner_image['guid'];
} elseif ($landing_banner_image == '') {
	$landing_banner_image = $post_values['wpcf-landing-banner-img'][0];
}

$landing_disclaimer = get_post_meta($post->ID, 'wpcf-landing-page-disclaimer', true);
$landing_logo_image = get_post_meta($post->ID, 'wpcf-landing-logo-img', true);

if(is_array($landing_logo_image) && count($landing_logo_image) < 2) {
	$landing_logo_image = $landing_logo_image[0]['guid'];
} elseif (is_array($landing_logo_image) && count($landing_logo_image) > 2) {
	$landing_logo_image = $landing_logo_image['guid'];
} elseif ($landing_logo_image == '') {
	$landing_logo_image = $post_values['wpcf-landing-logo-img'][0];
}

$search_bg_color = get_post_meta($post->ID, 'wpcf-landing-search-background-color', true);

// First Arrow
$landing_promo_code = get_post_meta($post->ID, 'wpcf-landing-page-promo', true);
$promo_code_text_color = get_post_meta($post->ID, 'wpcf-landing-promo-code-text-color', true);
$promo_code_arrow_color = get_post_meta($post->ID, 'wpcf-landing-promo-code-arrow-color', true);
$verbiage_promocode_1 = get_post_meta($post->ID, 'wpcf-landing-verbiage-promo-code-field-1', true);

// Display The Second Promo Code
$display_second_promo_code = get_post_meta($post->ID, 'wpcf-landing-display-second-promo-code', true);

// Second Arrow
$landing_promo_code_two = get_post_meta($post->ID, 'wpcf-landing-promo-code-two', true);
$promo_code_text_color_two = get_post_meta($post->ID, 'wpcf-landing-promo-code-text-color-two', true);
$promo_code_arrow_color_two = get_post_meta($post->ID, 'wpcf-landing-promo-code-arrow-color-two', true);
$verbiage_promocode_2 = get_post_meta($post->ID, 'wpcf-landing-verbiage-promo-code-field-2', true);

// Image Title
$verbiage_start_stacking_your_rewards = get_post_meta($post->ID, 'wpcf-landing-verbiage-start-stacking-your-rewards', true);
$verbiage_business_and_leisure_travelers = get_post_meta($post->ID, 'wpcf-landing-verbiage-business-and-leisure-travelers', true);

// Column One
$column_one_title = get_post_meta($post->ID, 'wpcf-landing-column-one-title', true);
if($column_one_title == '') {
	$column_one_title = 'FREE UPGRADE';
}
$column_one_verbiage = get_post_meta($post->ID, 'wpcf-landing-column-one-verbiage', true);
if($column_one_verbiage == '') {
	$column_one_verbiage = 'Receive a free class upgrade instantly when you sign up for the Advantage Awards Program!';	
}

// Column Two
$column_two_title = get_post_meta($post->ID, 'wpcf-landing-column-two-title', true);
if($column_two_title == '') {
	$column_two_title = 'FREE DAY';
}
$column_two_verbiage = get_post_meta($post->ID, 'wpcf-landing-column-two-verbiage', true);
if($column_two_verbiage == '') {
	$column_two_verbiage = 'Earn a free day during an upcoming rental period.';
}

// Column Three
$column_three_title = get_post_meta($post->ID, 'wpcf-landing-column-three-title', true);
if($column_three_title == '') {
	$column_three_title = 'FREE WEEKEND';
}
$column_three_verbiage = get_post_meta($post->ID, 'wpcf-landing-column-three-verbiage', true);
if($column_three_verbiage == '') {
	$column_three_verbiage = 'Earn a free weekend during an upcoming rental period.';
}

// Advantage Awards
$advantage_awards_verbiage = get_post_meta($post->ID, 'wpcf-landing-advantage-awards-verbiage', true);
$sign_up_now_button_text = get_post_meta($post->ID, 'wpcf-landing-sign-up-now-button-text', true);

$have_questions_about_enrollment_text = get_post_meta($post->ID, 'wpcf-landing-have-questions-about-enrollment-text', true);

// Partner Image
$advantage_partner_image = get_post_meta($post->ID, 'wpcf-landing-partner-img', true);
//$advantage_partner_image = parse_url($advantage_partner_image, PHP_URL_PATH);
if(is_array($advantage_partner_image) && count($advantage_partner_image) < 2) {
	$advantage_partner_image = $advantage_partner_image[0]['guid'];
} elseif (is_array($advantage_partner_image) && count($advantage_partner_image) > 2) {
	$advantage_partner_image = $advantage_partner_image['guid'];
} elseif ($advantage_partner_image == '') {
	$advantage_partner_image = $post_values['wpcf-landing-partner-img'][0];
}

// Logo Image
$advantage_logo_image = get_post_meta($post->ID, 'wpcf-landing-advantage-logo-img', true);
//$advantage_logo_image = parse_url($advantage_logo_image, PHP_URL_PATH);
if(is_array($advantage_logo_image) && count($advantage_logo_image) < 2) {
	$advantage_logo_image = $advantage_logo_image[0]['guid'];
} elseif (is_array($advantage_logo_image) && count($advantage_logo_image) > 2) {
	$advantage_logo_image = $advantage_logo_image['guid'];
} elseif ($advantage_logo_image == '') {
	$advantage_logo_image = $post_values['wpcf-landing-advantage-logo-img'][0];
}

// Person Image
$advantage_person_image = get_post_meta($post->ID, 'wpcf-landing-person-img', true);
//$advantage_person_image = parse_url($advantage_person_image, PHP_URL_PATH);
if(is_array($advantage_person_image) && count($advantage_person_image) < 2) {
	$advantage_person_image = $advantage_person_image[0]['guid'];
} elseif (is_array($advantage_person_image) && count($advantage_person_image) > 2) {
	$advantage_person_image = $advantage_person_image['guid'];
} elseif ($advantage_person_image == '') {
	$advantage_person_image = $post_values['wpcf-landing-person-img'][0];
}

// Car Image
$advantage_car_image = get_post_meta($post->ID, 'wpcf-landing-car-img', true);
//$advantage_car_image = parse_url($advantage_car_image, PHP_URL_PATH);
if(is_array($advantage_car_image) && count($advantage_car_image) < 2) {
	$advantage_car_image = $advantage_car_image[0]['guid'];
} elseif (is_array($advantage_car_image) && count($advantage_car_image) > 2) {
	$advantage_car_image = $advantage_car_image['guid'];
} elseif ($advantage_car_image == '') {
	$advantage_car_image = $post_values['wpcf-landing-car-img'][0];
}

$plus_button_before_color  = get_post_meta($post->ID, 'wpcf-landing-plus-button-before-color', true);
$plus_button_hover_color  = get_post_meta($post->ID, 'wpcf-landing-plus-button-hover-color', true);
$submit_button_before_color  = get_post_meta($post->ID, 'wpcf-landing-submit-button-before-color', true);
$submit_button_hover_color  = get_post_meta($post->ID, 'wpcf-landing-submit-button-hover-color', true);
$submit_button_text_color  = get_post_meta($post->ID, 'wpcf-landing-submit-button-text-color', true);
$for_business_leisure_travelers = get_post_meta($post->ID, 'wpcf-landing-for-business-leisure-travelers', true);
$plus_sign = get_post_meta($post->ID, 'wpcf-landing-plus-sign', true);
$equal_sign = get_post_meta($post->ID, 'wpcf-landing-equal-sign', true);
$check_mark1 = get_post_meta($post->ID, 'wpcf-landing-check-mark-1', true);
$check_mark2 = get_post_meta($post->ID, 'wpcf-landing-check-mark-2', true);
$check_mark3 = get_post_meta($post->ID, 'wpcf-landing-check-mark-3', true);
$client_name = get_post_meta($post->ID, 'wpcf-landing-client-name', true);
$client_name_text = get_post_meta($post->ID, 'wpcf-landing-client-name-text', true);
$sign_up_now_button = get_post_meta($post->ID, 'wpcf-landing-sign-up-now-button', true);
$sign_up_now_button_hover = get_post_meta($post->ID, 'wpcf-landing-sign-up-now-button-hover', true);
$sign_up_now_button_text_color = get_post_meta($post->ID, 'wpcf-landing-advantage-sign-up-now-button-text', true);
$email_us_text = get_post_meta($post->ID, 'wpcf-landing-email-us-text', true);
$awards_at_advantage_com_button_text = get_post_meta($post->ID, 'wpcf-landing-awards-at-advantage-com-button-text', true);
$advantage_dot_com_button = get_post_meta($post->ID, 'wpcf-landing-advantage-dot-com', true);
$advantage_dot_com_button_hover = get_post_meta($post->ID, 'wpcf-landing-advantage-dot-com-hover', true);
$advantage_dot_com_button_text_color = get_post_meta($post->ID, 'wpcf-landing-advantage-dot-com-hover', true);
$affiliate_airline = get_post_meta($post->ID, 'wpcf-landing-affiliate-airline', true);
$is_affiliate_airline = get_post_meta($post->ID, 'wpcf-landing-is-affiliate-airline', true);

if($sign_up_now_button !== '' || $sign_up_now_button_hover !== '') {
 if($advantage_awards_verbiage == '') {
	$advantage_awards_verbiage = 'Advantage Awards';
 }
 if($sign_up_now_button_text == '') {
	$sign_up_now_button_text = 'Sign Up Now!';
 }
}
if($advantage_dot_com_button !== '' || $advantage_dot_com_button_hover !== '') {
	if($awards_at_advantage_com_button_text == '') {
		$awards_at_advantage_com_button_text = 'awards@advantage.com';
	}
}

$landing_post_content = $post->post_content;
$landing_post_title = $post->post_title;

function my_styles_method($search_bg_color, $promo_code_text_color, $promo_code_text_color_two, $promo_code_arrow_color, $promo_code_arrow_color_two, $advantage_logo_image, $advantage_partner_image, $advantage_person_image, $advantage_car_image, $plus_button_before_color, $plus_button_hover_color, $submit_button_before_color, $submit_button_hover_color, $submit_button_text_color, $for_business_leisure_travelers, $plus_sign, $equal_sign, $check_mark1, $check_mark2, $check_mark3, $sign_up_now_button, $sign_up_now_button_hover, $sign_up_now_button_text_color, $advantage_dot_com_button, $advantage_dot_com_button_hover, $advantage_dot_com_button_text_color) {

	$custom_css = "
			/* Find A Car World Wide search background color */
			.aez-partners--promo-bg-color {
				/* Promo Mobile View Block BG Color */
				background-color: {$search_bg_color};
			}

			/* Promo Code One Text Color */
			.aez-partners-feature__content-promo .code span {
				color: {$promo_code_text_color};
			}

			/* Promo Code Two Text Color */
			.aez-partners-feature__content-promo-two .code span {
				color: {$promo_code_text_color_two};
			}

			/* Arrow One background color */
			.aez-partners--arrow-promo-bg-color {
				/* Promo Arrow Desktop View Block BG Color */
				background-color: {$promo_code_arrow_color} ;
			}

			/* Arrow One border color */
			.aez-partners-feature__content-promo .code.aez-partners--arrow-promo-bg-color:before {
				/* Promo Arrow Desktop View Block BG Color - Triangle Of Arrow */
				border-right-color: {$promo_code_arrow_color};
			}

			/* Arrow Two background color */
			.aez-partners--arrow-promo-bg-color-two {
				/* Promo Arrow Desktop View Block BG Color */
				background-color: {$promo_code_arrow_color_two} ;
			}

			/* Arrow Two border color */
			.aez-partners-feature__content-promo .code.aez-partners--arrow-promo-bg-color-two:before {
				/* Promo Arrow Desktop View Block BG Color - Triangle Of Arrow */
				border-right-color: {$promo_code_arrow_color_two};
			}

			/* Plus before button color */
			.aez-partners-feature__form .aez-form .aez-add-btn:before {
				/* Use Accent BG Color */
				background-color: {$plus_button_before_color};
				border-color: {$plus_button_before_color};
			}

			/* Plus hover button color */
			.aez-partners-feature__form .aez-form .aez-add-btn:hover:before,
			.aez-partners-feature__form .aez-form .aez-add-btn:focus:before {
				/*
				Accent BG Color darkened by 5%
				http://hslpicker.com/#005ca5
				*/
				background-color:{$plus_button_hover_color};
				border-color: {$plus_button_hover_color};
			}

			/* Submit button before color */
			.aez-partners-feature__form .aez-form #adv_rez_submit {
				/* Use Accent BG Color */
				background-color: {$submit_button_before_color};
				border-color: {$submit_button_before_color};
			}

			/* Submit button hover color */
			.aez-partners-feature__form .aez-form #adv_rez_submit:hover,
			.aez-partners-feature__form .aez-form #adv_rez_submit:focus {
				/*
					Accent BG Color darkened by 5%
					http://hslpicker.com/#005ca5
				*/
				background-color: {$submit_button_hover_color};
				border-color: {$submit_button_hover_color};
			}

			/* Submit button text color */
			.aez-btn--filled-green {
				color: {$submit_button_text_color} !important;
			}

			/* Business and Leisure verbiage */
			.aez-partners-business-leisure--primary-color {
				/* Primary Text Color */
				color: {$for_business_leisure_travelers};
			}

			/* Plus Sign */
			.aez-partners-plus-sign--primary-color {
				/* Primary Text Color */
				color: {$plus_sign};
			}

			/* Equal Sign */
			.aez-partners-equal-sign--primary-color {
				/* Primary Text Color */
				color: {$equal_sign};
			}

			/* Check Mark 1 */
			.aez-partners-check-marks1--primary-color {
				/* Primary Text Color */
				color: {$check_mark1};
			}

			/* Check Mark 2 */
			.aez-partners-check-marks2--primary-color {
				/* Primary Text Color */
				color: {$check_mark2};
			}

			/* Check Mark 3 */
			.aez-partners-check-marks3--primary-color {
				/* Primary Text Color */
				color: {$check_mark3};
			}

			/* Sign Up Now Button */
			.aez-partners-stacking__adv-awards-button.aez-partners-sign-up--primary-bg-color {
				/* Primary BG Color */
				background-color: {$sign_up_now_button};
				color: {$sign_up_now_button_text_color};
			}

			/* Sign Up Now Button Hover State */
			.aez-partners-stacking__adv-awards-button.aez-partners-sign-up--primary-bg-color:hover,
			.aez-partners-stacking__adv-awards-button.aez-partners-sign-up--primary-bg-color:focus {
				background-color: {$sign_up_now_button_hover};
				color: {$sign_up_now_button_text_color};
			}

			/* expressway@advantage.com Button */
			.aez-partners-awards--primary-bg-color {
				/* Primary BG Color */
				background-color: {$advantage_dot_com_button};
				color: {$advantage_dot_com_button_text_color};
			}

			/* expressway@advantage.com Button Hover State */
			.aez-partners-questions__content-button.aez-partners-awards--primary-bg-color:hover,
			.aez-partners-questions__content-button.aez-partners-awards--primary-bg-color:focus {
				background-color: {$advantage_dot_com_button_hover};
				color: {$advantage_dot_com_button_text_color};
			}

			/*Partner Logo/Image */
			.aez-partners-stacking__equation-circle--partner-logo {
				background-image: url('".$advantage_partner_image."');
			}

			/* Advantage Logo */
			.aez-partners-stacking__equation-circle--advantage-logo {
				background-image: url('".$advantage_logo_image."');
				background-size: 80%;
			}

			/* Person Image */
			.aez-partners-stacking__equation-circle--person {
				background-image: url('".$advantage_person_image."');
			}

			/* Car Image */
			.aez-partners-questions__header-car {
			  background-image: url('".$advantage_car_image."');
			}

			";

	wp_add_inline_style( 'landing-pages-css', $custom_css );

}

// Call the function and pass in the user defined colors
my_styles_method($search_bg_color, $promo_code_text_color, $promo_code_text_color_two, $promo_code_arrow_color, $promo_code_arrow_color_two, $advantage_logo_image, $advantage_partner_image, $advantage_person_image, $advantage_car_image, $plus_button_before_color, $plus_button_hover_color, $submit_button_before_color, $submit_button_hover_color, $submit_button_text_color, $for_business_leisure_travelers, $plus_sign, $equal_sign, $check_mark1, $check_mark2, $check_mark3, $sign_up_now_button, $sign_up_now_button_hover, $sign_up_now_button_text_color, $advantage_dot_com_button, $advantage_dot_com_button_hover, $advantage_dot_com_button_text_color);

add_action( 'wp_enqueue_scripts', 'my_styles_method' );


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
if ($display_second_promo_code != "yes") {
	$pre_populate_promo_code = $landing_promo_code;
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
				<img src="'.$landing_banner_image.'" class="aez-partners-feature__hero">
				<div class="aez-partners-feature__hero-gradient"></div>
				 <div class="aez-partners-feature__hero-content">
				<h2>'.$landing_post_title.'</h2>
			</div>
		</div>

		<div class="aez-partners-feature__container">
			<div class="aez-partners-feature__form aez-partners--promo-bg-color">
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
					<span class="close -blue">Close</span>';

					// If the Is Affiliate Airline checkbox is checked, then add the airline as a reference 
					// in the hidden field to be used on the reserve page 
					if ($is_affiliate_airline == "yes") {
						$find_a_car_html .='
						<input type="hidden" name="reference" value="'.$affiliate_airline.'">';
					}

				$find_a_car_html .='
				</form>

			</div>

			<div class="aez-partners-feature__content">';
				if ($landing_logo_image != "") {
					$find_a_car_html .=' <img class="aez-partners-feature__content-logo" src="'.$landing_logo_image.'" alt="Logo Image">';
				}

				$find_a_car_html .=' 
					<h3 class="aez-partners-feature__content-title">'.$landing_content_title.'</h3>
					<p class="aez-partners-feature__content-copy">'.$landing_post_content.'</p>';

			if ($landing_promo_code != "") {
				$find_a_car_html .=' 
					<a href="#" id="arrow1">
						<div class="aez-partners-feature__content-promo">
							<div class="code aez-partners--promo-bg-color aez-partners--arrow-promo-bg-color">
								<span id="promocode1">'.$landing_promo_code.'</span>
							</div>
							<p>'.$verbiage_promocode_1.'</p>
						</div>
					</a>';
			}

			// If the Second Promo Code checkbox is checked, then display the 2nd promo code 
			if ($display_second_promo_code == "yes" && $landing_promo_code_two != "") {

				$find_a_car_html .=' 
				<a href="#" id="arrow2">
					<div class="aez-partners-feature__content-promo">
						<div class="code aez-partners--promo-bg-color aez-partners--arrow-promo-bg-color-two">
							<span id="promocode2">'.$landing_promo_code_two.'</span>
						</div>
						<p>'.$verbiage_promocode_2.'</p>
					</div>
				</a>';

			}

			$find_a_car_html .='
			</div> 
			<div class="landing-disclaimer"></div>
		</div>

 		<div class="aez-partners-stacking aez-partners--stacking-rewards-bg-color">
                <div class="aez-partners-stacking__container">
                    <div class="aez-partners-stacking__header">
                        <h3 class="aez-partners-stacking__header-title">'.$verbiage_start_stacking_your_rewards.'</h3>
                        <h4 class="aez-partners-stacking__header-subtitle aez-partners-business-leisure--primary-color">'.$verbiage_business_and_leisure_travelers.'</h4>
                    </div>
                    <div class="aez-partners-stacking__equation">
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--partner-logo"></div>
                        <i class="fa fa-plus aez-partners-stacking__equation-symbol aez-partners-plus-sign--primary-color"></i>
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--advantage-logo"></div>
                        <span class="aez-partners-stacking__equation-symbol aez-partners-stacking__equation-symbol--equals aez-partners-equal-sign--primary-color">
                          <i class="fa fa-minus"></i>
                          <i class="fa fa-minus"></i>
                        </span>
                        <div class="aez-partners-stacking__equation-circle aez-partners-stacking__equation-circle--person"></div>
                    </div>
                    <p class="aez-partners-stacking__copy">'. $client_name .' '.$client_name_text.'</p>
                    <ul class="aez-partners-stacking__bullets">
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners-check-marks1--primary-color"></i>
                            <div class="aez-partners-stacking__bullet-content">
                                <p class="aez-partners-stacking__bullet-content-title">'.$column_one_title.'</p>
                                <p class="aez-partners-stacking__bullet-content-copy">'.$column_one_verbiage.'</p>
                            </div>
                        </li>
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners-check-marks2--primary-color"></i>
                            <div class="aez-partners-stacking__bullet-content">
                                <p class="aez-partners-stacking__bullet-content-title">'.$column_two_title.'</p>
                                <p class="aez-partners-stacking__bullet-content-copy">'.$column_two_verbiage.'</p>
                            </div>
                        </li>
                        <li class="aez-partners-stacking__bullet">
                            <i class="fa fa-check aez-partners-stacking__bullet-icon aez-partners-check-marks3--primary-color"></i>
                            <div class="aez-partners-stacking__bullet-content">
                                <p class="aez-partners-stacking__bullet-content-title">'.$column_three_title.'</p>
                                <p class="aez-partners-stacking__bullet-content-copy">'.$column_three_verbiage.'</p>
                            </div>
                        </li>
                    </ul>
                    <div class="aez-partners-stacking__adv-awards">
                        <h4 class="aez-partners-stacking__adv-awards-title">'.$advantage_awards_verbiage.'</h4>
                        <a href="sign-up" class="aez-partners-stacking__adv-awards-button aez-partners-sign-up--primary-bg-color">'.$sign_up_now_button_text.'</a>
                    </div>
                </div>
            </div>
            <div class="aez-partners-questions">
                <div class="aez-partners-questions__header">
                    <div class="aez-partners-questions__header-car"></div>
                    <h3 class="aez-partners-questions__header-title">'.$have_questions_about_enrollment_text.'</h3>
                </div>
                <div class="aez-partners-questions__content">
                    <p class="aez-partners-questions__content-copy">'.$email_us_text.'</p>
                    <a href="mailto:expressway@advantage.com" class="aez-partners-questions__content-button aez-partners-awards--primary-bg-color">'.$awards_at_advantage_com_button_text.'</a>
                </div>
            </div>
          <div class="landing-disclaimer">'.$landing_disclaimer.'</div>
	</div>
	';
	echo $find_a_car_html;
	?>
	
</article><!-- #post-## -->

