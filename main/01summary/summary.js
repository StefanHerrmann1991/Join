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
  await showUserName();
  let earliestTask;
  [earliestTask, count] = findEarliestTask();
  if (earliestTask !== null) {
    dateConverted = new Date(earliestTask.date)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const outputDateStr = dateConverted.toLocaleDateString('en-US', options);
    let date = getId('nextDeadline');
    let urgency = capitalizeFirst(earliestTask.urgency)
    date.innerHTML = `
    <div class="next-tasks-counter">        
        <div class="urgency-icon ${urgency.toLowerCase()}">
        <img src="../../assets/img/prio${urgency}.png"></div>
        <div>
        <div class="deadline-number">${count}</div>
        <div>${urgency}</div>
        </div>
        </div>
        <div class="middle-line"></div>
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
    console.log(boards)
    if (i < 2) {
      getId('upperSummary').innerHTML += `
      <a href="../02board/board.html" class="board-summary">
        <div class="big-number" id="${boardId}-number"></div>
        <div class="board-title-summary">${boardTitle}</div>
      </a>
      `;
    }
    if (i >= 2) {
      let picture = (boardTitle === "To do") ? "check" : (boardTitle === "Done") ? "editBtnWhite" : null;
      getId('lowerSummary').innerHTML += `
      <a href="../02board/board.html" class="lower-board-summary">
      <div class="icon">
      <img class="deko-img ${picture}" src="../../assets/img/${picture}.png">
      </div>
      <div class="number-container">
        <div class="big-number" id="${boardId}-number"></div>
        <div>${boardTitle}</div>
      </div>
      </a>
    `;
    }
    filterBoards(board, boardId);
  }
  getNumberOfTasks();
}

function getNumberOfTasks() {
  let summary = getId('upperSummary')
  let text = `
  <a href="../02board/board.html" class="board-summary">
    <div class="big-number">${allTaskNumber}</div>
    <div class="board-title-summary"><div>Tasks</div> in Board</div>
  </a>
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

function showUserName() {
if (loggedInUser == undefined) loggedInUser = { name: 'Guest' };
getId('userGreating').innerHTML = `${loggedInUser.name}`;  
}


function getQueryParameter(name) {
  var queryString = window.location.search.substring(1);
  var parameters = queryString.split('&');
  for (var i = 0; i < parameters.length; i++) {
    var parameter = parameters[i].split('=');
    if (parameter[0] === name) {
      return decodeURIComponent(parameter[1]);
    }
  }
  return null;
}

loggedInUser = JSON.parse(getQueryParameter('loggedInUser'));
console.log(loggedInUser); // Output: {'name': '<name of logged in user>'}
