
var db = null;
$("#estado").append("<p>iniciando</p>");


//iniciar base de datos, crear si no existe. consultar por una tabla, si no
//devuelve filas, tengo que conectarme al servidor y leer los datos.
document.addEventListener('deviceready', function() {
  db = window.sqlitePlugin.openDatabase({
    name: 'my.db',
    location: 'default',
  });

  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS  elecciones (id INTEGER PRIMARY KEY,descripcion)');
    tx.executeSql('CREATE TABLE  IF NOT EXISTS encuestas (id INTEGER,titulo,fecha_inicio,fecha_cierre,fecha_creacion)');
    tx.executeSql('CREATE TABLE  IF NOT EXISTS opciones (id INTEGER  PRIMARY KEY AUTOINCREMENT,eleccion_id,tipo_id,pregunta_id,estado)');
    tx.executeSql('CREATE TABLE  IF NOT EXISTS preguntas (id INTEGER,descripcion,encuesta_id INTEGER)');
    tx.executeSql('CREATE TABLE  IF NOT EXISTS tipos (id INTEGER,clase)');
    tx.executeSql('CREATE TABLE  IF NOT EXISTS usuarios (idUsuario INTEGER,nombre,password,tipo)');
    tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
    tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
  }, function(error) {
      $("#estado").append('<p>Transaction ERROR: ' + error.message+'</p>');
  }, function() {
      $("#estado").append('<p>Populated database OK'+'</p>');
  });

  db.transaction(function(tx) {
   tx.executeSql('SELECT count(*) AS mycount FROM usuarios', [], function(tx, rs) {
      $("#estado").append('<p>Record count (expected to be 2): ' + rs.rows.item(0).mycount+'</p>');
      populateDB();
   }, function(tx, error) {
       $("#estado").append('<p>SELECT error: ' + error.message+'</p>');
   });
 });
});


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
    tx.executeSql("insert into elecciones values (?,?)", [datae[i].id,datae[i].descripcion]);
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
      tx.executeSql("insert into encuestas values (?,?,?,?,?)", [datae[i].id,datae[i].titulo,datae[i].fecha_inicio,datae[i].fecha_cierre,datae[i].fecha_creacion]);
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
      tx.executeSql("insert into opciones values (?,?,?,?,?)", [datae[i].id,datae[i].eleccion_id,datae[i].tipo_id,datae[i].pregunta_id,'NULL']);
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
      tx.executeSql("insert into preguntas values (?,?,?)", [datae[i].id,datae[i].descripcion,datae[i].encuesta_id]);
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
      tx.executeSql("insert into tipos values (? ,?)",[datae[i].id,datae[i].clase]);
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
      tx.executeSql("insert into usuarios values (?,?,?,?)",[+datae[i].id,datae[i].nombre,datae[i].password,datae[i].tipo]);
  }, function (error) {
      alert('<p>transaction error usuarios: ' + error.message+'</p>');
  });
}
})
.fail(function(jqXHR, textStatus, errorThrown){
$("#estado").append("<p>error usuarios");
});

}
