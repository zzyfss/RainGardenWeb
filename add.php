<?php

include "insert.php";
include "upload.php";

// ini_set('display_errors', true);

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    die("Request rejected.");
}



// Fields are required
$req_fds = array("email", "name", "date", "type");

// Fields correspond to a type of rain facility
$type_fds = array(
  "rag" => array("rag-area", "rag-depth"),
  "rab" => array("rab-size")
);

// Optional fields
$opt_fds = array("image-url", "comments", "lat","lng");

// Fields which are numbers
$num_fds = array("rag-area", "rag-depth", "rab-size");


// Verbal names used in error messages
$verb_names = array("email" =>"Email address",
                    "name" => "Rain facility name",
                    "type" => "Rain facility type",
                    "date" => "Installation date",
                    "rag-area" =>"Surface area",
                    "rag-depth" => "Depth",
                    "rab-size" => "Rain barrel size");

// Column names in 'Rain Facility Database' table
$col_names = array("ID" => "ID",
                  "'IP address'" => "IP",
                  "Email" => "email",
                    "Name" => "name",
                    "Type" => "type",
                   "Location" => "location",
                   "'Installation date'" => "date",
                   "'Surface area'" => "rag-area",
                   "Depth" => "rag-depth",
                   "Capacity" => "capacity",
                   "Size" => "rab-size",
                   "Image" => "image-url",
                   "Comments" => "comments");

// If a column is number
$is_num = array("Size" => true,
                "Depth" => true,
                "Capacity" => true,
                "Surface area" => true);

/* ID of 'Rain Facility Database' table */
$table_id = "1lPPyZcuGwX3p0tbDF_YdIGjRew5KSzqkhd1WAq4j";

/* Error messages */
$errors = "";

date_default_timezone_set("America/Indiana/Indianapolis");


/** Check if any required field is missing **/
foreach($req_fds as $fd){
  if(empty($_POST[$fd])){
    $error = "<p>".$verb_names[$fd]." is required. </p>";
    $errors .= $error;
  }
  else{
    $value = sanitize($_POST[$fd]);
    $values[$fd] = $value;
  }
}

$type=$values["type"];
foreach($type_fds[$type] as $fd){
  if(empty($_POST[$fd])){
    $error = "<p>".$verb_names[$fd]." is required. </p>";
    $errors .= $error;
  }
  else{
    $value = sanitize($_POST[$fd]);
    $values[$fd] = $value;
  }
}

/** Sanitize data in optional fields */
foreach($opt_fds as $fd){
  if(!empty($_POST[$fd])){
    $values[$fd] = sanitize($_POST[$fd]);
  }
}

/** Validate lat lng **/
$latlngError = false;
if(isset($values["lat"])){
  $lat = $values["lat"];
  if(!filter_var($lat, FILTER_VALIDATE_FLOAT)
     || $lat < -85.1 || $lat > 85.1 ){
    $latlngError = true;
  }
}
else{
  $latlngError = true;
}

if(isset($values["lng"])){
  $lng = $values["lng"];
  if(!filter_var($lng, FILTER_VALIDATE_FLOAT)
     || $lng < -180 || $lng > 180){
    $latlngError = true;
  }
}
else {
  $latlngError = true;
}

if($latlngError === true ){
  $errors .= "<p>Sorry, there was an error obtaining geological information.</p>";
}
else {
  // Add location to $values
  $values["location"] = $values["lat"] . "," . $values["lng"];
}


// check if name only contains letters and whitespace
if(isset($values["name"])){
  if (!preg_match("/^[a-zA-Z0-9 ]{3,18}$/", $values["name"])) {
    $nameErr = "<p>The facility name has to be an alphanumeric value between 3-18 characters
                                                         (Spaces are allowed)</p>";
    $errors .= $nameErr;
  }
}

// Validate email address
if(isset($values["email"])){
  if (!filter_var($values["email"], FILTER_VALIDATE_EMAIL)) {
    $errors .= "<p>Invalid email format.</p>";
  }
}

