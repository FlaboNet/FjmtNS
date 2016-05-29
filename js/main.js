/*
 * ネットワークシミュレータのプログラム
 * 今のところメインのコードを書いている
 */

$(function(){
  // 変数の定義
  var pcNode = 0;     // PCの個数
  var swNode = 0;     // Switchの個数
  var svNode = 0;     // Serverの個数
  var ruNode = 0;     // Routerの個数
  var dropFlg = true; // フラグ

  // class(.dust)のクリック
  $(".dust").click(function(){
    // 変数のリセット
    pcNode = 0;
    swNode = 0;
    svNode = 0;
    ruNode = 0;
    $(".right p").replaceWith("<p></p>");
  });

  // class(.machinery)のドラッグ
  $(".machinery").draggable({
    helper: 'clone',
    revert: true,
    drag: function() {
      $(this).addClass('dragout');
    },
    stop: function() {
      $(this).removeClass('dragout');
    },
  });

  // class(.main)のドロップ
  $("#main").droppable({
    accept: '.machinery',
    tolerance: 'fit',
    drop: function(e, ui) {
      boxDropping(ui, $(this));
      dropFlg = false;
    },
    deactivate: function(e, ui) {
      ui.draggable.draggable({ revert: dropFlg });
      if(dropFlg == false) {
        dropFlg = true;
      }
    }
  });

  // class(.right)のクリック
  $(".right").on("click", "img", function(){
    // 画像を変更
    if($(this).attr("src") == "img/plus.jpg"){ $(this).attr("src", "img/minus.jpg"); }
    else if($(this).attr("src") == "img/minus.jpg"){ $(this).attr("src", "img/plus.jpg"); }
  });

  // class(.console)のPHP動作の確認
  $(".start").click(function(){
    $("#console").html("通信中…");
    $.ajax({
      type: "POST",
      url: "http://192.168.11.12/ns-allinone-3.25/ns-3.25/a.php",
      success: function(data){
        $("#console").html(data);
      },
      error: function(){
        $("#console").html("処理に失敗しました");
      }
    });
  });

  // 関数 boxDropping
  function boxDropping(ui, obj) {
    var tag = '';
    var dropFlg = true;
    // mainに画像を追加 (clssとstyleの設定の追加)
    $("#main").append(
      $("<img>").attr("src", ui.draggable.attr("src"))
      .attr("class", "context-menu-one")
      .attr("style", "position: absolute; top: "+ ui.offset.top + "px; left: "+ ui.offset.left +"px")
    );
    $("#main img").draggable({
      containment: '#main',
      zIndex: 1,
    });
    // rightにトポロジを追加
    $(".right p").append("<img src= img/plus.jpg> " + ui.draggable.attr("alt") + "<br>");
  }

  // contextMenuのプラグインの設定
  $.contextMenu({
    selector: '.context-menu-one',

    items: {
      "config": {name: "設定", icon: "edit"},
      "test1": {name: "テスト1", icon: "cut"},
      "まだ2": {name: "○○", icon: "copy"},
      "まだ3": {name: "○○", icon: "paste"},
      "delete": {name: "削除", icon: "delete"},
      "sep1": "---------",
      "quit": {name: "閉じる", icon: function(){
               return 'context-menu-icon context-menu-icon-quit';
               }}
    },

    callback: function(key, options) {

      /* contextMenuのデバック用
      var m = "clicked: " + key;
      console.log(m) || alert(m);
      */

      // 設定を押した時の動作
      if (key == "config") {
        alert(key + "が押されました");
      }

      // テスト1を押した時の動作
      else if (key == "test1") {

      }

      // 削除を押した時の動作
      else if (key == "delete"){
        alert(key + "が押されました");
        // $(this).remove();
        /* トポロジの削除コードはそれなりに機能が充実したら追加予定 */
      }
    },
  });
});
