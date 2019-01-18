//ToDo: Mejorar control de errores; mejorar diseño; agregar filtro por usuario;

var totalPreguntas=0;
var currentPregunta=0;
var currentEncuesta=0;
var tituloEncuesta="";
var arrayPreguntas;
var arrayResultados  = new Array();

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  var db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {
    db.transaction(function(tx) {
    tx.executeSql('SELECT preguntas.encuesta_id,encuestas.titulo,count(*) as cantpreguntas FROM preguntas inner join encuestas on encuestas.id=preguntas.encuesta_id group by preguntas.encuesta_id,encuestas.titulo', [], function(tx, resultSet) {

      for(var x = 0; x < resultSet.rows.length; x++) {
              $("#content").append('<ul class="list-group mb-4 media-list"><li class="list-group-item"><a href="#" class="media shadow-15 start"  data-preguntas="'+(resultSet.rows.item(x).cantpreguntas-1)+'" data-id="'+resultSet.rows.item(x).encuesta_id+'"><div class="media-body"><h3>'+resultSet.rows.item(x).titulo+'</h3><p>'+resultSet.rows.item(x).cantpreguntas+' preguntas</p></div></a></li></ul>');
          }

    }, function(tx, error) {
      mensaje('SELECT error: ' + error.message);
    });
  });


}, function (error) {
  mensaje("Error abriendo BD: "+ JSON.stringify(error));
});
}



/************************************************
esto responde al click del boton de la encuesta que se quiere iniciar
setea las variables currentEncuesta y totalPreguntas
obtiene un listado de las preguntas para dicha encuesta
************************************************/
$(document).on('click', '.start', function () {
    currentEncuesta=$(this).data("id");
    totalPreguntas=$(this).data("preguntas");
    getPreguntas(currentEncuesta);
//ToDo: mostrar titulo de la encuesta en algun lado
});

/************************************************
esto responde al click del boton Continuar
trae la siguiente pregunta
************************************************/
$(document).on('click', '.continue', function () {
    getPreguntaOpciones();
});


/************************************************
getPreguntas: obtiene un listado de las preguntas para la encuesta seleccionada
y carga la primer pregunta
Parametros: idEncuesta (el id de la encuesta en cuestion)
ToDo: modificar URL de la API
************************************************/
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
      //copio las preguntas en el array temporal
    arrayPreguntas=datae;
    currentPregunta=0;
    //obtengo la primer pregunta
    getPreguntaOpciones();
    })
    .fail(function(jqXHR, textStatus, errorThrown){
    alert("error");
    });

}

/************************************************
getPreguntaOpciones: obtiene las opciones para una pregunta y las dibuja en el div
se incrementa de manera automatica  y almacena en un array los resultados
de la pregunta anterior (si hubo)
ToDo: modificar URL de la API
ToDo: mejorar diseño en el append
ToDo: implementar filtro por usuario
************************************************/
function getPreguntaOpciones()
{
  //guardar resultados de las respuestas si ya pasé la primer pregunta
  if(currentPregunta>0)
  {
    $('#content').children('input').each(function () { //para cada elemento del div
      switch ($(this).attr('type')) { //segun el tipo del elemento
        case "radio":
          if($(this).is(':checked')){ //si es radio y esta checked
            arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:'1'});
          }
          break;
          case "checkbox":
            if($(this).is(':checked')){ //si es checkbox y esta checked
              arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:'1'});
            }
            break;
            case "text": //si es text
                arrayResultados.push({eleccion_id : $(this).data("eleccion"), tipo_id : $(this).data("clase"), pregunta_id: $(this).data("pregunta"), estado:$(this).val()});
              break;

      }
});

  }
//si NO estoy en la ultima pregunta
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
    $("#content").empty(); //vaciar el div
    $("#content").append('<legend>'+arrayPreguntas[currentPregunta].nombre+'</legend>'); //titulo
for(var i=0;i<datae.length;i++){
      switch (datae[i].clase) { //segun el tipo mostrar el control adecuado
        //en cada elemento se agregan atributos para mantener informaion importante
        //data-pregunta: el id de la pregunta
        //data-eleccion: el id de la opcion (respuesta)
        //data-clase: el id del tipo de objeto (check, radio, text, etc)
        //ToDo: modificar el append para mejorar el diseño
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
currentPregunta++; //incremento la posicion de la pregunta actual (para la proxima vez que se llame)
//muestro el boton Continuar
$("#content").append('<hr><a href="#" class="btn btn-success continue">Continuar</a>');
    })
    .fail(function(jqXHR, textStatus, errorThrown){
    alert("error");
    });

  }
  else {
    //llegue al final de la encuesta
    //guardo los resultados
    console.log(arrayResultados);
    //ToDo: almacenar los resultados en una BD?

    //vaciar el div
    $("#content").empty();
    //cargar las encuestas disponibles
    getEncuestas();
  }
}
