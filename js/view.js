function BoardView(model){
	this.model= model;
}
BoardView.prototype.getPegHTML = function(){
	return "<div class=\"peg\"></div>";
};
BoardView.prototype.getPegHoleHTML = function(){
	return "<div class=\"pegHole\" ></div>";
};
BoardView.prototype.getPegHoleContainerHTML = function(pegHoleContainer){
	var pegHoleContainerHTML = "<div class = \"pegHoleContainer\" id =\""+ pegHoleContainer.getString()+"\">";
	if (pegHoleContainer.filled){
		pegHoleContainerHTML += this.getPegHoleHTML() + this.getPegHTML() + "</div>";
	}else{
		pegHoleContainerHTML += this.getPegHoleHTML() + "</div>";
	}
	return pegHoleContainerHTML;
};
BoardView.prototype.getRowHTML = function(rowNum){
		return "<div class=\"pegRow\" id = \"pegRow" + rowNum + "\"></div>";
};
BoardView.prototype.setNewBoard = function (color){ //john param addition
	$(".triangle").empty(); //john addition
	for (var i = 0;i < this.model.model.length; i++) {
		var rowNum = i + 1;
		$('.triangle').append(this.getRowHTML(rowNum));
		for(var j = 0; j < this.model.model[i].length; j++){
			$('#pegRow'+ rowNum).append(this.getPegHoleContainerHTML(this.model.model[i][j]));
		}
	}
	$(".pegRow").each(function(index,element){
		if(typeof randomColor !== 'undefined' && typeof color !== 'undefined') { //john addition
			colors = randomColor({count: 3, hue: color,});
		} else {
			colors = ["#4878A8","#F07830","#781800"];
		}
		var randomNumber =  Math.floor(Math.random() * colors.length);
		$(element).find(".peg").css({"background-color" : colors[randomNumber]});});
	$(".peg").draggable({revert:"invalid",revertDuration:200,snap:".pegHole",snapMode:"inner",snapTolerance:19});
};
BoardView.prototype.regesterMoveStartHandler = function(handler){
	$(".peg").on("dragstart",function (event,ui){
		handler(ui.helper[0].parentNode.id);
	});
};
BoardView.prototype.setDroppable = function(pegHoleContainer,handler){
	$("#"+pegHoleContainer.getString()+ " > .pegHole").droppable({drop:function(event,ui){
		var oldPegHoleID= ui.draggable.parent().attr('id');
		ui.draggable.css({"top":"40px","left":"20px"});
		$(this).parent().append(ui.helper);
		BoardView.prototype.removeDroppables();
		handler($(this).parent().attr('id'),oldPegHoleID);},
		hoverClass:"over",tolerance:"intersect"});
};
BoardView.prototype.removeJumpedPeg = function(holeContainerID){
	holeContainerID = "#"+holeContainerID;
		$(holeContainerID + " > .peg").remove();
};
BoardView.prototype.showEnd = function(score){
	$(".gameOver").css({"display":"inline"});
		$(".score").html(score);
		if (score >= 5){
			score = 5;
		}
		var messages = ["Perfect!","So close!","Not bad!", "Average","Try Harder!"];
		$(".message").html(messages[score-1]);
		$("#tryAgain").on("click",function(){
			$(".gameOver").css({"display":"none"});
			$(".triangle").empty();
			newGame(5);
		});
};
BoardView.prototype.removeDroppables = function (){
	$('.ui-droppable').droppable('destroy');
};