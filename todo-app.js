(function() {

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.textContent = title;
        return appTitle;

    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true; // скрываем кнопку

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;

    }


    function createTodoItem(todoItem, { onDone, onDelete }) {

        let item = document.createElement('li');


        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');


        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');


        if (todoItem.done) {
            item.classList.add('list-group-item-success');
        }
        item.textContent = todoItem.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        doneButton.disabled = done; //задаем кнопке полученное значение
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';


        doneButton.addEventListener('click', function() {
            todoItemElement.item.classList.toggle('list-group-item-success', todoItem.done);
            onDone({ todoItem, element: item });
        });


        deleteButton.addEventListener('click', function() {

            onDelete({ todoItem, element: item });
        });


        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);


        return item;





    }


    async function createTodoApp(container, title, owner) {


        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        const handlers = {
            onDone({ todoItem }) {
                todoItem.done = !todoItem.done;
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'PATCH',
                    body: json.stringify({ done: todoItem.done }),
                    headers: {
                        'Content-type': 'application/json',
                    },
                });
            },
            onDelete({ todoItem, element }) {
                if (!confirm('Are you sure?')) {
                    return

                }
                element.remove();
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
                    method: 'DELETE',

                });
            }
        }





        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        //запрос на все дела с сервера
        const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        const todoItemList = await response.json();

        todoItemList.forEach(todoItem => {
            const todoItemElement = createTodoItem(todoItem, headers);
            todoList.append(todoItemElement);

        });



        todoItemForm.input.addEventListener('input', function() { //при вводе кнопка работает если ввод не пустой

            if (todoItemForm.input.value === '') {
                todoItemForm.button.disabled = true;
            } else {
                todoItemForm.button.disabled = false;
            }

        });


        todoItemForm.form.addEventListener('submit', async function(e) {



            e.preventDefault();

            if (!todoItemForm.input.value) {

                return;
            }

            //создаем дело на сервере
            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                body: JSON.stringify({
                    name: todoItemForm.input.value.trim(),

                }),
                headers: {
                    'Content-type': 'application/json',
                },

            });

            //с сервера загружаем созданное дело в html
            const todoItem = await response.json();
            const todoItemElement = createTodoItem(todoItem, headers);



            todoList.append(todoItemElement);


            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });

    }







    window.createTodoApp = createTodoApp;



})();