//TODO APP 2015

var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var _ = require('underscore');
var bodyParser = require('body-parser');
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

//GET /
app.get('/',function(req, res){
    res.send('TODO API ROOT');
});

//GET /todos
app.get('/todos',function(req, res){
    res.json(todos);
});

//GET todos/:id?completed=true&description="Watch the"
app.get('/todos/:id',function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id: todoId});

/*    todos.forEach(function(todo){
        if(todoId === todo.id)
            matchedTodo = todo;
    });
*/



    if(matchedTodo)
        res.json(matchedTodo);
    else res.status(400).json({"error":"There exist no item with id of " + todoId});
});

//POST todos/:id
app.post('/todos',function(req, res){
    var body = req.body;

    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
        return res.status(400).send();

    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});

//PUT todos/:id
app.put('/todos/:id',function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id: todoId});
    var body = _.pick(req.body,'description','completed');
    var validAttributes = {};

    if(!matchedTodo)
        return res.status(404).json({"error":"There exist no item with id of " + todoId});

    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed))
        validAttributes.completed = body.completed;
    else if(body.hasOwnProperty('completed'))
            return res.status(400).send();

    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.length > 0)
        validAttributes.description = body.description;
    else if(body.hasOwnProperty('description'))
        return res.status(400).send();

    _.extend(matchedTodo,validAttributes);
    res.json(matchedTodo);
});

//DELETE todos/:id
app.delete('/todos/:id',function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id: todoId});
    if(matchedTodo) {
        todos = _.without(todos,matchedTodo);
        res.json(matchedTodo);
    }
    else res.status(404).json({"error":"There exist no item with id of " + todoId});
});

app.listen(PORT,function(){
    console.log('Server running at localhost on PORT ' + PORT + '!');
});