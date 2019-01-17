var totalPreguntas=0;
var currentPregunta=0;
var currentEncuesta=0;
var tituloEncuesta="";
var arrayPreguntas;
var arrayResultados  = new Array();

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
for(var i=0;i<datae.length;i++){
  $("#content").append('<a href="#" class="btn btn-primary start" data-preguntas="'+(datae[i].preguntas-1)+'" data-id="'+datae[i].id+'">'+datae[i].nombre+'</a>');
}

  })
  .fail(function(jqXHR, textStatus, errorThrown){
  alert("error");
  });
}

$(document).on('click', '.start', function () {
    currentEncuesta=$(this).data("id");
    totalPreguntas=$(this).data("preguntas");
    getPreguntas(currentEncuesta);

});

$(document).on('click', '.continue', function () {
    getPreguntaOpciones();
});



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
    currentPregunta=0;
    getPreguntaOpciones();
    })
    .fail(function(jqXHR, textStatus, errorThrown){
    alert("error");
    });

}

function getPreguntaOpciones()
{
  //guardar resultados de las respuestas si ya pasé la primer preguntas
  if(currentPregunta>0)
  {
    $('#content').children('input').each(function () {
      switch ($(this).attr('type')) {
        case "radio":
          if($(this).is(':checked')){
            arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:'1'});
          }
          break;
          case "checkbox":
            if($(this).is(':checked')){
              arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:'1'});
            }
            break;
            case "text":
                arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:$(this).val()});
              break;

      }
});

  }

  if(currentPregunta<=totalPreguntas)
  {
    //pido los detalles de la siguiente preguntas
    $.ajax({
     type: "POST",
     crossDomain: true,
     url: "http://192.168.2.101/EncuestaApp/encuestas.php?action=getPreguntaDetalle&idPregunta="+arrayPreguntas[currentPregunta].id,
     processData: false,
     contentType: "application/json"
    })
    .success(function(datae, textStatus, jqXHR){
    //mostrar mis opciones para esta pregunta
    $("#content").empty();
    $("#content").append('<legend>'+arrayPreguntas[currentPregunta].nombre+'</legend>');
for(var i=0;i<datae.length;i++){
      switch (datae[i].clase) {
        case 'checkbox':
            $("#content").append('<input type="checkbox" id="option'+datae[i].id+'" value="'+datae[i].id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+datae[i].id+'" data-clase="'+datae[i].clase_id+'" > '+datae[i].nombre+'<br>');
          break;
          case 'radio':
              $("#content").append('<input type="radio" id="option'+datae[i].id+'" value="'+datae[i].id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+datae[i].id+'" data-clase="'+datae[i].clase_id+'"> '+datae[i].nombre+'<br>');
            break;
            case 'text':
                $("#content").append('<p>'+datae[i].nombre+'</p><input type="text" id="option'+datae[i].id+'" data-pregunta="'+arrayPreguntas[currentPregunta].id+'" data-eleccion="'+datae[i].id+'" data-clase="'+datae[i].clase_id+'"><br>');
              break;
      }
}
currentPregunta++;
$("#content").append('<hr><a href="#" class="btn btn-success continue">Continuar</a>');
    })
    .fail(function(jqXHR, textStatus, errorThrown){
    alert("error");
    });

  }
  else {
    //llegue al final de la encuesta
    console.log(arrayResultados);
    $("#content").empty();
    getEncuestas(1);
  }
}
