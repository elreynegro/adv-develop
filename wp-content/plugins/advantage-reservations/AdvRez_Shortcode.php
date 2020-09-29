<?php

    include_once('AdvRez_ShortCodeScriptLoader.php');
 
class AdvRez_Shortcode extends AdvRez_ShortCodeScriptLoader {

	public $rez_box_html;
    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_script('adv_rez', plugins_url('js/adv_rez.js', __FILE__), array('jquery', 'main'), '1.0', true);
 
            wp_localize_script( 'adv_rez', 'ADV_Rez_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
        		)
        	);

        }
    }

    // public function adv_rez_vehicle_list_func($atts) {
    //         error_log("In vehicle function");
    //         error_log("POST: ".print_r($_POST, true));
    //         $this->rez_box_html = $_POST['vehicles_html'];
    //     return $this->rez_box_html;

    // }

	public function handleShortcode($atts) {

        // Check if cookie exists or not
        if (isset($_COOKIE['adv_userbookmark'])) {
            // Remove the slashes
            $json = stripslashes($_COOKIE['adv_userbookmark']);
           
            // Decode the json
            $json = json_decode(base64_decode($json));

            foreach ($json as $key => $value) {

                // error_log("Key: ". $key . ", value: ". $value);
                switch (strtolower($key)) {
                    case 'action':
                        $action = $value;
                        break;
                    case 'rental_location_id':
                        $rental_location = $value;
                        break;
                    case 'return_location_id':
                        $return_location = $value;
                        break;
                    case 'pickup_date':
                        $pickup_date = $value;
                        break;
                    case 'pickup_time':
                        $pickup_time = $value;
                        break;
                    case 'dropoff_date':
                        $dropoff_date = $value;
                        break;
                    case 'dropoff_time':
                        $dropoff_time = $value;
                        break;
                    //case 
                }

            }

        }

        $this->rez_box_html = '<div class="row">'.
            '<div class="col-md-8 col-md-offset-2">'.
                '<div class="panel panel-default">'.
                    '<div class="panel-heading">Reservation</div>'.
                    '<div class="panel-body">'.
                        '<form id="adv_rez" class="form-horizontal" role="form" method="POST" name="adv_rez" action="/choose">'.
                            '<input type="hidden" name="api_provider" value="TSD">'.
                            '<div class="form-group">'.
                                '<label for="rental_location_id" class="col-md-4 control-label">Pick Up Location</label>'.
                                 '<div class="col-md-6">'.
                                    '<input id="rental_location_id" type="text" class="form-control" name="rental_location_id" value="'.$rental_location.'" required autofocus>'.
                                '</div>'.
                            '</div>'.

                            '<div class="form-group">'.
                                '<label for="return_location_id" class="col-md-4 control-label">Drop Off Location</label>'.
                                '<div class="col-md-6">'.
                                    '<input id="return_location_id" type="text" class="form-control" name="return_location_id" value="' . $return_location .'" required>'.
                                '</div>'.
                            '</div>'.

                            '<div class="form-group">'.
                                '<label for="pickup_date" class="col-md-4 control-label">Pick Up Date</label>'.
                                '<div class="col-md-6">'.
                                    '<input id="pickup_date" type="text" class="form-control" name="pickup_date" value="' . $pickup_date .'" required>'.
                                '</div>'.
                            '</div>'.

                            '<div class="form-group">'.
                                '<label for="pickup_time" class="col-md-4 control-label">Pick Up Time</label>'.
                                '<div class="col-md-6">'.
                                    '<input id="pickup_time" type="text" class="form-control" name="pickup_time" value="' . $pickup_time .'" required>'.
                                '</div>'.
                            '</div>'.

                            '<div class="form-group">'.
                                '<label for="dropoff_date" class="col-md-4 control-label">Pick Up Date</label>'.
                                '<div class="col-md-6">'.
                                    '<input id="dropoff_date" type="text" class="form-control" name="dropoff_date" value="' . $dropoff_date .'" required>'.
                                '</div>'.
                            '</div>'.

                            '<div class="form-group">'.
                                '<label for="dropoff_time" class="col-md-4 control-label">Pick Up Time</label>'.
                                '<div class="col-md-6">'.
                                    '<input id="dropoff_time" type="text" class="form-control" name="dropoff_time" value="' . $dropoff_time .'" required>'.
                                '</div>'.
                            '</div>'.

                            '<div class="form-group">'.
                                '<label for="promo_codes[]" class="col-md-4 control-label">Promo Code</label>'.
                                '<div class="col-md-6">'.
                                    '<input id="promo_codes1" type="text" class="form-control" name="promo_codes[]" required>'.
                                '</div>'.
                            '</div>'.

                            '<div class="form-group">'.
                                '<label for="promo_codes[]" class="col-md-4 control-label">Promo Code</label>'.
                                '<div class="col-md-6">'.
                                    '<input id="promo_codes2" type="text" class="form-control" name="promo_codes[]" required>'.
                                '</div>'.
                            '</div>'.

                            '<div class="form-group">'.
                                '<div class="col-md-8 col-md-offset-4">'.
                                    '<button id="adv_rez_submit" type="submit" class="btn btn-primary">'.
                                        'Check Rates'.
                                    '</button>'.
                                '</div>'.
                            '</div>'.
                        '</form>'.
                    '</div>'.
                '</div>'.
            '</div>'.
        '</div>';

        return $this->rez_box_html;


	}

}