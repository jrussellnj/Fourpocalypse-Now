<?php

	// Fourpocalypse class
	require_once('lib/fourpocalypse.php');

	// Find fourpocalyptic venues in the area
	$fourpoc = new fourpocalypse();
	print json_encode($fourpoc->findFourpocalypses($_GET['latitude'], $_GET['longitude']));

?>
