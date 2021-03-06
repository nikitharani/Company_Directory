<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=1

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	// $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname);


	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "Database unavailable!";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

    // $_REQUEST used for development / debugging. Remember to cange to $_POST for production
    if ((empty($_REQUEST['id'])) && (!empty($_REQUEST['locName'])))
	{    
		$locName = $_REQUEST['locName'];    
		$locName = ucwords($locName);
		$query = 'INSERT INTO location (name) VALUES("' . $locName . '")';
	}
	else if ((!empty($_REQUEST['id'])) && (!empty($_REQUEST['locName'])))
	{
		$id = $_REQUEST['id'];
		$locName = $_REQUEST['locName'];
		$locName = ucwords($locName);
		$query = "UPDATE location SET name = '$locName' WHERE id = $id";
	}
	else
	{
		$locName = "Hyderabad";
		$locName = ucwords($locName);
		$query = 'INSERT INTO location (name) VALUES("' . $locName . '")';

	}


	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "Failed to update location details!";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "Updated location successfully!";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>