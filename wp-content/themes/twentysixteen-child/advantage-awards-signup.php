<?php
/*
 * Template Name: Advantage Awards Signup
 */
get_header();
?>

<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<div class="aez-advantage-awards-banner">
	<div class="aez-awards-img">
		<img src="/wp-content/themes/twentysixteen-child/assets/expway2.png" alt="Advantage Expressway logo">
	</div>
</div>

<div class="aez-sign-up-form">
	<form action="" class="aez-form">
	    <span class="-blue aez-all-caps">Sign Up For</span>
		<h3 class="aez-find-a-car__heading">Advantage Expressway</h3>
		<div class="aez-form-block">
	        <h4 class="-dark-blue">My Profile</h4>
	        <div class="aez-form-item">
	            <label for="first_name" class="aez-form-item__label">First Name<sup>*</sup></label>
	            <input
	                id="first_name"
	                type="text"
	                class="aez-form-item__input"
	                name="first_name"
	                placeholder="First Name"
	                required
	            />
	        </div>
	        <div class="aez-form-item">
	            <label for="last_name" class="aez-form-item__label">Last Name<sup>*</sup></label>
	            <input
	                id="last_name"
	                type="text"
	                class="aez-form-item__input"
	                name="last_name"
	                placeholder="Last Name"
	                required
	            />
	        </div>
	        <div class="aez-form-item">
	            <label for="email" class="aez-form-item__label">Email<sup>*</sup></label>
	            <input
	                id="email"
	                type="email"
	                class="aez-form-item__input"
	                name="email"
	                placeholder="Email"
	                required
	            />
	        </div>
	        <div class="aez-form-item">
	            <label for="confirm_email" class="aez-form-item__label">Confirm Email<sup>*</sup></label>
	            <input
	                id="confirm_email"
	                type="email"
	                class="aez-form-item__input"
	                name="confirm_email"
	                placeholder="Confirm Email"
	                required
	            />
	        </div>
	        <div class="aez-form-item">
	            <label for="phone_number" class="aez-form-item__label">Phone Number<sup>*</sup></label>
	            <input
	                id="phone_number"
	                type="tel"
	                class="aez-form-item__input"
	                name="phone_number"
	                placeholder="Phone Number"
	                required
	            />
	        </div>
	        <div class="aez-form-item">
	            <label for="confirm_phone_number" class="aez-form-item__label">Confirm Phone Number<sup>*</sup></label>
	            <input
	                id="confirm_phone_number"
	                type="tel"
	                class="aez-form-item__input"
	                name="confirm_phone_number"
	                placeholder="Confirm Phone Number"
	                required
	            />
	        </div>
		</div>
		<div class="aez-form-block -checkbox">
	        <div class="aez-form-item--checkbox-cont">
	            <input
	                id="read_location_policy"
	                type="checkbox"
	                class="aez-form-item__checkbox"
	                name="read_location_policy"
	            />
	            <label for="read_location_policy" class="aez-form-item__label">I agree with the <a href="/terms-and-conditions-advantage-awards/" class="-green">Terms and Conditions</a> of the Advantage Expressway Program *</label>
	        </div>
			<button type="submit" class="aez-btn aez-btn--filled-green">Submit</button>
		</div>
	</form>
</div>

<!-- Advantage Awards -->
<div class="aez-checklist-image -awards">
    <div class="aez-check-image">
        <img src="/wp-content/themes/twentysixteen-child/assets/person_with_beach_ball.png" alt="Illustration of a person with a beach ball." />
        <div class="aez-sub-info">
            <h3 class="-dark-blue">Advantage Expressway</h3>
            <h4 class="-green">For Business &amp; Leisure Travelers</h4>
        </div>

        <!-- Checklist -->
        <div class="aez-checklist">
            <div class="aez-check-block">
                <i class="fa fa-check"></i>
                <div>
                    <h3>Free Upgrade</h3>
                    <p>Receive a free class upgrade instantly when you sign up for the Advantage Expressway Program!</p>
                </div>
            </div>
            <div class="aez-check-block">
                <i class="fa fa-check"></i>
                <div>
                    <h3>Free Weekend</h3>
                    <p>Earn a free weekend during an upcoming rental period</p>
                </div>
            </div>
        </div> <!-- End Checklist -->

        <div>
            <span class="-dark-blue">Advantage Expressway</span>
            <a class="aez-btn aez-btn--outline-blue" href="https://rewards.advantage.com">Learn More</a>
        </div>
    </div>
</div> <!-- End Advantage Expressway -->

<div class="aez-learn">
    <div>
        <h2 class="-dark-blue">Not The Right Program For You?</h2>
        <p class="-green">Advantage has multiple loyalty programs to choose from:</p>
    </div>

    <div class="aez-learn-block">
        <img src="/wp-content/themes/twentysixteen-child/assets/person_with_beach_ball.png" alt="Illustration of a person with a beach ball." />
        <h2 class="-dark-blue">Corporate Advantage</h2>
        <h3 class="-green">
            For Business &amp; Leisure Travelers
        </h3>
        <a href="#" class="aez-btn aez-btn--outline-blue">Learn More</a>
    </div>

    <div class="aez-learn-block">
        <img src="/wp-content/themes/twentysixteen-child/assets/arrow.png" alt="Illustration of an arrow" />
        <h2 class="-dark-blue">Book Friendly</h2>
        <h3 class="-green">
            For Travel Agents &amp; Tour Operations
        </h3>
        <a href="#" class="aez-btn aez-btn--outline-blue">Learn More</a>
    </div>

    <?php include_once('includes/questions.php'); ?>
</div>

<script type="text/javascript">
(function(d) { 
    if (document.addEventListener) 
    document.addEventListener('ltkAsyncListener', d); 
    else {
        e = document.documentElement; 
        e.ltkAsyncProperty = 0; 
        e.attachEvent('onpropertychange', function (e) { 
            if (e.propertyName == 'ltkAsyncProperty')
            {
                d();
            }
        });
    }
})(function() { 
    /********** Begin Custom Code **********/ 

    _ltk.SCA.CaptureEmail('email');
    /********** End Custom Code **********/ 
});

</script>

<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>