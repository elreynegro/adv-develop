<?php

    include_once('AdvRez_ShortCodeScriptLoader.php');
 
class AdvRez_ModalCancelShortcode extends AdvRez_ShortCodeScriptLoader {

    static $addedAlready = false;
 
 	/* 
 	* Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;

            // needs select2, pikaday, moment

            wp_enqueue_script('adv_modal_cancel', plugins_url('js/adv_modal_cancel.js', __FILE__), array('jquery', 'main'), '1.0', true);

            wp_localize_script( 'adv_modal_cancel', 'ADV_Rez_Ajax', array(
				'ajaxurl'   => admin_url( 'admin-ajax.php' ),
				'advRezNonce' => wp_create_nonce( 'advRez-nonce' )
        		)
        	);
        }
    }

	public function handleShortcode($atts) {

        // Grab the header and text from the short code on the view-reservation page.
        extract( shortcode_atts( array(
            'header' => '',
            'text' => ''
        ), $atts ) );

        $this->rez_modal = '<div class="aez-modal aez-reservation-summary-modal">' .
            '<div class="aez-modal-dialog">' .
                '<i class="fa fa-close aez-modal-dialog__close"></i>' .
                '<div class="aez-form-block">' .
                    '<h3 class="aez-find-a-car__heading">' . $header . '</h3><br />' .
                    '<div class="aez-form-block__header" style="display: block !important;">' . $text . '</div><br />' .
                '</div>' .
                '<button id="go_back" class="aez-btn aez-btn--filled-green" type="submit">Keep Reservation</button><br />' .
                '<button id="cancel_reservation" class="aez-btn aez-btn--filled-red" type="submit">Cancel Reservation</button>' .
            '</div>'.
        '</div>';

        return $this->rez_modal;
	}
}