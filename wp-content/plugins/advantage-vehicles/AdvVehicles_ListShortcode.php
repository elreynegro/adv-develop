<?php
    include_once('AdvVehicles_Helper.php');
    include_once('AdvVehicles_ShortCodeScriptLoader.php');

 
class AdvVehicles_ListShortcode extends AdvVehicles_ShortCodeScriptLoader {

    public $vehicle_list_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
        
        wp_register_style( 'remove-margin', get_stylesheet_directory_uri() . '/css/remove-margin.css');
        wp_register_style( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/css/select2.min.css' );
        wp_register_style( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/css/pikaday.css' );

        $styles = array('remove-margin', 'select2', 'pikaday');
        wp_enqueue_style($styles);

        // Register Scripts to be loaded
        wp_register_script( 'select2', get_stylesheet_directory_uri() . '/vendor/select2-4.0.3/dist/js/select2.min.js', array('jquery'), null, true );
        wp_register_script( 'moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true );
        wp_register_script( 'pikaday', get_stylesheet_directory_uri() . '/vendor/Pikaday-1.4.0/pikaday.js', array('moment'), null, true );
        wp_register_script( 'validator', get_stylesheet_directory_uri() . '/vendor/validator.js-6.1.0/validator.min.js', array(), null, true );
        wp_register_script( 'mask', get_stylesheet_directory_uri() . '/vendor/jQuery-Mask-Plugin-1.14.0/dist/jquery.mask.min.js', array(), null, true );
        wp_register_script( 'promo-code-add-remove', get_stylesheet_directory_uri() . '/js/promo-code-add-remove.js', array('jquery'), null, true );
        wp_register_script( 'vehicles', plugins_url('advantage-vehicles/js/adv_vehicles_list.js'), array('jquery'), null, true );
        wp_register_script( 'find-a-car-form', get_stylesheet_directory_uri() . '/js/find-a-car-worldwide-form.js', array('jquery'), null, true );
        wp_register_script( 'vehicles-locations', plugins_url('advantage-locations/js/adv_locations_anchor.js'), array('jquery'),  null, true );

        $scripts = array('jquery', 'select2', 'moment', 'pikaday', 'mask', 'vehicles', 'find-a-car-form', 'vehicles-locations');
        wp_enqueue_script($scripts);

        }
    }


    public function handleShortcode($atts) {
// print_r($_POST['RentalLocation']);
        if (isset($_POST['RentalLocation'])) {
            $rental_location_id = $_POST['RentalLocation'];
            $rental_location_name = $_POST['RentalLocation'];
        } else {
            // Default Location
           // $('RentalLocation').value() = 'MCO';
            $rental_location_id = 'MCO';
            //pre populate registered user information
            if(isset($_SESSION['adv_login'])) {
                $profile_data = Adv_login_Helper::getAdvFullUser();
                if($profile_data['PreferredRentalLocationCode'] != '') {
                    $rental_location_id = $profile_data['PreferredRentalLocationCode'];
                }
            }             
        }

        $location_array = AdvLocations_Helper::getLocation($rental_location_id);

        $location_value1 = $location_array['LocationName']." (".$location_array['City'].", ".$location_array['State']." ".$location_array['CountryName'].") - ".$location_array['LocationCode'];

        if(isset($location_array['LocationName'])) {
            $location_value1 = $location_value1; }
        else{
            $rental_location_id = 'MCO';
            $location_value1 = 'Orlando International Airport (Orlando, FL United States) - MCO'; }

        $this->vehicle_list_html = '<div class="aez-container aez-find-by-location">
                                     <br><p>Enter a location to view a list of vehicles for rent.</p>
                                     <input 
                                            type="search"
                                            id="list-vehicles-dropdown"
                                            name="list-vehicles-dropdown"
                                            pattern=".{15,}" 
                                            class="aez-select2-search aez-form-item__dropdown"
                                            placeholder="Enter a city or country to find a location"
                                            style= "font-size: .9em; border-radius: 5px;" 
                                            spellcheck="false"
                                            value= "'. $location_value1 .'"
                                            required >
                                    <label for="rental_id" class="aez-form-item__label--hidden"></label>
                                    <input id="rental_id" 
                                    name="rental_id" 
                                    style="display: none;"
                                    value= "'. $rental_location_id .'"
                                    class="aez-select2-search aez-form-item__dropdown"></div>
                                    ';

        if ($location_array['Country'] == 'US') {

            $vehicle_data = AdvVehicles_Helper::getVehicles($rental_location_id);
        } else {
            $vehicle_data = AdvVehicles_Helper::getIntlVehicles($rental_location_id);

        }

        $this->location_drop_down_html = '<select id="location-policy-dropdown" class="aez-select2-search aez-form-item__dropdown">
                                            <option value=""></option>
                                          </select>
                                          <div id="policies"></div>';
        if (!empty($vehicle_data)) {
                $this->vehicle_list_html .= '<div class="aez-title-subtitle-container">
                                                <h1>Economy to Luxury Cars</h1>
                                                <p>From practical to practically amazing. Advantage has a car that fits your style.</p>
                                            </div>

                                            <div class="aez-choice-grid-container">';

                foreach ($vehicle_data['RateProduct'] as $car_key => $car_value) {
                   
                    //generate vehicle details page link for respective car class
                    $car_class_link = '';
                    if( array_key_exists($car_value['ClassCode'],$_SESSION['get_vehicle_details_car_code'])) {
                        $car_class_link = site_url($_SESSION['get_vehicle_details_car_code'][$car_value['ClassCode']]);
                    } 
                    
                    //enable link only which vehicle class is available in the home page fleets section
                    $link_enabled = $link_closed = '';

                    if(!empty($car_class_link)){
                        $link_enabled = '<a href="'.$car_class_link.'">';
                        $link_closed = '</a>';
                    }
                    //  $car_value = json_decode($car_value, true);
                    $this->vehicle_list_html .= '<div class="aez-car-choice-cell vehicle-title-link">
                                                     <h2>'.$link_enabled . $car_value['ClassDesc'] . $link_closed.' <span class="vehicle_class_code">'.'(' . $car_value['ClassCode'] . ')</span>'.'</h2>';
                    
                    

                    //enable link only which vehicle class is available in the home page fleets section
                    if(!empty($car_class_link)){
                        $this->vehicle_list_html .='<a href="'.$car_class_link.'">';
                    }
                    
                    
                    $this->vehicle_list_html .='<div class="aez-white-container">
                                                        <div class="aez-info-and-title">
                                                            <!-- <a href="#">
                                                                <i class="fa fa-info-circle" aria-hidden="true"></i>
                                                            </a> -->
                                                            <div class="aez-title-similar">
                                                                <h2>' . $car_value['ModelDesc'] . '</h2>
                                                                 <p>Or Similar</p>
                                                            </div>
                                                        </div>
                                                        <div class="aez-car-cell-img">
                                                            <img src="' . $car_value['ClassImageURL'] . '" alt="car image">
                                                        </div>';
                    if(!empty($car_class_link)){
                        $this->vehicle_list_html .='</a>';
                    }
                    
                    // Determine if the car is Automatic, Manual, or NA
                    $third =  AdvRez_Helper::third_letter(substr($car_value['ClassCode'], 2, 1));

                    $this->vehicle_list_html .= '<div class="aez-mini-details">
                                                    <span>
                                                        <i class="fa fa-road" aria-hidden="true"></i>
                                                        <p>'.$third.'</p>
                                                    </span>';

                    if ((isset($car_value['MPGCity'])) && (isset($car_value['MPGHighway']))) {
                        $this->vehicle_list_html .= '<span>
                                                        <i class="fa fa-tachometer" aria-hidden="true"></i>
                                                        <p>' . $car_value['MPGCity'] . '/' . $car_value['MPGHighway'] . ' mpg</p>
                                                     </span>';
                    }
                    if (isset($car_value['Luggage'])) {
                        $this->vehicle_list_html .= '<span>
                                                        <i class="fa fa-suitcase" aria-hidden="true"></i>
                                                        <p>' . $car_value['Luggage'] . '</p>
                                                     </span>';
                    }
                    if (isset($car_value['Passengers'])) {
                        $this->vehicle_list_html .= '<span>
                                                        <i class="fa fa-users" aria-hidden="true"></i>
                                                        <p>' . $car_value['Passengers'] . '</p>
                                                     </span>';
                    }
                    // Get the location name and code, creating a comma delimited string. Example: ORLANDO INTERNATIONAL AIRPORT,MCO
                    $location_value = $location_array['LocationName']." (".$location_array['City'].", ".$location_array['State']." ".$location_array['CountryName'].") - ".$location_array['LocationCode'];
                    
                    if(isset($location_array['LocationName'])) {
                        $location_value = $location_value; }
                    else{
                        $location_value = 'Orlando International Airport (Orlando, FL United States) - MCO'; }

                    $this->vehicle_list_html .= '</div>
                                                </div>
                                                <a nohref id="check_availability_id" data-vechicle_car_class="'.$car_value['ClassCode'].'" class="aez-reserve-btn aez-btn aez-btn--outline-blue find-a-car-menu-item check_availability_class" value="'.$location_value.'" onclick="goToAnchorReserve(this);">Reserve Now</a>
                                         </div>';
                }



            $this->vehicle_list_html .= '</div></div>';

        }


//other styling of the awards promotions block had issues in IE, hence changed the appearence of only this block.

$this->vehicle_list_html .= '<div id="promo_locations" class="aez-awards-promo aez-travelers-promo" style="background-color: rgba(0,0,0,0.7)!important; background-position: center !important;">
    <div class="aez-dark-background">
    <h2>Like Our Rides?</h2>
    <h3>Travelers of All Types Can Save With Advantage</h3>

        <div class="aez-promo-blocks">
            <div class="aez-promo">
                <img src="/wp-content/themes/twentysixteen-child/assets/group-icon.png" alt="group icon">
                <div>
                    <span style="color: #8ED8F8;"">Corporate Advantage</span>
                     <p class="aez-uppercase" style= "color: white;">For Corporations</p>
                    <p style= "color: white;">
                         We know our business clients have a busy schedule, so no matter where or when they travel, the discount works 24/7.
                    </p>
                </div>
            </div>

             <div class="aez-promo">
             <img src="/wp-content/themes/twentysixteen-child/assets/single-icon.png" alt="single person icon">
                        <div>
                            <span style="color: #8ED8F8;">Expressway Program</span>
                            <p class="aez-uppercase" style= "color: white;">For Business Travelers</p>
                            <p style= "color: white;">
                                Make your business travel work for you! Every time you rent, you receive an additional reward and are one step closer to the next tier!
                            </p>
                        </div>
            </div>
            <div class="aez-promo">
            <img src="/wp-content/themes/twentysixteen-child/assets/umbrella-icon.png" alt="umbrella">
                    <div style="margin-top: 5.2%;">
                        <span style="color: #8ED8F8;">Expressway Program</span>
                        <p class="aez-uppercase" style= "color: white;">For leisure travelers</p>
                        <p style= "color: white;">
                            Receive a free class upgrade or a free day instantly upon signing up for the Expressway Loyalty Program!
                        </p>
                    </div>
            </div>
        </div>

        <div class="aez-member-login">
        <span style= "color: white;">Expressway Program</span>
        <a href="/login" type="button" class="aez-btn aez-btn--filled-green">Log In To Your Account</a>
        <span style= "color: white;">Not An Expressway Member?</span>
        <a href="javascript:void(0);" type="button" class="aez-btn aez-btn--outline-green signup_menu">Start Earning Now!</a>
        </div>
    </div>
</div>';

        return $this->vehicle_list_html;


    }

}