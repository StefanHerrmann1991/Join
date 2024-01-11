/**
 * An array of boards.
 * @type {Object[]}
 * @property {string} boardTitle - The title of the board.
 * @property {string} boardId - The ID of the board.
 * @property {string} boardName - The name of the board.
 */
let boards = [
    { boardTitle: 'To do', boardId: 'board-0', boardName: 'todoBoard' },
    { boardTitle: 'In progress', boardId: 'board-1', boardName: 'progressBoard' },
    { boardTitle: 'Awaiting Feedback', boardId: 'board-2', boardName: 'awaitingFeedbackBoard' },
    { boardTitle: 'Done', boardId: 'board-3', boardName: 'doneBoard' }
]


/**
 * A boolean parameter that indicates an open or closed details window.
 * @type {boolean}
 */
let detailsAreOpen = false;
let editIsOpen = false;


/**
 * A number that stores the current task which will be able to be deleted.
 * @type {number}
 */
let currentIndexDelete;


/**
 * This asynchronous function initializes the state of the boards. It includes the necessary
 * HTML, initializes the task adding process, connects to the backend, initializes tasks, 
 * and finally renders the boards.
 */
async function initBoards() {
    await includeHTML();
    await initContactList();
    tasks = await loadFromBackend('tasks', tasks);
    categories = await loadFromBackend('categories', categories);
    await renderBoards(tasks);
    highlightChosenMenu()
}


/**
 * This function renders a new board button in the 'addBoard' container. It dynamically creates 
 * HTML for the button, allowing for board creation cancellation and confirmation.
 */
function renderNewBoardBtn() {
    let subtask = getId('addBoard')
    subtask.classList.remove('assign-btn-container')
    subtask.innerHTML = `
        <div class="subtasks-container">
            <input id="newBoardInput" placeholder="Add new Board">
            <div class="button-container">
                <button type="button" class="cancel-button" onclick="cancelBoardCreation()"><img
                        src="../../assets/img/cancelDark.png"></button>
                <button type="button" class="add-button" onclick="addNewBoard()"><img src="../../assets/img/checkDark.png"></button>
            </div>
        </div>
    `
}



/**
 * This function is used to render the boards with the provided task array. It generates the HTML for each 
 * board and appends it to the 'boards' container. Each board gets a unique id and title.
 *
 * @param {Array} array - The array of tasks to be rendered on the boards.
 */
function renderBoards(array) {
    let boardsContent = getId('boards');
    boardsContent.innerHTML = '';
    for (let i = 0; i < boards.length; i++) {
        board = boards[i]
        boardId = board['boardId'];
        boardTitle = board['boardTitle'];
        boardName = board['boardName'];
        boardsContent.innerHTML += boardsContentHTML(board);
        renderEachBoard(boardTitle, boardId, array);
    }
}


/**
 * This function is used to set the current board. It's triggered by clicking on the plus button in the board header.
 *
 * @param {String} boardName - The name of the board to be set as the current board.
 */
function setBoard(boardName) {
    chosenBoard = boardName
}


/**
 * This function is used to render each board with the provided task array.
 * 
 * @param {String} boardTitle - The title of the board.
 * @param {String} boardId - The id of the board.
 * @param {Array} array - The array of tasks to be rendered on the board.
 */
function renderEachBoard(boardTitle, boardId, array) {
    let boardTaskArray = array.filter(t => t['board'] == `${boardId}`);
    getId(`${boardId}`).innerHTML = '';
    if (boardTaskArray.length == 0) getId(`${boardId}`).innerHTML = renderEmptyBoard(boardTitle);
    for (let i = 0; i < boardTaskArray.length; i++) {
        const element = boardTaskArray[i];
        const taskIndex = array.indexOf(element);
        getId(`${boardId}`).innerHTML += boardTaskHTML(element, taskIndex);
    }
}


/**
 * This function renders an empty board with a provided board title.
 * 
 * @param {String} boardTitle - The title of the board.
 * @return {String} - HTML string for an empty board.
 */
function renderEmptyBoard(boardTitle) {
    return `<div class="empty-board">No tasks ${boardTitle.toLowerCase()}</div>`;
}


