function newGame(sizeOfBoard, theColor){
	var model = new BoardModel(sizeOfBoard);
	model.create();
	var view =  new BoardView(model);
	view.setNewBoard(theColor);
	var controller = new BoardController(model,view);
}
$(document).ready(function(){
	newGame(5);
	$('.colorPicker').change(function(){
		theColor = $(this).val().toLowerCase();
		if(theColor == 'choose color' || theColor == '') {
			return false;
		} else {
			newGame(5, theColor);
		}
	});
});