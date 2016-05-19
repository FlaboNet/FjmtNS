$(function(){

	/* class(.lan)のクリック */
  $(".lan").click(function(){

    /* LANが押されているときの動作 */
    if ( $(this).attr("src") == "img/LANcable.png"){
			/* 画像を変更 */
			$(this).attr("src", "img/LANcable_2.png");

      /*************************************************************/
      var $canvas; 		 //追加されたキャンバスを格納
			var canvasWidth;
			var canvasHeight;

      function addCanvas(){
        return $('<canvas width="'+ canvasWidth +'" height="'+ canvasHeight +'"></canvas>').prependTo('#main');
      }
      function mouseDown(e){
				$canvas = addCanvas();
			}

      $('#main').on("mousedown", mouseDown);

      canvasWidth = $('#main').width();
			canvasHeight = $('#main').height();

      /*************************************************************/

      /* hoverを追加(lanBorder_on, lanBorder_off) */
      $("#main img").hover(lanBorder_on, lanBorder_off);
      function lanBorder_on() {
				/* cssの設定を加える */
        $(this).css({
          boxShadow: "0px 0px 10px #999",
        });
				/* 一時的にドラッグ機能を無効 */
				$(this).draggable("disable");
      }
      function lanBorder_off() {
				/* cssの設定を削除する */
        $(this).css({
          boxShadow: "",
        });
				/* ドラッグ機能を有効 */
				$(this).draggable("enable");
      }

    }
    else {
      /* 画像を変更 */
      $(this).attr("src", "img/LANcable.png");
			/* hoverを消す(lanBorder) */
      $('#main').off("mousedown", mouseDown);
      $("#main img").off("mouseenter").off("mouseleave");
    }
  });
});
