<?php


    include_once('AdvLandingPages_ShortCodeScriptLoader.php');

class AdvLandingPages_CustomerSurvey_Shortcode extends AdvLandingPages_ShortCodeScriptLoader {

    public $choose_list_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            
            // Styles to be loaded            
            wp_register_style( 'landing-page-survey', plugin_dir_url( __FILE__) . 'css/aez-landing-page-customer-survey.css' );

            $styles = array('landing-page-survey');
            wp_enqueue_style($styles);
            
            // Scripts to be loaded
           wp_register_script( 'moment', get_stylesheet_directory_uri() . '/vendor/moment-2.15.2/min/moment.min.js', array(), null, true );
           wp_register_script( 'survey', plugins_url('adv-landing-pages/js/survey.js'), array('jquery'), null, true );

           $scripts = array('jquery', 'moment', 'survey');
           wp_enqueue_script($scripts);           
        }
    }

        
        
    public function handleShortcode($atts) {
        
        $guid = $_GET['guid'];
        $_SESSION['survey_guid'] = $guid;
        $response = Adv_Landingpage_Helper::getSurveyQuestions($guid);
       
        if($response['Result']['Questions'] != '') {
            $questions = $response['Result']['Questions'];
        
            $this->survey_html = '<article class="page type-page status-publish survey_container_main">
                <div class="aez-full-width-content">

                <div class="">
                    <div class="aez-title-subtitle-container">
                        <h1>Tell us what you think!</h1>
                    </div>

                    <form id="survey-form" class="aez-form">
                        <div class="aez-form-block"><ul class="error-messages error_message_survey"></ul></div>';

                        if(is_array($questions) && count($questions) > 0) {
                            
                            $i = 0;
                            $n = 0;
                            foreach($questions as $row) {
                                //echo '<pre>';
                                //print_r($row);
                                $n++;
                                $this->survey_html .= '  
                                        <div class="aez-form-block Q_block">
                                        <h3 class="aez-form-block__heading qsurvey" q_id="'.$row['Id'].'">'.$n.'. '.$row['Question'].'</h3>';
                                        
                                        if($row['Instructions'] != '') {
                                            $this->survey_html .= '<label class="info">'.$row['Instructions'].'</label><br>';
                                        }
                                        
                                        $q_type =  $row['QuestionType'];
                                        
                                        //For radio button
                                        if($q_type['Type'] == 'Boolean' || $q_type['Type'] == 'BooleanNA') {
                                            
                                            $this->survey_html .= '<div class="survey_opt_container">';

                                            foreach($q_type['Options'] as $key=> $option) { 
                                            $i++;    
                                            $this->survey_html .= '
                                                        <input id="opt_'.$i.'" class="type_1 survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_'.$row['Id'].'" value="'.$option['Id'].'"> 
                                                        <label class="aez-form-item__label" for="opt_'.$i.'">'.$option['Description'].'</label>
                                                    ';
                                            }
                                            $this->survey_html .= '</div>';
                                        }     
                                        
                                        if(strstr($q_type['Type'], 'Rating')) {
                                            $len = substr($q_type['Type'], 6);                                            
                                            for($a=1;$a<=$len;$a++) { 
                                            $i++;    
                                            $this->survey_html .= '
                                                        <input id="opt_'.$i.'" class="type_2 survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_'.$row['Id'].'" value="'.$a.'"> 
                                                        <label class="aez-form-item__label" for="opt_'.$i.'">'.$a.'</label>
                                                    ';
                                            }
                                        }
                                        
                                        //For remark
                                        if($q_type['Type'] == 'Comments') {
                                            
                                            $this->survey_html .= '  
                                                        <textarea class="type_3 remark_field aez-form-item1" name="ans_'.$row['Id'].'" cols="30" rows="2" style=" white-space: pre;"></textarea>
                                                        <span id="remainingChars"></span>
                                                   ';
                                        }                                          
                                $this->survey_html .= '</div>';
                            }
                            
                        }

                     $this->survey_html .=   '
                         
                       <!-- <div class="aez-form-block Q_block">
                            <h3 class="aez-form-block__heading qsurvey" q_id="1">1. Was the customer service agent professional and helpful ?</h3>
                            <div class="survey_opt_container">
                                <input id="opt_1" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_1" value="1"> 
                                <label class="aez-form-item__label" for="opt_1">Yes</label>
                                <input id="opt_2" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_1" value="0"> 
                                <label class="aez-form-item__label" for="opt_2">No</label>
                            </div>
                        </div>
                        <div class="aez-form-block Q_block">
                            <h3 class="aez-form-block__heading qsurvey" q_id="2">2. Did the customer service agent handled your concerns appropriately and provided a resolution to your case ?</h3>
                            <div class="survey_opt_container">
                                <input id="opt_3" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_2" value="1"> 
                                <label class="aez-form-item__label" for="opt_3">Yes</label>
                                <input id="opt_4" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_2" value="0"> 
                                <label class="aez-form-item__label" for="opt_4">No</label>
                            </div>
                        </div>                
                        <div class="aez-form-block Q_block">
                            <h3 class="aez-form-block__heading qsurvey" q_id="3">3. Rate the overall service provided by the customer service agent on a scale of 1-5, 1 being the lowest, 5 being the highest.</h3>
                            <div class="survey_opt_container">
                                <input id="opt_5" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_3" value="1"> 
                                <label class="aez-form-item__label" for="opt_5">1</label>
                                <input id="opt_6" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_3" value="2"> 
                                <label class="aez-form-item__label" for="opt_6">2</label>
                                <input id="opt_7" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_3" value="3"> 
                                <label class="aez-form-item__label" for="opt_7">3</label>
                                <input id="opt_8" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_3" value="4"> 
                                <label class="aez-form-item__label" for="opt_8">4</label>
                                <input id="opt_9" class="survey_form_options aez-form-item__oradio aez-form-item__radio1" type="radio" name="ans_3" value="5"> 
                                <label class="aez-form-item__label" for="opt_9">5</label>

                            </div>
                        </div> 
                        <div class="aez-form-block Q_block">
                            <h3 class="aez-form-block__heading qsurvey qsurvey_cmt" q_id="4">4. Remark (Optional) </h3>
                            <label class="info">Please use this space to provide further feedback of your experience with our customer service agent</label>
                            <textarea class="remark_field aez-form-item1" name="ans_4" cols="30" rows="2"></textarea>
                            <span id="remainingChars"></span>
                        </div>-->
                        <div class="aez-form-block">
                            <input id="form_button" style="margin:0 auto; width:200px;" type="submit" class="aez-btn aez-btn--filled-blue" value="Submit">
                        </div>

                    </form>

                </div>
                    <!--<div class="section_right">
                    <img class="aez-survey-page-img" src="'. plugin_dir_url( __FILE__) .'img/hp-app-silver-cell-phone.png">
                    </div> -->                   
                </div>
                </article>';
        }
                     
        if($response['Result']['ErrorCode'] == 2000) {
            $URL="/404";
            echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
            return;     
        }   
        
        if($response['Result']['ErrorCode'] == 1000) {
            $URL="/404";
            echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
            return;      
        } 
        return $this->survey_html;

    }

}