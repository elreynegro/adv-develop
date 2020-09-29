<?php
/*
 * Template Name: Loyalty Program
 */

get_header(); ?>

<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/man_pledging.jpg);
">
	<div class="aez-gradient">
		<h1>Loyalty Programs</h1>
	</div>
</div>
<div class="aez-loyalty">
    <div class="aez-body">
        <h2 class="-dark-blue">Increase Your ROL - Return On Loyalty</h2>
        <p>Welcome to Advantage's loyalty programs. We offer programs for all types of travelers. Choose the program below that's right for you and start saving today!</p>
    </div>

    <!-- Corporate Advantage -->
    <div class="aez-checklist-image -corporate">
        <div class="aez-check-image">
            <img src="/wp-content/themes/twentysixteen-child/assets/corporate_people.png" alt="Illustration of a group of business people." />
            <div class="aez-sub-info">
                <h3 class="-white">Corporate Advantage</h3>
                <h4 class="-green">For Corporations</h4>
            </div>

            <!-- Checklist -->
            <div class="aez-checklist">
                <div class="aez-check-block">
                    <img src="/wp-content/uploads/2016/11/arrow_with_shadow.png">
                    <div>
                        <h3>Discounts On Every Rental Anywhere &amp; Anytime</h3>
                        <p>We know our business clients have a busy schedule, so no matter where they travel to, or when they travel, the discount works 24/7.</p>
                    </div>
                </div>
                <div class="aez-check-block">
                    <img src="/wp-content/uploads/2016/11/arrow_with_shadow.png">
                    <div>
                        <h3>No Blackout Dates</h3>
                        <p>Discounts apply every day of the year and in every domestic market.</p>
                    </div>
                </div>
            </div> <!-- End Checklist -->

            <div>
                <span class="-white">Corporate Advantage</span>
                <a class="aez-btn aez-btn--filled-green signup_menu" href="javascript:void(0);">Sign Up Now!</a>
            </div>
        </div>
    </div> <!-- End Corporate Advantage -->

    <!-- Advantage Awards -->
    <div class="aez-checklist-image -awards">
        <div class="aez-check-image">
            <img src="/wp-content/themes/twentysixteen-child/assets/person_with_beach_ball.png" alt="Illustration of a person with a beach ball." />
            <div class="aez-sub-info">
                <h3 class="-dark-blue">Advantage Awards</h3>
                <h4 class="-green">For Business &amp; Leisure Travelers</h4>
            </div>

            <!-- Checklist -->
            <div class="aez-checklist">
                <div class="aez-check-block">
                    <img src="/wp-content/uploads/2016/11/arrow_with_shadow.png">
                    <div>
                        <h3>Free Upgrade</h3>
                        <p>Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!</p>
                    </div>
                </div>
                <div class="aez-check-block">
                    <img src="/wp-content/uploads/2016/11/arrow_with_shadow.png">
                    <div>
                        <h3>Free Weekend</h3>
                        <p>Earn a free weekend during an upcoming rental period</p>
                    </div>
                </div>
            </div> <!-- End Checklist -->

            <div>
                <span class="-dark-blue">Advantage Expressway</span>
                <a class="aez-btn aez-btn--outline-blue signup_menu" href="javascript:void(0);">Sign Up Now!</a>
            </div>
        </div>
    </div> <!-- End Advantage Awards -->

    <!-- Book Friendly -->
    <div class="aez-checklist-image -booking">
        <div class="aez-check-image">
            <img src="/wp-content/themes/twentysixteen-child/assets/arrow.png" alt="Illustration of an arrow" />
            <div class="aez-sub-info">
                <h3 class="-dark-blue">Book Friendly</h3>
                <h4 class="-green">For Travel Agents &amp; Tour Operators</h4>
            </div>

            <!-- Checklist -->
            <div class="aez-checklist">
                <div class="aez-check-block">
                    <img src="/wp-content/uploads/2016/11/arrow_with_shadow.png">
                    <div>
                        <h3>Free Day &amp; Double Commission</h3>
                        <p>Enroll now and get a FREE Day and Double Commission: 5% base plus 5% bonus. Enroll your customers in the Instant Awards Program, and when you book their rental you can earn a FREE DAY!</p>
                    </div>
                </div>
                <div class="aez-check-block">
                    <img src="/wp-content/uploads/2016/11/arrow_with_shadow.png">
                    <div>
                        <h3>Discounts On Rentals</h3>
                        <p>Enroll a Small Business Client in Advantage for Business, and when you book their rental you earn a FREE day!</p>
                    </div>
                </div>
                <div class="aez-check-block">
                    <img src="/wp-content/uploads/2016/11/arrow_with_shadow.png">
                    <div>
                        <h3>Earn More Free Days</h3>
                        <p>Enroll your customers in Instant Awards, and when you book their rental you can earn a FREE day!</p>
                    </div>
                </div>
            </div> <!-- End Checklist -->

            <div>
                <span class="-dark-blue">Travel Agent Awards</span>
                <a class="aez-btn aez-btn--outline-blue signup_menu" href="javascript:void(0);">Sign Up Now!</a>
            </div>
        </div>
    </div> <!-- End Booking Friendly -->
    <?php include_once('includes/questions.php'); ?>
</div>

<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>
