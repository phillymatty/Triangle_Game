function newGame(sizeOfBoard){
		var model = new BoardModel(sizeOfBoard);
		model.create();
		var view =  new BoardView(model);
		view.setNewBoard();
		var controller = new BoardController(model,view);
	}
$(document).ready(function(){
	newGame(5);
});