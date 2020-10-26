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
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

    // $_REQUEST used for development / debugging. Remember to cange to $_POST for production
    if (empty($_REQUEST['firstName']))
    {        
		$id = 125;
        $first_name = "nikki";
        $last_name = "chikki";
        $job_title = "Developer";
        $email_id = "nikki.bikki@gmail.com";
        $department_id = 2;
    }
    else 
    {
		$id = $_REQUEST['id'];
        $first_name = $_REQUEST['firstName'];
        $last_name = $_REQUEST['lastName'];
        $job_title =$_REQUEST['jobTitle'];
        $email_id = $_REQUEST['email'];
        $department_id = $_REQUEST['deptId'];
    }

	// $query = 'INSERT INTO department (name, locationID) VALUES("' . $_REQUEST['name'] . '",' . $_REQUEST["locationID"] . ')';
	// $query = "INSERT INTO personnel (id, firstName, lastName, jobTitle, email, departmentID) VALUES('$id', '$first_name','$last_name','$job_title','$email_id',$department_id)";
	$query = "UPDATE personnel SET firstName = '$first_name', lastName = '$last_name', jobTitle='$job_title', email='$email_id', departmentID='$department_id' WHERE id = $id";

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>