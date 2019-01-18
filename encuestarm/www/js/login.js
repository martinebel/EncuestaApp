var db = null;


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
db = window.sqlitePlugin.openDatabase({ name: 'encuestarm.db', location: 'default' }, function (db) {
}, function (error) {
    alert('Open database ERROR: ' + JSON.stringify(error));
});
}

$("#submit").on("click",function(){

  db.transaction(function(tx) {
  tx.executeSql("SELECT * from usuarios where nombre='"+$("#usuario").val()+"' and password='"+$("#pass").val()+"'", [], function(tx, rs) {
    if(rs.rows.length==0)
    {
      $("#error").css("display","block");
    }
    else
    {
      for(var x = 0; x < rs.rows.length; x++) {
              localStorage.setItem("nombreUsuario",rs.rows.item(x).nombre);
              localStorage.setItem("tipoUsuario",rs.rows.item(x).tipo);
              localStorage.setItem("idUsuario",rs.rows.item(x).id);
          }
      window.location.href="content.html";
    }
  }, function(tx, error) {
    alert('SELECT error: ' + error.message);
  });
  });

});
