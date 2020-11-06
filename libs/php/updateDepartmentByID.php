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
    if ((empty($_REQUEST['id'])) && (!empty($_REQUEST['locID'])) && (!empty($_REQUEST['deptName'])))
	{        
		$locID = $_REQUEST['locID'];
		$deptName = $_REQUEST['deptName'];
		$deptName = ucwords($deptName);

		$query = 'INSERT INTO department (name, locationID) VALUES("' . $deptName . '",' . $locID . ')';
	}
	else if ((!empty($_REQUEST['id'])) && (!empty($_REQUEST['locID'])) && (!empty($_REQUEST['deptName'])))
	{
		$id = $_REQUEST['id'];
		$locID = $_REQUEST['locID'];
		$deptName = $_REQUEST['deptName'];

		$deptName=ucwords($deptName);

		$query = "UPDATE department SET name = '$deptName', locationID='$locID' WHERE id = $id";
	}
	else {
		$id = 13;
		$locID = 6;
		$deptName = "Testing";
		$deptName=ucwords($deptName);
		$query = 'INSERT INTO department (name, locationID) VALUES("' . $deptName . '",' . $locID . ')';
 		
	}
	

	// $query = 'INSERT INTO department (name, locationID) VALUES("' . $_REQUEST['name'] . '",' . $_REQUEST["locationID"] . ')';
	// $query = "INSERT INTO personnel (id, firstName, lastName, jobTitle, email, departmentID) VALUES('$id', '$first_name','$last_name','$job_title','$email_id',$department_id)";
	

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "Failed to update department details!";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "Updated department details succesfully!";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>