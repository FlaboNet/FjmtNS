/*
 * ネットワークシミュレータのプログラム
 * LANの動作について
 *
 * do: コードが冗長なので短くしたい
 * bg: 線が引かれた時にクリックした時のエラー(動作の影響度無だが気になる)
 *     画像同士が重なると線がおかしくなる(動作の影響度中)[Z軸の問題]
 */

$(function(){

  var ctxArr = [];        // キャンバス情報の保存配列
  var lanArr = [];        // LANの座標情報の保存配列
  var nodeInt = 0;        // Nodeの個数

  var points = [];        // ドラッグ時のマウスの座標を集める
  var pointsFirst = [];   // ドラッグ開始時のマウスの座標
  var $canvas;            // 追加されたキャンバスを格納
  var canvasWidth;        // mainの幅
  var canvasHeight;       // mainの高さ
  var lanFlag;            // フラグ
  var lnkFlag;            // フラグ2
  var lanFlag_point;      // フラグ3

  // 線を描く関数
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

  // class(.dust)のクリック
  $(".dust").click(function(){
    // 変数のリセット
    ctxArr = [];
    lanArr = [];
    nodeInt = 0;

    //lanLinckがある時
    if( $("#main img").hasClass("lanLinck") ){
      $("#main").off("mousedown", lanDown2);
      $("#main").off("mouseup", lanUp2);
    }

    $("#main img").remove();
    $("#main canvas").remove();
  });

  // class(.lan)のクリック
  $(".lan").click(function(){

    // LANが押されているときの動作
    if($(this).attr("src") == "img/lanCable.png"){
      // lanLinckがある時
      if( $("#main img").hasClass("lanLinck") ){
        $("#main").off("mousedown", lanDown2);
        $("#main").off("mouseup", lanUp2);
      }

      // 画像を変更
      $(this).attr("src", "img/lanCable_2.png");

      // 画像のドラッグ防止
      $("#main img").mouseup(function(e){
        e.preventDefault();
      });
      $("#main img").mousedown(function(e){
        e.preventDefault();
      });

      // Canvasを追加する関数
      function addCanvas(){
        return $('<canvas width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>').prependTo('#main');
      }

      // マウスのボタンが押されたときに処理を実行する関数
      function lanDown(e){
        // imgにマウスが乗っているときに実行する
        if(lanFlag) {
          // canvasの追加
          $canvas = addCanvas();
          lanFlag_point = true;
          // lanLinckがある場合
          if ($(this).children(".lanOn").hasClass("lanLinck")){ lnkFlag = true; }
          // Classの追加
          $(this).children(".lanOn").addClass("lanFrist lanLinck sP_"+ nodeInt);
          // マウスを押した場所から線を描画
          points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
          // マウスを押した画像の真ん中から線を描画
          pointsFirst = [{x:e.pageX - this.offsetLeft - e.offsetX + 38, y:e.pageY - this.offsetTop - e.offsetY + 38}];
          $(this).on("mousemove", lanMove);
        }
      }

      // マウスが移動したときに処理を実行する関数
      function lanMove(e){
        var ctx = $canvas.get(0).getContext('2d');

        points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});

        var array = getRectPoints(
          points[0].x,                  // 線Xの始点
          points[0].y,                  // 線Yの始点
          points[points.length - 1].x,  // 線Xの終点
          points[points.length - 1].y,  // 線Yの終点
          2                             // 線の太さ
        );

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();

        // 線の色の変更
        if(!($(e.toElement).hasClass("lanFrist")) && $(e.toElement).hasClass("lanOn")) { ctx.fillStyle = '#2fb9fe'; }
        else { ctx.fillStyle = '#fb9003'; }

        ctx.moveTo(array[0].x, array[0].y);
        ctx.lineTo(array[1].x, array[1].y);
        ctx.lineTo(array[2].x, array[2].y);
        ctx.lineTo(array[3].x, array[3].y);
        ctx.closePath();
        ctx.fill();

      }

      // マウスのボタンが離されたときに処理を実行する関数
      function lanUp(e){

        // 画像の真ん中に線を持ってくる動作（コードが冗長なのでできれば改善）
        if (!($(e.toElement).hasClass("lanFrist")) && $(e.toElement).hasClass("lanOn")){
          var ctx = $canvas.get(0).getContext('2d');
          points.push({x:e.pageX - this.offsetLeft - e.offsetX + 38, y:e.pageY - this.offsetTop - e.offsetY + 38});

          var array = getRectPoints(
            pointsFirst[0].x,
            pointsFirst[0].y,
            points[points.length - 1].x,
            points[points.length - 1].y,
            2
          );

          // 線（LAN）が付いた画像を動かしたときに線も一緒に付いてくる動作の変数保存
          ctxArr[nodeInt] = $canvas.get(0).getContext('2d');
          lanArr[nodeInt] = array;
          $(".lanOn").addClass("lanLinck eP_"+ nodeInt);

          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.beginPath();
          ctx.moveTo(array[0].x, array[0].y);
          ctx.lineTo(array[1].x, array[1].y);
          ctx.lineTo(array[2].x, array[2].y);
          ctx.lineTo(array[3].x, array[3].y);
          ctx.closePath();
          ctx.fill();
        }

        $(this).off("mousemove", lanMove);
        nodeInt++;

        // Lanの長さが短いとき(1px分しかドラック) または フラグが合う時×2
        // e.toElementが IE と FireFox だと null undefined になる（取得できない） 他の方法で取得すれば OK（たぶんないかも）
        if(points.length == 1 || (lanFlag == false && lanFlag_point == true) || $(e.toElement).hasClass("lanFrist")) {
          nodeInt--;
          if (lnkFlag == true) { $(".sP_"+ nodeInt).removeClass("sP_"+ nodeInt); }
          else { $(".sP_"+ nodeInt).removeClass("lanLinck sP_"+ nodeInt); }
          $canvas.remove();
        }

        points = [];
        points_first = [];
        lanFlag_point = false;
        $("#main img").removeClass("lanFrist");
      }

      $("#main").on("mousedown", lanDown);
      $("#main").on("mouseup", lanUp);

      canvasWidth = $('#main').width();
      canvasHeight = $('#main').height();

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
      // 画像を変える
      $(this).attr("src", "img/lanCable.png");
      $("#main").off("mousedown", lanDown);
      $("#main").off("mouseup mouseleave", lanUp);
      // hoverを消す(lanBorder)
      $("#main img").off("mouseenter").off("mouseleave");

      // lanLinckがある時
      if( $("#main img").hasClass("lanLinck") ){
        $("#main").on("mousedown", lanDown2);
        $("#main").on("mouseup", lanUp2);
      }

    }
  });

  // 線（LAN）が付いた画像を動かしたときに線も一緒に付いてくる動作
  function lanDown2(e) {
    if ($(e.toElement).hasClass("lanLinck")){
      $(this).on("mousemove", lanMove2);
    }
  }

  function lanMove2(e){
    for(var i=0; i < nodeInt; i++){
      if ($(e.toElement).hasClass("sP_"+ i)){
        var ctx = ctxArr[i];
        points.push({x:e.pageX - this.offsetLeft - e.offsetX + 38, y:e.pageY - this.offsetTop - e.offsetY + 38});
        var array = getRectPoints(
          points[points.length - 1].x,  // 線Xの終点
          points[points.length - 1].y,  // 線Yの終点
          lanArr[i][1].x,               // 線Xの始点
          lanArr[i][1].y,               // 線Yの始点
          2                             // 線の太さ
        );
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.moveTo(array[0].x, array[0].y);
        ctx.lineTo(array[1].x, array[1].y);
        ctx.lineTo(array[2].x, array[2].y);
        ctx.lineTo(array[3].x, array[3].y);　
        ctx.closePath();
        ctx.fill();
      }
      else if ($(e.toElement).hasClass("eP_"+ i)){
        var ctx = ctxArr[i];
        points.push({x:e.pageX - this.offsetLeft - e.offsetX + 38, y:e.pageY - this.offsetTop - e.offsetY + 38});
        var array = getRectPoints(
          lanArr[i][0].x,               // 線Xの始点
          lanArr[i][0].y,               // 線Yの始点
          points[points.length - 1].x,  // 線Xの終点
          points[points.length - 1].y,  // 線Yの終点
          2                             // 線の太さ
        );
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.moveTo(array[0].x, array[0].y);
        ctx.lineTo(array[1].x, array[1].y);
        ctx.lineTo(array[2].x, array[2].y);
        ctx.lineTo(array[3].x, array[3].y);　
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  function lanUp2(e){
    for(var i=0; i < nodeInt; i++){
      if ($(e.toElement).hasClass("sP_"+ i)){
        var array = getRectPoints(
          points[points.length - 1].x,  // 線Xの始点
          points[points.length - 1].y,  // 線Yの始点
          lanArr[i][1].x,               // 線Xの終点
          lanArr[i][1].y,               // 線Yの終点
          2                             // 線の太さ
        );
        if ( !(array === undefined) ){
          lanArr[i] = array;
        }
      }
      else if ($(e.toElement).hasClass("eP_"+ i)){
        var array = getRectPoints(
          lanArr[i][0].x,               // 線Xの始点
          lanArr[i][0].y,               // 線Yの始点
          points[points.length - 1].x,  // 線Xの終点
          points[points.length - 1].y,  // 線Yの終点
          2                             // 線の太さ
        );
        if ( !(array === undefined) ){
          lanArr[i] = array;
        }
      }
    }

    $(this).off("mousemove", lanMove2);
    points = [];
  }

});
