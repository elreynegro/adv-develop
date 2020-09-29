<?php
/*
 * Template Name: Advantage awards
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

<form action="" method="POST" class="aez-edit-profile-form">
	<div class="aez-advantage-awards-header">
		<h3 class="aez-advantage-awards-header__title">Edit Profile</h3>
	</div>
	<div class="aez-form-block">
		<h4 class="aez-advantage-awards-header__subtitle">Contact Information:</h4>
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
            <label for="phone" class="aez-form-item__label">Phone Number<sup>*</sup></label>
            <input
                id="phone"
                type="number"
                class="aez-form-item__input"
                name="email"
                placeholder="Phone Number"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="email" class="aez-form-item__label">Email<sup>*</sup></label>
            <input
                id="email"
                type="tel"
                class="aez-form-item__input"
                name="email"
                placeholder="Email"
                required
            />
        </div>

        <h4 class="aez-advantage-awards-header__subtitle">Home or Business:</h4>
        <div class="aez-form-item">
            <label for="address" class="aez-form-item__label">Street Address<sup>*</sup></label>
            <input
                id="address"
                type="text"
                class="aez-form-item__input"
                name="address"
                placeholder="Street Address"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="addressTwo" class="aez-form-item__label">Street Address 2<sup>*</sup></label>
            <input
                id="addressTwo"
                type="text"
                class="aez-form-item__input"
                name="addressTwo"
                placeholder="Street Address 2"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="zipCode" class="aez-form-item__label">Postal Code<sup>*</sup></label>
            <input
                id="zipCode"
                type="text"
                class="aez-form-item__input"
                name="zipCode"
                placeholder="Postal Code"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="city" class="aez-form-item__label">City<sup>*</sup></label>
            <input
                id="city"
                type="text"
                class="aez-form-item__input"
                name="city"
                placeholder="City"
                required
            />
        </div>
        <div class="aez-form-item aez-form-item--dropdown">
            <label for="state" class="aez-form-item__label">State</label>
            <select
                id="state"
                class="aez-form-item__dropdown"
                name="state"
            >
                <option>Select</option>
                <option value="">Florida</option>
            </select>
        </div>
        <div class="aez-form-item aez-form-item--dropdown">
            <label for="country" class="aez-form-item__label">Country</label>
            <select
                id="country"
                class="aez-form-item__dropdown"
                name="country"
            >
                <option>Select</option>
                <option value="">Florida</option>
            </select>
        </div>
        
        <div class="aez-terms-submit-block">
	        <button type="submit" class="aez-btn aez-btn--filled-green">Update Your Profile</button>
	    </div>
    </div>

    <div class="aez-advantage-awards-header">
		<h3 class="aez-advantage-awards-header__title">Change Your Password</h3>
	</div>
	<div class="aez-form-block">
        <div class="aez-form-item">
            <label for="current_password" class="aez-form-item__label">Current Password<sup>*</sup></label>
            <input
                id="current_password"
                type="text"
                class="aez-form-item__input"
                name="current_password"
                placeholder="Current Password"
                required
            />
        </div>
        <div class="aez-form-item">
            <label for="new_password" class="aez-form-item__label">New Password<sup>*</sup></label>
            <input
                id="new_password"
                type="text"
                class="aez-form-item__input"
                name="new_password"
                placeholder="New Password"
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

        <div class="aez-terms-submit-block">
	        <button type="submit" class="aez-btn aez-btn--filled-green">Update Your Password</button>
	    </div>
    </div>
</form>

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
<?php include_once('includes/steps.php'); ?>
<?php get_footer(); ?>