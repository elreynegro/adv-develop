<?php

function Authorize($auth_token)
{
	return true;
}

function parseRequest()
{
	error_reporting(0);
	//$data = "eJydVttu4zYQ/RXB6GNjXSzf1Jd67SxqIIkDx9tinwSaom0ilMiSVGJn0X/vUCYtyfIGRZ/izOXMzJnhjFAymSY/VBJOkp4khUYsZRwjTXmR0qz3m0oGSe9xvjK/zja6lMUnNqOkJyh+LUWaIU1STXNSycdJL5gGYRSEYy8MkyDwZo+VImw5GNGkNr2ycGhg0cIA8ExywXe7m1HjKmowbXhEbY86bHwJ2zBpxG2iALqQRKAzCZDmk5VKk8RZCv+Fg0k8GUSVTZD0MENKpZhnFWSc9F7ms3VbWaBLvBeNigzJzKVkmkRkuqNSaUv9mnw4nqwWQLQN/oXzV1rsKwOwJTmiLEVZJolSRhgNwYviA4To75HEFP2OyIdEuI957ji0sAeek1QceEFcNnEwvhuPh3fxYDCqZMOLsY0RVkGgsvFoGHlPEIFzpQjx1hxlV2ljqk827ZVkUDe/qlpp2ysQfX1wnFnlBxVGAhkMokkUuYrnhtFljvbk27pyGYGz/y7uMAe3QvuClXtaKB9lbwgewJ7cvZEDxYyACDLVyjcNSidBcIyDoC8smZDk15KxLjwoDloLlfi+yZfiPilhjjCShlIf/r5RVSKmfIGkLohU/mQwPA6HY/9+/rhON2sXY2qzXxCFq14P63nwIj/2FpxLb1Zqnps43l9UH7zZ3Lo+woQx5xrCnP1xKsGVei+8QBrZ+VoDo8/AtaVuMVs+fHfEgjE7pdJyDtpw2A+Cy1CYIRdEUp7BwG0Js+OYoZMDMOCznJeF7gBY7RwGb+/g46Z2w2EZbdCRKNfVuG+7Glrt/VFLpOwrCpxvZLVnaOc9njpvKFqgUw6tT/VJwLIwxpeoq83swXueLRfVmLWXU7rjEpjWpBrcyDxdBOsQCvbuvJmQlHnhr55bIFHQXanuYUfQn9X6Yfa0WHnLp839+mm2Wa6eIPRsuX5erTeVUdQFUFoSol1HQ2fufXn4c/GzoM1ndY7pauuid97XtGvVfmjnWgc3wpq+y5OF+/biSmpt6jajgLIpiWoSGl8T2r4//4PQNsB/I7Tt8xmh1+i3CW1b/ZTQq7A3CIVh3iJF0lIyd37N8oHdY9zYgZ8PgZG/EiJSIXnOq+Oj7M367h6NIrCYMFEOK47rRZaRNyRov74M/jvZgsS3EqTyo3uajO9hn+4dzGDwGYw1dszMSwljhE9zSHBBlWDnXTI05S68X1wpGVUVGWb9YHLeLtAnuwmo3W5W4m4SzCZENO9eNbX1eXvn8rU+b109Jox19fUByvi2qYhrx7pxDSUDsgtoXVHmWyKbykGtvAyQ041qHTnW30xWHdXZVP1vXvpGQXDuSokKTFK4RpK2opvJq/WCQ7RTN0foleIlkG8/cxpsMH5CTJ/aCgiKcbVv2yAg7GCPKjFU1wSGwYKDDZ89uXFoaqqvUjO89slVabVDIyoZbbUNYuwY3R/0Fe+XyXLfZ3Wq1b27Ept6iblCHUV8+TZM0eUCNovBqSL4lhsMqUDFDc5NftWxgldMsX01jcbvJPm7NGfNfSMy1DRpfJuRXECX2uCTLkC7tRB9e/6YTOFrp12Q6SR8lKQZEVxRfaPkkbVApT50SzO7swXglt7V4ALThUoRrjqd15/Qm/sX2PD//AuKzQsw";
	//Code to compress in API: $data = base64_encode(gzcompress(serialize($this->request_array)));
	
	$data = $_POST['reservation_data'];
	$decoded = base64_decode($data);
	$uncompressed = gzuncompress($decoded);
	$addRezRequest = unserialize($uncompressed);
	
	//echo "<BR />decoded<BR />";
	//print_r($decoded);
	//echo "<BR /><BR />uncompressed<BR />";
	//print_r($uncompressed);
	//echo "<BR /><BR />addRezRequest<BR />";
	//print_r($addRezRequest);
	
	return $addRezRequest;
}


