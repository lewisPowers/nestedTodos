var ENTER_KEY = 13;
var ESCAPE_KEY = 27;    

var util = {
		
    uuid: function() {
        var uuidString = '';

        for (var i = 0; i < 32; i++) {
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuidString += '-';
            }
            
            var randomInt = Math.floor(Math.random() * 16);
            uuidString += randomInt.toString(16);
        }

        return uuidString;
    },

    /**
        * save() stores data in the browser's local storage if both the 
        * namespace and data arguments are passed in. If only namespace
        * is passed to save(), localStorage returns the data at that 
        * namespace. If the namespace does not exist, and empty array is
        * returned.
        *
        * @param {String} namespace
        * @param {Array} data
        * @return {Array}
        */
    save: function(namespace, data) {
        if (arguments.length > 1) {
            localStorage.setItem(namespace, JSON.stringify(data));
        } else {
            return JSON.parse(localStorage.getItem(namespace)) || [];
        }
    },

    deleteAll: function() {
        throw new TypeError('this function has been disabled')
        // App.todos = [];
        // localStorage.clear('data');
    },
};

var App = {

    todos: util.save('data'),
    // todos: [],

    init: function() {
        view.eventListeners();
        view.displayTodos();
    },

    // Create new todo and add it to the todos array.
    // addTodo: function(todo) { 
    //     this.todos.push(new Todo(todo));
    //     view.displayTodos();
    // },
    createTodo: function(content) {
        var todo = {
            content: content,
            id: util.uuid(),
            nestedTodos: [],
            completed: false
        };
        this.todos.push(todo);
        view.displayTodos();
    },

    deleteTodo: function(id, todos) {
        todos = todos || App.todos;

        for (var i = 0; i < todos.length; i++) {
            if (!todos[i].id || Array.isArray(todos[i])) {
                unwrapTodo(todos[i]);
            } else if (todos[i].id === id) {
                if (todos[i].nestedTodos.length) {
                    if (!App.checkNestsForCompletion(todos[i])) {
                        return;
                    }
                }
                return todos.splice(i, 1);
            }
            
            if (todos[i].nestedTodos.length) {
                var nestedArray = todos[i].nestedTodos;
                this.deleteTodo(id, nestedArray);
            }
        }
    },

    removeTodoById: function(id, todos) {
        todos = todos || App.todos;

        for (var i = 0; i < todos.length; i++) {
            if (!todos[i].id || Array.isArray(todos[i])) {
                unwrapTodo(todos[i]);
            } else if (todos[i].id === id) {
                var spliced = todos.splice(i, 1);
            }
            
            if (todos[i].nestedTodos.length) {
                var nestedArray = todos[i].nestedTodos;
                return this.removeTodoById(id, nestedArray);
            }
            if (spliced) {
                App.todos.splice(i, 0, spliced);
            }
        }
    },

    changeTodoContent: function(id, todos, newText) {
        todos = todos || App.todos;

        for (var i = 0; i < todos.length; i++) {
            if (!todos[i].id || Array.isArray(todos[i])) {
                unwrapTodo(todos[i]);
            } 
            
            if (todos[i].id === id) {
                todos[i].completed = false;
                todos[i].content = newText;
            } else if (todos[i].nestedTodos.length) {
                var nestedArray = todos[i].nestedTodos;
                this.changeTodoContent(id, nestedArray, newText);
            }
        }
        view.displayTodos();
    },

    completeTreeFalse: function(todo) {
        var route = '';
        
        todo.completed = false;
        // if (todo.nestedTodos.length) {
        //     App.completeTreeFalse(todo.nestedTodos);
        // }

    },

    completeTreeTrue: function(todos) {
        todos.map(function(todo) {
            todo.completed = true;
            if (todo.nestedTodos.length) {
                App.completeTreeTrue(todo.nestedTodos);
            }
        });
    },

    toggleCompleted: function(id, todos) {
        todos = todos || App.todos;
        function closeLoop(id, todos) {
            for (var i = 0; i < todos.length; i++) {
                if (todos[i].id === id) {
                    todos[i].completed = !todos[i].completed;
                    if (todos[i].completed === true) {
                        App.completeTreeTrue(todos[i].nestedTodos);
                    } 
                    else {
                        App.fixCompletion(App.todos);
                    }
                } else if (todos[i].nestedTodos.length) {
                    var nestedArray = todos[i].nestedTodos;
                    App.toggleCompleted(id, nestedArray);
                }
            }
        }
        closeLoop(id, todos);
        view.displayTodos();
    },
    
    fixCompletion: function(todos) {
        // var todos = App.todos;
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].completed) {
                if (!App.checkNestsForCompletion(todos[i])) {
                // if (!App.nestsComplete(todos[i].nestedTodos[0])) {
                    todos[i].completed = false;
                }
            } else if (todos[i].nestedTodos.length && App.checkNestsForCompletion(todos[i].nestedTodos[0])) {
                App.fixCompletion(todos[i].nestedTodos[0])
            }
        }
    },

    nestsComplete: function(todos) {
        return todos.every(function(item) {
            return item.completed;
        })
    },

    checkNestsForCompletion: function(todo) { // returns a boolean
        var id = todo.id;
        var todos = todo.nestedTodos;
        var nestedTodosAreComplete = todos.every(function(todo) {
                return todo.completed;
            })
        if (todos.length) {
            if (nestedTodosAreComplete) {
                todos.forEach(function(todo, i) {
                    if (todo.nestedTodos.length) {

                        if (todo.nestedTodos.every(function(task) {
                            return task.completed;
                        })) {
                            return true;
                        }
                    }
                });
                return true
            }
        }
        return false;
    },

    deleteCompleted: function(todos) {

        todos = todos || App.todos;
        var filteredTodos = todos.filter(function(todo) {
            if (!todo.id || Array.isArray(todo)) {
                todo = this.unwrapTodo(todo);
            } else if (todo.completed === false) {
                console.log(todo);
                return todo;
            }
            
            if (todo.nestedTodos.length) {
                var nestedArray = todo.nestedTodos;
                App.deleteCompleted(nestedArray);
            }
        })
        App.todos = filteredTodos;
    },

    moveTodo: function(idToMove, targetId, todos) {
        var todoToMove; 
        var moveIdx;
        var targetTodo;
        var targetIdx; 
        var done = false;

        function closeLoop(idToMove, targetId, todos) {
            todos.forEach(function(todo, index, array) {
                if (!done) {
                    if (todo.id === idToMove) {
                        todoToMove = array[index];
                        moveIdx = index;
                    } else if (todo.id === targetId) {
                        targetTodo = todo;
                        targetIdx = index;
                    }

                    if (targetIdx !== undefined && todoToMove) {
                        if (moveIdx < targetIdx) {
                            array.splice(targetIdx + 1, 0, todoToMove);
                            array.splice(moveIdx, 1);
                        } 
                        else {
                            array.splice(moveIdx, 1);
                            array.splice(targetIdx, 0, todoToMove);
                        }
                        done = true;
                    } else if (todo.nestedTodos.length) {
                        closeLoop(idToMove, targetId, array[index].nestedTodos)
                    }
                }
            })
        }
        closeLoop(idToMove, targetId, todos);
    },

    unwrapTodo: function(todo) {
        console.log('A todo needed to be unwrapped.')
        while (Array.isArray(todo)) {
            return todo[0];
        }
    },

    nestTodo: function(id, todos) {
     
        todos = todos || App.todos;
        var mainIdx = mainIdx || 0;
        var done = done || false;

        function closeLoop(id, todos) {

            for (var i = 0; i < todos.length; i++) {

                if (!done) {
                    if (todos[i].id === id) {
                        var target = todos[i - 1].nestedTodos;
                        var spliced = todos.splice(i, 1);
                        if (Array.isArray(spliced)) {
                            spliced = spliced[0];
                        }
                        target.push(spliced);
                        return done = true;
                    } else if (todos[i].nestedTodos.length) {
                        var nestedArray = todos[i].nestedTodos;
                        closeLoop(id, nestedArray);
                    } 
                } 
            }
        }
        closeLoop(id, todos);        
    },

    unnestTodo: function(id, todos) {
        todos = todos || App.todos;
        var mainTodos = App.todos;
        var mainIdx = 0;
        var done = false;
        var targetArray;

        function closeLoop(id, todos) {
            for (var i = 0; i < todos.length; i++) {

                if (!done) {
                    if (todos === mainTodos) {
                        mainIdx++;
                    } 
                    if (todos[i].id === id) {
                        var todoToMove = todos[i];
                        todos.splice(i, 1);
                        targetArray.splice(mainIdx, 0, todoToMove);
                        return done = true;
                    } else if (todos[i].nestedTodos.length) {
                        targetArray = todos;
                        var nestedArray = todos[i].nestedTodos;
                        closeLoop(id, nestedArray);
                    } 
                } 
            }
        }
        closeLoop(id, todos);
    },

    unnestTotally: function(id, todos) {
        todos = todos || App.todos;
        var mainTodos = App.todos;
        var mainIdx = 0;
        var done = false;
        // var targetArray;

        function closeLoop(id, todos) {
            for (var i = 0; i < todos.length; i++) {

                if (!done) {
                    if (todos === mainTodos) {
                        mainIdx++;
                    } 
                    if (todos[i].id === id) {
                        var todoToMove = todos[i];
                        todos.splice(i, 1);
                        App.todos.splice(mainIdx, 0, todoToMove);
                        return done = true;
                    } else if (todos[i].nestedTodos.length) {
                        // targetArray = todos;
                        var nestedArray = todos[i].nestedTodos;
                        closeLoop(id, nestedArray);
                    } 
                } 
            }
        }
        closeLoop(id, todos);
    }
};

