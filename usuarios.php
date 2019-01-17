<?php
require 'db.php';

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
    foreach($result as $row)
    {



      if(!$first){
            $json .=  ",";
        }else{
            $first = false;
        }
  header("HTTP/1.1 200 OK");
  http_response_code(201);
        $json .= '{"id":"'.$row['idUsuario'].'","nombre":"'.$row['nombre'].'","tipo":"'.$row['tipo'].'"}';

     }
  }



  $json .= "]";

  echo $json;

  ?>
