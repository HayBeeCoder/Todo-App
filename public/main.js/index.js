
const state = {
    todos: [],
    currentFilter: 'All',
    light: true
}

const events = {
    addItem: (text)=>{
        const todo = {text , completed: false}
        state.todos.push(todo);
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
         render();
        }
        
    }

}
window.onload = ()=>{
    console.log(inputElement);
    render();
}
const render = ()=>{
    console.log(state)
    window.requestAnimationFrame(()=>{
     const main = document.querySelector('#root');  
     console.log(main) ;
      const clonedMain = main.cloneNode(true);
      console.log(state)
      const newMain = update(clonedMain,state,events);
    console.log(newMain);
    main.replaceWith(newMain);
    const inputElement = document.querySelector('.form__input');
    
    inputElement.focus()
    }) 
}
render()

function update(clonedMain,state,events){
    console.log(state)
    const { todos,light,currentFilter }  = state;
     const list = clonedMain.querySelector('.todos__list');
     console.log(list)
    const toggle = clonedMain.querySelector('.header__icon');
    const counter  = clonedMain.querySelector('.todos__status');
    const filters = clonedMain.querySelector('.todos__filters');   
    const inputElement = clonedMain.querySelector('.form__input');
    const clearTodosBtn =  clonedMain.querySelector('.todos__clear')
    const generalCheckbox = clonedMain.querySelector('.form__checkbox');
    //Update components
    console.log(list);
     updateList(list,todos,events);
    updateToggle(toggle, light);
    updateCounter(counter,todos)
    updateCurrentFilter(filters,currentFilter);
    updateHeaderCheckbox(generalCheckbox,todos);
    // update(filters,state)
    //add appropriate Listeners 
    listenForInput(inputElement);
    listenForDeleteAllTodos(clearTodosBtn);
    listenForCheckAllTodos(generalCheckbox);
    listenForFilters(filters)
    // inputElement.focus();
    return  clonedMain;

}


function listenForFilters(filters){
    // for(let filter of filters){
        filters.addEventListener('click' , (e)=>{
            console.log(e.target)
            state.currentFilter = e.target.textContent;
        })
        console.log(state)
    // }
}
function listenForInput(targetElement){
    targetElement.addEventListener('keypress' , e => {
        if( targetElement.value && e.key == 'Enter'){
             events.addItem(e.target.value);
          
             e.target.value = '';
            
        }
        // e.preventDefault();
    })
}

function listenForDeleteAllTodos(targetELement){
    targetELement.addEventListener('click' , ()=>{
     events.clearCompleted();
    })
}

function listenForCheckAllTodos(targetElement){
    targetElement.addEventListener('change' , (e)=>{
        if(e.target.checked){
            events.completeAll();
        }else{
            events.uncompleteAll();
        }
    })
}

function updateList(list,todos,events){
    console.log(list);
    list.innerHTML = '';
    // console.log(list.innerHTML)
   todos
   .map((todo,index) => createTodo(todo,index,events)).forEach(todo => list.appendChild(todo));
  
}

function updateHeaderCheckbox(targetElement , todos){
    if(!todos.length) targetElement.checked = false;
}
function updateToggle(toggle,light){
    toggle.className = light ? "header__icon" : "header__icon header__icon--translate";
   
}
function updateCurrentFilter(filters,currentFilter){
    filters.addEventListener('click' , (e)=>{
        e.target.textContent = currentFilter;
    })

}
function updateCounter(counter,todos){
    counter.textContent = getItemsLeft(todos)
}
function getItemsLeft(todos){
    const itemsLeft =  todos.filter(todo => !todo.completed);
    const { length } = itemsLeft;
    if(length == 1){
        return `1 item left`
    }
    return `${length} items left`;
 }

function createTodoTemplate(){
    let template = document.getElementById('todo-item');
    console.log(template)
    return template.content.firstElementChild.cloneNode(true) 
}

 
function createTodo(todo,index,events){
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

    const handleCheckbox = (e)=>{
        if(e.target.checked){
            events.completeItem(index);
        }else{
            events.unCompleteItem(index);
        }
    }
    const handleDeleteX = ()=>{
        events.removeItem(index);
    }
    checkbox.addEventListener('change' , handleCheckbox)
    deleteX.addEventListener('click' , handleDeleteX)
    return newTodo;
}


