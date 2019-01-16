<?php
require 'db.php';

$html="";
$return = array();
  $json = "[";
  $first = true;

$stmt = $dbh->prepare("SELECT productos.modeloauto from productos where marcaauto='".$_REQUEST['clave']."' group by modeloauto order by modeloauto asc");
      $stmt->execute();
  $result = $stmt->fetchAll();
  foreach($result as $row)
  {



    if(!$first){
          $json .=  ",";
      }else{
          $first = false;
      }

      $json .= '{"modelo":"'.$row['modeloauto'].'"}';

   }


  $json .= "]";

  echo $json;

  ?>
