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
  let earliestTask;
  [earliestTask, count] = findEarliestTask();
  if (earliestTask !== null) {
    dateConverted = new Date(earliestTask.date)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const outputDateStr = dateConverted.toLocaleDateString('en-US', options);
    let date = getId('nextDeadline')
    date.innerHTML = `<img src="/assets/img/prio${earliestTask.urgency.toUpperCase()}.png"</div><div>${outputDateStr}</div>`;
  } else {
    console.log('No tasks found in the future.');
  }
  await renderSummary();
}

function findEarliestTask() {
  if (tasks.length === 0) {
    return null; // No tasks found
  }
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  const earliestTask = tasks[0];
  const tasksWithEarliestDate = tasks.filter(task => task.date === earliestTask.date);
  const count = tasksWithEarliestDate.length;
  return [earliestTask, count];
}

async function renderSummary() {
  boards.forEach((board, index) => {
    boardId = boards[index]['boardId'];
    boardTitle = boards[index]['boardTitle'];
    boardName = boards[index]['boardName'];
    getId('summaryMenu').innerHTML += `
    <div class="board-summary">
      <div class="big-number" id="${boardId}"></div>
      <div>${boardTitle}</div>
    </div>
    `;
    filterBoards(board, boardId);
  })
}

function filterBoards(boardTaskArray, boardId) {
  boardTaskArray = filterTasks(boardId);
  getId(boardId).innerHTML = boardTaskArray;
  allTaskNumber += boardTaskArray;
  getId('allTasks').innerHTML = `<div class="board-summary">
  <div class="big-number"> ${allTaskNumber}</div>
  <div> Tasks in Board</div>
 </div>`;
}


async function initAddTasks() {
  setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem('tasks')) || [];
}

function filterTasks(boardId) {
  return tasks.filter(t => t['board'] == `${boardId}`).length;
}




