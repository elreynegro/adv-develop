<?php

require_once( adv_plugin_dir('aez_oauth2') . '/AEZ_Oauth2_Plugin.php');
// Add filter to diplay login status
add_filter( 'wp_nav_menu_items', 'dispaly_login_state_menu_item', 10, 2 );
// add_filter( 'wp_nav_menu_items', 'update_persuade_SSO_menu_item', 10, 2 );

function dispaly_login_state_menu_item ( $items, $args ) {
    if ($args->theme_location == 'secondary') {
// error_log('$items: ' . print_r($items, true));
    	$login_state_display = getLoggedInState();
      	$items .= $login_state_display;
    }

    if ($args->theme_location == 'tertiary') {

		$api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

		$pursuade_url = $api_url_array['pursuade_url'];

    	$user_array = Adv_login_Helper::getAdvFullUser();

// error_log('items: ' . print_r($items, true));
// error_log('args: ' . print_r($args, true));

//$search_string = '<a href="https://awards.advantage.com" class="responsive-menu-item-link">Advantage Awards</a>';

$search_string = '<a href="/awards" class="responsive-menu-item-link">Advantage Awards</a>';

// error_log('strpos(items, search_string): ' . print_r(strpos($items, $search_string), true));
// str_replace(search, replace, subject)
		$items = str_replace($search_string, 
			'<form class="advantage-awards-link-form" action="/awards" method="post">
									<input type="hidden" name="membernumber" value="' . $user_array['loyalty_membernumber'] . '" />
									<input type="hidden" name="id" value="' . $user_array['loyalty_id'] . '" />
									<input type="hidden" name="hash" value="' . $user_array['loyalty_hash'] . '" />
									<input class="responsive-menu-item-sso" style="color: white; text-transform: none; letter-spacing: 0; padding: 0 5%; border-bottom: 1px solid #069; line-height: 40px;     text-align: left; width: 100%;" type="submit" value="Advantage Awards" />
								</form>', 
			$items);

		// $items = str_replace($search_string, 
		// 	'<form class="advantage-awards-link-form" action="' . $api_url_array['pursuade_url'] . '/sso.php" method="post">
		// 							<input type="hidden" name="membernumber" value="' . $user_array['loyalty_membernumber'] . '" />
		// 							<input type="hidden" name="id" value="' . $user_array['loyalty_id'] . '" />
		// 							<input type="hidden" name="hash" value="' . $user_array['loyalty_hash'] . '" />
		// 							<input class="responsive-menu-item-sso" style="color: white; text-transform: none; letter-spacing: 0; padding: 0 5%; border-bottom: 1px solid #069; line-height: 40px;     text-align: left; width: 100%;" type="submit" value="Advantage Awards" />
		// 						</form>', 
		// 	$items);


// error_log('items: ' . print_r($items, true));

		return $items;
    }

    if ($args->theme_location == 'primary') {

    	// $login_state_display = getLoggedInState();
		$api_url_array = AEZ_Oauth2_Plugin::getApiUrl();

		$pursuade_url = $api_url_array['pursuade_url'];

    	$user_array = Adv_login_Helper::getAdvFullUser();
// error_log('  dispaly_login_state_menu_item  $user_array: ' . print_r($user_array, true));

      	$items .= '<li id="menu-item-97" class="down-carat menu-item menu-item-type-custom menu-item-object-custom menu-item-97">
						<a  href="/expressway/benefits/"  class="advantage-awards-navigation">Expressway</a>
						<button class="dropdown-toggle" aria-expanded="false"><span class="screen-reader-text">expand child menu</span></button>
						<ul class="sub-menu">
							<li class="menu-item menu-item-type-post_type menu-item-object-page">
								<form class="advantage-awards-link-form" action="/expressway" method="post">
									<input type="hidden" name="membernumber" value="' . $user_array['loyalty_membernumber'] . '" />
									<input type="hidden" name="id" value="' . $user_array['loyalty_id'] . '" />
									<input type="hidden" name="hash" value="' . $user_array['loyalty_hash'] . '" />
									<input type="submit" value="EXPRESSWAY PROGRAM" />
								</form>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-page">
								<a href="/corporate-advantage">Corporate Advantage</a>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-page">
								<a href="/book-friendly">Book Friendly</a>
							</li>
						</ul>
      				</li>';

      // 	items .= '<li id="menu-item-97" class="down-carat menu-item menu-item-type-custom menu-item-object-custom menu-item-97">
						// <a  href="javascript:void(0);"  class="advantage-awards-navigation">Awards</a>
						// <button class="dropdown-toggle" aria-expanded="false"><span class="screen-reader-text">expand child menu</span></button>
						// <ul class="sub-menu">
						// 	<li class="menu-item menu-item-type-post_type menu-item-object-page">
						// 		<form class="advantage-awards-link-form" action="' . $api_url_array['pursuade_url'] . '/sso.php" method="post">
						// 			<input type="hidden" name="membernumber" value="' . $user_array['loyalty_membernumber'] . '" />
						// 			<input type="hidden" name="id" value="' . $user_array['loyalty_id'] . '" />
						// 			<input type="hidden" name="hash" value="' . $user_array['loyalty_hash'] . '" />
						// 			<input type="submit" value="Advantage Awards" />
						// 		</form>
						// 	</li>
						// 	<li class="menu-item menu-item-type-post_type menu-item-object-page">
						// 		<a href="/corporate-advantage">Corporate Advantage</a>
						// 	</li>
						// 	<li class="menu-item menu-item-type-post_type menu-item-object-page">
						// 		<a href="/book-friendly">Book Friendly</a>
						// 	</li>
						// </ul>
      // 				</li>';
    }
    return $items;
}
// function update_persuade_SSO_menu_item ( $items, $args ) {

