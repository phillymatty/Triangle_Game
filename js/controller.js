function BoardController(model,view){
 this.model = model;
 this.view = view;
 this.availableHoles = [];
 this.jumpables = [];
 this.currentPeg = null;
 this.score = 0;
 view.regesterMoveStartHandler($.proxy(this.findAvailableHoles,this));
 //view.regesterMoveEndHandler($.proxy(this.updateModel,this))
}
BoardController.prototype.addHoles = function(x,y){
	var pegHoleContainer = this.model.getPegHoleContainer(x,y);
	this.availableHoles.push(pegHoleContainer);
	this.view.setDroppable(pegHoleContainer,$.proxy(this.updateModel,this));
	};
BoardController.prototype.addJumpables = function(x,y){
	this.jumpables.push(this.model.getPegHoleContainer(x,y));
};
BoardController.prototype.convertIdToXCoor = function (pegID){
	return parseInt(pegID.charAt(16),10);
};
BoardController.prototype.convertIdToYCoor = function(pegID){
	return parseInt(pegID.charAt(18),10);
};
BoardController.prototype.getPegHoleContainerByID = function (pegID){
	var xCoor =  this.convertIdToXCoor(pegID);
	var yCoor = this.convertIdToYCoor(pegID);
	return this.model.getPegHoleContainer(xCoor,yCoor);
};
BoardController.prototype.clearController = function (){
	this.availableHoles = [];
	this.jumpables = [];
};
BoardController.prototype.findAvailableHoles = function (pegID){
	console.log(pegID);
	this.clearController();
	this.currentPeg = this.getPegHoleContainerByID(pegID);

	this.checkDirections(this.currentPeg.x,this.currentPeg.y);

	console.log("avail " + this.availableHoles);
	console.log("jumpables" + this.jumpables);
};
BoardController.prototype.checkDirections = function(x,y){
	this.checkUp(x,y);
	this.checkDown(x,y);
	if(this.model.model[x].length >= 3){
	this.checkLeft(x,y);
	this.checkRight(x,y);
	}
};
BoardController.prototype.checkUp = function(x,y){
	console.log("Check up ");

	if((x-2) < 0){
		console.log("Up is out of bounds");
		return;
	}
	else{
		if(y-2 >= 0 && y < this.model.model[x-2].length){
			console.log("there are 2");
			if(this.model.isHoleEmpty(x-2,y)){
				//now we check if there is a peg inbetween
				if(!this.model.isHoleEmpty(x-1,y)){
					this.addJumpables(x-1,y);
					this.addHoles(x-2,y);
				}
			}
			if(this.model.isHoleEmpty(x-2,y-2)){
				//now we check if there is a peg inbetween
				if(!this.model.isHoleEmpty(x-1,y-1)){
					this.addJumpables(x-1,y-1);
					this.addHoles(x-2,y-2);
				}
			}
		}
		else{
			console.log("only one up");
				if(y >= this.model.model[x-2].length){
					console.log("up left");
					if(this.model.isHoleEmpty(x-2,y-2)){
						if(!this.model.isHoleEmpty(x-1,y-1)){
							this.addJumpables(x-1,y-1);
							this.addHoles(x-2,y-2);
						}
					}
			}
			else{
				console.log("up right");
				if(this.model.isHoleEmpty(x-2,y)){
					console.log('here1');
				//now we check if there is a peg inbetween
				if(!this.model.isHoleEmpty(x-1,y)){
					console.log('here2');
					this.addJumpables(x-1,y);
					this.addHoles(x-2,y);
				}
			}
			}
		}
	}

};
BoardController.prototype.checkDown = function(x,y){
	console.log("Check down");
	if (x+2 >= this.model.model.length){
		console.log("down is out of bounds");
		return;
	}else{
		if (this.model.isHoleEmpty(x+2,y)){
			if (!this.model.isHoleEmpty(x+1,y)){
				this.addHoles(x+2,y);
				this.addJumpables(x+1,y);
			}

		}
		if (this.model.isHoleEmpty(x+2,y+2)) {
			if(!this.model.isHoleEmpty(x+1,y+1)){
				this.addHoles(x+2,y+2);
				this.addJumpables(x+1,y+1);
			}
		}
	}
};
BoardController.prototype.checkLeft = function(x,y){
	console.log("Check left");
	if(y-2 >= 0){
		console.log("can go left");
		if(this.model.isHoleEmpty(x,y-2)){
			if(!this.model.isHoleEmpty(x,y-1)){
				this.addHoles(x,y-2);
				this.addJumpables(x,y-1);
			}
		}
	}
};
BoardController.prototype.checkRight = function(x,y){
	console.log("Check right");
	if(y+2 < this.model.model[x].length){
		console.log("can go right");
		if(this.model.isHoleEmpty(x,y+2)){
			if(!this.model.isHoleEmpty(x,y+1)){
				this.addHoles(x,y+2);
				this.addJumpables(x,y+1);
			}
		}
	}
};
BoardController.prototype.findJumpedpeg = function(holeContainerID){
	for (var i = 0; i < this.availableHoles.length; i++){
		if(this.availableHoles[i].getString() === holeContainerID){
			return this.jumpables[i].getString();
		}
	}
};

BoardController.prototype.updateModel = function(holeContainerID,oldContainerID){

	console.log("updateModel "+oldContainerID);
	this.model.getPegHoleContainer(this.convertIdToXCoor(oldContainerID), this.convertIdToYCoor(oldContainerID)).filled = false;
	this.model.getPegHoleContainer(this.convertIdToXCoor(holeContainerID), this.convertIdToYCoor(holeContainerID)).filled = true;
	console.log(this.model);
	var jumpedPegID = this.findJumpedpeg(holeContainerID);
	this.view.removeJumpedPeg(jumpedPegID);
	this.model.getPegHoleContainer(this.convertIdToXCoor(jumpedPegID), this.convertIdToYCoor(jumpedPegID)).filled = false;
	if(this.checkForEnd()){
		this.view.showEnd(this.score);
	}
};
BoardController.prototype.checkForEnd = function(){
	this.score = 0;
	for(var i = 0; i < this.model.model.length;i++){
		for(var j = 0; j < this.model.model[i].length;j++){
			if (this.model.model[i][j].filled === true){
				this.clearController();
				this.score ++;
				this.checkDirections(this.model.model[i][j].x,this.model.model[i][j].y);
				if (this.availableHoles.length > 0){
					console.log("false");
					return false;
				}
			}
		}
	}
	console.log("true");
	return true;
};