var db = null;
document.addEventListener("deviceready", onDeviceReady, false);

//iniciar base de datos, crear si no existe. consultar por una tabla, si no
//devuelve filas, tengo que conectarme al servidor y leer los datos.
function onDeviceReady() {
  db = window.openDatabase({ name: 'encuestarm.db', location: 'default' }, function (db) {
//crear las tablas si no existen
    db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS  elecciones (id INTEGER PRIMARY KEY,descripcion)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS  encuestas (id INTEGER,titulo,fecha_inicio,fecha_cierre,fecha_creacion)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS  opciones (id INTEGER  PRIMARY KEY AUTOINCREMENT,eleccion_id,tipo_id,pregunta_id,estado)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS  preguntas (id INTEGER,descripcion,encuesta_id INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS  tipos (id INTEGER,clase)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS  usuarios (idUsuario INTEGER,nombre,password,tipo)');
}, function (error) {
    alert('transaction error1: ' + error.message);
}, function () {
    //hacer una consulta a usuarios. si está vacia tengo que conectarme al servidor
    //y descargar los datos
    db.transaction(function (tx) {
      tx.executeSql("SELECT * from usuarios", function (tx, resultSet) {
        if(resultSet.rows.length>0){window.location.href="login.html";}
        else{populateDB();}
        },
        function (tx, error) {
            alert('SELECT error: ' + error.message);
        });
    }, function (error) {
        alert('transaction error2: ' + error.message);
    });
});

}, function (error) {
    alert('Open database ERROR1: ' + JSON.stringify(error));
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
      alert('transaction error elecciones: ' + error.message);
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
alert("error");
});

//copiar tabla elecciones
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
      alert('transaction error elecciones: ' + error.message);
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
alert("error");
});
}
