function PegHoleContainerModel(x,y,filled){
	this.x = x;
	this.y = y;
	this.filled = filled;
}
PegHoleContainerModel.prototype.getString = function(){
	return "pegHoleContainer"+this.x+"-"+this.y;
};
function BoardModel(numberOfRows) {
	this.model = [];
	this.numRows = numberOfRows;
	this.create = function(){
		for (var i = 0; i < this.numRows; i++) {
			var horizontal = [];
			for (var j = 0; j <= i; j++){
				if (i===0 && j===0)
				{
				horizontal.push(new PegHoleContainerModel(i,j,false));

				}
				else
				{
					horizontal.push(new PegHoleContainerModel(i,j,true));
				}
			}
		this.model[i] = horizontal;
		}
	};
}
BoardModel.prototype.isHoleEmpty = function(x,y){
	if(!this.model[x][y]){
		return false;
	}
	if(this.model[x][y].filled === false){
		return true;
	}
	else{
		return false;
	}
};
BoardModel.prototype.getPegHoleContainer = function(x,y){
	return this.model[x][y];
};