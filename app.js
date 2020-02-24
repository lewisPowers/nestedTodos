var ENTER_KEY = 13;

var util = {
		/**
		 * uuid() generates and returns a compliant universally unique identifier.
		 *
		 * @return {String} uuidString
		 */
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
            App.todos = [];
            localStorage.clear('data');
            // view.displayTodos();
        },
	}

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
        }
        this.todos.push(todo);
        view.displayTodos();
    },

    // deleteTodo: function(position, array) {
    //     array.splice(position, 1);
    //     util.save('data', App.todos);
    //     view.displayTodos();
    // },

    deleteTodo: function(id, todos) {
        debugger;
        todos = todos || App.todos;
        // todos.forEach(function(todo) {
        for (var i = 0; i < todos.length; i++) {
            if (!todos[i].id || Array.isArray(todos[i])) {
                unwrapTodo(todos[i]);
            } else if (todos[i].id === id) {
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
        // todos.forEach(function(todo) {
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

    changeTodoContent: function(position, content) {
        this.todos[position].content = content;
        view.displayTodos();
    },

    // toggleCompleted: function(position) {
    //     this.todo.completed = !this.todo.completed;
    //     view.displayTodos();
    // },

    toggleCompleted: function(id, todos) {
        todos = todos || App.todos;
        // todos.forEach(function(todo) {
        for (var i = 0; i < todos.length; i++) {
            if (!todos[i].id) {
                todos[i] = todos[i][0];
            } else if (Array.isArray(todos[i])) {
                todos[i] = todos[i][0];
            } else  if (todos[i].id === id) {
                todos[i].completed = !todos[i].completed;
                return;
            }
            
            if (todos[i].nestedTodos.length) {
                var nestedArray = todos[i].nestedTodos;
                return this.toggleCompleted(id, nestedArray);
            }
        }
        
        view.displayTodos();
    },

    completeTree: function() {

    },

    deleteCompleted: function(todos) {
        todos = App.todos.filter(function(todo, index) {
            if (todo.nestedTodos.length) {
                return this.deleteCompleted(todo.nestedTodos);
            } else {
                return !todo.completed;
            }
        })
        
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
        var mainIdx = mainIdx || 0;
        var done = done || false;
        var targetArray;
        function closeLoop(id, todos) {
            for (var i = 0; i < todos.length; i++) {

                if (!done) {
                
                    if (todos[i].id === id) {
                        var spliced = todos.splice(i, 1);
                        if (Array.isArray(spliced)) {
                            spliced = spliced[0];
                        }
                        targetArray.splice(mainIdx + 1, 0, spliced);
                        return done = true;
                    } else if (todos[i].nestedTodos.length) {
                        targetArray = todos;
                        var nestedArray = todos[i].nestedTodos;
                        closeLoop(id, nestedArray);
                    } else {
                        
                        mainIdx++;
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
    // todos.forEach(function(todo) {
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i];
        if (!todo.id) {
            return todo[0];
        } else if (Array.isArray(todo)) {
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
        // var todos = util.save('data');
        var todos = App.todos;
        var todosUl = document.getElementById('todo-list');
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
                // for (var i = 0; i < list.length; i++) {
                    // var todo = list[i];

                // create and append li to ul

                    // list.flat();
                    // if (Array.isArray(todo)) {
                    //     todo = todo.flatMap(function(todo) {
                    //         return todo;
                    //     });
                    // }
                    
                    while (!todo.content) {
                        todo = todo[0];
                    }
                    var li = document.createElement('li');
                    li.setAttribute('data-id', todo.id);
                    li.className = 'li';
                    var todoLabel = document.createElement('label');
                    todoLabel.className = 'todo';
                    todoLabel.innerHTML = todo.content;
                    // li.textContent = todo.content;
                    var input = document.createElement('input');
                    input.className = 'toggle';
                    input.setAttribute('type', 'checkbox');
                    if (todo.completed) {
                        input.checked = true;
                    }
                    var deleteButton = document.createElement('button');
                    deleteButton.className = 'delete';
                    li.appendChild(input);
                    li.appendChild(todoLabel);
                    li.appendChild(deleteButton);
                    ul.appendChild(li);
                    
                    if (endOfTree) {
                        list = todo;
                        endOfTree = false;
                    }
                    // if nested todos, append new ul and repeat previous steps
                    while (!list.nestedTodos) {
                        // if ()
                        list = list[0];
                    }

                    // todos = todos.nestedTodos;
                    if (list.nestedTodos.length && index in list.nestedTodos !== false) {
                        while (!list.nestedTodos) {
                            list.nestedTodos = list.nestedTodos[0];
                        }
                        // switch list to nested array
                        list = list.nestedTodos;
                        // create and append new ul to parent ul
                        var newUl = document.createElement('ul');
                        ul.appendChild(newUl);
                        renderAll(list, newUl);
                    } else {
                        endOfTree = true;
                    }
                    
                })
                // }
            }
            renderAll(todos, todosUl);
        }
    },


    indexFromEl: function (el, todos) {   
        var id = el.closest('li').dataset.id;
        if (arguments.length < 2) {
            var todos = App.todos;
        }
        
        var i = todos.length;

        while (i--) {
            if (todos[i] === undefined) {
                i--;
            }
            while (!todos[i].id) {
                todos = todos[0];
            }
            if (todos[i].id === id) {
                return i;
            } else if (!todos[i].nestedTodos) {
                while (!todos[i].nestedTodos) {
                    todos = todos[0];
                }
            }  else if (todos[i].nestedTodos.length) {
                view.indexFromEl(el, todos[i].nestedTodos)
            }
        }
        

    },

    toggleNesting: function(todo) {

    },

    // check for nested todos
    checkForNestedTodos: function(todo) {
        if (/*todo.nestedTodos != undefined &&*/ todo.nestedTodos.length) {
            return true;
        } else {
            return false;
        }
    },

    eventListeners: function(e) {
        var mainDiv = document.getElementById('main');
        var todosUl = document.getElementById('todo-list');
        var todoInput = document.getElementById('todo-input');
        var otherUl = document.querySelectorAll('other');
        var clearCompleted = document.getElementById('clear-completed');
        


        todoInput.addEventListener('keydown', function(event) {
           
            if (event.keyCode === ENTER_KEY) {
                if (todoInput.value === '') {
                    return;
                } else {

                    // App.addTodo(todoInput.value);
                    App.createTodo(todoInput.value);

                    todoInput.value = '';
                    todoInput.focus();
                    // todoInput.textContent into li element (displayTodos)
                }
            }
        });

        todosUl.addEventListener('click', function(e) {
            var elClicked = e.target;
            var todo = elClicked.closest('li');
            var todoId = todo.dataset.id;

             if (e.target.className === 'toggle') {
                console.log('toggle button clicked');
                // App.toggleCompleted(todo);
                App.toggleCompleted(todoId);
            } else if (e.target.className === 'todo') {
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
            
            } else if (e.target.className === 'li') {
                // console.log(e.target.closest('ul'));
                // console.log(e.target.parentElement);
                console.log(e.target.children);
                // console.log(e.target.id);
            } else if (e.target.className === 'delete') {
                // var todoId = e.target.closest('li').dataset.id;
                App.deleteTodo(todoId);
            }
            view.displayTodos();
        })

        mainDiv.addEventListener('click', function(e) {
            var clearAll = document.getElementById('clear-button');
            var elClicked = e.target;
            if (e.target === clearAll) {

                util.deleteAll();
                view.displayTodos();
            } else if (elClicked === clearCompleted) {
                debugger;
                console.log(e.target)
                App.deleteCompleted();
            }
        })
        
    },


};

App.init();
