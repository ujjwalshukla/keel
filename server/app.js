
var restify = require('restify'),
	toDoItems = [];

function getAllToDoItems(req, res, next) {
	'use strict';
	res.setHeader('Access-Control-Allow-Origin','*');
	res.send(toDoItems);
	next();
}

function getNewId() {
	'use strict';
	return toDoItems.reduce(function(pv,cv) {
		return parseInt(pv.id,10) > parseInt(cv.id,10) ? parseInt(pv.id,10) : parseInt(cv.id,10);
	},0) + 1;
}

function addToDoItems(req, res, next) {
	'use strict';
	res.setHeader('Access-Control-Allow-Origin','*');
	var newId = getNewId(),
		newToDoItems = {
			id : newId,
			item : req.params.item,
			completed : false
		};
	toDoItems.push(newToDoItems);
	res.send(newToDoItems);
	next();
}

function updateToDoItems(req, res, next) {
	'use strict';
	res.setHeader('Access-Control-Allow-Origin','*');
	for(var i=0; i<toDoItems.length; i++) {
		if (parseInt(toDoItems[i].id,10) === parseInt(req.params.id,10)){
			toDoItems[i].item = req.params.item;
			toDoItems[i].completed = req.params.completed;
			res.send(toDoItems[i]);
		}
	}
	next();
}

function deleteSelectedToDo(req, res, next) {
	'use strict';
	res.setHeader('Access-Control-Allow-Origin','*');
	for (var i = 0; i < toDoItems.length; i++) {
		if (parseInt(req.params.x,10) === parseInt(toDoItems[i].id,10)) {
			toDoItems.splice(i,1);
			res.send(toDoItems);
			break;
		}
	}
	next();
}

var server = restify.createServer();
server.use(restify.CORS());
server.use(restify.bodyParser());

server.get('/toDoItems', getAllToDoItems);
server.post('/toDoItems', addToDoItems);
server.put('/toDoItems/:x', updateToDoItems);
server.del('/toDoItems/:x', deleteSelectedToDo);

server.listen(8081, function() {
	'use strict';
});
