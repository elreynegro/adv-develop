<!DOCTYPE html>
<html lang="en">
<?php

// if post and base64 is posted, fill the hidden form and wait for self post
// if self post with card details, attach to Request and proceed

//$reservationData = "";
//$reservationData = "eJydVttu4zYQ/RXB6GNjXSzf1Jd67SxqIIkDx9tinwSaom0ilMglqcRO0X/vUCYtyfIGRZ/izOXMzJnRDFEymSZ/qyScJD1JCo1YyjhGmvIipVnvN5UMkt7jfGV+nW10KYtPbEZJT1D8Woo0Q5qkmuakko+TXjANwigIx14YJkHgzR4rRdhyMKJJbXpl4dDAooUB4Jnkgu92N6PGVdRg2vCI2h512PgStmHSiNtEAXQhiUBnEiDNJyuVJomzFP4LB5N4MogqmyDpYYaUSjHPKsg46b3MZ+u2skCXeC8aFRmSmUvJNInIdEel0pb6NflwPFktgGgb/Avnr7TYVwZgS3JEWYqyTBKljDCCoLmiWUZ/lPR3RD4kwn3Mc0efRTzwnKTiwAviEomD8d14PLyLB4NRJRtejC186PDHo2HkPSGJOVeKEG/NUXaVMab6ZDNeSQYl86uClbZtAtHXB0eXVX5QYSSQwSCaRJErdm7IXOZoT76tK5cROPvv4g5zcCu0L1i5p4XyUfaGYPb35O6NHChmBESQqVa+6U06CYJjHAR9YXmEJL+WjHXhQXHQWqjE902+FPdJCSOEkTSU+vD3jaoSMeULJHVBpPIng+FxOBz79/PHdbpZuxhTm/2CKFy1eViPghf5sbfgXHqzUvPcxPH+ovrgzebW9RGGiznXEEbsj1MJrtR74QXSyI7WGhh9Bq4tdYvZ8uG7IxaM2SmVlnPQhsN+EFyGwsy3IJLyDGZtS5idxAydHIABn+W8LHQHwGrnByT3Dj5uajcc9tAGHYlyXY37tquh1d4ftUTKfkCB842s9gztvMdT5w1FC3TKofWpPgnYE8b4EnW1mT14z7Plohqz9l5Kd1wC05pUgxuZrxbBJoSCvTtvJiRlXvir53ZHFHS3qfumI+jPav0we1qsvOXT5n79NNssV08QerZcP6/Wm8oo6gIoLQnRrqOhM/e+PPy5+FnQ5md1julq66J3vq9p16r9oZ1rHdwIa/ouTxbu24srqbWk24wCyqYkqklofE1o+/T8D0LbAP+N0LbPZ4Reo98mtG31U0Kvwt4gFIZ5ixRJS1mNcDQ6Lx/YPQV5/4H6l6V2Wedg8UqISIXkOa8ukLKH67v7fBSBFYWJcqhxXK+0jLwhQfv1jfDfyRYkvpUglR/dR8r4Hjbr3sEMBp/BWGPH0byUMFD4NIcEF1QJdt4qQ1P4wvvFlZJRVdFiFhEm5z0DHbM7gdo9ZyXuOsGUQkSzAVRTWx+6dy5f60PX1WPCWFdfn6KMb5uKuHasW9hQMiC7gCYWZb4lsqkc1MrLKDndqNaRY/1wsuqozsYMUOvcNwqCw1dKVGCSwl2StBXdzGCtFxyinbo5Qq8UL4F8+9ZpsMH4CTF9aisgKMbV5m2DgLCDParEUF0TGAYLTje8fXLj0NRUT1MzvPbjq9Jqh0ZUMtpqG8TYMbo/6CveL5PlHml1qtXluxKbeom5Rx1FfHkgpuhyC5vF4FQRfMsNhlSg4gbnJr/qbMFXTLH9ahqN30nyozQHzj0UGWqaNF5pJBfQpTb4pAvQbi1E355flClslnZBppPwPEkzIrii+kbJI2uBSn3olma2aAvArb+rwQWmC5UiXHU6r9/Rm/sX2PX//AvW0g0c";

if(isset($_POST['auth_token']))
{
 	require_once("paymentHelper.php");
 	if(Authorize($_POST['auth_token']))
	{
		$auth_token = $_POST['auth_token'];
		$reservationData = $_POST['reservation_data'];
		//$auth_token = $_POST['auth_token'];
		// for testing
		if(!isset($_POST['reservation_data']))
			parseRequest($reservationData);
	}
}

