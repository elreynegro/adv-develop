<?php
 AdvLocations_Helper::getAllLocations();
    include_once('AdvRez_ShortCodeScriptLoader.php');
class AdvRez_MyReservationsShortcode extends AdvRez_ShortCodeScriptLoader {

    public $my_rez_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;

            // needs select2, pikaday, moment
            wp_enqueue_script('adv-my-reservations', plugins_url('js/adv_my-reservations.js', __FILE__), array('jquery', 'main'), '1.0', true);
            wp_enqueue_script('awards-block',get_stylesheet_directory_uri() . '/js/awards-block.js', array('jquery', 'main'), '1.0', true );
            // wp_enqueue_script('promo-code-add-remove', get_stylesheet_directory_uri() . '/js/promo-code-add-remove.js', array('jquery', 'main'), '1.0', true);
 
            // wp_localize_script( 'adv_modal_form', 'ADV_Rez_Ajax', array(
            //     'ajaxurl'   => admin_url( 'admin-ajax.php' ),
            //     'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
            //     )
            // );
        }
    }

    public function handleShortcode($atts) {
        // $location_array = AdvLocations_Helper::getAllLocations();

        // Unset the my_reservation session so the data will be removed and not kept when going to the view-reservation page,
        // which will then recreate the my_reservation session
        if (isset($_SESSION['my_reservation'])) {
            unset($_SESSION['my_reservation']);
        }

        $this->my_rez_html = '
        <div id="primary" class="find_rez_form_container">
            <form id="find_rez_form" method="POST" class="rez_task aez-edit-profile-form" action="/view-reservation">
                <div class="aez-advantage-awards-header">
                    <h3 class="aez-advantage-awards-header__title">View a Reservation</h3>
                </div>
               <div class="aez-form-block">
                    <h4 class="aez-advantage-awards-header__subtitle">Location:</h4>
                    <div class="aez-form-item">
                        <input 
                                type="search"
                                id="locations-dropdown-my-reservations"
                                name="my_rental_location_id"
                                pattern=".{15,}" 
                                class="aez-select2-search aez-form-item__dropdown"
                                placeholder="Enter a city or country to find a location"
                                style= "font-size: .9em; border-radius: 5px;" 
                                spellcheck="false"
                                required >
                        <label for="rental_id" class="aez-form-item__label--hidden"></label>
                        <input id="rental_id" 
                        name="rental_id" 
                        style="display: none;"
                        class="aez-select2-search aez-form-item__dropdown">
                    </div>
                </div>
                <div class="aez-form-block">
                    <h4 class="aez-advantage-awards-header__subtitle">Last Name:</h4>
                    <div class="aez-form-item">
                        <!-- <label for="last_name" class="aez-form-item__label">Last Name<sup>*</sup></label> -->
                        <input
                            id="renter_last"
                            type="text"
                            class="aez-form-item__input"
                            name="renter_last"
                            placeholder="Last Name"
                            required
                        />
                    </div>
                </div>
                <div class="aez-form-block">
                    <h4 class="aez-advantage-awards-header__subtitle">Confirmation Number:</h4>
                    <div class="aez-form-item">
                        <!-- <label for="confirmation_number" class="aez-form-item__label">Confirmation Number<sup>*</sup></label> -->
                        <input
                            id="confirm_num"
                            type="text"
                            class="aez-form-item__input"
                            name="confirm_num"
                            placeholder="Confirmation Number"
                            required
                        />
                    </div>
                </div>

                <div class="aez-form-block">
                    <div>
                        <h4 class="aez-advantage-awards-header__title"></h4>
                    </div>
                </div>
                <div class="aez-advantage-awards-header">
                    <h4 class="aez-advantage-awards-header__title">
                        Forgot your confirmation number?<br>
                         Call us at <a href="tel:+18007775500" class="-blue"> 800-777-5500  </a> for assistance.
                    </h4>
                </div>
                <div class="aez-form-block">
                    <button id="adv_rez_submit" type="submit" class="aez-btn aez-btn--filled-green">Search</button>
                </div>
            </form>
        </div>

        <!-- Test -->
        <div id="view_reservation_content" class="find_rez_form_container rez_display_container">
            <div class="aez-advantage-awards-header">
                <h3 class="aez-advantage-awards-header__title">View a Reservation</h3>
            </div>  
        </div>

        <div class="aez-images">
            <div class="aez-image-block -first">
                <div class="-blue">
                    <a href="javascript:void(0);" class="signup_menu">
                        <img src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway Logo" />
                    </a>
                    <span>Increase Your ROL</span>
                    <p>Expressway Program</p>

                </div>
            </div>

            <div class="aez-image-block -second">
                <div class="-blue">
                    <a href="/corporate-advantage/">
                        <img src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway Logo" />
                    </a>
                    <span>Increase Your ROL</span>
                    <p>Corporate Advantage</p>
                </div>
            </div>
        </div>';
        return $this->my_rez_html;

    }
}
