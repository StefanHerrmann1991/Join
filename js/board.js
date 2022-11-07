
let boards = ['BACKLOG', 'SPRINT', 'TODO', 'INPROGRESS', 'DONE'];

/**
 * This Function used  for rendering the boards with filters
 */
function renderBoards() {
  
 let boardsContent = document.getElementById('boardContent');
    boardsContent.innerHTML = '';
    for (let i = 0; i < boards.length; i++) {
        boardId = boards[i]['boardId'];
        boardTitle = boards[i]['boardTitle'];
        boardsContent.innerHTML += `
        <div>
        <div>        
        <h2>${boardTitle}</h2>
        <button></button>
        </div>
        <div class="scroll-bar">
            <div id="${boardId}" class="board-task-container" ondrop="moveTo('${boardId}')" ondragover="allowDrop(event)"></div>
        </div>`  
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

    let boardInput = document.getElementById('newBoard').value;
    let boardTitle = boardInput.toUpperCase();
    let boardId = 'board-' + boards.length
    let board = {
        'boardTitle': boardTitle,
        'boardId': lowerFirstLetter(boardId),
    };
    return board;
}

/* TODO */
function moreLettersRequired() {

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