<?php

    include_once('AdvContactUs_ShortCodeScriptLoader.php');
 
    class AdvContactUs_CommunicationFormShortcode extends AdvContactUs_ShortCodeScriptLoader {

    public $communication_form_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_script('contact_us', plugins_url('js/adv_contact_us.js', __FILE__), array('jquery'), '1.0', true);
         }
    }

    public function handleShortcode($atts) {

?>

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

	_ltk.SCA.CaptureEmail('your-email');
	/********** End Custom Code **********/ 
});

</script>

<?php
        
        $this->communication_form_html = '

	<div class="aez-sign-up-form">
	
		<div class="aez-form-item">
			<label for="first-name" class="aez-form-item__label">First Name *</label>
			<input id="first-name" type="text" pattern="[A-Za-z\\s]*" class="aez-form-item__input" name="first-name" placeholder="First Name" required />
		</div>
	
		<div class="aez-form-item">
			<label for="last-name" class="aez-form-item__label">Last Name *</label>
			<input id="last-name" type="text" pattern="[A-Za-z\\s]*" class="aez-form-item__input" name="last-name" placeholder="Last Name" required />
		</div>
	
		<div class="aez-form-item">
			<label for="your-email" class="aez-form-item__label">Email *</label>
			<input id="your-email" type="email" class="aez-form-item__input" name="your-email" placeholder="Email" required />
		</div>

 		<div class="aez-form-item">
			<label for="location-contact-us-drop-down" class="aez-form-item__label aez-form-item__label--hidden">Rent From</label>
			<input 
				type="search"
				id="location-contact-us-drop-down"
				name="location-contact-us-drop-down"
				pattern=".{15,}" 
				class="aez-form-item__label aez-select2-search aez-form-item__dropdown location-policy-dropdown"
				placeholder="Enter a city or country to find a location"
				style= "font-size: .9em; border: 0; border-radius: 5px; line-height: 2;" 
				spellcheck="false"
			>
			<label for="rental_location_id" class="aez-form-item__label--hidden"></label>
			<input id="rental_location_id" 
				name="rental_location_id" 
				style="display: none;" 
				class="aez-select2-search aez-form-item__dropdown" 
			>
		</div>

		<div class="aez-form-item">
			<textarea id="your-message" type="textarea" cols="40" rows="10" name="your-message" placeholder="Message"></textarea>
		</div>
	
		<div class="aez-form-item">
			<button type="submit" class="aez-btn aez-btn--filled-green">Send</button>
		</div>
	
	</div>';
        
        return $this->communication_form_html;
        
    }
    
}