const boards = [
  { boardTitle: 'To do', boardId: 'board-0', boardName: 'todoBoard' },
  { boardTitle: 'In progress', boardId: 'board-1', boardName: 'progressBoard' },
  { boardTitle: 'Awaiting Feedback', boardId: 'board-2', boardName: 'awaitingFeedbackBoard' },
  { boardTitle: 'Done', boardId: 'board-3', boardName: 'doneBoard' }
];


async function initSummary() {
  includeHTML();
  await initAddTasks();
  await renderSummary();
}

async function renderSummary() {
  boards.forEach((board, index) => {
    boardId = boards[index]['boardId'];
    boardTitle = boards[index]['boardTitle'];
    boardName = boards[index]['boardName'];
    getId('summaryMenu').innerHTML += `<div>${boardTitle}</div><div id="${boardId}"></div>`;
    filterBoards(board, boardId);
  })
}

function filterBoards(boardTaskArray, boardId) {
  boardTaskArray = tasks.filter(t => t['board'] == `${boardId}`).length;
  getId(boardId).innerHTML = boardTaskArray
}

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
      <h2>${boardTitle}</h2>
      <button onclick="openContainer('addTaksPopup'); initTasks()"><img src="/assets/img/plusButton.png"</button> 
      </div>
      <div id="${boardId}" class="board-task-container" ondrop="moveTo('${boardId}')" ondragover="allowDrop(event)"></div>
      </div>
         `
    renderBoards(boardTitle, boardId);
  }
}


function renderEachBoard(boardTaskArray, boardId) {
  boardTaskArray = tasks.filter(t => t['board'] == `${boardId}`);
  getId(`${boardId}`).innerHTML = '';
  for (let i = 0; i < boardTaskArray.length; i++) {
    const element = boardTaskArray[i];
    const taskIndex = tasks.indexOf(element);
    getId(`${boardId}`).innerHTML += boardTaskHTML(element, taskIndex);
  }
}

async function initAddTasks() {
  setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem('tasks')) || [];
}



function filterTasksByBoard(boardId) {
  return boardTaskArray = tasks.filter(t => t['board'] == `${boardId}`);
}

function countTasksInBoard(boardId) {
  return filterTasksByBoard(boardId).length;
}

function getEaliestTask(boardId) {
  const currentDate = new Date();
  const tasksInBoard = filterTasksByBoard(boardId);
  const futureTasks = tasksInBoard.filter(task => new Date(task.date) > currentDate);

  if (futureTasks.length === 0) {
    return null;
  }

  return futureTasks.reduce((earliestTask, currentTask) => {
    const currentTaskDate = new Date(currentTask.date);
    const earliestTaskDate = new Date(earliestTask.date);

    return currentTaskDate < earliestTaskDate ? currentTask : earliestTask;
  });
}

function displayTaskSummary() {
  boards.forEach(board => {
    console.log(`Board ID: ${board.boardId}`);
    console.log('Number of tasks in board:', countTasksInBoard(board.boardId));

    const earliestTask = getEaliestTask(board.boardId);
    if (earliestTask) {
      console.log('Earliest task in the future for the specified board:', earliestTask);
    } else {
      console.log('No tasks found in the future for the specified board.');
    }
    console.log('\n');
  });
}


/* 
function countTasksInBoard(boardId) {
  return tasks?.filter(task => task.board === boardId).length;
}

function findEarliestTaskInFuture() {
  const currentDate = new Date();
  const futureTasks = tasks.filter(task => new Date(task.date) > currentDate);
  
  if (futureTasks.length === 0) {
    return null;
  }

  return futureTasks.reduce((earliestTask, currentTask) => {
    const currentTaskDate = new Date(currentTask.date);
    const earliestTaskDate = new Date(earliestTask.date);

    return currentTaskDate < earliestTaskDate ? currentTask : earliestTask;
  });
}

const boardId = 'board-0';
console.log('Number of tasks in board:', countTasksInBoard(boardId));

const earliestTask = findEarliestTaskInFuture();
if (earliestTask) {
  console.log('Earliest task in the future:', earliestTask);
} else {
  console.log('No tasks found in the future.');
} */