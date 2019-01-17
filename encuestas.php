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

  $return = array();
    $json = "[";
    $first = true;
switch($_REQUEST["action"])
{
  case "getEncuestas": //obtener las encuestas para un usuario
$usuario=$_REQUEST["usuario"];
//ToDo: agregar filtro por usuario
$stmt = $dbh->prepare("SELECT preguntas.encuesta_id,encuestas.titulo,count(*) as cantpreguntas FROM `preguntas` inner join encuestas on encuestas.id=preguntas.encuesta_id    group by preguntas.encuesta_id,encuestas.titulo");
      $stmt->execute();
  $result = $stmt->fetchAll();
  if($stmt->rowCount()==0)
  {
    header("HTTP/1.1 404 NotFound");
    http_response_code(404);
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

        $json .= '{"id":"'.$row['encuesta_id'].'","nombre":"'.$row['titulo'].'","preguntas":"'.$row['cantpreguntas'].'"}';

     }
  }
  break;

  case "getPreguntas": //obtener el listado de preguntas para una encuesta
  $idEncuesta=$_REQUEST["idEncuesta"];
  $stmt = $dbh->prepare("SELECT * from preguntas where encuesta_id=".$idEncuesta);
        $stmt->execute();
    $result = $stmt->fetchAll();
    if($stmt->rowCount()==0)
    {
      header("HTTP/1.1 404 NotFound");
      http_response_code(404);
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

          $json .= '{"id":"'.$row['id'].'","nombre":"'.$row['descripcion'].'"}';

       }
    }
  break;

  case "getPreguntaDetalle": //obtener las respuestas posibles para una pregunta
  $idPregunta=$_REQUEST["idPregunta"];
  $stmt = $dbh->prepare("SELECT  elecciones.id,elecciones.descripcion,tipos.clase,tipos.id as idclase from opciones inner join elecciones on elecciones.id=opciones.eleccion_id inner join tipos on tipos.id=opciones.tipo_id where pregunta_id=".$idPregunta." and estado is null");
        $stmt->execute();
    $result = $stmt->fetchAll();
    if($stmt->rowCount()==0)
    {
      header("HTTP/1.1 404 NotFound");
      http_response_code(404);
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

          $json .= '{"id":"'.$row['id'].'","nombre":"'.$row['descripcion'].'","clase":"'.$row['clase'].'","clase_id":"'.$row['idclase'].'"}';

       }
    }
  break;
}



  $json .= "]";

  echo $json;

  ?>
