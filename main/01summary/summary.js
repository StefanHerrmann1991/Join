const boards = [
  { boardTitle: 'To do', boardId: 'board-0', boardName: 'todoBoard' },
  { boardTitle: 'In progress', boardId: 'board-1', boardName: 'progressBoard' },
  { boardTitle: 'Awaiting Feedback', boardId: 'board-2', boardName: 'awaitingFeedbackBoard' },
  { boardTitle: 'Done', boardId: 'board-3', boardName: 'doneBoard' }
];



let allTaskNumber = 0;

async function initSummary() {
  includeHTML();
  await initAddTasks();
  const earliestTask = findEarliestTask();
  if (earliestTask !== null) {
    console.log('Task with the earliest date:', earliestTask);
  } else {
    console.log('No tasks found in the future.');
  }
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
  boardTaskArray = filterTasks(boardId);
  getId(boardId).innerHTML = boardTaskArray;
  allTaskNumber += boardTaskArray;
  getId('allTasks').innerHTML = allTaskNumber;
  }

  function findEarliestTask() {
    if (tasks.length === 0) return null; // No tasks found    
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    return tasks[0].date;
  }

async function initAddTasks() {
  setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem('tasks')) || [];
}

function filterTasks(boardId) {
 return tasks.filter(t => t['board'] == `${boardId}`).length;
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


