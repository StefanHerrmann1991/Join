let newCategoryOpen = false;
let newSubtaskOpen = false;

/**
 * Initialization of tasks including HTML inclusion, backend initialization, 
 * user list rendering, task loading, categories loading and rendering.
 * Also sets up the priority event listener and compares date.
 */
async function initTasks() {
    await includeHTML();
    await initContactList();
    /*  tasks = await loadFromBackend('tasks', tasks); */
    categories = await loadFromBackend('categories', categories);
    console.log(categories);
    await renderUserList();
    await renderCategories();
    startPriorityEventListener();
    compareDate();
    highlightChosenMenu()
}


/**
 * Adds a new task to the tasks array. It processes the task inputs, 
 * assigns an id, saves the tasks and gives user a feedback on successful submission.
 * @param {string} board - The id of the board to which the task will be added.
 */
function addToTasks(board) {
    event.preventDefault();
    const task = processTaskInputs(board);
    task.id = tasks.length + 1; // set id when creating the task
    tasks.push(task);
    saveToBackend('tasks', tasks)
    openContainer('successfulSubmit');
    checkCurrentTitle();
}


function checkCurrentTitle() {
    if (document.getElementsByTagName('h1')[0].textContent !== 'Board') {
        setTimeout(function () {
            window.location.href = '../../main/02board/board.html';
        }, 1400);
    }
    else {
        renderBoards(tasks);
        closeContainer('addTasksPopup');
        clearInputTasks();
    }
    setTimeout(function () {
        closeContainer('successfulSubmit');
    }, 1500);
}

/**
 * Checks the data's validity. It sets 'required' attribute for the element if the array is empty.
 * Otherwise, it removes 'required' attribute.
 * @param {string} id - The id of the HTML element to be validated.
 * @param {Array} array - The array to be checked for emptiness.
 * @function
 */
function validateData(id, array) {
    let validateId = getId(id);
    if (array.length === 0 || validateId == undefined) validateId?.setAttribute('required', '');
    else validateId.removeAttribute('required');
}


/**
 * Processes and returns a task object from the inputs. 
 * If no board is provided, 'board-0' is used by default.
 * @param {string} [board='board-0'] - The id of the board to which the task is to be added.
 * @returns {object} The task object.
 */
function processTaskInputs(board) {
    if (board == undefined) board = 'board-0';
    else board = chosenBoard;
    let [title, description, category, date] = getIds('title', 'description', 'category', 'date');
    let urgency = getUrgency();
    let task = {
        'title': title.value,
        'description': description.value,
        'category': categories[category.value],
        'urgency': urgency,
        'date': date.value,
        'board': board,
        'assignedTo': assignedUsers,
        'subtasks': subtasks,
    };
    return task;
}


/**
 * Gets the value of the checked priority radio button.
 * @returns {string} The value of the checked radio button or undefined if no radio button is checked.
 */
function getUrgency() {
    let urgency;
    let selectedUrgency = document.querySelector('#urgency input.priority-radio:checked');
    if (selectedUrgency) urgency = selectedUrgency.value;
    return urgency;
}




/**
 * Cancels the category creation process and reverts the layout changes made in newCategory function. 
 * Then it re-renders the categories.
 */
function cancelNewCategory() {
    newCategoryOpen = false;
    getId('newCategoryBtn').classList.remove('d-none');
    renderCategories();
}


/**
 * Renders a color picker with colors fetched from the 'colorPicker' array.
 */
function renderColorPicker() {
    let pickColor = getId('colorPicker');
    pickColor.innerHTML = '';
    for (let i = 0; i < colorPicker.length; i++) {
        const color = colorPicker[i];
        pickColor.innerHTML += `<button type="button" onclick="chooseCategoryColor(${i})" class="category-color" style="background-color: ${color}"></button>`
    }
}


/**
 * Chooses a color for the new category to be added from the color picker.
 * @param {number} index - The index of the chosen color in the 'colorPicker' array.
 */
function chooseCategoryColor(index) {
    let colorId = getId('chosenColor');
    chosenColor = colorPicker[index];
    colorId.innerHTML = `<div style="background-color: ${chosenColor}" class="category-color"></div>`;
}