// 	if ($args->theme_location == 'primary') {

		// <form action="<%=System.Configuration.ConfigurationManager.AppSettings("irSSO_URL")%>" method="post">
		// <input type='hidden' name='membernumber' value="<%=Session("irMemberNumber")%>" />
		// <input type='hidden' name='id' value="<%=Session("irUserGUID")%>" />
		// <input type="hidden" name="hash" value="<%=Session("ssoHash")%>" />
		// <input type="submit" value="" style="visibility:hidden;" />
		// </form>

// 	}
// }
function getLoggedInState() {
 // error_log('getLoggedInStatehere 1');
 // error_log('getLoggedInStatehere 1');
 // error_log('getLoggedInStatehere 1');
 // error_log('getLoggedInStatehere 1');
 // error_log('getLoggedInStatehere 1');
 // error_log('getLoggedInStatehere 1');
 // error_log('getLoggedInStatehere 1');

	if (! isset($_SESSION['adv_login']->access_token)) {
		return buildMenuItem();
	}
 // error_log('getLoggedInStatehere 2');
// 	$loggedInCookie = getLoggedInCookie();
//  error_log('here 1');
// 	if (strlen(trim($loggedInCookie)) == 0) {
// // error_log('here 2');
// 		return buildMenuItem();
// 	}
// error_log('here 3');

	// $loggedInArray = validateLoggedInCookie($_SESSION['adv_login']->access_token);
// error_log('here 4');

// 	if (count($loggedInArray) == 0) {
// // error_log('here 5');
// 		return buildMenuItem();
// 	}
// // error_log('here 6');
// Adv_login_Helper::err_log($loggedInArray);

 // error_log('getLoggedInStatehere 3');

	//if (isset($_SESSION['adv_login']->memberNumber)) {
 // error_log('getLoggedInStatehere 4');
	    //$member_array = Adv_login_Helper::getUserProfile($_SESSION['adv_login']->memberNumber);
// error_log('member_array: ' . print_r($member_array,true));
		// $_SESSION['adv_login']
	//}

	if (isset($_SESSION['adv_login']->user['FirstName'])) { 
		$firstname = $_SESSION['adv_login']->user['FirstName'];
	}

	// return buildMenuItem('scott');

	return buildMenuItem('Hi ' . $firstname);

	// return '<li id="menu-item-300" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-300"><a href="/login">Log in <i class="fa fa-chevron-right"></i></a></li>';
}

