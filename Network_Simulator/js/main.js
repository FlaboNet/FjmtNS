/****************************************************
 *                                                  *
 *  ネットワークシミュレータのプログラム                    *
 *                                                  *
 *                                                  *
 *                                                  *
 *                                                  *
 *                                                  *
 ****************************************************/

$(function(){
  /* 変数の定義 */
  var flg = true;

  /* class(.dust)のクリック */
  $(".dust").click(function(){
    $("#main img").remove();
    $(".right p").replaceWith("<p></p>");
  });

  /* class(.machinery)のドラッグ */
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

  /* class(.main)のドロップ */
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

  /* class(.console)のPHP動作の確認 */
  $(document).on("click", ".start", function(){
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


  /* class(.console)のPHP動作の確認 *//*
  $(document).on("click", ".start", function(){
    $.get(
      "php/test.php",
      function( data, textStatus ){
        if(textStatus == "success") {
          console.log("読み込み成功");
        }
        $("#console").html(data);
      }
      ,"html"
    );
  });
  */

  /* class(.lan)のクリック */
  $(".lan").click(function(){
    if ( $(this).attr("src") == "img/LANcable.png"){

      $(this).attr("src", "img/LANcable_2.png");
      /* hoverを追加(lanBorder_on, lanBorder_off) */
      $("#main img").hover(lanBorder_on, lanBorder_off);
      function lanBorder_on() {
        $(this).css({
          boxShadow: "0px 0px 10px #999",
        });
      }
      function lanBorder_off() {
        $(this).css({
          boxShadow: "",
        });
      }

    } else {
      $(this).attr("src", "img/LANcable.png");
      /* hoverを消す(lanBorder) */
      $("#main img").off("mouseenter").off("mouseleave");
    }
  });

  /* 関数 boxDropping */
  function boxDropping(ui, obj) {
    var tag = '';
    var flg = true;
    // console.log(ui.position.top)  // デバック用
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

  /* contextMenuのプラグインの設定 */
  $.contextMenu({
    selector: '.context-menu-one',
    callback: function(key, options) {
      /* contextMenuのデバック用 */
      /*
      var m = "clicked: " + key;
      console.log(m) || alert(m);
      */

      /* 設定を押した時の動作 */
      if (key == "config") {
        alert(key + "が押されました");
      }
      /* 削除を押した時の動作 */
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
