<?php

class AdvRez_TSD_Reservations {

	public $response_array;
	public $RentalLocation;
	public $RateProduct;
	public $NoRatesFound;

	public function __construct($response_array) {

		$this->response_array = $response_array;

	}

	public function loadReservations() {

		$this->getRentalLocation();
		$this->getRateProduct();
		$this->getNoRatesFound();

	}

	public function getRentalLocation() {
		$this->RentalLocation = $this->response_array['RentalLocation'];
	}

	public function getRateProduct() {
		$this->RateProduct = $this->response_array['RateProduct'];
	}

	public function getNoRatesFound() {
		$this->NoRatesFound = $this->response_array['NoRatesFound'];
	}
}
