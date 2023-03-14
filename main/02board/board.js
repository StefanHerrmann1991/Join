let boards = [
    {boardTitle: 'To do', boardId: 'board-0', boardName: 'todoBoard'},
    {boardTitle: 'In progress', boardId: 'board-1', boardName: 'progressBoard'},
    {boardTitle: 'Awaiting Feedback', boardId: 'board-2', boardName: 'awaitingFeedbackBoard'},
    {boardTitle: 'Done', boardId: 'board-3', boardName: 'doneBoard'}
]


async function initBoards() {
    includeHTML();
    await initAddTasks();
    await renderBoards();
}

function addTaskAnywhere() {}

function renderNewBoardBtn() {
    let subtask = getId('addBoard')
    subtask.classList.remove('assign-btn-container')
    subtask.innerHTML = `
    <div class="subtasks-container">
    <input id="newBoardInput" placeholder="Add new Board">
    <div class="button-container">
    <button type="button" class="cancel-button" onclick ="cancelBoardCreation()"><img
    src="/assets/img/cancelDark.png"></button>
    <button type="button" class="add-button" onclick="addNewBoard()"><img
    src="/assets/img/checkDark.png"></button>
    </div>
    </div>
    `
}

/**
 * Updates an element with given index i in the given array
 * @param {Array} dataArray
 * @param {integer} i - array index
 */
async function saveEdit(dataArray, i) { // check: async no diff
    let task = await processTaskInputs();
    task.board = dataArray[i].board; // keep the right board
    dataArray[i] = task;
    saveTasks();
    hide('overlay');
    // check if sent from boards page or backlog page and render content
    if (getId('todoBoard')) renderBoards()   
}


 async function initAddTasks() {
    setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    console.log(tasks);
}

/**
 * This Function used  for rendering the boards with filters
 */
function renderBoards() {  
 let boardsContent = getId('boards');
     boardsContent.innerHTML = '';
    for (let i = 0; i < boards.length; i++) {
        boardId = boards[i]['boardId'];
        boardTitle = boards[i]['boardTitle'];
        boardName = boards[i]['boardName'];
        boardsContent.innerHTML += `
        <div class="board">
        <div class="board-header">
        <h3>${boardTitle}</h3>
        <button><img src="/assets/img/plusButton.png"</button> 
        </div>
        <div id="${boardId}" class="board-task-container" ondrop="moveTo('${boardId}')" ondragover="allowDrop(event)"></div>
        </div>
           `  
        renderEachBoard(boardTitle, boardId);   
    } 
}

function addNewBoard() {
    let board = processBoardInputs();
    boards.push(board);
    saveBoards();
    renderBoards();
}

function processBoardInputs() {
    let boardInput = getId('newBoardInput').value
    let boardTitle = boardInput.toUpperCase();
      /* `${boardName}Board`;  boardInput.split(" ").join("")*/
    let boardId = 'board-' + boards.length
    let board = {
        'boardTitle': boardTitle,
        'boardId': lowerFirstLetter(boardId),
    };
    return board;
}

function clearInputsBoard() {
    clearInputValues();
}

/** renderEachBoard
 * This Function shows/refreshes all boards filtered with categorys and also allow drag and drop 
 */

function renderEachBoard(boardTaskArray, boardId) {
    boardTaskArray = tasks.filter(t => t['board'] == `${boardId}`);
    getId(`${boardId}`).innerHTML = '';
    for (let i = 0; i < boardTaskArray.length; i++) {
        const element = boardTaskArray[i];
        const taskIndex = tasks.indexOf(element);
        getId(`${boardId}`).innerHTML += boardTaskHTML(element, taskIndex);
    }
}

async function saveBoards() { //check async: no diff
    if (event) {
        event.preventDefault();
    }
    let boardsAsText = JSON.stringify(boards);
    await backend.setItem('boards', boardsAsText);
}

/**
 *  This function loads and converts boards from text-format to a JSON-array. 
 *  The preventDefault() function is necessary to prevent the page from reloading when adding a new board.
 */
async function loadBoards() {
    if (event) {
        event.preventDefault();
    }
    let boardsAsText = await backend.getItem('boards');
    if (boardsAsText) {
        boards = JSON.parse(boardsAsText);
    }
}

/**
 * This function saves the current id of the dragged task 
 */
function startDragging(id) { // i only for testing purposes
    currentDraggedElement = id;
}
/**
 * This function makes the div container droppable
 */
function allowDrop(ev) {
    ev.preventDefault();
}
/**
 * This function gives the task the new category. The category depends on the dropped board 
 */
