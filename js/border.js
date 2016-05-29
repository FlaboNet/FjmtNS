/*
 * ネットワークシミュレータのプログラム
 * LANの動作について
 *
 * do:
 * bg:
 *
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

  // 線の座標を整える関数
  function getRectPoints(ptax, ptay, ptbx, ptby) {
    var array = [];
    array.push({x:ptax, y:ptay});
    array.push({x:ptbx, y:ptby});
    return array;
  }

  // class(.dust)のクリック
  $(".dust").click(function(){
    // 変数のリセット
    ctxArr = [];
    lanArr = [];
    nodeInt = 0;
    // lanLinckがある時
    if($("#main img").hasClass("lanLinck")){
      $("#main").off("mousedown", lanDown2);
      $("#main").off("mouseup", lanUp2);
    }
    // 画像と線の削除
    $("#main img").remove();
    $("#main canvas").remove();
  });

  // class(.lan)のクリック
  $(".lan").click(function(){
    // LANが押されているときの動作
    if($(this).attr("src") == "img/lanCable.png"){
      // lanLinckがある時
      if($("#main img").hasClass("lanLinck")){
        $("#main").off("mousedown", lanDown2);
        $("#main").off("mouseup", lanUp2);
      }

      // 画像を変更
      $(this).attr("src", "img/lanCable_2.png");

      // 画像のドラッグ防止
      $("#main img").mouseup(function(e) { e.preventDefault(); });
      $("#main img").mousedown(function(e) { e.preventDefault(); });

      // Canvasを追加する関数
      function addCanvas()　{ return $('<canvas width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>').prependTo('#main');　}

      // マウスのボタンが押されたときに処理を実行する関数
      function lanDown(e){
        // imgにマウスが乗っているときに実行する
        if(lanFlag) {
          // canvasの追加
          $canvas = addCanvas();
          lanFlag_point = true;
          // lanLinckがある場合
          if ($(this).children(".lanOn").hasClass("lanLinck"))　{ lnkFlag = true; }
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

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        // 線の色の変更
        if(!($(e.target).hasClass("lanFrist")) && $(e.target).hasClass("lanOn")) { ctx.strokeStyle = '#2fb9fe'; }
        else { ctx.strokeStyle = '#fb9003'; }
        ctx.lineWidth = 2;
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();
        ctx.fill();
      }

      // マウスのボタンが離されたときに処理を実行する関数
      function lanUp(e){
        // 画像の真ん中に線を持ってくる動作（コードが冗長なのでできれば改善）
        if (!($(e.target).hasClass("lanFrist")) && $(e.target).hasClass("lanOn")){
          var ctx = $canvas.get(0).getContext('2d');
          points.push({x:e.pageX - this.offsetLeft - e.offsetX + 38, y:e.pageY - this.offsetTop - e.offsetY + 38});
          var array = getRectPoints(
            pointsFirst[0].x,
            pointsFirst[0].y,
            points[points.length - 1].x,
            points[points.length - 1].y
          );

          // 線（LAN）が付いた画像を動かしたときに線も一緒に付いてくる動作の変数保存
          ctxArr[nodeInt] = $canvas.get(0).getContext('2d');
          lanArr[nodeInt] = array;
          $(".lanOn").addClass("lanLinck eP_"+ nodeInt);

          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.beginPath();
          ctx.moveTo(pointsFirst[0].x, pointsFirst[0].y);
          ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
          ctx.stroke();
          ctx.fill();
        }

        $(this).off("mousemove", lanMove);
        nodeInt++;

        // Lanの長さが短いとき(1px分しかドラック) または フラグが合う時×2
        if(points.length == 1 || (lanFlag == false && lanFlag_point == true) || $(e.target).hasClass("lanFrist")) {
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

  // マウスを押したとき、線（LAN）が付いた画像を動かしたときに線も一緒に付いてくる動作
  function lanDown2(e) {
    if ($(e.target).hasClass("lanLinck")){
      $(this).on("mousemove", lanMove2);
    }
  }

  // ドラッグしている時、線（LAN）が付いた画像を動かしたときに線も一緒に付いてくる動作
  function lanMove2(e){
    for(var i=0; i < nodeInt; i++){
      if ($(e.target).hasClass("sP_"+ i)){
        var ctx = ctxArr[i];
        points.push({x:e.pageX - this.offsetLeft - e.offsetX + 38, y:e.pageY - this.offsetTop - e.offsetY + 38});
        var array = getRectPoints(
          points[points.length - 1].x,
          points[points.length - 1].y,
          lanArr[i][1].x,
          lanArr[i][1].y
        );
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.moveTo(array[0].x, array[0].y);
        ctx.lineTo(array[1].x, array[1].y);
        ctx.stroke();
        ctx.fill();
      }
      else if ($(e.target).hasClass("eP_"+ i)){
        var ctx = ctxArr[i];
        points.push({x:e.pageX - this.offsetLeft - e.offsetX + 38, y:e.pageY - this.offsetTop - e.offsetY + 38});
        var array = getRectPoints(
          lanArr[i][0].x,
          lanArr[i][0].y,
          points[points.length - 1].x,
          points[points.length - 1].y
        );
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.beginPath();
        ctx.moveTo(array[0].x, array[0].y);
        ctx.lineTo(array[1].x, array[1].y);
        ctx.stroke();
        ctx.fill();
      }
    }
  }

  // マウスを放した時、線（LAN）が付いた画像を動かしたときに線も一緒に付いてくる動作
  function lanUp2(e){
    // ドラックした時
    if(!(points.length == 0)){
      for(var i=0; i < nodeInt; i++){
        if ($(e.target).hasClass("sP_"+ i)){
          var array = getRectPoints(
            points[points.length - 1].x,
            points[points.length - 1].y,
            lanArr[i][1].x,
            lanArr[i][1].y
          );
          lanArr[i] = array;
        }
        else if ($(e.target).hasClass("eP_"+ i)){
          var array = getRectPoints(
            lanArr[i][0].x,
            lanArr[i][0].y,
            points[points.length - 1].x,
            points[points.length - 1].y
          );
          lanArr[i] = array;
        }
      }
    }
    $(this).off("mousemove", lanMove2);
    points = [];
  }

});