function addReservation()
{
	echo "<script>$('#Send').show();$('#spinnerDiv').show();</script>";
	$addRezRequest = parseRequest();
	if(!isset($addRezRequest["TotalCharges"]))
	{
		echo "<script>$('#spinnerDiv').hide();</script>";
		//echo "ERROR: Unable to proceed (No total charges)";
		showError("There was an error completing your reservation. (No total charges)");
		return;
	}
	
	//$addRezRequest["email_address"] = "msiddiqui@aezrac.com";
	if(isset($_POST['payment_cc_number']))
	{
		//echo "Posting Payment<BR />";
		
		$addRezRequest["prepaid"] = "Y";
		$addRezRequest["cc_number"] = $_POST['payment_cc_number'];
		$addRezRequest["cc_type"] = getCardType($addRezRequest["cc_number"]);
		
		// if len 4 substr($_POST['payment_cc_exp_year'], 2, 2);
		if(strlen($_POST['payment_cc_exp_year']) > 2)
		{
			$ccExpiryYear = substr($_POST['payment_cc_exp_year'], 2, 2);
		}
		$ccExpiry = $_POST['payment_cc_exp_month'] . '/01/' . $ccExpiryYear;
		$addRezRequest["cc_exp"] = $ccExpiry;//date("m/t/y", strtotime($ccExpiry));
		
		$addRezRequest["cc_sec_code"] = $_POST['payment_cc_sec_code'];
		$addRezRequest["prepaid_amount"] = $addRezRequest["TotalCharges"];

		// Add billing address if set
		if(!isset($_POST['checkbox_billingAddress']))
		{
			//echo $_POST['payment_StreetAddress'];
			$addRezRequest["renter_address1"] = $_POST['payment_StreetAddress'];
			$addRezRequest["renter_zip"] = $_POST['payment_ZipCode'];
			$addRezRequest["renter_city"] = $_POST['payment_City'];
			$addRezRequest["renter_state"] = $_POST['payment_State'];
			$addRezRequest["renter_country"] = $_POST['payment_Country'];			
		}
		
		//print_r($addRezRequest);
		//echo "<BR /><BR />";
		//echo "<BR /><BR />";
		postAddReservation($addRezRequest);
	}
}