function moveTo(board) {
    tasks[currentDraggedElement]['board'] = board;
    saveTasks();
    renderBoards()
}
/**
 * This function shows move buttons on responsive view when arrow image is clicked 
 */
function showMoveButtons(i) {
    let moveButtonBox = document.getElementById('moveButtonBox' + i)

    if (moveButtonBox.classList.contains('d-none')) {
        moveButtonBox.classList.remove('d-none')
        moveButtonBox.classList.add('move-button-box-transition-in')
    } else {
        moveButtonBox.classList.add('d-none')
    }
}

/**
 * This function Moves a given task to the passed target-board
 * @param {integer} i - tasks index
 * @param {string} targetBoard - name of board
 */
function moveToBoard(i, targetBoard) {
    console.log(targetBoard);
    tasks[i]['board'] = targetBoard;
    saveTasks();
    renderBoards();
}



function boardTaskHTML(element, i) {
    return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${i})" id="task${i}" class="task" onclick="openDetailedTask()">
        <div class="task-container">
        <div class="category-icon" style="background-color: ${element.category.color}">${element.category.topic}</div>
        <h3 class="task-headline-text"><b>${capitalizeFirst(element['title'])}</b></h3> 
        <div class="description">${element.description}</div>                      
        <div class="assigned-users">
                ${renderAssignedUsers(element.assignedTo)}
        </div>      
        </div>    
    `;
}

/**
 * Renders several user icons for all passed users in an array
 * @param {string[]} usersArr - array with usernames
 * @returns {(string | string)} - user-icon  HTML code for all passed users | replacement image
 */
function renderAssignedUsers(usersArr) {    
    let iconsHTML = '';
    if (usersArr && usersArr.length > 0) {
        for (let i = 0; i < usersArr.length; i++) {
            let user = usersArr[i];
            console.log(user)
            iconsHTML += `<span id="iconUser-${i}" class="user-icon" alt="user icon" style="background-color: ${user.color}">${user.initial}</span>`;
        }
    } else {
        iconsHTML = '<img src="img/icon-plus.png" alt="" class="icon-replacement">';
    }
    return iconsHTML;
}

function openDetailedTask() {}

function renderMobile() {
   return ` <div class="move-to">
   <img onclick="showMoveButtons(${i})" class="move-to-btn" alt="">
   <div id="moveButtonBox${i}" class="move-button-box d-none">
       <div><button onclick="moveToBoard(${i},'todo')" class="move-button">Todo</button></div>
       <div><button onclick="moveToBoard(${i},'inProgress')" class="move-button">In Progress</button></div>
       <div><button onclick="moveToBoard(${i},'testing')" class="move-button">Testing</button></div>
       <div><button onclick="moveToBoard(${i},'done')" class="move-button">Done</button></div>
   </div>
</div>
<div class="task-links">
   <img class="delete-task" src="/assets/img/deleteWhite.png" 
   onclick="deleteTask(tasks, ${i})" alt="delete icon">
   <img class="edit-task" onclick="renderEditForm(${i})" alt="edit icon">
</div>
</div>`
}

function editFormHTML(i) {
    return /*html*/ `
 `
}

/**
 * Saves tasks in the backend in form of an JSON string */
async function saveTasks() { //check async: no diff
    if (event) event.preventDefault();
    let tasksAsText = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsText);
}

/**
 * Displays a list of users with names or emails that match the input string.
 * @param {string} val The input string to match against.
 */
function showResultsTasks(val) {
    const res = getId("taskSearchInput");
    res.innerHTML = '';
    let list = '';
    const tasksList = autocompleteMatchTask(val);
    for (let i = 0; i < tasks.length; i++) {
        list += `<option value="${tasksList[i].title}">${tasksList[i].title} (${tasksList[i].email})</option>`;
    }
    res.innerHTML = `<datalist class="custom-datalist" id="usersSearch" name="userList">${list}</datalist>`;
}

function openTask(index) {
    tasks[index]
    console.log(tasks[index])
    renderEditTask();
}

function renderEditTaskPopup() {
    

}

/* Need to write function to show the editTask  */

/**
 * The function matches the input in the search input field with the names and emails of the users array.
 * @param {string} input A string containing a name or email.
 * @returns An array of users with names or emails that match the input string.
 */
function autocompleteMatchTask(input) {
    if (input == '') return [];
    let reg = new RegExp(input);
    
    return tasks.filter(function (task) {
        console.log(task)
        if (task.title.match(reg) || task.urgency.match(reg) || task.date.match(reg) || task.category.topic.match(reg)) return task;
    });
}