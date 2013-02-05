<?php

// Foursquare API library
require_once("lib/FoursquareAPI.class.php");

// API keys for this Foursquare app
include_once('lib/apidata.php');

/* Class for making calls to the Foursquare API and other functionality associated
 * with searching for the nearest fourpocalypses */
class fourpocalypse extends apidata {

	// Our Foursquare API object
	private $_foursquare;

	// The fourpocalypses we find
	private $_venues = array();

	function __construct() {

		// Get the object we'll use to make calls for the Foursquare API
		$this->_foursquare = new FoursquareAPI(self::$client_key, self::$client_secret);
	}

	/* Look for fourpocalypses */
	public function findFourpocalypses($latitude = null, $longitude = null) {
		if ($latitude && $longitude) {
			return $this->_venues = $this->searchVenues('apocalypse', $latitude, $longitude);

			// TODO: Add things to $this->_venues only if it pass isDuplicate
			// $this->searchVenues('apocalypse', $latitude, $longitude);
		}
	}

	/* Perform a search for Foursquare venues matching a particular term */
	private function searchVenues($query = '', $latitude = null, $longitude = null) {

		// Parameters to give to the venue search 
		// See https://developer.foursquare.com/docs/venues/search for parameter definitions
		$params = array(
			'll' => "$latitude, $longitude",
			'limit' => '50',
			'query' => $query,
			'intent' => 'browse',
			'radius' => '40000',
			'v' => '20111221'
		);

		// Perform the search
		$response = json_decode($this->_foursquare->GetPublic('venues/search', $params), true);
		return $response['response']['venues'];
	}

	/* Look through the current venue array and make sure there aren't any duplicates */
	private function isDuplicate($name = '') {
		return false;
	}

	private function deep_in_array($value, $array, $case_insensitive = false) {
	  foreach($array as $item)
	  {
		if (is_array($item))
		{
		  $output = deep_in_array($value, $item, $case_insensitive);
		}
		else
		{
		  $output = ($case_insensitive) ? strtolower($item)==$value : $item==$value;
		}
		if ($output)
		{
		  return $output;
		}
	  }
	  return false;
	}
}

?>