function postAddReservation($addRezRequest)
{
	//$addRezURL = "https://devrezbookmobile.aezrac.com/api/v1/addReservation";
	$addRezURL = "https://rezbookapi.aezrac.com/api/v1/addReservationMobile";

	$url = 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
	if (strpos($url, "local.") !== false || strpos($url, "dev.") !== false || strpos($url, "qa.") !== false) {
	    // this is Local or DEV or QA
	    $addRezURL = "https://qapi.advantage.com/api/v1/addReservationMobile";
	} else {
	    // PROD
	    $addRezURL = "https://rezbookapi.aezrac.com/api/v1/addReservationMobile";
	}
	
	//$addRezURL = "http://rezbooklocal.advantage.com:8081/api/v1/addReservation";
	// Post to AddReservation API endpoint
	$context = stream_context_create(array(
		'http' => array(
			'method' => 'POST',
			'header' => "Authorization: \r\n".
				"Content-Type: application/json\r\n",
			'content' => json_encode($addRezRequest)
		)
	));

	// Send the request
	$response = file_get_contents($addRezURL, FALSE, $context);
	
	echo "<script>$('#spinnerDiv').hide();</script>";

	if($response === FALSE){
		//echo "ERROR: AddReservation failed. No Response";
		showError("");
		die('Error');
	}

	// Read the response and validate
	$responseData = json_decode($response, TRUE);
	
	$labelHTML = "<label class='label-control'>LABEL_TEXT</label>";
	$inputHTML = "<input style='width: 80%' name='INPUT_ID' id='INPUT_ID' value='INPUT_VALUE' />";
	
	if(isset($responseData["ConfirmNum"]))
	{
		
		//echo "<b>Confirmation Number: " . $responseData["ConfirmNum"] . "</b>";
		$confirmationNumber = str_replace("INPUT_VALUE", $responseData["ConfirmNum"], $inputHTML);
		$cardType = str_replace("INPUT_VALUE", $addRezRequest["cc_type"], $inputHTML);
		$cardLastFour = str_replace("INPUT_VALUE", substr($addRezRequest["cc_number"], -4), $inputHTML);
		
		$street = str_replace("INPUT_VALUE", $addRezRequest["renter_address1"], $inputHTML);
		$zip = str_replace("INPUT_VALUE", $addRezRequest["renter_zip"], $inputHTML);
		$city = str_replace("INPUT_VALUE", $addRezRequest["renter_city"], $inputHTML);
		$state = str_replace("INPUT_VALUE", $addRezRequest["renter_state"], $inputHTML);
		$country = str_replace("INPUT_VALUE", $addRezRequest["renter_country"], $inputHTML);
		
		$formHTML = "<form id='redirectHiddenForm' action='postData.php' method='post' style='display: none'>";
		
		$status = str_replace("INPUT_VALUE", "OK", $inputHTML);
		$error_code = str_replace("INPUT_VALUE", "", $inputHTML);
		$error_message = str_replace("INPUT_VALUE", "", $inputHTML);
			
		// Add hidden fields
		$formHTML .= str_replace("INPUT_ID", "ConfirmationNumber", $confirmationNumber);
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "CardType", $cardType);
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "CardLastFour", $cardLastFour);
		
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "Street", $street);
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "Zip", $zip);
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "City", $city);
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "State", $state);
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "Country", $country);
		
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "Status", $status);
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "ErrorCode", $error_code);
		$formHTML .= "<br />";
		$formHTML .= str_replace("INPUT_ID", "ErrorMessage", $error_message);
		
		$formHTML .= "</form>";
		
		echo $formHTML;
		echo "<script type='text/javascript'>document.getElementById('redirectHiddenForm').submit();</script>";
	}
	else {
		if(isset($responseData["status"]) && $responseData["status"] == "error")
		{
			if(isset($responseData["error"]["errorCode"]))
			{
				//echo "Error code: " . $responseData["error"]["errorCode"];
				//echo "<br />Error Message: " . $responseData["error"]["errorMessage"];
				//echo "<br />AddReservation Response:<br />";
				//print_r($responseData);
				showError("There was an error authorizing your card. Please confirm details and try again.");
			}
		}
	}
}

function showError($msg)
{
	if(!isset($msg))
		$msg = "There was an error completing your reservation. Please try again.";
	echo "<script>$('#errorDiv').text('".$msg."');$('#errorDiv').show();</script>";
}

function getCardType($cc_number)
{
	// AX – American Express
	// DS – Discover
	// MC – Master Card
	// VI – VISA
	// DS 6011, 622126-622925, 644-649, 65
	$cc_number = str_replace('-', '', $cc_number);
	$first_cc_number = substr($cc_number, 0, 1);
	$first2_cc_number = substr($cc_number, 0, 2);
	$first3_cc_number = substr($cc_number, 0, 3);
	$first4_cc_number = substr($cc_number, 0, 4);
	$first6_cc_number = substr($cc_number, 0, 6);

	$cc_type = '';
	if ($first_cc_number == '4') {
		$cc_type = 'VI';
	} elseif ($first2_cc_number == '34' || $first2_cc_number == '37') {
		$cc_type = 'AX';
	} elseif ($first2_cc_number >= '51' && $first2_cc_number <= '55') {
		$cc_type = 'MC';
	} elseif ($first4_cc_number >= '2221' && $first4_cc_number <= '2720') {
		$cc_type = 'MC';
	} elseif ($first2_cc_number == '65' ) {
		$cc_type = 'DS';
	} elseif ($first2_cc_number == '65' ) {
		$cc_type = 'DS';
	} elseif ($first3_cc_number >= '644' && $first3_cc_number <= '649' ) {
		$cc_type = 'DS';
	} elseif ($first4_cc_number == '6011' ) {
		$cc_type = 'DS';
	} elseif ($first6_cc_number >= '622126' && $first6_cc_number <= '622925' ) {
		$cc_type = 'DS';
	}
	
	return $cc_type;
}

?>