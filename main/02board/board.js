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


/**
 * This asynchronous function initializes the state of the boards. It includes the necessary
 * HTML, initializes the task adding process, connects to the backend, initializes tasks, 
 * and finally renders the boards.
 */
async function initBoards() {
    includeHTML();
    await initAddTasks();
    await initBackend();
    await initTasks()
    await renderBoards(tasks);
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
 * This function is used to initiate the process of adding tasks. It sets the URL of the backend,
 * and then downloads the tasks from the server. If there are no tasks, it initializes the tasks
 * array as empty.
 */
async function initAddTasks() {
    setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
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
        boardId = boards[i]['boardId'];
        boardTitle = boards[i]['boardTitle'];
        boardName = boards[i]['boardName'];
        boardsContent.innerHTML += `
        <div class="board">
        <div class="board-header">
        <h2>${boardTitle}</h2>
        <button class="add-task-board-btn" value="${boardId}" onclick="openContainer('addTasksPopup'); setBoard(this.value)"><img src="../../assets/img/plusButton.png"</button> 
        </div>
        <div id="${boardId}" class="board-task-container" ondrop="moveTo('${boardId}')" ondragover="allowDrop(event)"></div>
        </div>
           `
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
 * This function is used to process inputs for a new board. It takes the value from the 'newBoardInput' field,
 * formats it to uppercase, generates a unique id, and returns an object representing the new board.
 *
 * @return {Object} - An object representing the new board.
 */
function processBoardInputs() {
    let boardInput = getId('newBoardInput').value
    let boardTitle = boardInput.toUpperCase();
    let boardId = 'board-' + boards.length
    let board = {
        'boardTitle': boardTitle,
        'boardId': lowerFirstLetter(boardId),
    };
    return board;
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
    return `<div class="empty-board mobile">No tasks ${boardTitle.toLowerCase()}</div>`;
}


/**
 * This function saves the current state of the boards in the backend in the form of a JSON string.
 */
async function saveBoards() {
    if (event) event.preventDefault();
    let boardsAsText = JSON.stringify(boards);
    await backend.setItem('boards', boardsAsText);
}


/**
 * This function loads the current state of the boards from the backend and converts it from text to a JSON array.
 */
async function loadBoards() {
    if (event) event.preventDefault();
    let boardsAsText = await backend.getItem('boards');
    if (boardsAsText) boards = JSON.parse(boardsAsText);
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
    saveTasks();
    renderBoards(tasks)
}


/**
 * This function moves a task to a specified board, saves tasks, and renders the boards.
 * 
 * @param {Number} i - The index of the task in the tasks array.
 * @param {String} targetBoard - The id of the board where the task will be moved.
 */
function moveToBoard(i, targetBoard) {
    tasks[i]['board'] = targetBoard;
    saveTasks();
    renderBoards(tasks);
}


/**
 * This function returns an HTML string for a task.
 * 
 * @param {Object} element - The task to be rendered.
 * @param {Number} i - The index of the task in the tasks array.
 * @return {String} - An HTML string for the task.
 */
function boardTaskHTML(element, i) {
    let doneSubtask = element.subtasks.filter(function (subtask) { return subtask.checked }).length;
    let subtaskProgressBarClass = element.subtasks.length === 0 ? 'd-none' : '';
    let firstWord = element.description.split(' ')[0];
    let description = element.description.length > 10 ? `${firstWord}...` : element.description;
    return `
      <div draggable="true" ondragstart="startDragging(${i})" id="task-${i}" class="task" onclick="renderDetailedTask(${i})">
          <div class="task-container">
              <div class="category-icon" style="background-color: ${element.category.color}">${element.category.topic}</div>
              <h2 class="task-headline"><b>${capitalizeFirst(element['title'])}</b></h2>
              <div class="description">${description}</div>
              <div id="subtaskProgressBar" class="subtask-progress ${subtaskProgressBarClass}">
                  <progress value="${doneSubtask}" max="${element.subtasks.length}"></progress>
                  <div>${doneSubtask}/${element.subtasks.length}</div>
              </div>
              <div class="user-urgency">
                  <div class="assigned-users">
                      ${renderAssignedUsers(element.assignedTo)}
                  </div>
                  <img class="urgency" src="../../assets/img/prio${capitalizeFirst(element.urgency)}.png">
              </div>
          </div>
          
          <div class="move-to mobile-flex" onclick="event.stopPropagation(); toggleContainer('boardBtns-${i}')">
              <img  class="chevron" src="../../assets/img/chevron.png">
              <div id="boardBtns-${i}" class="move-btn-box d-none">
                  <div><button onclick="event.stopPropagation(); moveToBoard(${i},'board-0')" class="move-button">Todo</button></div>
                  <div><button onclick="event.stopPropagation(); moveToBoard(${i},'board-1')" class="move-button">In Progress</button></div>
                  <div><button onclick="event.stopPropagation(); moveToBoard(${i},'board-2')" class="move-button">Awaiting Feedback</button></div>
                  <div><button onclick="event.stopPropagation(); moveToBoard(${i},'board-3')" class="move-button">Done</button></div>
              </div>                
      </div>
      </div>
    `;
}


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


/**
 * This function saves the current state of the tasks in the backend in the form of a JSON string.
 */
async function saveTasks() { //check async: no diff
    if (event) event.preventDefault();
    let tasksAsText = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsText);
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



function renderDetailedTask(index) {
    detailsAreOpen = true;
    let task = tasks[index]
    let editTask = getId('editTaskDialog')
    openContainer('editTaskDialog')
    editTask.innerHTML = `
        <div class="edit-task-dialog center" id="editTaskContainer">
            <div class="edit-task-container">
                <div class="task-details">
                <div class="task-head">
                    <div class="category-icon" style="background-color: ${task.category.color}">${task.category.topic}</div>
                    <button  onclick="closeTaskDialog()" class="mobile back-arrow"><img src="../../assets/img/backArrowBlack.png"</button>
                </div>
                    <button class="close-upper-right" onclick="closeTaskDialog()"><img
                            src="../../assets/img/cancel.png"></button>        
                    <h1>${task.title}</h1>
                   
                    <div class="long-text">${task.description}</div>
             
                    <div class="details-container">
                        <h2>Due date: </h2>
                        <div>${task.date}</div>
                    </div>
                    <div class="details-container">
                        <h2>Priority: </h2>
                        <div class="${task.urgency} details-priority-btn ">${task.urgency}<img class="filtered-img-${task.urgency}" src="../../assets/img/prio${task.urgency}.png"></div>
                    </div>
                    <div class="subtasks-in-details" id="subtask-${index}">
               
                    </div>
                    <div class="assigned-to-container">
                        <h2>Assigned to:</h2>
                        <div class="details-assigned-users">${renderAssignedUsers(task.assignedTo)}</div>
                    </div>
                    <div class="change-tasks">
                    <button class="delete-task-btn" onclick="deleteTask(${index})"><img src="../../assets/img/deleteDark.png"></button>
                    <button class="edit-task-btn" onclick="renderEditTask(${index})"><img src="../../assets/img/editBtnWhite.png"></button>
                    </div>
                </div>
            </div>
        </div>
`
    renderSubtasksDetails(index);
}

function renderSubtasksDetails(index) {

    let subtaskId = getId(`subtask-${index}`)
    let subtasks = tasks[index].subtasks
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        let checkedValue = subtask.checked ? "checked" : "";
        subtaskId.innerHTML += `
        <h2>Subtasks: </h2><div class="subtask-checkbox-container">
        <input class="subtask-checkbox" type="checkbox" value="0" onchange="updateEditSubtask(${index}, ${i})" ${checkedValue}>
        ${subtask.title}
      </div>`;
    }
}

function updateEditSubtask(taskIndex, subtaskIndex) {
    tasks[taskIndex].subtasks[subtaskIndex].checked = !tasks[taskIndex].subtasks[subtaskIndex].checked;
    saveTasks();
}

function renderEditTask(index) {
    detailsAreOpen = true;
    let editTask = getId('editTaskDialog');
    let task = tasks[index];
    assignedUsers = task.assignedTo;
    editTask.innerHTML = `
    <div class="edit-task-dialog center">
        <div class="edit-task-container">
            <button class="close-upper-right desktop" onclick="closeTaskDialog()"><img
                    src="../../assets/img/cancel.png"></button>
            <form class="edit-task-form" onsubmit="changeTask(${index}, '${task.board}')">
                <div class="edit-task-field">   
                        <div class="mgn-b">            
                        <div class="title-button">                        
                            <h3>Title</h3>
                            <button class="close-upper-right mobile" onclick="closeTaskDialog()"><img
                                    src="../../assets/img/cancel.png"></button>
                        </div>
                        <input required class="title" id="title" value="${task.title}" placeholder="Enter a title"
                            oninput="loadTasks()">
                        </div>
                        
                        <div class="mgn-b">
                            <h3>Description</h3>
                            <textarea resize="none" required id="description"
                                placeholder="Enter a description">${task.description}</textarea>
                            <h3>Due date</h3>
                            <input value="${task.date}" required id="date" class="date" type="date" name="setTodaysDate">
                        </div>
                        <div class="mgn-b">
                            <h3>Prio</h3>
                            <div id="urgency" class="priority-btns">
                                <label for="urgent" class="urgent priority-btn">
                                    <input type="radio" id="urgent" name="priority" value="urgent" class="priority-radio"
                                        required>
                                    Urgent<img src="../../assets/img/prioUrgent.png">
                                </label>
                                <label for="medium" class="medium priority-btn">
                                    <input type="radio" id="medium" name="priority" value="medium" class="priority-radio">
                                    Medium<img class="medium-prio" src="../../assets/img/prioMedium.png">
                                </label>
                                <label for="low" class="low priority-btn">
                                    <input type="radio" id="low" name="priority" value="low" class="priority-radio">
                                    Low<img src="../../assets/img/prioLow.png">
                                </label>
                            </div>
                        </div>
                        <div class="mgn-b">
                            <h3>Assigned to</h3>
                            <div class="assign-btn-container" id="assignBtnContainer">
                                <button type="button" class="assign-btn"
                                    onclick="toggleContainer('detailsUserMenu'); toggleContainer('userInitialContainer')">
                                    <div>Select contact to assign</div>
                                    <div id="imgArrow"><img src="../../assets/img/open.png"></div>
                                </button>
                                <div class="user-menu d-none" id="detailsUserMenu">
                                    <div class="user-list" id="userList"></div>
                                    <button id="inviteUserBtn" type="button" class="invite-user-btn"
                                        onclick="inviteUsers()">Invite
                                        new contact<img src="../../assets/img/contactsBlack.png">
                                    </button>
                                </div>
                                </div>
                                <div class="user-assignment-container">
                                <div id="userInitialContainer" class="user-initial-container"></div>
                                </div>
                            <input class="d-none" id="category" value="${task.category.index}">
                        </div>
                        
                        <button class="accept-edited-task-btn">Ok<img src="../../assets/img/check.png"></button>
                    </div>
            </form>
        </div>
    </div>
`
    startPriorityEventListener(task.urgency);
    renderUserList();
    compareDate();
}

async function changeTask(index, board) {
    event.preventDefault();
    chosenBoard = board
    let task = processTaskInputs(board);
    tasks[index] = task;
    saveTasks();
    closeTaskDialog();
    renderBoards(tasks);
}

function closeTaskDialog() {
    detailsAreOpen = false;
    closeContainer('editTaskDialog');
    renderBoards(tasks);
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
 * @param {i} @type {Number}
 */
function deleteTask(i) {
    tasks.splice(i, 1);
    saveTasks();
    closeTaskDialog();
    renderBoards(tasks)
}