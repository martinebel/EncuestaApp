
$("#estado").append("<p>iniciando</p>");
document.addEventListener("deviceready", onDeviceReady, false);

//iniciar base de datos, crear si no existe. consultar por una tabla, si no
//devuelve filas, tengo que conectarme al servidor y leer los datos.
function onDeviceReady() {
  $("#estado").append("<p>abriendo bd</p>");
  var db = window.sqlitePlugin.openDatabase({ name: 'encuestarm.db', location: 'default' }, function (db) {
//crear las tablas si no existen
$("#estado").append("<p>bd abierta</p>");
    db.executeSql('CREATE TABLE  elecciones (id INTEGER PRIMARY KEY,descripcion)');
    db.executeSql('CREATE TABLE  encuestas (id INTEGER,titulo,fecha_inicio,fecha_cierre,fecha_creacion)');
    db.executeSql('CREATE TABLE  opciones (id INTEGER  PRIMARY KEY AUTOINCREMENT,eleccion_id,tipo_id,pregunta_id,estado)');
    db.executeSql('CREATE TABLE  preguntas (id INTEGER,descripcion,encuesta_id INTEGER)');
    db.executeSql('CREATE TABLE  tipos (id INTEGER,clase)');
    db.executeSql('CREATE TABLE  usuarios (idUsuario INTEGER,nombre,password,tipo)');

    $("#estado").append("<p>create table finalizado</p>");

    $.ajax({
                // THANKS: http://stackoverflow.com/a/8654078/1283667
                url: "http://192.168.2.101/EncuestaApp/bdfetch.php?tabla=usuarios",
                dataType: "json",

                success: function(res) {
                  alert('Got AJAX response: ' + JSON.stringify(res));
                  //alert('Got AJAX response');
                  db.transaction(function(tx) {
                    // http://stackoverflow.com/questions/33240009/jquery-json-cordova-issue
                    $.each(res, function(i, item) {
                      alert('item: ' + JSON.stringify(item.nombre));
                      tx.executeSql("INSERT INTO usuarios values (?,?,?,?)", [JSON.stringify(item.idUsuario),JSON.stringify(item.nombre),JSON.stringify(item.password),JSON.stringify(item.tipo)]);

                    });
                  }, function(e) {
                    console.log('Transaction error: ' + e.message);
                    alert('Transaction error: ' + e.message);
                  }, function() {
                    db.executeSql('SELECT COUNT(*) FROM usuarios', [], function(res) {
                      console.log('Check SELECT result: ' + JSON.stringify(res.rows.item(0)));
                      alert('Transaction finished, check record count: ' + JSON.stringify(res.rows.item(0)));
                    });
                  });
                },
                error: function(e) {
                    console.log('ajax error: ' + JSON.stringify(e));
                    alert('ajax error: ' + JSON.stringify(e));
                }
            });


}, function (error) {
  $("#estado").append('<p>Open database ERROR1: ' + JSON.stringify(error)+'</p>');
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
