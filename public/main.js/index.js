
const state = {
    todos: [],
    currentFilter: 'All',
    light: true
}

const events = {
    
    addItem: (text)=>{
        const todo = {text , completed: false};
        if(state.duplicateTodos) state.duplicateTodos.push(todo);
        else if(state.currentFilter != 'Completed') state.todos.push(todo);
        render();
    },
    removeItem: (index)=>{
        state.todos.splice(index,1 );
        render();
    },
    completeItem: (index)=>{
        state.todos[index].completed = true;
        render();
    },
    unCompleteItem: (index)=>{
        state.todos[index].completed = false;
        render();
    },
    completeAll: ()=>{
        state.todos.forEach(todo => todo.completed = true);
        render();
    },
    uncompleteAll: ()=>{
        state.todos.forEach(todo => todo.completed = false);
        render();
    },
    clearCompleted: ()=>{
        if(state.todos.some(todo => todo.completed)){
         state.todos = state.todos.filter(todo => !todo.completed);
            if(state.duplicateTodos) state.duplicateTodos = state.duplicateTodos.filter(todo => !todo.completed);
         render();
        }   
    },
    toggle: ()=>{
        if(state.light){
            state.light = false
        }else{
            state.light = true;
        }
        render();
    },
    selectFilter: (filter)=>{
        state.currentFilter = filter;
        render();
    },
    syncFilters: ()=>{
        const filter = state.currentFilter;
        if(filter == 'All'){
            if(state.duplicateTodos) {
                state.todos = state.duplicateTodos;
                delete state.duplicateTodos};  
            }else if(filter == 'Active'){
                if(state.duplicateTodos){
                    // state.duplicateTodos = state.todos;
                    state.todos = state.duplicateTodos.filter(todo => !todo.completed) ;
                 }else{
                    state.duplicateTodos = state.todos;
                 }
                //  state.todos = state.duplicateTodo || state.todos;
                console.log('helllo')
                 state.todos = state.todos.filter(todo => !todo.completed);
             }else if(filter == 'Completed'){
                if(state.duplicateTodos){
                    state.todos = state.duplicateTodos.filter(todo => todo.completed);
                 }else{
                    state.duplicateTodos = state.todos;
                    state.todos = state.duplicateTodos.filter(todo => todo.completed);
                 }
             }
             render();
         }

}

/*const render = ()=>{
    
    window.requestAnimationFrame(()=>{
     const main = document.querySelector('#root');  

      const clonedMain = main.cloneNode(true);
    
      const newMain = update(clonedMain,state,events);
    
    main.replaceWith(newMain);
    const inputElement = document.querySelector('.form__input');
    
    inputElement.focus()
    }) 
}
render()*/

function update(clonedMain,state,events){
    
    const { todos,light,currentFilter }  = state;

     const list = clonedMain.querySelector('.todos__list');
    const toggle = clonedMain.querySelector('.header__icon');
    const counter  = clonedMain.querySelector('.todos__status');
    const filters = clonedMain.querySelectorAll('.todos__filters li');   
    const inputElement = clonedMain.querySelector('.form__input');
    const clearTodosBtn =  clonedMain.querySelector('.todos__clear')
    const generalCheckbox = clonedMain.querySelector('.form__checkbox');
    //Update components
    
     updateList(list,todos,currentFilter);
    updateToggle(toggle, light,clonedMain);
    updateCounter(counter,state)
    updateCurrentFilter(filters,currentFilter);
    updateHeaderCheckbox(generalCheckbox,todos,currentFilter);
    //add appropriate Listeners 
    listenForInput(inputElement);
    listenForDeleteAllTodos(clearTodosBtn);
    listenForCheckAllTodos(generalCheckbox);
    listenForFilters(filters);
    listenForToggle(toggle);
    // inputElement.focus();
    return  clonedMain;

}


// LISTENERS 
function listenForFilters(filters){
    // events.syncFilters();
        filters.forEach(filter => {
            filter.addEventListener('click' , ()=>{
                events.selectFilter(filter.textContent);
                events.syncFilters()
        })
        })
}
function listenForInput(targetElement){
    targetElement.addEventListener('keypress' , e => {
        if( targetElement.value && e.key == 'Enter'){
             events.addItem(e.target.value);
            events.syncFilters()
             e.target.value = '';
        }
    })
}

function listenForDeleteAllTodos(targetELement){
    targetELement.addEventListener('click' , ()=>{
     events.clearCompleted();
    })
}

function listenForToggle(targetElement){
    targetElement.addEventListener('click' ,()=>{
        events.toggle();
    })

}

function listenForCheckAllTodos(targetElement){
    targetElement.addEventListener('change' , (e)=>{
        if(e.target.checked){
            events.completeAll();
        }else{
            events.uncompleteAll();
        }
        // events.syncFilters()
    })
}


// UI UPDATES
function updateList(list,todos,events){
    list.innerHTML = '';
   todos
   .map((todo,index) => createTodo(todo,index,events)).forEach(todo => list.appendChild(todo));
  
}

function updateHeaderCheckbox(targetElement , todos,currentFilter){
    // if(currentFilter != 'All') targetElement.disabled = true;
    if(!todos.length || todos.some(todo => !todo.completed)) targetElement.checked = false;
     if(todos.length && todos.every(todo => todo.completed )) targetElement.checked = true;
     if(currentFilter != 'All') targetElement.disabled = true;
     else targetElement.disabled = false;
}

function updateToggle(toggle,light,clonedMain){
    if(light){
        clonedMain.classList.remove('dark')
        toggle.classList.remove('header__icon--translate');
    }else{
        clonedMain.classList.add('dark');
        toggle.classList.add('header__icon--translate')
    }
}
function updateCurrentFilter(filters,currentFilter){
    filters.forEach(filter => {
        if(filter.textContent == currentFilter){
            filter.classList.add('active');
            
        }else{
            filter.classList.remove('active');
        }
    })
}

//HELPERS
function updateCounter(counter,state ){
    let { todos , duplicateTodos} = state;
    counter.textContent = getItemsLeft(todos,duplicateTodos)
}
function getItemsLeft(todos,duplicateTodos){
    if(duplicateTodos) todos = duplicateTodos;
    const itemsLeft =  todos.filter(todo => !todo.completed);
    const { length } = itemsLeft;
    if(length == 1){
        return `1 item left`
    }
    return `${length} items left`;
 }

function createTodoTemplate(){
    let template = document.getElementById('todo-item');
    return template.content.firstElementChild.cloneNode(true) 
}

 
function createTodo(todo,index,currentFilter){
    const newTodo = createTodoTemplate();
    const {text , completed}= todo;
    const checkbox = newTodo.querySelector('.todo__checkbox');
    const deleteX  = newTodo.querySelector('.todo__cancel');
    newTodo.querySelector('.todo__name').textContent = text;
    if(completed){
        newTodo.querySelector('.todo__name').classList.add('todo__name--completed');
        newTodo.querySelector('.todo__checkbox').checked = true;
        newTodo.querySelector('.todo__cancel').style.display = 'none';
    }
    checkbox.disabled = false;
    if(currentFilter != 'All'){
        checkbox.disabled = true;
    }
    const handleCheckbox = (e)=>{
        if(e.target.checked){
            events.completeItem(index);
       
        }else{
            events.unCompleteItem(index);
      
        }
        events.syncFilters();
    }
    const handleDeleteX = ()=>{
        events.removeItem(index);
    }
    checkbox.addEventListener('change' , handleCheckbox)
    deleteX.addEventListener('click' , handleDeleteX)
    return newTodo;
}



