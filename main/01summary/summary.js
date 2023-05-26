/**
 * An array of boards.
 * @type {Object[]}
 * @property {string} boardTitle - The title of the board.
 * @property {string} boardId - The ID of the board.
 * @property {string} boardName - The name of the board.
 */
const boards = [
  { boardTitle: 'In progress', boardId: 'board-1', boardName: 'progressBoard' },
  { boardTitle: 'Awaiting Feedback', boardId: 'board-2', boardName: 'awaitingFeedbackBoard' },
  { boardTitle: 'To do', boardId: 'board-0', boardName: 'todoBoard' },
  { boardTitle: 'Done', boardId: 'board-3', boardName: 'doneBoard' }
];


/**
 * The total number of tasks.
 * @type {number}
 */
let allTaskNumber = 0;


/**
 * Initializes the summary page.
 * @returns {Promise<void>} A Promise that resolves when the summary page is initialized.
 */
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


/**
 * Finds the earliest task and counts the number of tasks with the same date.
 * @returns {Array} An array containing the earliest task and the count of tasks with the same date.
 */
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


/**
 * This asynchronous function is responsible for rendering the summary page.
 * It iterates over the boards, obtaining information about each board,
 * and formats it into HTML to be inserted into the DOM.
 */
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


/**
 * This function is used to calculate and show the number of tasks present in a board.
 * The number of tasks is inserted into a HTML template, which is then added to the DOM.
 */
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


/**
 * This function is used to filter tasks of a specific board. It receives the tasks array
 * and the board id as parameters. The function replaces the current tasks array with a 
 * new one containing only tasks from the given board, and updates the HTML to show the number 
 * of tasks for the given board.
 *
 * @param {Array} boardTaskArray - An array containing tasks information.
 * @param {String} boardId - The id of the board to be filtered.
 */
function filterBoards(boardTaskArray, boardId) {
  boardTaskArray = filterTasks(boardId);
  getId(boardId + '-number').innerHTML = boardTaskArray;
  allTaskNumber += boardTaskArray;
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
 * This function is used to filter the tasks array based on the board id.
 * It returns the count of tasks related to the provided board id.
 *
 * @param {String} boardId - The id of the board for which tasks are to be filtered.
 * @return {Number} - The count of tasks related to the provided board id.
 */
function filterTasks(boardId) {
  return tasks.filter(t => t['board'] == `${boardId}`).length;
}


/**
 * This function is used to display the name of the user who is currently logged in.
 * If no user is logged in, it defaults to 'Guest'.
 */
function showUserName() {
if (loggedInUser == undefined) loggedInUser = { name: 'Guest' };
getId('userGreating').innerHTML = `${loggedInUser.name}`;  
}


/**
 * This function is used to parse the URL's query string and get the value of a given parameter.
 * It splits the query string into its components, and then iterates through them to find the 
 * matching parameter. It returns the value of the parameter, or null if the parameter is not found.
 *
 * @param {String} name - The name of the parameter whose value is to be retrieved.
 * @return {String|null} - The value of the parameter, or null if the parameter is not found.
 */
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


/**
 * A global variable 'loggedInUser' is set here. It is obtained by parsing the value of the 
 * 'loggedInUser' parameter from the URL's query string. If the parameter is found, its value 
 * is parsed as JSON. The result is an object with a 'name' property.
 */
loggedInUser = JSON.parse(getQueryParameter('loggedInUser'));

