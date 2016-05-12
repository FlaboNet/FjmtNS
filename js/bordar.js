$(function(){

	var points = []; //ドラッグ時のマウスの座標を集める
	var $canvas; 		 //追加されたキャンバスを格納
	var canvasWidth;
	var canvasHeight;

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
		return $('<canvas width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>').appendTo('#main');
	}

	/* マウスのボタンが押されたときに処理を実行する */
	function mouseDown(e){
		$canvas = addCanvas();
		points = [{x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop}];
		$(this).on("mousemove", mouseMove);
	}

	/* マウスが移動したときに処理を実行する */
	function mouseMove(e){
		var ctx = $canvas.get(0).getContext('2d');

		points.push({x:e.pageX - this.offsetLeft, y:e.pageY - this.offsetTop});

		var array = getRectPoints(
			points[0].x,
			points[0].y,
			points[points.length - 1].x,
			points[points.length - 1].y,
			1
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

	/* マウスのボタンが離されたときに処理を実行する */
	function mouseUp(e){

		$(this).off("mousemove", mouseMove);

		if(points.length == 1){
			$canvas.remove();
		}

		points = [];
	}

	$('#main').on("mousedown",mouseDown);
	$('#main').on("mouseup mouseleave", mouseUp);

	canvasWidth = $('#main').width();
	canvasHeight = $('#main').height();

});
