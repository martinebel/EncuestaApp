
$("#estado").append("<p>iniciando</p>");
document.addEventListener("deviceready", onDeviceReady, false);

//iniciar base de datos, crear si no existe. consultar por una tabla, si no
//devuelve filas, tengo que conectarme al servidor y leer los datos.
function onDeviceReady() {
  $("#estado").append("<p>abriendo bd</p>");
  var db = window.sqlitePlugin.openDatabase({ name: 'encuestarm.db', location: 'default' }, function (db) {
//crear las tablas si no existen
$("#estado").append("<p>bd abierta</p>");
    db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE  elecciones (id INTEGER PRIMARY KEY,descripcion)');
    tx.executeSql('CREATE TABLE  encuestas (id INTEGER,titulo,fecha_inicio,fecha_cierre,fecha_creacion)');
    tx.executeSql('CREATE TABLE  opciones (id INTEGER  PRIMARY KEY AUTOINCREMENT,eleccion_id,tipo_id,pregunta_id,estado)');
    tx.executeSql('CREATE TABLE  preguntas (id INTEGER,descripcion,encuesta_id INTEGER)');
    tx.executeSql('CREATE TABLE  tipos (id INTEGER,clase)');
    tx.executeSql('CREATE TABLE  usuarios (idUsuario INTEGER,nombre,password,tipo)');

    $("#estado").append("<p>create table finalizado</p>");
}, function (error) {
    $("#estado").append('<p>transaction error1: ' + error.message+'</p>');
}, function () {
    //hacer una consulta a usuarios. si está vacia tengo que conectarme al servidor
    //y descargar los datos
consulta();
});

}, function (error) {
  $("#estado").append('<p>Open database ERROR1: ' + JSON.stringify(error)+'</p>');
});
}

function consulta()
{
  var db = window.sqlitePlugin.openDatabase({ name: 'encuestarm.db', location: 'default' }, function (db) {
  db.transaction(function (tx) {

    tx.executeSql("SELECT * from usuarios", function (tx, resultSet) {
      $("#estado").append('<p>SELECT results: ' +resultSet.rows.length+'</p>');

      },
      function (tx, error) {
          $("#estado").append('<p>SELECT12 error: ' + error.message+'</p>');
      });
  }, function (error) {
    $("#estado").append('<p>transaction error2: ' + error.message+'</p>');
  }, function () {
      $("#estado").append('<p>transaction ok'+'</p>');
  });



}, function (error) {
  $("#estado").append('<p>Open database ERROR2: ' + JSON.stringify(error)+'</p>');
});
}

function populateDB()
{
//copiar tabla elecciones
$.ajax({
 type: "POST",
 crossDomain: true,
 url: urlAPI+"bdfetch.php?tabla=elecciones",
 processData: false,
 contentType: "application/json"
})
.success(function(datae, textStatus, jqXHR){
  for(var i=0;i<datae.length;i++){
  db.transaction(function (tx) {
      tx.executeSql("insert into elecciones (id ,descripcion) values ("+datae[i].id+",'"+datae[i].descripcion+"')");
  }, function (error) {
      $("#estado").append('<p>transaction error elecciones: ' + error.message+'</p>');
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
$("#estado").append("<p>error elecciones");
});

//copiar tabla encuestas
$.ajax({
 type: "POST",
 crossDomain: true,
 url: urlAPI+"bdfetch.php?tabla=encuestas",
 processData: false,
 contentType: "application/json"
})
.success(function(datae, textStatus, jqXHR){
  for(var i=0;i<datae.length;i++){
  db.transaction(function (tx) {
      tx.executeSql("insert into encuestas (id ,titulo,fecha_inicio,fecha_cierre,fecha_creacion) values ("+datae[i].id+",'"+datae[i].titulo+"','"+datae[i].fecha_inicio+"','"+datae[i].fecha_cierre+"','"+datae[i].fecha_creacion+"')");
  }, function (error) {
      $("#estado").append('<p>transaction error encuestas: ' + error.message+'</p>');
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
$("#estado").append("<p>error encuestas");
});

//copiar tabla opciones
$.ajax({
 type: "POST",
 crossDomain: true,
 url: urlAPI+"bdfetch.php?tabla=opciones",
 processData: false,
 contentType: "application/json"
})
.success(function(datae, textStatus, jqXHR){
  for(var i=0;i<datae.length;i++){
  db.transaction(function (tx) {
      tx.executeSql("insert into opciones (id,eleccion_id,tipo_id,pregunta_id,estado) values ("+datae[i].id+",'"+datae[i].eleccion_id+"','"+datae[i].tipo_id+"','"+datae[i].pregunta_id+"',null)");
  }, function (error) {
      $("#estado").append('<p>transaction error opciones: ' + error.message+'</p>');
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
$("#estado").append("<p>error opciones");
});

//copiar tabla preguntas
$.ajax({
 type: "POST",
 crossDomain: true,
 url: urlAPI+"bdfetch.php?tabla=preguntas",
 processData: false,
 contentType: "application/json"
})
.success(function(datae, textStatus, jqXHR){
  for(var i=0;i<datae.length;i++){
  db.transaction(function (tx) {
      tx.executeSql("insert into preguntas (id ,descripcion,encuesta_id) values ("+datae[i].id+",'"+datae[i].descripcion+"','"+datae[i].encuesta_id+"')");
  }, function (error) {
      $("#estado").append('<p>transaction error preguntas: ' + error.message+'</p>');
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
$("#estado").append("<p>error preguntas");
});

//copiar tabla tipos
$.ajax({
 type: "POST",
 crossDomain: true,
 url: urlAPI+"bdfetch.php?tabla=tipos",
 processData: false,
 contentType: "application/json"
})
.success(function(datae, textStatus, jqXHR){
  for(var i=0;i<datae.length;i++){
  db.transaction(function (tx) {
      tx.executeSql("insert into tipos (id ,clase) values ("+datae[i].id+",'"+datae[i].clase+"')");
  }, function (error) {
      $("#estado").append('<p>transaction error tipos: ' + error.message+'</p>');
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
$("#estado").append("<p>error tipos");
});

//copiar tabla usuarios
$.ajax({
 type: "POST",
 crossDomain: true,
 url: urlAPI+"bdfetch.php?tabla=usuarios",
 processData: false,
 contentType: "application/json"
})
.success(function(datae, textStatus, jqXHR){
  for(var i=0;i<datae.length;i++){
  db.transaction(function (tx) {
      tx.executeSql("insert into usuarios (id ,nombre,password,tipo) values ("+datae[i].id+",'"+datae[i].nombre+"','"+datae[i].password+"','"+datae[i].tipo+"')");
  }, function (error) {
      alert('<p>transaction error usuarios: ' + error.message+'</p>');
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
$("#estado").append("<p>error usuarios");
});

}
