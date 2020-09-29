<?php
/*
 * Template Name: Cancel Reservation
 */

get_header(); ?>

<div class="aez-find-a-car-dropdown is-open">
    <h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
    <div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<!-- <div id="primary" class="find_rez_form_container">
    <form id="find_rez_form" method="POST" class="rez_task aez-edit-profile-form" action="/comfirm">
        <div class="aez-advantage-awards-header">
            <h3 class="aez-advantage-awards-header__title">View a Reservation</h3>
        </div>
        <div class="aez-form-block">
            <h4 class="aez-advantage-awards-header__subtitle">Location:</h4>
            <div class="aez-form-item">
                <select id="locations-dropdown-my-reservations" class="aez-select2-search aez-form-item__dropdown" name="my_rental_location_id">
                    <option value=""></option>
                </select>
            </div>
        </div>
        <div class="aez-form-block">
            <h4 class="aez-advantage-awards-header__subtitle">Last Name:</h4>
            <div class="aez-form-item"> -->
                <!-- <label for="last_name" class="aez-form-item__label">Last Name<sup>*</sup></label> -->
              <!--   <input
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
            <div class="aez-form-item"> -->
                <!-- <label for="confirmation_number" class="aez-form-item__label">Confirmation Number<sup>*</sup></label> -->
               <!--  <input
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
                Call us at 800-777-5500 for assistance.
            </h4>
        </div>
        <div class="aez-form-block">
            <button id="adv_rez_submit" type="submit" class="aez-btn aez-btn--filled-green">Search</button>
        </div>
    </form>
</div> -->

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
            <p>Advantage Expressway</p>

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
</div>

<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>