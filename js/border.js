/****************************************************
 *
 *  ネットワークシミュレータのプログラム
 *  ＬＡＮをクリックしたときの動作について
 *
 *
 *
 *
 ****************************************************/

$(function(){
  // class(.lan)のクリック
  $(".lan").click(function(){

    // LANが押されているときの動作
    if($(this).attr("src") == "img/lanCable.png"){

      // 画像を変更
      $(this).attr("src", "img/lanCable_2.png");

      // 画像のドラッグ防止
      $("#main img").mouseup(function(e){
        e.preventDefault();
      });
      $("#main img").mousedown(function(e){
        e.preventDefault();
      });

      var points = [];        // ドラッグ時のマウスの座標を集める
      var $canvas;            // 追加されたキャンバスを格納
      var canvasWidth;        // mainの幅
      var canvasHeight;       // mainの高さ
      var lanFlag;            // フラグ
      var lanFlag_point;      // フラグ2

      /************************** 線を描く動作 ****************************/
      function getRectPoints(ptax, ptay, ptbx, ptby, width) {

        var rad = Math.atan2(ptby - ptay, ptbx - ptax);
        var offX = (width / 2) * Math.sin(rad);
        var offY = (width / 2) * Math.cos(rad);

        var array = [];

        array.push({x:ptax + offX, y:ptay - offY});
        array.push({x:ptbx + offX, y:ptby - offY});
        array.push({x:ptbx - offX, y:ptby + offY});
        array.push({x:ptax - offX, y:ptay + offY});

        return array;
      }

      function addCanvas(){
        return $('<canvas width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>').prependTo('#main');
      }

      // マウスのボタンが押されたときに処理を実行する
      function lanDown(e){
        // imgにマウスが乗っているときに実行する
        if(lanFlag) {
          $canvas = addCanvas();
          lanFlag_point = true;
          $(this).children(".lanOn").addClass("lanFrist");
          // points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
          points = [{x:e.pageX - 109, y:e.pageY - 105}];
          $(this).on("mousemove", lanMove);
        }
      }

      // マウスが移動したときに処理を実行する
      function lanMove(e){
        var ctx = $canvas.get(0).getContext('2d');

        // points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});
        points.push({x:e.pageX - 109, y:e.pageY - 105});

        var array = getRectPoints(
          points[0].x,
          points[0].y,
          points[points.length - 1].x,
          points[points.length - 1].y,
          2
        );

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        ctx.beginPath();
        // 線の色の変更
        if(!($(e.toElement).hasClass("lanFrist")) && $(e.toElement).hasClass("lanOn")) {
          ctx.fillStyle = 'rgb(47, 185, 254)';
        }
        else {
          ctx.fillStyle = 'rgb(251, 144, 3)';
        }
        ctx.moveTo(array[0].x, array[0].y);
        ctx.lineTo(array[1].x, array[1].y);
        ctx.lineTo(array[2].x, array[2].y);
        ctx.lineTo(array[3].x, array[3].y);
        ctx.closePath();
        ctx.fill();

      }

      // マウスのボタンが離されたときに処理を実行する
      function lanUp(e){

        /* 画像の真ん中に線を持ってくる関数を作る予定 */
        /* function lanCentre(e){} */

        $(this).off("mousemove", lanMove);

        // Lanの長さが短いとき(1px分しかドラック) または フラグが合う時×2
        if(points.length == 1 || (lanFlag == false && lanFlag_point == true) || $(e.toElement).hasClass("lanFrist")) {
          $canvas.remove();
        }

        points = [];
        lanFlag_point = false;
        $("#main img").removeClass("lanFrist");
      }

      $("#main").on("mousedown", lanDown);
      $("#main").on("mouseup", lanUp);

      canvasWidth = $('#main').width();
      canvasHeight = $('#main').height();

      /**************************************************************/

      // hoverを追加(lanBorder_on, lanBorder_off)
      $("#main img").hover(lanBorder_on, lanBorder_off);
      function lanBorder_on() {
        // フラグの設定
        lanFlag = true;
        // Class(lanON)の追加
        $(this).addClass("lanOn");
        // cssの設定を加える
        $(this).css({
          boxShadow: "0px 0px 10px #999",
          userSelect: "none",
        });
        // 一時的にドラッグ機能を無効
        $(this).draggable("disable");

      }
      function lanBorder_off() {
        // フラグの設定
        lanFlag = false;
        // Class(lanON)の削除
        $(this).removeClass("lanOn");
        // cssの設定を削除する
        $(this).css({
          boxShadow: "",
        });
        // ドラッグ機能を有効
        $(this).draggable("enable");
      }
    }

    else {
      $(this).attr("src", "img/lanCable.png");
      $("#main").off("mousedown", lanDown);
      $("#main").off("mouseup mouseleave", lanUp);
      /* hoverを消す(lanBorder) */
      $("#main img").off("mouseenter").off("mouseleave");
    }
  });
});
