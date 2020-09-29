<?php

include_once('AdvContactUs_ShortCodeScriptLoader.php');
 
class AdvContactUs_HurricaneWarningShortcode extends AdvContactUs_ShortCodeScriptLoader {

    public $hurricane_warning_html;
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

        $api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

        $this->hurricane_warning_html = '<div class="emergencyLabel">'. $api_url_array['hurricane_text'].'</div>';

        // $this->hurricane_warning_html = '
        //     <div class="emergencyLabel">
        //         <a href="tel:+18007775500" class="emergency">(800) 777-5500</a>&nbsp
        //         <a href="/wp-content/plugins/adv-contact-us/assets/Hurricane - Helpful Tips and Resources (Renters)vHI.pdf" target="_blank" class="emergency" style="text-decoration: underline !important;">(Hurricane Florence Travel Advisory)</a>
        //     </div>';
        return $this->hurricane_warning_html;

    }

}