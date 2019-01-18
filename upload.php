<?php
require 'db.php';
if (isset($_SERVER['HTTP_ORIGIN'])) {
       header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
       header('Access-Control-Allow-Credentials: true');
       header('Access-Control-Max-Age: 86400');    // cache for 1 day
   }

   // Access-Control headers are received during OPTIONS requests
   if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

       if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
           header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

       if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
           header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

       exit(0);
   }
  header('Content-Type: application/json');


  $data = json_decode($_POST['data'],true);

    // here i would like use foreach:

    foreach($data as $d){
    //  echo "INSERT INTO opciones (id, eleccion_id, tipo_id, pregunta_id, estado) VALUES (NULL,'".$d['eleccion_id']."','".$d['tipo_id']."','".$d['pregunta_id']."','".$d['estado']."')";
       $stmt = $dbh->prepare("INSERT INTO opciones (id, eleccion_id, tipo_id, pregunta_id, estado) VALUES (NULL,'".$d['eleccion_id']."','".$d['tipo_id']."','".$d['pregunta_id']."','".$d['estado']."')");
      $stmt->execute();
    }
//  die();
header("HTTP/1.1 200 OK");
http_response_code(200);
echo '{"message": "ok"}';
  ?>
