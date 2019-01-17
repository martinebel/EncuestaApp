var totalPreguntas=0;
var currentPregunta=0;
var currentEncuesta=0;
var tituloEncuesta="";
var arrayPreguntas;
function getEncuestas(usuario)
{
  $.ajax({
   type: "POST",
   crossDomain: true,
   url: "http://192.168.2.101/EncuestaApp/encuestas.php?action=getEncuestas&usuario="+localStorage.getItem("idUsuario"),
   processData: false,
   contentType: "application/json"
  })
  .success(function(datae, textStatus, jqXHR){
  totalPreguntas=datae[0].preguntas;
  totalPreguntas--;
  currentEncuesta=datae[0].id;
  tituloEncuesta=datae[0].nombre;
  getPreguntas(currentEncuesta);
  })
  .fail(function(jqXHR, textStatus, errorThrown){
  alert("error");
  });
}

function getPreguntas(idEncuesta)
{
    $.ajax({
     type: "POST",
     crossDomain: true,
     url: "http://192.168.2.101/EncuestaApp/encuestas.php?action=getPreguntas&idEncuesta="+idEncuesta,
     processData: false,
     contentType: "application/json"
    })
    .success(function(datae, textStatus, jqXHR){
    arrayPreguntas=datae;
    })
    .fail(function(jqXHR, textStatus, errorThrown){
    alert("error");
    });

}

function getPreguntaOpciones(idPregunta)
{
  if(currentPregunta<=totalPreguntas)
  {
    //pido los detalles de la siguiente preguntas
    $.ajax({
     type: "POST",
     crossDomain: true,
     url: "http://192.168.2.101/EncuestaApp/encuestas.php?action=getPreguntaDetalle&idPregunta="+arrayPreguntas[idPregunta].id,
     processData: false,
     contentType: "application/json"
    })
    .success(function(datae, textStatus, jqXHR){
    //mostrar mis opciones para esta pregunta
    })
    .fail(function(jqXHR, textStatus, errorThrown){
    alert("error");
    });
    currentPregunta++;
  }
}