function logIds(todos) {

    todos = todos || App.todos;
    todos.forEach(function(todo) {
        if (!todo.id) {
            return todo[0];
        } else if (Array.isArray(todo)) {
            return todo[0];
        } else {
            console.log(todo.id);
        }
        
        if (todo.nestedTodos.length) {
            var nestedArray = todo.nestedTodos;
            return logIds(nestedArray);
        }
    })
};

function getTodoById(id, todos) {

    var todos = todos || App.todos;
    todos.forEach(function(todo) {
        if (!todo.id) {
            return todo[0];
        } else if (Array.isArray(todo)) {
            return todo[0];
        } else  if (todo.id === id) {
            return todo;
        }
        
        if (todo.nestedTodos.length) {
            var nestedArray = todo.nestedTodos;
            return getTodoById(id, nestedArray);
        }
    })
};

function getTodoIdxById(id, todos) {

    var todos = todos || App.todos;
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i];
        if (!todo.id || Array.isArray(todo)) {
            return todo[0];
        } else  if (todo.id === id) {
            return i;
        }
        
        if (todo.nestedTodos.length) {
            var nestedArray = todo.nestedTodos;
            return getTodoIdxById(id, nestedArray);
        }
    }
};


var view = {

    displayTodos: function() {
        util.save('data', App.todos);
        var todos = App.todos;
        var todosUl = document.getElementById('todo-list');
        var todoInput = document.getElementById('todo-input');
        var endOfTree = false;
        var index = 0;
        
        if (!todos.length) {
            todosUl.innerHTML = 'No Todos!';
        } else {
            todosUl.innerHTML = '';
            function renderAll(list, ul) {
                list = list || todos;
                ul = ul || todosUl;

                list.forEach(function(todo) {
                    
                    while (!todo.content) {
                        todo = App.unwrapTodo(todo);
                    }
                    var li = document.createElement('li');
                    li.setAttribute('data-id', todo.id);
                    li.className = 'li';
                    li.draggable = true;
                    var todoLabel = document.createElement('label');
                    todoLabel.className = 'todo-label';
                    todoLabel.innerHTML = todo.content;
                    var input = document.createElement('input');
                    input.className = 'toggle';
                    input.setAttribute('type', 'checkbox');
                    if (todo.completed) {
                        input.checked = true;
                        todoLabel.style.cssText = "text-decoration: line-through;";
                    }
                    var deleteButton = document.createElement('button');
                    deleteButton.className = 'delete';
                    deleteButton.innerText = 'X';

                    li.appendChild(todoLabel);
                    li.appendChild(input);
                    li.appendChild(deleteButton);
                    ul.appendChild(li);
                    
                    if (endOfTree) {
                        list = todo;
                        endOfTree = false;
                    }
                    // if nested todos, append new ul and repeat previous steps
                    while (!list.nestedTodos) {
                        // console.log('line 446 displayTodos(): list did not have nested todos')
                        list = list[0];
                    }

                    if (list.nestedTodos.length && index in list.nestedTodos !== false) {
                        while (!list.nestedTodos) {
                            list.nestedTodos = list.nestedTodos[0];
                        }
                        // switch list to nested array
                        list = list.nestedTodos;
                        // create and append new ul to parent ul
                        var newUl = document.createElement('ul');
                        newUl.className = 'nested';
                        ul.appendChild(newUl);
                        renderAll(list, newUl);
                    } else {
                        endOfTree = true;
                    }
                })
            }
            renderAll(todos, todosUl);
        }
        // todoInput.focus();
    },

    editInput: function(parent, label) {
        var editInput = document.createElement('input');
        editInput.className = 'edit';
        parent.draggable = false;
        parent.replaceChild(editInput, label);
        editInput.value = label.innerText;
        editInput.focus();
    },

    editKeyup: function(e) {
        var el = e.target;
        if (e.which === ESCAPE_KEY) {
            // remove input and replace original todo text
            
        } else if (e.which === ENTER_KEY) {
            // input.value = todo.content
            App.changeTodoContent()
        }
    },

    update: function() {},



    eventListeners: function(e) {
        var mainDiv = document.getElementById('main');
        var todosUl = document.getElementById('todo-list');
        var todoInput = document.getElementById('todo-input');
        var clearCompleted = document.getElementById('clear-completed');
        var label = document.querySelectorAll('.todo-label');
        

        mainDiv.addEventListener('click', function(e) {
            var clearAll = document.getElementById('clear-button');
            var elClicked = e.target;
            if (e.target === clearAll) {
                util.deleteAll();
            } else if (elClicked === clearCompleted) {
                App.deleteCompleted();
            }
            // view.displayTodos();
        }, false);
    
        document.addEventListener('keyup', function(e) {
            var el = e.target;
            var todo = el.closest('li');
            var label = el.closest('label');
            var todoId = todo.dataset.id;

            if (e.keyCode === 191 && !e.shiftKey) { // '/' key
                todoInput.focus();
            } else if (e.which === ESCAPE_KEY && el.className === 'edit') {
                console.log('line 534 was reached');
                view.displayTodos();
            } else if (e.which === ENTER_KEY && el.className === 'edit') {
                console.log('line 537 was reached');
                App.changeTodoContent(todoId, App.todos, el.value);
                view.displayTodos();
            }
            
        }, false);
        
        todoInput.addEventListener('keydown', function(event) {
           
            if (event.keyCode === ENTER_KEY) {
                if (todoInput.value === '') {
                    return;
                } else {
                    App.createTodo(todoInput.value);
                    todoInput.value = '';
                    todoInput.focus();
                }
            }
        }, false);

        var pickedUp;
        var dropped;

        todosUl.addEventListener('mousedown', function(e) {
            pickedUp = e.screenX;
            console.log(pickedUp);
        }, false);

  


        todosUl.addEventListener('click', function(e) {
            // var timesClicked = e.detail;
            var elClicked = e.target;
            var todo = elClicked.closest('li');
            var label = elClicked.closest('label');
            var todoId = todo.dataset.id;

            if (e.altKey || e.shiftKey) {
                view.editInput(todo, label);

            } else if (e.target.className === 'toggle') {
                App.toggleCompleted(todoId);
            } else if (elClicked.className === 'todo-label') {
    
                var isFirst = todo.parentElement.firstElementChild;
                var parentId = todo.parentElement.id;
                if (todo === isFirst && parentId) {
                    return;
                } else if (todo.previousElementSibling) {
                    App.nestTodo(todoId);
                } else if (todo.previousElementSibling === null) {
                    App.unnestTodo(todoId);
                } else {
                    return;
                }
                
            } else if (e.target.className === 'delete') {
                App.deleteTodo(todoId);
            } 
            if (!e.altKey && !e.shiftKey) {
                view.displayTodos();
            } 
        }, false);

        var draggedTodo;
        var targetTodo;

        todosUl.addEventListener('drag', function(e) {
            var elDragged = e.target;
            var todo = elDragged.closest('li');
            if (elDragged.className === 'li') {
                draggedTodo = todo.dataset.id;
            }
            // console.log(e.screenX)
        }, false);

        todosUl.addEventListener("dragover", function(event) {
            // prevent default to allow drop
            event.preventDefault();
        }, false);

        todosUl.addEventListener('drop', function(e) {
            dropped = e.screenX;
            console.log(dropped, pickedUp - dropped);
            if ( (pickedUp - dropped) > 50) {
                console.log('accessed the function call to unnest!');
                App.unnestTotally(draggedTodo);
            };
            var dropTarget = e.target.closest('li');
            e.preventDefault();
            if (dropTarget) {
                targetTodo = dropTarget.dataset.id;
                App.moveTodo(draggedTodo, targetTodo, App.todos);
            }
            view.displayTodos();
        }, false);
    },
};

App.init();
