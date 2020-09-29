<?php

class AdvRez_Flow_Storage {

	public static function reservation_flow_set_cookie($key, $value, $time = 0) {
	
		$cookie_to_be_saved = base64_encode(json_encode($value));

		if ($time == 0) {
			$time = time() + (60 * 60);
		}
		ob_start();
		//setrawcookie($key, $value, $time, '/');
		$cookie_status = setcookie($key, $cookie_to_be_saved, $time, '/');
		ob_end_flush();

	}

	public static function reservation_flow_delete_cookie($delete_cookie) {

		$reservation_flow = array('search', 'choose', 'choose-sort', 'enhance', 'reserve', 'confirm', 'complete');
		$cookie_found = false;
		foreach ($reservation_flow as $cookie) {

			if ($cookie == $delete_cookie) {
				$cookie_found = true;
			}

			if ($cookie_found) {
			    unset($_COOKIE[$cookie]);
			    setcookie($cookie, null, -1, '/');

			}
		}

	}

	public static function reservation_flow_save($key, $value) {

		$_SESSION[$key] = $value;

		if (isset($_SESSION['now'])) {
			unset($_SESSION['now']);
		}

	}

	public static function reservation_flow_delete($delete_rez_page) {

		$reservation_flow = array('search', 'choose', 'enhance', 'reserve', 'confirm', 'complete');
		$data_found = false;
		foreach ($reservation_flow as $reservation_page) {

			if ($reservation_page == $delete_rez_page) {
				$data_found = true;
			}

			if ($data_found) {
				if (isset($_SESSION[$reservation_page])) {
					unset($_SESSION[$reservation_page]);					
				}
			}
		}
	}

}