/****************************************************
 *                                                  *
 *  ネットワークシミュレータのプログラム                    *
 *  今のところメインのコードを書いている                   *
 *                                                  *
 *                                                  *
 *                                                  *
 *                                                  *
 ****************************************************/

$(function(){
  // 変数の定義
  var flg = true;

  // class(.dust)のクリック
  $(".dust").click(function(){
    $("#main img").remove();
    $(".right p").replaceWith("<p></p>");
  });

  // class(.lan_delete)のクリック
  $(".lan_delete").click(function(){
    $("#main canvas").remove();
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
      flg = false;
    },
    deactivate: function(e, ui) {
      ui.draggable.draggable({ revert: flg });
      if(flg == false) {
        flg = true;
      }
    }
  });

  // class(.console)のPHP動作の確認
  $(document).on("click", ".start", function(){
    $("#console").html("通信中…");
    $.ajax({
      type: "POST",
      url: "http://192.168.11.12/ns-allinone-3.25/ns-3.25/a.php",
      success: function(data){
        $("#console").html(data);
      },
      error: function(){
        console.log("no");
        $("#console").html("処理に失敗しました");
      }
    });
  });

  // 関数 boxDropping
  function boxDropping(ui, obj) {
    var tag = '';
    var flg = true;
    // mainに画像を追加 (clssとstyleの設定の追加)
    $("#main").append(
      $("<img>").attr("src", ui.draggable.attr("src"))
      .attr("class", "context-menu-one")
      .attr("style" , "position: absolute; top: "+ ui.offset.top + "px; left: "+ ui.offset.left +"px")
    );
    $("#main img").draggable({
      containment: '#main',
    });
    // rightにトポロジを追加
    $(".right p").append("　" + ui.draggable.attr("alt") + "<br>");
  }

  // contextMenuのプラグインの設定
  $.contextMenu({
    selector: '.context-menu-one',
    callback: function(key, options) {

      /* contextMenuのデバック用
      var m = "clicked: " + key;
      console.log(m) || alert(m);
      */

      // 設定を押した時の動作
      if (key == "config") {
        alert(key + "が押されました");
      }
      // 削除を押した時の動作
      else if (key == "delete"){
        $(this).remove();
        /* トポロジの削除コードの追加方法がまだ未定 */
      }

    },
    items: {
      "config": {name: "設定", icon: "edit"},
      "まだ1":   {name: "○○", icon: "cut"},
      "まだ2":   {name: "○○", icon: "copy"},
      "まだ3":   {name: "○○", icon: "paste"},
      "delete": {name: "削除", icon: "delete"},
      "sep1":   "---------",
      "quit":   {name: "閉じる", icon: function(){
                  return 'context-menu-icon context-menu-icon-quit';
                }}
    }
  });
});
