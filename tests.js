tests({

//     'It should display todos.': function() {
//         App.deleteAll(); 
//        eq(App.todos.length, 0);
//        App.addTodo('item added');
//        App.addTodo('another item added');
//        var liElements = document.getElementsByTagName('li').length
//        eq(liElements, 2);
//     },

//     'It should display todo content in li element.': function() { 
//         App.deleteAll();
//        App.addTodo('item added');
//        var li = document.querySelector('li')
//        eq(li.textContent, 'item added');
//     },

//     'It should add todos to the todos array.': function() { 
//        App.deleteAll();
//        App.addTodo('item added');
//        eq(App.todos.length, 1);
//        eq(App.todos[0].content, 'item added')
//     },

//     'It should change a todo in the todos array.': function() {       
//         eq(App.todos.length, 1);
//         eq(App.todos[0].content, 'item added');
//         App.changeTodoContent(0, 'changed todo');
//         eq(App.todos.length, 1);
//         eq(App.todos[0].content, 'changed todo');
//     },

//     'It should delete todos from the todos array.': function() {       
//        eq(App.todos.length, 1);
//        App.deleteTodo(0);
//        eq(App.todos.length, 0);
//     },

//     // 'It should get length of the todos array.': function() {       
//     //    App.deleteAll();
//     //    App.addTodo(0);
//     //    App.addTodo(0);
//     //    App.addTodo(0);

//     //    eq(App.getLength(), 3);
//     // },

//     // 'It should get length of all the nested todos arrays and add to todos.length.': function() {       
//     //    App.deleteAll();
//     //    App.addTodo(0);
//     //    App.addTodo(1);
//     //    App.addTodo(0);
//     //    App.addTodo(0);
//     //    App.nestTodo(1);

//     //    eq(App.getLength(), 4);
//     // },

//     // 'It should get length recursively through all todos arrays.': function() {       
//     //    App.deleteAll();
//     //    App.addTodo(0);
//     //    App.addTodo(1);
//     //    App.addTodo(2);
//     //    App.addTodo(0);
//     //    App.nestTodo(2);
//     //    App.nestTodo(1);

//     //    eq(App.getLength(), 4);
//     // },

//     'It should delete todo[i] from todos array if nested.': function() {      
//         App.addTodo('This is not nested');
//         App.addTodo('This should be nested');
//         App.nestTodo(1);
//         eq(App.todos.length, 1);
//     },

//     'It should nest todos[i] into todos[i-1].nestedTodos.': function() { 
    
//         eq(App.todos[0].nestedTodos[0][0].content, 'This should be nested');
//     },

//     'It should move todos from the original todos array into the array of the todo it is nested to.': function() {      
       
//         eq(App.todos[0].nestedTodos[0].length, 1);
//     },

//     'It should unnest todos back into the todos array.': function() {      
//         eq(App.todos.length, 1);
//        App.unnestTodo();
//        eq(App.todos.length, 2);
//     },

//     'It should delete all todos.': function() { 
//         App.deleteAll();
//         App.addTodo('This is not nested');
//         App.addTodo('This should be nested'); 
//         eq(App.todos.length, 2);    
//         App.deleteAll();
//         eq(App.todos.length, 0);
//     },

    

//     // 'It should allow for any todo to have nested todos': function() { 
//     //     debugger;      
//     //     eq(App.todos.length, 0);
//     //     App.addTodo('item added');
//     //     eq(App.todos.length, 1);
//     //     App.nestTodo(0, 'this item is nested');
//     //     eq(App.todos[0].nest.length, 1);
//     //     eq(App.todos[0].nest[0].content, 'this item is nested');
//     // },

   
});
