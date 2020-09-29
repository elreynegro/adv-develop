<?php

include_once('AdvLocations_ShortCodeScriptLoader.php');
 
class AdvLocations_LocationMarkupTemplateShortcode extends AdvLocations_ShortCodeScriptLoader {

	public $markup_template;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
        }
    }

	public function handleShortcode($atts) {

                $locations_data = AdvLocations_Helper::getLocation();
                $locations_hours = AdvLocations_Helper::getLocationHours($locations_data['LocationCode']);
                
                //Get the image URL of the Brand
                $image_url =(isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]/wp-content/uploads/2016/11/cropped-adv_logo.png";
                //Get the full URL of that location
                $full_url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
                
                $time_format = $locations_hours['Mon'];

                //Format the time string coming
                $time_format = substr($time_format, 0, 2) . ':' . substr($time_format, 2, 5) . ':'. substr($time_format, 7, 9);
                       
                if($locations_data['Phone1'] !== "") {
                        $phone_number_display = $locations_data['Phone1'];
                }
                 else
                {
                        $phone_number_display = $locations_data['Phone2'];
                }

                //$phone_number_display = str_replace("(", "", $phone_number_display);
                //$phone_number_display = str_replace(")", "", $phone_number_display);
                //$phone_number_display = str_replace(" ", "", $phone_number_display);
                //$phone_number_display = str_replace("-", "", $phone_number_display);
                $phone_number_display = preg_replace("/^1/", "", $phone_number_display);
                $phone_number_display = preg_replace("/[^\d]/","", $phone_number_display);
                
                $phone_number_display = "1" . $phone_number_display;
                /*
                $this->markup_template = '
                    <script type="application/ld+json">
                            {
                            "@context": "http://schema.org",
                            "@type": "AutoRental",
                            "name": "Advantage Rent A Car",
                            "address": {
                                    "@type": "PostalAddress",
                                    "streetAddress": "'.$locations_data['AddLine1'].'",
                                    "addressLocality": "'.$locations_data['City'].'",
                                    "addressRegion": "'.$locations_data['State'].'",
                                    "postalCode": "'.$locations_data['PostalCode'].'"
                            },
                            "image": "'.$image_url.'",
                            "telePhone": "'.$phone_number_display.'",
                            "url": "'.$full_url.'", 
                            "openingHours": "Mon, Tues, Wed, Thurs, Fri, Sat, Sun ' .$time_format. '",
                            "geo": {
                                    "@type": "GeoCoordinates",
                                    "latitude": "'.$locations_data['Latitude'].'",
                                    "longitude": "'.$locations_data['Longitude'].'"
                            },
                            "priceRange":"$"
                            }
                    </script>';
                    */

        return $this->markup_template;

    }
}