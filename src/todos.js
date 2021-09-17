const { request } = require('express');

const express = require('express');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const users = []; 

function VerifyIfExistesUsersNickname(request, response, next) {
    const { username } = request.headers;
    
    

    const user = users.find((user) => user.username === username);

    
    if(!user){
        return response.status(400).json({error: "User not found"});
    }

   request.user = user;

    return next();
}


app.post("/users" , (request, response) => {

    const { name , username } = request.body;
    
    const userAlreadyExist = users.some((user) => user.username === username);

    if(userAlreadyExist){
        return response.status(400).json({error: "User already Exists!"});
    }

    const user = {
        name,
        username,
        id: uuidv4(),
        todos: []

    };
    
    users.push(user);
    

    return response.status(201).json({mensage: "Usuario Criado", user});

});

app.get("/users", VerifyIfExistesUsersNickname, (request, response) => {
    const { user } = request;

    return response.json(user);
})
app.post("/todos",VerifyIfExistesUsersNickname , (request, response) => {

    const {title , deadline} = request.body;

    const { user } = request;

    const todosOperation= {
        id: uuidv4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    };

    user.todos.push(todosOperation);

    return response.status(201).send("Todos was created!");



});

app.get("/todos", VerifyIfExistesUsersNickname, (request, response) => {
    const { user } =  request;

    return response.json(user.todos);
});

app.put("/todos/:id", VerifyIfExistesUsersNickname, (request, response) => {
    const { id } = request.params;

    const { user } = request;

    const { title, deadline} = request.body;

    
    const infoTodos = user.todos;


    const userid = infoTodos.find((user) => user.id === id);

    if(!userid){
        return response.status(400).json({error: "ID dont found!"})
    }

    userid.title = title;
    userid.deadline = deadline;

    return response.status(201).json({ok: "todos as updated!", userid});


});

app.patch("/todos/:id/done", VerifyIfExistesUsersNickname, (request, response) => {

    const { id } = request.params;

    const { user } = request;

    const infoTodos = user.todos;

    const userid = infoTodos.find((user) => user.id === id);

    if(!userid){
        return response.status(400).json({error: "ID dont found!"})
    }
    

    userid.done = true;
    

    return response.status(201).json({ok: "todos as updated!", userid});

})

app.delete("/todos/:id", VerifyIfExistesUsersNickname, (request, response) => {
    const { id } = request.params;

    const { user } = request;

    
     infoTodos = user.todos;

    const userid = infoTodos.find((user) => user.id === id);

    if(!userid){
        return response.status(400).json({error: "ID dont found!"})
    }

    const indexUser = infoTodos.findIndex(
        userIndex => userIndex.id === infoTodos.id);
        infoTodos.splice(indexUser, 1);

    return response.status(200).json({ok: "Todo excluded"});

})
app.listen(3333);