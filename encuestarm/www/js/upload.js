var db = null;
var arrayResultados  = new Array();

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
 db = window.sqlitePlugin.openDatabase({ name: 'encuesta.db', location: 'default' }, function (db) {
    db.transaction(function(tx) {
    tx.executeSql('SELECT * from opciones where estado is not null', [], function(tx, resultSet) {

      for(var x = 0; x < resultSet.rows.length; x++) {
          arrayResultados.push({eleccion_id : resultSet.rows.item(x).eleccion_id, tipo_id :resultSet.rows.item(x).tipo_id, pregunta_id: resultSet.rows.item(x).pregunta_id, estado:resultSet.rows.item(x).estado});
          }
          subirdatos();
    }, function(tx, error) {
      mensaje('SELECT error: ' + error.message);
    });
  });



}, function (error) {
  mensaje("Error abriendo BD: "+ JSON.stringify(error));
});
}


function subirdatos()
{
  $.ajax({
    type: 'POST',
    url: 'http://192.168.2.101/EncuestaApp/upload.php',
    data: {data : JSON.stringify(arrayResultados)},
              dataType: "json",
              async: false,

              success: function(res) {

                db.executeSql('delete from elecciones');
                db.executeSql('delete from encuestas');
                db.executeSql('delete from opciones');
                db.executeSql('delete from preguntas');
                db.executeSql('delete from tipos');
                db.executeSql('delete from usuarios');
                window.localStorage.clear();
                window.location.href="index.html"
              },
              error: function(e) {

                db.executeSql('delete from elecciones');
                db.executeSql('delete from encuestas');
                db.executeSql('delete from opciones');
                db.executeSql('delete from preguntas');
                db.executeSql('delete from tipos');
                db.executeSql('delete from usuarios');
                window.localStorage.clear();
                window.location.href="index.html"
              }
          });
}


function mensaje(msg)
{
  alert(msg);
}
