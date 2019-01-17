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
$usuario=$_REQUEST["usuario"];
$pass=$_REQUEST["pass"];

$return = array();
  $json = "[";
  $first = true;

$stmt = $dbh->prepare("SELECT * from usuarios where nombre='".$usuario."' and password='".$pass."'");
      $stmt->execute();
  $result = $stmt->fetchAll();
  if($stmt->rowCount()==0)
  {
    header("HTTP/1.1 404 NotFound");
    http_response_code(404);
    //$json = '{"id":"'.$row['idUsuario'].'","nombre":"'.$row['nombre'].'","tipo":"'.$row['tipo'].'"}';
  }
  else {
    header("HTTP/1.1 200 OK");
    http_response_code(200);
    foreach($result as $row)
    {



      if(!$first){
            $json .=  ",";
        }else{
            $first = false;
        }

        $json .= '{"id":"'.$row['idUsuario'].'","nombre":"'.$row['nombre'].'","tipo":"'.$row['tipo'].'"}';

     }
  }



  $json .= "]";

  echo $json;

  ?>
