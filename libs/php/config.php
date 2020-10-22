<?php

	// $cd_host = "127.0.0.1";
	// $cd_port = 3306;
	// $cd_socket = "";
	// $cd_user = ""; // user name
	// $cd_password = ""; // password
	// $cd_dbname = ""; // database name
	
	//myown
	$db_url = getenv('JAWSDB_URL');// heroku_db_url
  
	// check if running on heroku or localmachine
	if ($db_url == false) 
	{
		// get local db credentials
		$db_url = getenv('DIRECTORY_DB_URL', $local_only = TRUE);
	}

	$dbparts = parse_url($db_url);

	$cd_host= $dbparts['host'];
	$cd_user = $dbparts['user'];
	$cd_password = $dbparts['pass'];
	$cd_dbname = ltrim($dbparts['path'],'/');
	// $cd_port = $dbparts['port'];
	// $cd_socket = "";

?>