/**
 * Adds a new category with the provided topic and color. 
 * If no color is chosen, a default color '#E200BE' is assigned.
 * It then saves the new categories to the backend, cancels the new category input layout and re-renders the categories.
 */
function addCategory() {
    let topic = getId('categoryInput').value;
    if (topic.length > 2) {
        let color = chosenColor;
        if (chosenColor == undefined) color = '#E200BE';
        let newCategory = {
            'topic': topic,
            'color': color,
            'index': `${categories.length}`
        }
        categories.push(newCategory);
        saveToBackend('categories', categories);
        cancelNewCategory();
        renderCategories();
        closeNewCategory();
    }
    else closeContainerInTime(2000, 'popupMessageCategory');
}


function setRandomColor() {
    // Generating a random color in hexadecimal (e.g., #ff0033)
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}


/**
 * Renders categories to the HTML element with id 'categoryList'.
 * Iterates through the 'categories' array and creates a button for each category.
 */
function renderCategories() {
    let categoryOption = getId('categoryList');
    categoryOption.innerHTML = '';
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        categoryOption.innerHTML += categoryOptionsHTML(category, i);
    };
};


/**
 * Saves a category from the categories list by its index. It then validates the category and closes the category menu.
 * @param {number} index - The index of the category in the 'categories' array.
 */
function saveCategory(index) {
    let chosenCategoryOption = getId('openCategoryBtn');
    let category = categories[index];
    chosenCategoryOption.innerHTML = chosenCategoryHTML(category);
    validateData('validateCategory', category);
    renderCategories();
    closeContainer('categoryMenu');
}


/**
 * Starts an event listener for each priority radio button.
 * It adds the 'selected' class to the label of the checked radio button and removes it when another radio button is selected.
 * @param {string} [selectedValue] - The value of the radio button that is initially selected. 
 */
function startPriorityEventListener(selectedValue) {
    const radioEls = document.querySelectorAll('.priority-radio');
    radioEls.forEach(radioEl => {
        const parentLabel = radioEl.parentElement;
        if (radioEl.value === selectedValue) {
            parentLabel.classList.add('selected');
            radioEl.checked = true;
        }
        radioEl.addEventListener('change', () => {
            radioEls.forEach(r => r.parentElement.classList.remove('selected'));
            parentLabel.classList.add('selected');
            selectedValue = radioEl.value;
        });
    });
}


/**
 * Clears the inputs for tasks, subtasks and assigned users. It also removes the 'selected' class from priority radio buttons.
 */
function clearInputTasks() {
    let taksIds = getIds('title', 'description', 'category', 'date');
    clearInputValues(taksIds);
    const radioEls = document.querySelectorAll('.priority-radio');
    radioEls.forEach(r => r.parentElement.classList.remove('selected'));
    getId('renderedSubtasks').innerHTML = '';
    getId('userInitialContainer').innerHTML = '';
    getId('validateCategory').required = true;
    closeContainer('categoryMenu');
    cancelNewCategory();
    subtasks = [];
    assignedUsers = [];
}


/**
 * Disables the selection of a date before the current day on the HTML element with id 'date'.
 */
function compareDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
}


/**
 * Transforms the HTML element with id 'subtasks' into a subtask input form where new subtasks could be added to the task.
 */
function renderSubtasks() {
    let subtask = getId('subtasks')
    subtask.classList.remove('assign-btn-container')
    subtask.innerHTML = subtaskHTML();
}


/**
 * Cancels the process of adding a new subtask, reverts the HTML of 'subtasks'.
 */
function cancelSubtask() {
    let subtask = getId('subtasks');
    subtask.classList.add('assign-btn-container')
    subtask.innerHTML = cancelSubtaskHTML();
}


/**
 * Adds a new subtask based on the value inputted in 'subtaskInput' and updates the list of subtasks.
 */
function newSubtask() {
    let subtaskInput = getId('subtaskInput').value;
    if (subtaskInput.length > 2) {
        let renderedSubtasks = getId('renderedSubtasks');
        subtasks.push({ title: subtaskInput, checked: false });
        renderedSubtasks.innerHTML = "";
        subtasks.forEach((subtask, index) => {
            renderedSubtasks.innerHTML += newSubtaskHTML(subtask, index);
        });
    }
    else closeContainerInTime(2000, 'popupMessageSubtask');
}


