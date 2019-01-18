document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
var db = window.sqlitePlugin.openDatabase({name: "test.db"});
db.executeSql("DROP TABLE IF EXISTS tt");
db.executeSql("CREATE TABLE tt (data)");

$.ajax({
    // THANKS: http://stackoverflow.com/a/8654078/1283667
    url: "http://192.168.2.101/EncuestaApp/bdfetch.php?tabla=usuarios",
    dataType: "json",

    success: function(res) {
      $("#estado").append('<p>Got AJAX response: ' + JSON.stringify(res)+'</p>');
      //alert('Got AJAX response');
      db.transaction(function(tx) {
        // http://stackoverflow.com/questions/33240009/jquery-json-cordova-issue
        $.each(res, function(i, item) {
          $("#estado").append('<p>item: ' + JSON.stringify(item)+'</p>');
          tx.executeSql("INSERT INTO tt values (?)", JSON.stringify(item.nombre));
        });
      }, function(e) {
      $("#estado").append('<p>Transaction error: ' + e.message+'</p>');
        alert('Transaction error: ' + e.message);
      }, function() {
        db.executeSql('SELECT COUNT(*) FROM tt', [], function(res) {
          $("#estado").append('<p>Check SELECT result: ' + JSON.stringify(res.rows.item(0))+'</p>');
          alert('Transaction finished, check record count: ' + JSON.stringify(res.rows.item(0)));
        });
      });
    },
    error: function(e) {
        $("#estado").append('<p>ajax error: ' + JSON.stringify(e)+'</p>');
        alert('ajax error: ' + JSON.stringify(e));
    }
});
$("#estado").append('<p>sent ajax'+'</p>');

}