/**
 * This function prepares a container to be moved by setting up its style and listeners.
 * 
 * @param {Number} id - The id of the container to be moved.
 */
function startDragging(id) {
    movedContainer = getId(`task-${id}`)
    movedContainer.style = 'transform: rotate(3deg);';
    currentDraggedElement = id;
    const dropZones = document?.querySelectorAll(".board-task-container");
    dropZones.forEach(dropZone => {
        dropZone.addEventListener("dragenter", function (dragEvent) {
            dragEvent.target.classList.add("hovered");
        });
        dropZone.addEventListener("dragleave", function (dragEvent) {
            dragEvent.target.classList.remove("hovered");
        });
    });
}


/**
 * This function allows a dragged item to be dropped into an element.
 * 
 * @param {Event} ev - The ondragover event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * This function moves a task to a new board and then saves and re-renders the tasks.
 * 
 * @param {String} board - The id of the board where the task will be moved.
 */
function moveTo(board) {
    tasks[currentDraggedElement]['board'] = board;
    saveToBackend('tasks', tasks);
    renderBoards(tasks);
}


/**
 * This function moves a task to a specified board, saves tasks, and renders the boards.
 * 
 * @param {Number} i - The index of the task in the tasks array.
 * @param {String} targetBoard - The id of the board where the task will be moved.
 */
function moveToBoard(i, targetBoard) {
    tasks[i]['board'] = targetBoard;
    saveToBackend('tasks', tasks);
    renderBoards(tasks);
}


/**
 * This function renders the user icons for all users in a provided array.
 * 
 * @param {Array} usersArr - The array of users.
 * @return {String} - HTML string of user icons.
 */
/**
 * This function renders the user icons for all users in a provided array.
 * 
 * @param {Array} usersArr - The array of users.
 * @return {String} - HTML string of user icons.
 */
function renderAssignedUsers(usersArr) {
    let iconsHTML = '';
    if (usersArr && usersArr.length > 0) {
        for (let index = 0; index < usersArr.length; index++) {
            const user = usersArr[index];
            if (index == 2 && !detailsAreOpen) {
                iconsHTML += `<span class="user-icon" alt="user icon" style="background-color: #2A3647">${usersArr.length - 2}+</span>`
                break;
            }
            if (!detailsAreOpen) iconsHTML += `
            <span class="user-icon" alt="user icon" style="background-color: ${user.color}">${user.initial}</span>`;
            if (detailsAreOpen) iconsHTML += `
            <div class="user-details">
            <span class="user-icon" alt="user icon" style="background-color: ${user.color}">${user.initial}</span>
            <div>${user.name}</div>
            </div>
            `;
        }
        return iconsHTML;
    }
    else return iconsHTML = `<div>No user assigned</div>`
}


function renderEditAssignedUsers(usersArr) {
    let iconsHTML = '';
    if (usersArr && usersArr.length > 0) {
        for (let index = 0; index < usersArr.length; index++) {
            const user = usersArr[index];
            iconsHTML += `
            <span id="userIcon-${user.id}" class="user-icon" alt="user icon" style="background-color: ${user.color}">${user.initial}</span>`;
        }
        return iconsHTML;
    }
    else return iconsHTML = `<div>No user assigned</div>`
}



/**
 * This function opens a task for editing.
 * 
 * @param {Number} index - The index of the task in the tasks array.
 */
function openTask(index) {
    tasks[index]
    renderEditTask();
}


/**
 * Renders the detailed view of a specific task.
 * @param {number} index - The index of the task in the 'tasks' array.
 */
async function renderDetailedTask(index) {
    detailsAreOpen = true;
    let task = tasks[index]
    let editTask = getId('editTaskDialog')
    openContainer('editTaskDialog')
    editTask.innerHTML = editTaskHTML(task, index);
    renderSubtasksDetails(index);
}


/**
 * Renders the subtasks for a specific task in the detailed view.
 * @param {number} index - The index of the task in the 'tasks' array.
 */
function renderSubtasksDetails(index) {
    let subtaskId = getId(`subtask-${index}`)
    let subtasks = tasks[index].subtasks
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        let checkedValue = subtask.checked ? "checked" : "";
        subtaskId.innerHTML += `
    <div class="subtask-checkbox-container">
        <input name="subtask" class="subtask-checkbox" type="checkbox" value="0" onchange="updateEditSubtask(${index}, ${i})" ${checkedValue}>
        <div>${subtask.title}<div>
    </div>`;
    }
}