function buildMenuItem($loggedInName = '') {

	$menu_item_beginning = '<li id="menu-item-300" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-300">';
	$menu_item_endingning = '</li>';
// error_log('loggedInName: ' . $loggedInName);
	if (strlen(trim($loggedInName)) == 0) {

		return $menu_item_beginning . '<a id="signup_menu" href="javascript:void(0);">Sign Up </i></a>' . $menu_item_endingning .
			$menu_item_beginning . '<a id="login_menu" href="javascript:void(0);"> Log in <i class="fa fa-chevron-right"></i></a>' . $menu_item_endingning;
	}
// $pagename = get_query_var('pagename');
// error_log('pagename: ' . print_r($pagename, true));
// if ($pagename == 'profile') {
// error_log('pagename is profile');
// }
	return $menu_item_beginning . '<select id="logged_in_ddl" class="text-uppercase logged_in" name="logged_in" style="border: none; font-family: Montserrat,Arial,sans-serif !important; font-size: 1em; max-width: fit-content; margin-top: 3.5%;">
				    <option value="home" class="logged_select_options" selected>'. $loggedInName  .'</option>
				    <option value="profile" class="logged_select_options">'. 'Profile'  .'</option>
				    <option value="logout" class="logged_select_options">'. 'Logout'  .'</option>
	            </select>' .$menu_item_endingning;

}

function getLoggedInCookie() {

// error_log('here getLoggedInCookie  1');

	if (! isset($_COOKIE['adv_login'])) {
// error_log('here getLoggedInCookie  2');
		return '';
	} 
// error_log('here getLoggedInCookie  3');
	return $_COOKIE['adv_login'];

}

function validateLoggedInCookie($loggedInCookie, $login_cookie_name = 'adv_login') {
    $get_wp_config_settings_array = AEZ_Oauth2_Plugin::GetWPConfigSettings();
	$api_url_array = AEZ_Oauth2_Plugin::getApiUrl();
// error_log('loggedInCookie ----: ' . print_r($loggedInCookie, true));
// error_log('_COOKIE: ' . print_r($_COOKIE, true));
// error_log(' ---- login_cookie_name: ' . print_r($login_cookie_name, true));


    // header("Accept: application/json");
    // header("Authorization: Bearer " . $loggedInCookie);

    $http = new GuzzleHttp\Client;
    
// Adv_login_Helper::err_log(" validateLoggedInCookie Above Try", __FUNCTION__, __LINE__);
    try {

        $response = $http->get( $get_wp_config_settings_array['full_api_url']  . '/user', [
        	'headers' => [
			    'Accept' => 'application/json',
			    'Authorization' => 'Bearer ' . $loggedInCookie,
				'services_url' => $get_wp_config_settings_array['services_url'] ,
				'logging_url' => $get_wp_config_settings_array['logging_url'] ,
        	]
        ] );

//         $client->request('GET', '/get', [
//     'headers' => [
//         'User-Agent' => 'testing/1.0',
//         'Accept'     => 'application/json',
//         'X-Foo'      => ['Bar', 'Baz']
//     ]
// ]);
    } catch (Exception $e) {

// error_log('bad deal 444: ' . print_r($e->getMessage(), true));
        echo json_encode('{error: "6 Getting User Something went wrong. Please try your search another time."}');
        // die();            
    }
// Adv_login_Helper::err_log(" validateLoggedInCookie After Call", __FUNCTION__, __LINE__);
// error_log("After Call");

	if (empty($response)) {
		$response_arrays = array();
	} else {
		
	    $response_contents = $response->getBody()->getContents();
	    $response_arrays = json_decode($response_contents, true);
	}
// error_log("response_arrays: " . print_r($response_arrays, true));
// error_log(' +++++++++ login_cookie_name: ' . print_r($login_cookie_name, true));

	if (isset($response_arrays['name'])) {
		if (strlen(trim($response_arrays['name'])) > 0) {
			return $response_arrays;
		} else {
		    unset($_COOKIE[$login_cookie_name]);
		    // setcookie($login_cookie_name, null, -1, '/');

			return ;
		}
	} else {
	    unset($_COOKIE[$login_cookie_name]);
	    // setcookie($login_cookie_name, null, -1, '/');
		return ;
	}

}