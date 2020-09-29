<?php

    include_once('AdvAwards_ShortCodeScriptLoader.php');
    include_once('AdvAwards_Helper.php');
 
class AdvAwards_ActivityShortcode extends AdvAwards_ShortCodeScriptLoader {

    public $awards_activity_html;
    static $addedAlready = false;
 
    /* 
    * Load scripts and styles
    */
    public function addScript() {
        if (!self::$addedAlready) {
            self::$addedAlready = true;
            wp_enqueue_style('awards-header', plugins_url('css/awards-header.css', __FILE__), false,'1.1','all');
            wp_enqueue_style('awards-activity', plugins_url('css/awards-activity.css', __FILE__), false,'1.1','all');
            wp_enqueue_script('awards-javascript', plugins_url('js/adv_awards.js', __FILE__), array('jquery'), '1.0', true);
         }
    }

    public function handleShortcode($atts) {

      if(isset($_SESSION['adv_login'])) { 
        if(isset($_SESSION['adv_login']->memberNumber))
          $member_number = $_SESSION['adv_login']->memberNumber;
      }

      if(!isset($member_number)) {
        $URL="/expressway/benefits";
        echo '<META HTTP-EQUIV="refresh" content="0;URL=' . $URL . '">';
        return;
      }
      else 
      {
          $available_awards = $_SESSION['available_awards'];
          $awards_history = $_SESSION['awards_history'];
      }

$this->awards_activity_html = '<div id="main">

  <div class="container-fluid" id="history">';
  if (isset($member_number)) {
        $this->awards_activity_html .= '<div class="visible-xs header_no_desktop" style="margin-bottom: 4%;">
        <span style="padding-right: 1%; padding-left: 2%;"><a class="awards" href="/expressway">Rewards</a>
        </span>
        <div class="header_division_tablets">
        <span>
            <a class="activity" href="/expressway/activity">ACTIVITY</a>
        </span></div>
        <div class="header_division_tablets">                
        <span>
           <a class="benefits" href="/expressway/benefits">BENEFITS</a>
        </span></div>
        <div class="header_division_tablets">
        <span>
            <a class="faq" href="/expressway/faq">FAQS</a>
        </span></div></div>';
    }
    $this->awards_activity_html .= '<div class="row history-header">
      <div class="col-sm-8"><h1>Available Rewards</h1></div>
      <div class="col-sm-4 text-right history-header-instructions hidden-xs">
      <a href="#rewardshistory" class="awards_history_click">Click here for Reward History</a>
    </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="ng-isolate-scope">
          <div class="rewardcode">
            <div class="hidden-xs">
              <div id="DataTables_Table_0_wrapper" class="dataTables_wrapper no-footer">
                <table class="table table-condensed table-curved table-striped ng-isolate-scope dataTable no-footer" style="display: table;" id="DataTables_Table_0" role="grid">
                  <thead>
                    <tr role="row">
                      <th class="sorting_desc" style="width: 19%;">Date Issued</th>
                      <th class="sorting" style="width: 5%;">&nbsp;</th>
                      <th class="sorting" style="width: 19%;">Reward Type</th>
                      <th class="sorting" style="width: 19%;">Code</th>
                      <th class="sorting" style="width: 19%;">Expiration Date</th>
                      <th class="sorting" style="width: 19%;">Status</th>
                    </tr>';
                      if (!isset($available_awards['d'][0]['AwardType'])) {
                    $this->awards_activity_html .= '<tr role="row">
                      <td colspan="7" class="text-center" rowspan="1">No rewards found</td>
                    </tr><tr class="ng-hide" role="row">
                      <td colspan="7" class="text-center" rowspan="1"><i class="fa fa-refresh fa-spin"></i> Loading rewards</td>
                    </tr>
                  </thead>';
                    }
                    else {
                    for ($x = 0; $x < count($available_awards['d']); $x++) {                
                  $this->awards_activity_html .= '
                  </thead><tbody>
                    <tr class="odd" role="row">
                      <td class="ng-binding sorting_1">'. $available_awards['d'][$x]['IssuedOn'] .'</td>
                      <td>
                        <img class="award-icons" src="/wp-content/plugins/adv-awards/assets/'.$available_awards['d'][$x]['AwardType'].'.png">
                      </td>
                      <td>
                        <a class="ng-binding">'. $available_awards['d'][$x]['AwardType'] .'</a>
                      </td>
                      <td class="ng-binding">'. $available_awards['d'][$x]['AwardCode'] .'</td>';
                        if(isset($available_awards['d'][$x]['ExpiresOn']) || !empty($available_awards['d'][$x]['ExpiresOn'])) {
                        $this->awards_activity_html .= '<td class="ng-binding">'.$available_awards['d'][$x]['ExpiresOn'].'</td>';
                      }
                      else {
                        $this->awards_activity_html .= '<td class="ng-binding">N/A</td>'; 
                      }
                     $this->awards_activity_html .= '
                      <td>
                        <button class="btn btn-default redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'. $available_awards['d'][$x]['AwardCode'] .'">REDEEM NOW</button>
                      </td>
                    </tr>
                  </tbody>';
                }
              }
                $this->awards_activity_html .= '</table>
              </div>
            </div>';
            for ($x = 0; $x < count($available_awards['d']); $x++)  {
            if (isset($available_awards['d'][$x]['AwardType'])) {
            $this->awards_activity_html .= '
              <div class="visible-xs">
              <div class="panel reward-box text-white text-center bg-blue-dark">
                <div class="panel-body">
                  <div><img  width="90" height="90" class="award-icons" src="/wp-content/plugins/adv-awards/assets/mobile-'.$available_awards['d'][$x]['AwardType'].'.png"></div>
                  <h3 class="text-blue-light ng-binding">'. $available_awards['d'][$x]['AwardType'] .'</h3>
                  <p class="ng-binding">
                    <span class="small">Redemption Code:</span><br>
                    '. $available_awards['d'][$x]['AwardCode'] .'<br>
                  </p>';
                    if(isset($available_awards['d'][$x]['ExpiresOn']) || !empty($available_awards['d'][$x]['ExpiresOn'])) {
                    $this->awards_activity_html .= '<p class="small ng-binding">
                      Expires: '.$available_awards['d'][$x]['ExpiresOn'].'
                    </p>';
                  }
                  else {
                    $this->awards_activity_html .= '<p class="small ng-binding">
                    Expires: N/A
                    </p>'; 
                  }
                   $this->awards_activity_html .= '
                  <p><a class="btn btn-default redeem_now find-a-car-menu-item" onclick="goToAnchorReserve();" value="'. $available_awards['d'][$x]['AwardCode'] .'">Redeem Now</a></p>
                </div>
              </div>
            </div>';
          }
        else {
          $this->awards_activity_html .= '<div class="visible-xs"><div class="awards_header_bottom_line"></div><div class="text-center">No rewards found</div></div>';
        }
      }
            $this->awards_activity_html .= '
          </div>
        </div>
      </div>
    </div>
    <div class="row history-header">
      <div class="col-sm-8"><h1>Reward History</h1></div>
    </div>
    <div class="row">
    <span id="rewardshistory"></span>
      <div class="col-md-12" style="margin-bottom: 1%;">
        <div class="ng-isolate-scope">
            <div class="rewardcode">
              <div class="hidden-xs">
                <div id="DataTables_Table_1_wrapper" class="dataTables_wrapper no-footer">
                  <table class="table table-condensed table-curved table-striped ng-isolate-scope dataTable no-footer" style="display: table;" id="DataTables_Table_1" role="grid">
                    <thead>
                      <tr role="row">
                        <th class="sorting_desc" style="width: 19%;">Date Issued</th>
                        <th class="sorting" style="width: 5%;">&nbsp;</th>
                        <th class="sorting" style="width: 19%;">Reward Type</th>
                        <th class="sorting" style="width: 19%;">Code</th>
                        <th class="sorting" style="width: 19%">Expiration Date</th>
                        <th class="sorting" style="width: 19%;">Status</th>
                      </tr>';
                       if (!isset($awards_history['d'][0]['AwardType'])) {
                      $this->awards_activity_html .= '
                      <tr role="row">
                        <td colspan="7" class="text-center" rowspan="1">No rewards found</td>
                      </tr><tr class="ng-hide" role="row">
                      <td colspan="7" class="text-center" rowspan="1"><i class="fa fa-refresh fa-spin"></i> Loading rewards</td>
                    </tr>
                  </thead>';
                      }
                      else{
                      
                        for ($x = 0; $x < count($awards_history['d']); $x++) {                  
                    $this->awards_activity_html .= '
                  </thead>
                    <tbody>
                      <tr class="odd" role="row">
                        <td class="ng-binding sorting_1">'.$awards_history['d'][$x]['IssuedOn'].'</td>
                        <td><img class="award-icons" src="/wp-content/plugins/adv-awards/assets/'.$awards_history['d'][$x]['AwardType'].'.png"></td>
                        <td>
                          <a class="ng-binding">'.$awards_history['d'][$x]['AwardType'].'</a>
                        </td>
                        <td class="ng-binding">'.$awards_history['d'][$x]['AwardCode'].'</td>';
                        if(isset($awards_history['d'][$x]['ExpiresOn']) || !empty($awards_history['d'][$x]['ExpiresOn'])) {
                        $this->awards_activity_html .= '<td class="ng-binding">'.$awards_history['d'][$x]['ExpiresOn'].'</td>';
                      }
                      else {
                        $this->awards_activity_html .= '<td class="ng-binding">N/A</td>'; 
                      }
                      if($awards_history['d'][$x]['RedeeemdByMember'] == false){
                       $this->awards_activity_html .= '
                        <td>
                          <span class="ng-binding">Expired</span>
                        </td>';
                      }
                      else {
                        $this->awards_activity_html .= '
                        <td>
                          <span class="ng-binding">Used</span>
                        </td>';
                      }
                      $this->awards_activity_html .= '</tr>
                    </tbody>';
                  }
                }
                  $this->awards_activity_html .= '</table>
                </div>
                <h3 class="dt-loading" style="display: none;">Loading...</h3>
              </div>';
            for ($x = 0; $x < count($awards_history['d']); $x++) {
              if (isset($awards_history['d'][$x]['AwardType'])) {
              $this->awards_activity_html .= '
              <div class="visible-xs">
                <div class="panel reward-box text-white text-center bg-blue-dark">
                  <div class="panel-body">
                    <div><img width="90" height="90" class="award-icons" src="/wp-content/plugins/adv-awards/assets/mobile-'.$awards_history['d'][$x]['AwardType'].'.png"> </div>
                    <h3 class="text-blue-light ng-binding">'.$awards_history['d'][$x]['AwardType'].'</h3>
                    <p class="ng-binding">
                      <span class="small">Redemption Code:</span><br>
                      '.$awards_history['d'][$x]['AwardCode'].'<br>
                    </p>';
                    if(isset($awards_history['d'][$x]['ExpiresOn']) || !empty($awards_history['d'][$x]['ExpiresOn'])) {
                    $this->awards_activity_html .= '<p class="small ng-binding">
                      Expires: '.$awards_history['d'][$x]['ExpiresOn'].'
                    </p>';
                  }
                  else {
                    $this->awards_activity_html .= '<p class="small ng-binding">
                    Expires: N/A
                    </p>'; 
                  }
                   $this->awards_activity_html .= '<p></p>
                  </div>
                </div>
              </div>';
            }
          else {
            $this->awards_activity_html .= '<div class="visible-xs"><div class="awards_header_bottom_line"></div><div class="text-center">No rewards found</div></div>';
          }
        }
              $this->awards_activity_html .= '
            </div>
        </div>
    </div>
  </div>
</div>';
    return $this->awards_activity_html;
    }

}