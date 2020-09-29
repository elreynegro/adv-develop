<?php

    include_once('AdvPromoCodes_ShortCodeScriptLoader.php');
 
class AdvPromoCodes_Shortcode extends AdvPromoCodes_ShortCodeScriptLoader {

    public $promocode_html;
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

        // The promo code short code should look like this:
        // [adv-promocodes value="ADC12KUJ45" text="Return to www.rentalcarmomma.com"]

        // value = the promocode
        // text = the text of the button
        extract( shortcode_atts( array(
            'promo_code' => 'promo_code',
            'display_text' => 'display_text',
            'css_classes' => 'css_classes'
            ), $atts ) );

        $this->promocode_html = '<a nohref value="'. esc_attr($promo_code) .'" class="' . $css_classes . '" onclick="goToAnchorReserve();">' . $display_text . '</a>';

        return $this->promocode_html;

    }

}