?>



<head>
    <meta charset="utf-8" />
    <title>Advantage Payment</title>
    <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="payment.css" rel="stylesheet" />
	
	<script src="Scripts/jquery-1.8.2.js"></script>
	
</head>

<body>
    <header>
        <div class="content-wrapper"></div>
		<div id="spinnerDiv" class="loading"></div>
    </header>

    <div id="body" class="outer-wrapper">

        <section class="content-wrapper main-content clear-fix">

            <hr size="8" width="100%" color="red">
            <h2 style="margin-top: 0;">Payment Method</h2>
            
            <br />
			
			<div style="payment-div">
				<!-- <span class="label-control cc-label">We accept:</span> -->
				<div class="label-control-cctext">
					We accept all major credit cards as payment for a pre-paid rental. Please note, at the time of rental the renter will need to present a current driver's license and a valid credit or charge card in the renters name.
				</div>
				<br />
				<div class="payment-header"></div>
				<br />
				
				<div id="errorDiv" class="label-control-cctext" style="color: Red; display: none;">There was an error completing your reservation. Please try again.</div>
				<div id="expiryError" class="label-control-cctext" style="color: Red; display: none;"></div>
			</div>
			
            <form id="paymentForm" action="" class="form-horizontal" method="post">
			
			<input style="width: 80%;visibility: hidden;" type="hidden" name="auth_token" id="auth_token" value="<?= $auth_token ?>" />
			<input style="width: 80%;visibility: hidden;" type="hidden" name="reservation_data" id="reservation_data" value="<?= $reservationData ?>" />
			
				<div class="credit-card-details">
				</div>
			
                <div class="credit-card-details">
                    <label class="label-control">Name on Card</label>
                    <!-- <input required data-val="true" class="input-control" data-val-length="Name can not be more than 50 characters " data-val-length-max="50" data-val-required="Please enter card holder name" id="payment_cc_name" name="payment.cc_name" type="text" value="" /> -->
                    <input required maxlength="50" class="input-control" placeholder="" title="Name can not be more than 50 characters" id="payment_cc_name" name="payment.cc_name" type="text" value="" oninvalid="this.setCustomValidity('Please provide valid card holder name')" oninput="setCustomValidity('')" />

                    <label class="label-control">Credit Card</label>
                    <input type="number" pattern="\d*" required maxlength="16" class="input-control" title="Valid credit card number of maximum 16 digits" id="payment_cc_number" name="payment.cc_number" value="" oninvalid="this.setCustomValidity('Please provide valid credit card number')" oninput="setCustomValidity('')" />

                    <label class="label-control">Expiry Date</label>					
					<select
                            id="payment_cc_exp_month"
                            class="select-control"
                            name="payment.cc_exp_month"
                            required>
                            <!--<option></option>-->
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">Jun</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
						
						<select
                            id="payment_cc_exp_year"
                            class="select-control"
                            name="payment.cc_exp_year"
                            required>
							<!--<option></option>-->
							<?php
								$start_exp_year = (int)date('Y');
								$end_exp_year = (int)date('Y', strtotime('+30 years'));
								if($end_exp_year < $start_exp_year)
									$end_exp_year = 2047;
								$card_exp_dropdown = '';

								for ($year = $start_exp_year; $year <= $end_exp_year; $year++) {
									$sel = "";
									//if($year == 2018) $sel = "selected";
									$option = '<option '.$sel.' value="' . $year . '"  >' . $year . '</option>';
									$card_exp_dropdown .= $option;
								}
								echo $card_exp_dropdown;
							?>
                        </select>

                    <label class="label-control">CVV Number</label>
                    <input type="number" pattern="\d*" required maxlength="4" class="input-control" title="Valid CVV code 3 or 4 digits is required" id="payment_cc_sec_code" name="payment.cc_sec_code" value="" oninvalid="this.setCustomValidity('Please provide valid CVV number')" oninput="setCustomValidity('')" />
                    
                    <!--
					<br />
					<hr class="divider-dotted" />
					-->
					<br />
                </div>
				<h2>Billing Address</h2>
				<label class="label-control-x">
					<input type="checkbox" id="checkbox_billingAddress" />
					Same As Profile/Reservation Address
				</label>
				
                <div id="divBillingAddress" class="billing-address">
                    
                    <label class="label-control">Street Address</label>
                    <input id="payment_StreetAddress" class="input-control" name="payment.StreetAddress" type="text" value="" title="Street Address" />

                    <label class="label-control">Street Address 2</label>
                    <input id="payment_StreetAddress2" class="input-control" name="payment.StreetAddress2" type="text" value="" />

                    <label class="label-control">Zip Code</label>
                    <input id="payment_ZipCode" class="input-control" name="payment.ZipCode" type="number" pattern="[0-9]{5}" title="Five digit zip code" value="" data-val-required="Please provide Zip Code" />

                    <label class="label-control">City</label>
                    <input id="payment_City" class="input-control" name="payment.City" type="text" value="" data-val-required="Please provide City"/>

                    <label class="label-control">State</label>
                    <input id="payment_State" class="input-control" name="payment.State" type="text" value="" data-val-required="Please provide State"/>

                    <label class="label-control">Country</label>
					<select
                            id="payment_Country"
                            class="select-control"
                            name="payment_Country">
							<option value="United States">United States</option>
                    </select>
                    <!--<input id="payment_Country" class="input-control" name="payment.Country" type="text" value="" data-val-required="Please enter Street Address"/>-->

                </div>
                <input type="submit" class="book-now" name="Send" id="Send" value="Book Now" />
				<br/>
				**Please note: Your credit card will be charged after you press Book Now.
            </form>
        </section>
    </div>


	
	<script>
	
	$(document).ready(function()
	{

		function hasHtml5Validation () {
			return typeof document.createElement('input').checkValidity === 'function';
		}
		function showHideSpinner(show) {
			if(show == 1) 
			$('#spinnerDiv').show();
			else $('#spinnerDiv').hide();
		}


		//$('#spinnerDiv').hide();
		showHideSpinner(0);
		
		$('#payment_cc_name').bind("cut copy paste",function(e) { e.preventDefault();});

		$('#payment_cc_number').bind("cut copy paste",function(e) {e.preventDefault();});

		$('#payment_cc_sec_code').bind("cut copy paste",function(e) {e.preventDefault();});

		$('#payment_StreetAddress').bind("cut copy paste",function(e) {	e.preventDefault();	});

		$('#payment_StreetAddress2').bind("cut copy paste",function(e) {e.preventDefault();	});

		$('#payment_ZipCode').bind("cut copy paste",function(e) {e.preventDefault();});

		$('#payment_City').bind("cut copy paste",function(e) {e.preventDefault();});

		$('#payment_State').bind("cut copy paste",function(e) {	e.preventDefault();	});

		
		$('#checkbox_billingAddress').prop('checked', true);
		$('#divBillingAddress').css('display', 'none');
		$('#checkbox_billingAddress').change(function(){
			if(this.checked)
			{
				
				$("#payment_StreetAddress").prop('required', false);
				$("#payment_ZipCode").prop('required', false);
				$("#payment_City").prop('required', false);
				$("#payment_State").prop('required', false);
				$("#payment_Country").prop('required', false);
				//$('#divBillingAddress').hide();//.fadeOut('slow');
				$('#divBillingAddress').css('display', 'none');
			}
			else
			{
				//$("#paymentForm").validate();
				$("#payment_StreetAddress").prop('required', true);
				$("#payment_ZipCode").prop('required', true);
				$("#payment_City").prop('required', true);
				$("#payment_State").prop('required', true);
				$("#payment_Country").prop('required', true);
				//$('#divBillingAddress').show();//.fadeIn('slow');
				$('#divBillingAddress').css('display', 'block');
			}
		});

		if (hasHtml5Validation()) 
		{
			$('#paymentForm').submit(function (e) 
			{
			 	$('#errorDiv').hide();
				showHideSpinner(1);

			   if (!this.checkValidity()) {
			     // Prevent default stops form from firing
			     e.preventDefault();
			     $(this).addClass('invalid');
				 showHideSpinner(0);
			     return;
			   } 
			   else {
			     $(this).removeClass('invalid');
			     $(this).addClass('.input-control');
			   }

			   if(!validateCC())
				{
					showHideSpinner(0);
					$("#payment_cc_number").focus();
					$("#payment_cc_number").addClass('invalid');

					$('#errorDiv').text('Please provide a valid credit card number');
					$('#errorDiv').show();

					e.preventDefault();
					return false;
				}

				if(/^[0-9]{3,4}$/.test($("#payment_cc_sec_code").val()) === false)
				{
					showHideSpinner(0);
					$("#payment_cc_sec_code").focus();
					$("#payment_cc_sec_code").addClass('invalid');

					$('#errorDiv').text('Please provide a valid CVV code');
					$('#errorDiv').show();

					e.preventDefault();
					return false;
				}

				var month = $('#payment_cc_exp_month').val();
				var year = $('#payment_cc_exp_year').val();
				var expiry = new Date(year, month - 1);
				var currentDate = new Date();

				if(currentDate >= expiry)
				{
					showHideSpinner(0);
					$('#payment_cc_exp_month').focus();
					$('#errorDiv').text('Please provide valid expiration date.');
					$('#errorDiv').show();

					e.preventDefault();
					return false;
				}

			 });
			}

		function validateCC(){
			var ccNum = $("#payment_cc_number").val();
			var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
			var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
			var amexpRegEx = /^(?:3[47][0-9]{13})$/;
			var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
			var isValid = false;

			if (visaRegEx.test(ccNum)) { isValid = true; } 
			else if(mastercardRegEx.test(ccNum)) { isValid = true; } 
			else if(amexpRegEx.test(ccNum)) { isValid = true; } 
			else if(amexpRegEx.test(ccNum)) { isValid = true; }

			return isValid;
		}
		
		
		$('#paymentForm').submit(function() {
			
			if(!$('#paymentForm').checkValidity()) return;
			
			var month = $('#payment_cc_exp_month').val();
			var year = $('#payment_cc_exp_year').val();
			var expiry = new Date(year, month - 1);
			var currentDate = new Date();
			var hasErrors = false;
			var errorMessages = "Please provide ";

			if($("#payment_cc_name").val().length == 0)
			{
				errorMessages += "valid name, ";
				hasErrors = true;
			}

			if($("#payment_cc_number").val().length == 0 || 
                           /^[0-9]{15,16}$/.test($("#payment_cc_number").val()) === false)
			{
				errorMessages += "valid credit card number, ";
				hasErrors = true;
			}

			if(currentDate >= expiry){
				$('#payment_cc_exp_month').focus();
				errorMessages += " valid expiration date, ";
				hasErrors = true;
			}

			if($("#payment_cc_sec_code").val().length == 0 ||
			   $("#payment_cc_sec_code").val().length <= 2 ||
			   $("#payment_cc_sec_code").val().length > 4 ||
                           /^[0-9]{3,4}$/.test($("#payment_cc_sec_code").val()) === false)
			{
				errorMessages += "valid CVV, ";
				hasErrors = true;
			}


			if(!$('#checkbox_billingAddress').prop('checked'))
			{
				if($("#payment_StreetAddress").val().length == 0)
				{
					errorMessages += "valid billing street address, ";
					hasErrors = true;
				}
				if($("#payment_ZipCode").val().length == 0)
				{
					errorMessages += "valid billing zipcode, ";
					hasErrors = true;
				}
				if($("#payment_City").val().length == 0)
				{
					errorMessages += "valid billing city, ";
					hasErrors = true;
				}
				if($("#payment_State").val().length == 0)
				{
					errorMessages += "valid billing state, ";
					hasErrors = true;
				}
			}


			if(!$('#checkbox_billingAddress').prop('checked'))
			{
				if($("#payment_State").val().length == 0)
				{
					$("#payment_State").focus();
				}
				if($("#payment_City").val().length == 0)
				{
					$("#payment_City").focus();
				}
				if($("#payment_ZipCode").val().length == 0)
				{
					$("#payment_ZipCode").focus();
				}
				if($("#payment_StreetAddress").val().length == 0)
				{
					$("#payment_StreetAddress").focus();
				}
			}

			if($("#payment_cc_sec_code").val().length == 0 ||
			   $("#payment_cc_sec_code").val().length <= 2 ||
			   $("#payment_cc_sec_code").val().length > 4)
			{
				$("#payment_cc_sec_code").focus();
			}

			if(currentDate >= expiry)
			{
				$('#payment_cc_exp_month').focus();
			}


			if($("#payment_cc_number").val().length == 0)
			{
				$("#payment_cc_number").focus();
			}

			if($("#payment_cc_name").val().length == 0)
			{
				$("#payment_cc_name").focus();
			}

			if(hasErrors)
			{
				 errorMessages = errorMessages.substring(0, errorMessages.length - 2) + ".";
				 $('#expiryError').text(errorMessages);
				 $('#expiryError').show();
				 return false;
			}
			else
			{
				//$('#spinnerDiv').show();
				showHideSpinner(1);
				$('#errorDiv').hide();
				$('#expiryError').hide();
				return true;
			}
		});
		
	});
	</script>
</body>
</html>	

<?php

if(isset($_POST['payment_cc_number']))
{
	if(isset($_POST['reservation_data']))
	{
		require_once('paymentHelper.php');
		addReservation();
	}
}
?>