<?php

/** Execute an insert statement **/
function insert($statement){

  session_start();

  // Include google client library for authentication
  set_include_path(get_include_path() . PATH_SEPARATOR . '/Users/zhiyuanzheng/Documents/RainGarden/GAuth/src');
  require_once realpath(dirname(__FILE__).'/GAuth/src/Google/autoload.php');

  $scopes = array("https://www.googleapis.com/auth/fusiontables");

  $client_email = "292122509653-4aogjq3gd4qnv1ac4hbu9ibqdp40t3iu@developer.gserviceaccount.com";
  $private_key = file_get_contents('Rain Facility Mapper-9d8f8a19eaa3.p12');

  $credentials = new Google_Auth_AssertionCredentials(
    $client_email,
    $scopes,
    $private_key
  );


  $client = new Google_Client();
  $client->setAssertionCredentials($credentials);

  if (isset($_SESSION['service_token'])) {
    $client->setAccessToken($_SESSION['service_token']);
  }

  if ($client->getAuth()->isAccessTokenExpired()) {
    $client->getAuth()->refreshTokenWithAssertion();
  }

  $_SESSION['service_token'] = $client->getAccessToken();

  $fusiontablesService = new Google_Service_Fusiontables($client);

  $query = $fusiontablesService->query;

  $response = $query->sql($statement);

}

?>