/**
 * Toggles the checked status of a subtask in edit mode.
 * @param {number} taskIndex - The index of the task in the 'tasks' array.
 * @param {number} subtaskIndex - The index of the subtask in the 'subtasks' array of the task.
 */
function updateEditSubtask(taskIndex, subtaskIndex) {
    tasks[taskIndex].subtasks[subtaskIndex].checked = !tasks[taskIndex].subtasks[subtaskIndex].checked;
    saveToBackend('tasks', tasks)
}


/**
 * Renders the task editing form for a specific task.
 * @param {number} index - The index of the task in the 'tasks' array.
 */
async function renderEditTask(index) {
    detailsAreOpen = true;
    let editTask = getId('editTaskDialog');
    let task = tasks[index];
    assignedUsers = task.assignedTo;
    editTask.innerHTML = editTaskDialogHTML(index, task);
    categories = await loadFromBackend('categories', categories);
    await renderCategories();
    openCurrentCategory(task.category)
    startPriorityEventListener(task.priority);
    renderUserList()
    compareDate();
}


function openCurrentCategory(category) {
    let chosenCategoryOption = getId('openCategoryBtn');
    chosenCategoryOption.innerHTML = chosenCategoryHTML(category);
}


function renderTaskSubtasks(subtaskArray) {
    subtasks = subtaskArray;   
    let subtaskHTML = '';
    if (subtaskArray.length > 0) {
        for (let index = 0; index < subtaskArray.length; index++) {
            const subtask = subtaskArray[index];
                     subtaskHTML += editSubtaskHTML(subtask, index);
        }
    }
    return subtaskHTML;
}



/**
 * Changes the properties of a task based on the inputs in the task editing form, saves the updated 'tasks' array to the backend, 
 * and re-renders the task boards.
 * @param {number} index - The index of the task in the 'tasks' array.
 * @param {string} board - The board to which the task belongs.
 */
async function changeTask(index, board) {
    event.preventDefault();
    chosenBoard = board
    let task = processTaskInputs(board);
    tasks[index] = task;
    saveToBackend('tasks', tasks)
    closeTaskDialog();
    renderBoards(tasks);
    editIsOpen = false;
}


/**
 * Closes the task editing dialog and re-renders the task boards.
 */
function closeTaskDialog() {
    detailsAreOpen = false;
    closeContainer('editTaskDialog');  
    renderBoards(tasks);
}

function closeEditTask() {
    closeContainerEvent();
    editIsOpen = false;
}


/**
 * Displays a list of users with names or emails that match the input string.
 * @param {string} val The input string to match against.
 */
function showResultsTasks(val) {
    const tasksList = autocompleteMatchTask(val.toLowerCase());
    if (tasksList.length !== 0) renderBoards(tasksList);
    else renderBoards(tasks)
}


/**
 * The function matches the input in the search input field with the names and emails of the users array.
 * @param {string} input A string containing a name or email.
 * @returns An array of users with names or emails that match the input string.
 */
function autocompleteMatchTask(input) {
    if (input == '') return [];
    let reg = new RegExp(input, 'i');
    return tasks.filter(function (task) {
        if (task.title.match(reg) || task.description.match(reg) || task.category.topic.match(reg)) return task;
    });
}


/**
 * Deletes an element from an array, updates the data on the server,  and renders boards.
 */
function deleteTask() {
    tasks.splice(currentIndexDelete, 1);
    saveToBackend('tasks', tasks)
    closeTaskDialog();
    closeContainer('deletePopup');
    renderBoards(tasks);
}


/**
 * Opens a specified dialog for deleting a task.
 *
 * @param {number} index - The index of the task to be deleted.
 */
function openDeleteDialog(index) {
    setIndex(index);
    openContainer('deletePopup');
}


/**
 * Sets the current index for deletion to a specified value.
 *
 * @param {number} i - The new value for the current index of deletion.
 */
function setIndex(i) {
    currentIndexDelete = i;
}