// Validate date yyyy-mm-dd
if(isset($values["date"])){
  $date_arr  = explode('-', $values["date"]);
  if (count($date_arr) == 3) {
    if (!checkdate($date_arr[1], $date_arr[2], $date_arr[0])) {
      // Invalid date ...
      $errors .="<p>Invalid installation date.</p>";
    }
  }
  else{
    $errors .= "<p>Invalid installation date.</p>";
  }
}

// Validate image url
if(isset($values["image-url"])){
  // Check if the url is valid.
  if(!filter_var($values["image-url"], FILTER_VALIDATE_URL)){
    $errors .= "<p>Invalid image URL.</p>";
  }
  else if(getimagesize($values["image-url"]) === false){
    $errors .= "<p>Invalid image URL.</p>";
  }
}

// Validate length of the comments
if(isset($values["comments"])){
  if(strlen($values["comments"]) > 200){
    $errors .= "<p>Comments are limited to 200 characters </p>";
  }
  else{
    // Add backslash to escape \" or \' in SQL query
    $values["comments"] = addslashes($values["comments"]);
  }
}

// Validate number fields (0,999999);
foreach($num_fds as $fd){
  if(isset($values[$fd])){
    $num = $values[$fd];
    if(!filter_var($num, FILTER_VALIDATE_FLOAT) || $num < 0 || $num>999999){
      $errors .="<p>" . $verb_names[$fd] . " is invalid.</p>";
    }
  }
}

/* Generate an id for this post.
  ID will be used as row-id as well as the name of uploaded image
*/
$values["ID"] = str_replace(" ","_", $values["name"]) . date("y_m_d_h_i_s");

// Validate image file if any
$check_file = $_FILES["image-file"]["tmp_name"];
if (file_exists($check_file))
{
  $image_size_data = getimagesize($check_file);
  if ($image_size_data === FALSE)
  {
    //not image
    $errors .= "<p>File uploaded is not an image. </p>";
  }
  else if((filesize($check_file)/1024/1024) > 2)
  {
    // Check if the file size exceeds 2MB;
    $errors .= "<p>The size of uploaded file exceeds 2MB.</p>";
  }
  else{
    $imageFile = $_FILES["image-file"];
    $imageFileType = pathinfo($imageFile["name"],PATHINFO_EXTENSION);

    // Make the name of file to be uploaded
    $imageFile["name"] = $values["ID"].".".$imageFileType;

    // Upload the image to Google Picasa
    $uploadedURL = upload($imageFile);


    if($uploadedURL){
      $values['image-url'] = $uploadedURL;
    }
    else{
      $errors .= "<p>There was an issue uploading your image.</p>";
    }
  }
}

if($errors === ""){


  if($values["type"] === "rag"){
    /** Calculate capacity **/
    $values["capacity"] = $values["rag-area"]*$values["rag-depth"]/12*7.5;

    $values["type"] = "Rain garden";
  }
  else if($values["type"] === "rab"){
    $values["capacity"] = $values["rab-size"];

    $values["type"] = "Rain barrel";
  }

  // Get client ip address for administration purpose
  $values["IP"] = $_SERVER['REMOTE_ADDR'];

  echo "OK";

  /* craft an INSERT statement */
  $statement = "INSERT INTO " . $table_id . " (";

  // Append column names
  $first = true;
  foreach($col_names as $cname => $fd){
    if(isset($values[$fd])){
      if($first){
        $first = false;
      }
      else{
        $statement .= " , ";
      }
      $statement .= $cname;
    }
  }

  $statement .= ") VALUES (";


  // Append values to the statement
  $first = true;
  foreach($col_names as $cname => $fd){
    if(isset($values[$fd])){
      if($first){
        $first = false;
      }
      else{
        $statement .= " , ";
      }
      if(isset($is_num[$cname])){
        $statement .= $values[$fd];
      }
      else{
        $statement .= "'" . $values[$fd] . "'";
      }

    }
  }

  $statement .= ")";

  // Execute insert statement
  insert($statement);


}
else{
  /** Send errors */
  echo $errors;
}


/** Sanitize user input **/
function sanitize($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>
