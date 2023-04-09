const boards = [
  { boardTitle: 'In progress', boardId: 'board-1', boardName: 'progressBoard' },
  { boardTitle: 'Awaiting Feedback', boardId: 'board-2', boardName: 'awaitingFeedbackBoard' },
  { boardTitle: 'To do', boardId: 'board-0', boardName: 'todoBoard' },
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
    let date = getId('nextDeadline');
    let urgency = capitalizeFirst(earliestTask.urgency)
    date.innerHTML = `
    <img src="/assets/img/prio${urgency}.png"</div>
    <div>${urgency}</div>
    <div>${outputDateStr}</div>`;
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
  for (let i = 0; i < boards.length; i++) {
    const board = boards[i];
    boardId = board['boardId'];
    boardTitle = board['boardTitle'];
    boardName = board['boardName'];
    if (i < 2) {
      getId('upperSummary').innerHTML +=`
      <div class="board-summary">
        <div class="big-number" id="${boardId}-number"></div>
        <div>${boardTitle}</div>
      </div>
      `;
    }
    if (i >= 2) {
      getId('lowerSummary').innerHTML +=`
      <div class="board-summary">
      <div class="big-number" id="${boardId}-number"></div>
      <div>${boardTitle}</div>
      </div>
    `;
    }
    filterBoards(board, boardId);
  }
  getNumberOfTasks();
}

function getNumberOfTasks() {
  let summary = getId('upperSummary')
  let text = `
  <div class="board-summary">
  <div class="big-number"> ${allTaskNumber}</div>
  <div> Tasks in Board</div>
  </div>
  `;
  summary.insertAdjacentHTML('afterbegin', text);
}

function filterBoards(boardTaskArray, boardId) {
  boardTaskArray = filterTasks(boardId);
  getId(boardId + '-number').innerHTML = boardTaskArray;
  allTaskNumber += boardTaskArray;
}



async function initAddTasks() {
  setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem('tasks')) || [];
}

function filterTasks(boardId) {
  return tasks.filter(t => t['board'] == `${boardId}`).length;
}




