
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
   }, function(tx, error) {
       $("#estado").append('<p>SELECT error: ' + error.message+'</p>');
   });
 });
});
