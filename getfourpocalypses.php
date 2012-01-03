<?php

	// Foursquare API library
	require_once("lib/FoursquareAPI.class.php");

	// API keys, etc.
	include_once('lib/apidata.php');

	// Load the Foursquare API library
	$foursquare = new FoursquareAPI($client_key, $client_secret);

	$params = array(
		'll' => $_GET['latitude'] . ',' . $_GET['longitude'],
		'limit' => '50',
		'query' => 'apocalypse',
		'intent' => 'browse',
		'radius' => '40000',
		'v' => '20111221'
	);

	$response = $foursquare->GetPublic('venues/search', $params);

	/* DO THIS:
	$responseAsArray = json_decode($response);
	$responseAsArray = $responseAsArray->response->venues;

	$params = array(
		'll' => $_GET['latitude'] . ',' . $_GET['longitude'],
		'limit' => '50',
		'query' => 'apocalypse',
		'intent' => 'browse',
		'radius' => '40000',
		'v' => '20111221'
	);

	$response2 = $foursquare->GetPublic('venues/search', $params);
	$response2AsArray = json_decode($respose2);

	print "<pre>" . var_export($responseAsArray, true) . "</pre>";
	print "<pre>" . var_export($response2AsArray, true) . "</pre>";
	*/

	print $response;
?>