/**
 * Toggles the checked status of a subtask.
 * @param {number} index - The index of the subtask in the 'subtasks' array.
 */
function updateSubtask(index) {
    subtasks[index].checked = !subtasks[index].checked;
}


function toggleUsersInput() {
    event.preventDefault();
    getId('userAssignBtn').classList.toggle('d-none');
    getId('userSearchInputCon').classList.toggle('d-none');
    getId('users-background').classList.toggle('white-background');
}


function openNewCategory() {
    toggleNewCategory();
    renderColorPicker();
}


function toggleNewCategory() {
    getId('newCategoryBtn').classList.toggle('d-none');
    getId('newCategoryContainer').classList.toggle('d-none');
}


function closeNewCategory() {
    console.log('trigere')
    toggleNewCategory();
    categoryInput.value = '';

}


function toggleCategoryInput() {
    event.preventDefault();
    getId('categoriesContainer').classList.toggle('d-none');
    getId('category-background').classList.toggle('white-background');
}


function renderUserList(filteredUsers) {
    let usersArray = filteredUsers || users;
    const userListContainer = getId('allUsersList');
    userListContainer.innerHTML = '';

    usersArray.forEach((user) => {
        let isChecked = assignedUsers.some(assignedUser => assignedUser.id === user.id) ? 'checked' : '';
        let userElementId = `user-${user.id}`;

        userListContainer.innerHTML += `
            <div id="${userElementId}" class="user-in-list">
                <div class="initial-name">
                    <div class="user-icon" style="background-color: ${user.color}">${user.initial}</div>
                    <div>${user.name}</div>
                </div>
                <input name="assignedUsers" type="checkbox" id="checkbox-${user.id}" class="subtask-checkbox" ${isChecked}
                       value="${user.name}" onclick="renderUserInitial(event, ${user.id})"> 
            </div>
        `;
    });

    // Add event listener to user-in-list elements
    userListContainer.querySelectorAll('.user-in-list').forEach(userElement => {
        userElement.addEventListener('click', () => {
            let checkbox = userElement.querySelector('.subtask-checkbox');
            if (event.target !== checkbox) {
                checkbox.click();
            }
            updateStylesForCheckedItems();
        });
    });
}

function updateStylesForCheckedItems() {
    document.querySelectorAll('.user-in-list').forEach(userElement => {
        let checkbox = userElement.querySelector('.subtask-checkbox');
        if (checkbox && checkbox.checked) {
            // Apply styles for checked items
            userElement.style.borderRadius = '10px';
            userElement.style.background = 'var(--version-2-main-color, #2A3647)';
            userElement.style.color = 'white';
        } else {
            // Reset styles for unchecked items
            userElement.style.borderRadius = '';
            userElement.style.background = '';
            userElement.style.color = '';
        }
    });
}


function renderDetailedUsers(userId) {
    let user = users.find(user => user.id === userId);
    if (user) {
        getId('userInitialContainer').innerHTML += `<div id="userIcon-${user.id}" class="user-icon" style="background-color: ${user.color}">${user.initial}</div>`;
    }
}

function renderUserInitial(event, userId) {
    let user = users.find(user => user.id === userId);
    if (!user) return;

    if (event.target.checked) {
        user.assigned = true;
        assignedUsers.push(user);
        getId('userInitialContainer').innerHTML += `<div id="userIcon-${user.id}" class="user-icon" style="background-color: ${user.color}">${user.initial}</div>`;
    } else {
        let userIndex = assignedUsers.findIndex(assignedUser => assignedUser.id === user.id);
        if (userIndex !== -1) {
            user.assigned = false;
            assignedUsers.splice(userIndex, 1);
            getId(`userIcon-${user.id}`).remove();
        }
    }
}


/* function handleClickOutside(event) {
    let usersSelect = document.getElementById('usersSelect');

    // Check if the click is outside the usersSelect element
    if (!usersSelect.contains(event.target)) {
        toggleInput();
    }
}

document.addEventListener('click', handleClickOutside); */


function filterUsers(searchTerm) {
    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);
    });
    renderUserList(filteredUsers)
}


