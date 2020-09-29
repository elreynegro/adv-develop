<?php
	//$reservationData = "eJydVttu4zYQ/RXB6GNjXSzf1Jd67SxqIIkDx9tinwSaom0ilMiSVGJn0X/vUCYtyfIGRZ/izOXMzJnhjFAymSY/VBJOkp4khUYsZRwjTXmR0qz3m0oGSe9xvjK/zja6lMUnNqOkJyh+LUWaIU1STXNSycdJL5gGYRSEYy8MkyDwZo+VImw5GNGkNr2ycGhg0cIA8ExywXe7m1HjKmowbXhEbY86bHwJ2zBpxG2iALqQRKAzCZDmk5VKk8RZCv+Fg0k8GUSVTZD0MENKpZhnFWSc9F7ms3VbWaBLvBeNigzJzKVkmkRkuqNSaUv9mnw4nqwWQLQN/oXzV1rsKwOwJTmiLEVZJolSRhgNwYviA4To75HEFP2OyIdEuI957ji0sAeek1QceEFcNnEwvhuPh3fxYDCqZMOLsY0RVkGgsvFoGHlPEIFzpQjx1hxlV2ljqk827ZVkUDe/qlpp2ysQfX1wnFnlBxVGAhkMokkUuYrnhtFljvbk27pyGYGz/y7uMAe3QvuClXtaKB9lbwgewJ7cvZEDxYyACDLVyjcNSidBcIyDoC8smZDk15KxLjwoDloLlfi+yZfiPilhjjCShlIf/r5RVSKmfIGkLohU/mQwPA6HY/9+/rhON2sXY2qzXxCFq14P63nwIj/2FpxLb1Zqnps43l9UH7zZ3Lo+woQx5xrCnP1xKsGVei+8QBrZ+VoDo8/AtaVuMVs+fHfEgjE7pdJyDtpw2A+Cy1CYIRdEUp7BwG0Js+OYoZMDMOCznJeF7gBY7RwGb+/g46Z2w2EZbdCRKNfVuG+7Glrt/VFLpOwrCpxvZLVnaOc9njpvKFqgUw6tT/VJwLIwxpeoq83swXueLRfVmLWXU7rjEpjWpBrcyDxdBOsQCvbuvJmQlHnhr55bIFHQXanuYUfQn9X6Yfa0WHnLp839+mm2Wa6eIPRsuX5erTeVUdQFUFoSol1HQ2fufXn4c/GzoM1ndY7pauuid97XtGvVfmjnWgc3wpq+y5OF+/biSmpt6jajgLIpiWoSGl8T2r4//4PQNsB/I7Tt8xmh1+i3CW1b/ZTQq7A3CIVh3iJF0lIyd37N8oHdY9zYgZ8PgZG/EiJSIXnOq+Oj7M367h6NIrCYMFEOK47rRZaRNyRov74M/jvZgsS3EqTyo3uajO9hn+4dzGDwGYw1dszMSwljhE9zSHBBlWDnXTI05S68X1wpGVUVGWb9YHLeLtAnuwmo3W5W4m4SzCZENO9eNbX1eXvn8rU+b109Jox19fUByvi2qYhrx7pxDSUDsgtoXVHmWyKbykGtvAyQ041qHTnW30xWHdXZVP1vXvpGQXDuSokKTFK4RpK2opvJq/WCQ7RTN0foleIlkG8/cxpsMH5CTJ/aCgiKcbVv2yAg7GCPKjFU1wSGwYKDDZ89uXFoaqqvUjO89slVabVDIyoZbbUNYuwY3R/0Fe+XyXLfZ3Wq1b27Ept6iblCHUV8+TZM0eUCNovBqSL4lhsMqUDFDc5NftWxgldMsX01jcbvJPm7NGfNfSMy1DRpfJuRXECX2uCTLkC7tRB9e/6YTOFrp12Q6SR8lKQZEVxRfaPkkbVApT50SzO7swXglt7V4ALThUoRrjqd15/Qm/sX2PD//AuKzQsw";
	$reservationData = "eJydVttu4zYQ/RXB6GNjXSzf1Jd67SxqIIkDx9tinwSaom0ilMglqcRO0X/vUCYtyfIGRZ/izOXMzJnRDFEymSZ/qyScJD1JCo1YyjhGmvIipVnvN5UMkt7jfGV+nW10KYtPbEZJT1D8Woo0Q5qkmuakko+TXjANwigIx14YJkHgzR4rRdhyMKJJbXpl4dDAooUB4Jnkgu92N6PGVdRg2vCI2h512PgStmHSiNtEAXQhiUBnEiDNJyuVJomzFP4LB5N4MogqmyDpYYaUSjHPKsg46b3MZ+u2skCXeC8aFRmSmUvJNInIdEel0pb6NflwPFktgGgb/Avnr7TYVwZgS3JEWYqyTBKljDCCoLmiWUZ/lPR3RD4kwn3Mc0efRTzwnKTiwAviEomD8d14PLyLB4NRJRtejC186PDHo2HkPSGJOVeKEG/NUXaVMab6ZDNeSQYl86uClbZtAtHXB0eXVX5QYSSQwSCaRJErdm7IXOZoT76tK5cROPvv4g5zcCu0L1i5p4XyUfaGYPb35O6NHChmBESQqVa+6U06CYJjHAR9YXmEJL+WjHXhQXHQWqjE902+FPdJCSOEkTSU+vD3jaoSMeULJHVBpPIng+FxOBz79/PHdbpZuxhTm/2CKFy1eViPghf5sbfgXHqzUvPcxPH+ovrgzebW9RGGiznXEEbsj1MJrtR74QXSyI7WGhh9Bq4tdYvZ8uG7IxaM2SmVlnPQhsN+EFyGwsy3IJLyDGZtS5idxAydHIABn+W8LHQHwGrnByT3Dj5uajcc9tAGHYlyXY37tquh1d4ftUTKfkCB842s9gztvMdT5w1FC3TKofWpPgnYE8b4EnW1mT14z7Plohqz9l5Kd1wC05pUgxuZrxbBJoSCvTtvJiRlXvir53ZHFHS3qfumI+jPav0we1qsvOXT5n79NNssV08QerZcP6/Wm8oo6gIoLQnRrqOhM/e+PPy5+FnQ5md1julq66J3vq9p16r9oZ1rHdwIa/ouTxbu24srqbWk24wCyqYkqklofE1o+/T8D0LbAP+N0LbPZ4Reo98mtG31U0Kvwt4gFIZ5ixRJS1mNcDQ6Lx/YPQV5/4H6l6V2Wedg8UqISIXkOa8ukLKH67v7fBSBFYWJcqhxXK+0jLwhQfv1jfDfyRYkvpUglR/dR8r4Hjbr3sEMBp/BWGPH0byUMFD4NIcEF1QJdt4qQ1P4wvvFlZJRVdFiFhEm5z0DHbM7gdo9ZyXuOsGUQkSzAVRTWx+6dy5f60PX1WPCWFdfn6KMb5uKuHasW9hQMiC7gCYWZb4lsqkc1MrLKDndqNaRY/1wsuqozsYMUOvcNwqCw1dKVGCSwl2StBXdzGCtFxyinbo5Qq8UL4F8+9ZpsMH4CTF9aisgKMbV5m2DgLCDParEUF0TGAYLTje8fXLj0NRUT1MzvPbjq9Jqh0ZUMtpqG8TYMbo/6CveL5PlHml1qtXluxKbeom5Rx1FfHkgpuhyC5vF4FQRfMsNhlSg4gbnJr/qbMFXTLH9ahqN30nyozQHzj0UGWqaNF5pJBfQpTb4pAvQbi1E355flClslnZBppPwPEkzIrii+kbJI2uBSn3olma2aAvArb+rwQWmC5UiXHU6r9/Rm/sX2PX//AvW0g0c";
	
	if(isset($_POST['ConfirmationNumber']))
	{
		/*
		echo "ConfirmationNumber: " . $_POST['ConfirmationNumber'];
		echo "<br />";
		echo "CardType: " . $_POST['CardType'];
		echo "<br />";
		echo "CardLastFour: " . $_POST['CardLastFour'];
		echo "<br />";
		echo "Street: " . $_POST['Street'];
		echo "<br />";
		echo "Zip: " . $_POST['Zip'];
		echo "<br />";
		echo "City: " . $_POST['City'];
		echo "<br />";
		echo "State: " . $_POST['State'];
		echo "<br />";
		echo "Country: " . $_POST['Country'];
		echo "<br />";
		echo "Status: " . $_POST['Status'];
		echo "<br />";
		echo "ErrorCode: " . $_POST['ErrorCode'];
		echo "<br />";
		echo "ErrorMessage: " . $_POST['ErrorMessage'];
		*/
		
		//reservationInfo(String confirmationNumber, String cardType, String cardLastFour, String street, String zip, String city, String state, String country, String status , String errorCode, String errorMessage)
		$reservationInfo = "'" . $_POST['ConfirmationNumber'] . "'";
		$reservationInfo .= ",'" . $_POST['CardType'] . "'";
		$reservationInfo .= ",'" . $_POST['CardLastFour'] . "'";
		$reservationInfo .= ",'" . $_POST['Street'] . "'";
		$reservationInfo .= ",'" . $_POST['Zip'] . "'";
		$reservationInfo .= ",'" . $_POST['City'] . "'";
		$reservationInfo .= ",'" . $_POST['State'] . "'";
		$reservationInfo .= ",'" . $_POST['Country'] . "'";
		$reservationInfo .= ",'" . $_POST['Status'] . "'";
		$reservationInfo .= ",'" . $_POST['ErrorCode'] . "'";
		$reservationInfo .= ",'" . $_POST['ErrorMessage'] . "'";
		
		echo "<script type='text/javascript'>Android.reservationInfo(" . $reservationInfo . ");</script>";
	}
	//else echo "Confirmation number is not sent";
	
?>

<!--

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>POST PAYMENT TEST</title>
    <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">


    <link href="payment.css" rel="stylesheet" />
</head>

<body>
    <header>
        <div class="content-wrapper">


        </div>
    </header>
    <div id="body" class="outer-wrapper">

        <section class="content-wrapper main-content clear-fix">

            <hr size="8" width="100%" color="red">
            <h2 style="margin-top: 0;">Test Payment Method</h2>
            <script src="Scripts/jquery-1.8.2.js"></script>
            <script src="Scripts/jquery.validate.js"></script>
            <script src="Scripts/jquery.validate.unobtrusive.js"></script>
            <br />
            <form action="pay.php" class="form-horizontal" method="post" enctype="multipart/form-data">			
				<label class="label-control">Auth Token</label>
				<input name="auth_token" id="auth_token" value="token_value" /><br /><br />
				
				<label class="label-control">Reservation Data (Compressed String)</label>
				<input style="width: 80%" name="reservation_data" id="reservation_data" value="< ? = $reservationData ?>" ></textarea>
				<input type="submit" class="book-now" name="Send" id="Send" value="Book Now" />
            </form>
        </section>
    </div>

</body>

</html>

-->