var nums = [];
var score = 0;

$(function(){
	newGame();
});

function newGame(){
	
	init();
	generateOneNumber()
	generateOneNumber()
}

//初始化页面
function init(){
	//初始化单元格的位置:原始单元格
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$('#grid-cell-'+i+'-'+j);
			gridCell.css('top',gettopposition(i,j));
			gridCell.css('left',getleftposition(i,j));
		}
	}
	//初始化数组
	for(var i=0;i<4;i++){
		nums[i]=new Array();//定义二重数组
		for(var j=0;j<4;j++){
			nums[i][j]=0;
		}
	}

    // nums[1][3]=4;
	updateView();
}

// 初始化单元格方块
function updateView(){
  	$(".number-cell").remove();
    
  	for(var i=0;i<4;i++){
  		for(var j=0;j<4;j++){
  			$('#grid-container').append(`<div class="number-cell" id="number-cell-${i}-${j}"></div>`)
  			var numberCell=$(`#number-cell-${i}-${j}`);
  			if(nums[i][j]==0){
				numberCell.css('width','0px');
				numberCell.css('height','0px');
				numberCell.css('top',gettopposition(i,j)+50);
				numberCell.css('left',getleftposition(i,j)+50);
			}else{
				numberCell.css('width','100px');
				numberCell.css('height','100px');
				numberCell.css('top',gettopposition(i,j));
				numberCell.css('left',getleftposition(i,j));
				numberCell.css('background-color',getNuberBgColor(nums[i][j]));
				numberCell.css('color',getNubColor(nums[i][j]));
				numberCell.text(nums[i][j]);
			}
  		}
  	}
}


//判断是还没有空间了
function noSpace(nums){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(nums[i][j]==0){
				return false;
			}
		}
	}
	return true; //true表示没空间
}


/**
 * 产生随机数(2或4)
 * 找到随机位置(空单元格)
 */
function generateOneNumber(){
	if(noSpace(nums)){
	   return;
	}

	var count = 0;
	var array = [];
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(nums[i][j]==0){
				array[count]=i*4+j; //i=2  j=1
				count++;
			}
		}
	}

	var n=Math.floor(Math.random()*count);
	var randX=Math.floor(array[n]/4); //2
	var randY=Math.floor(array[n]%4); //1

	var randNumber=Math.random()>0.5?2:4;
	nums[randX][randY]=randNumber;

	showNumberWithAnimation(randX,randY,randNumber);
    
    //统计相应分数
    $('#score').html(score);
    
    //判断：当上下左右按键均按不了后弹出框提示游戏结束
	if(!canMoveLeft(nums)&&!canMoveUp(nums)&&!canMoveRight(nums)&&!canMoveDown(nums)){
        
        setTimeout(Go,500)
		function Go(){
			alert('Game Over!!!');
		}
		
	}
 
}


/**
 * 实现键盘响应
 */

$(document).keydown(function(event){
 	event.preventDefault();

 	switch(event.keyCode){
 		case 37://left
 		    if(canMoveLeft(nums)){
 		    	moveLeft();
 		    	setTimeout(generateOneNumber,210);
 		    }
 		    break;
 		case 38://up
 		    if(canMoveUp(nums)){
 		    	moveUp();
 		    	setTimeout(generateOneNumber,210);
 		    }
 		    break;
 		case 39:
 		    if(canMoveRight(nums)){
 		    	moveRight();
 		    	setTimeout(generateOneNumber,210);
 		    }
 		    break;
 		case 40:
 		    if(canMoveDown(nums)){
 		    	moveDown();
 		    	setTimeout(generateOneNumber,210);
 		    }
 		    break;
 	}
})


//注意事项：往哪个方向滑动，循环就要从哪个方向开始
//向左移动
function moveLeft(){
 	for(var i=0;i<4;i++){
 		for(var j=1;j<4;j++){  //往左滑动循环从左边开始
 			if(nums[i][j]!=0){
 				for(var k=0;k<j;k++){
 					if(nums[i][k]==0&&noBlocklHorizontal(i,k,j,nums)){
 						showMoveAnimation(i,j,i,k);
 						nums[i][k]=nums[i][j];
 						nums[i][j]=0;
 						break; 
 					}else if(nums[i][k]==nums[i][j]&&noBlocklHorizontal(i,k,j,nums)){
 						showMoveAnimation(i,j,i,k);
 						nums[i][k]=2*nums[i][j];
 						score += nums[i][k];
 						nums[i][j]=0;
 						break 
 					}
 				}
 			}
 		}
 	}
 	setTimeout(updateView,200);
 }

//向右移动
function moveRight(){
 	for(var i=0;i<4;i++){
 		for(var j=2;j>=0;j--){ //往右滑动循环从右边开始
 			if(nums[i][j]!=0){
 				for(var k=3;k>j;k--){
 					if(nums[i][k]==0&&noBlockrHorizontal(i,j,k,nums)){
 						showMoveAnimation(i,j,i,k);
 						nums[i][k]=nums[i][j];
 						nums[i][j]=0;
 						break 
 					}else if(nums[i][k]==nums[i][j]&&noBlockrHorizontal(i,j,k,nums)){
 						showMoveAnimation(i,j,i,k);
 						nums[i][k]=2*nums[i][j];
 						score += nums[i][k];
 						nums[i][j]=0;
 						break 
 					}
 				}
 			}
 		}
 	}
 	setTimeout(updateView,200);
 }

// 向上移动
function moveUp(){
 	for(var i=1;i<4;i++){  //往上滑动循环从上边开始
		for(var j=0;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=0;k<i;k++){
					if(nums[k][j]==0&&noBlockuVertial(k,i,j,nums)){
						showMoveAnimation(i,j,k,j);
 						nums[k][j]=nums[i][j];
 						nums[i][j]=0;
 						break 
					}else if(nums[k][j]==nums[i][j]&&noBlockuVertial(k,i,j,nums)){
						showMoveAnimation(i,j,k,j);
 						nums[k][j]=2*nums[i][j];
 						score += nums[i][k];
 						nums[i][j]=0;
 						break 
					}
				}
			}
		}
	}
	setTimeout(updateView,200);
}

 // 向下移动
function moveDown(){
 	for(var i=2;i>=0;i--){  //往下滑动循环从下边开始
		for(var j=0;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=3;k>i;k--){
					if(nums[k][j]==0&&noBlockdVertial(i,k,j,nums)){
						showMoveAnimation(i,j,k,j);
 						nums[k][j]=nums[i][j];
 						nums[i][j]=0;
 						break 
					}else if(nums[k][j]==nums[i][j]&&noBlockdVertial(i,k,j,nums)){
						showMoveAnimation(i,j,k,j);
 						nums[k][j]=2*nums[i][j];
 						score += nums[i][k];
 						nums[i][j]=0;
 						break 
					}
				}
			}
		}
	}
	setTimeout(updateView,200);
}

