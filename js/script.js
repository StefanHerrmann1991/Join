let currentDraggedElement;

/**
 * This function gets data stored at the ftp server
 */
async function loadServerData() {
    setURL('https://gruppe-228.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    //users = JSON.parse(backend.getItem('users')) || [];
}

/**
 * This function initializes the tasks generated in the addToTask() function, the include HTML function 
 * and load the backend with the init function.
 * Then the tasks are rendered in the different boards.
 * 
 */
async function initBoard() {
    initTasksAndIncludeHTML();
    await init();
    renderBoards();
}

/**
 * This function initializes the tasks generated in the addToTask() function, the include HTML function
 * and load the backend with the init function.
 * Then the tasks are rendered in the backlog.
 * 
 */
async function initBacklog() {
    await initTasksAndIncludeHTML();
    await init();
    renderLogs();
}


/**
 * This function initTasksAndIncludeHTML() executes on load of html body
 */
function initTasksAndIncludeHTML() {
    //loadServerData(); // get data from ftp server
    loadBoards()
    loadTasks();
    // Todo: get all local data additionally or only if there is no data on the server? 
    includeHTML();
}

function splitID(id, separator) {
    let arrayOfStrings = id.split(separator);
    return arrayOfStrings;
}

/**
 * This function generates a random hex color code.
 * @returns {string} - the string value for a random hex color code
 */
function randomHexColor() {
    let hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    let hexColorStr = '#';
    for (let i = 0; i < 6; i++) {
        let randNr = Math.floor(Math.random() * hex.length); //random number between [0, hex.length[
        hexColorStr += hex[randNr];
    }
    return hexColorStr;
}

/* ********* generic functions ********* */

/**
 * This function Returns an HTML element
 * @param {string} id - The id of an HTML element
 * @returns {Object} - The corresponding HTML element
 */
function getId(id) {
    return document.getElementById(id);
}

/**
 * This function Returns an array with one or several HTML elements
 * @param {...string} idsArr - The id of one or several HTML elements
 * @returns {Object[]} elementArr - All corresponding HTML elements in an array
 */
function getIds(...idsArr) { // rest-operator
    elementArr = [];
    for (let i = 0; i < idsArr.length; i++) {
        elementArr.push(document.getElementById(idsArr[i]));
    }
    return elementArr;
}

/**
 * This function Hides all passed HTML elements
 * @param  {...string} ids - The id of one or several HTML elements
 */
function hide(...ids) {
    for (let i = 0; i < ids.length; i++) {
        getId(ids[i]).classList.add('d-none');
    }
}

/**
 * This function Displays all passed HTML elements
 * @param  {...string} ids - The id of one or several HTML elements
 */
function show(...ids) {
    for (let i = 0; i < ids.length; i++) {
        let element = getId(ids[i]);
        //if (element.classList.contains('d-none')){
        element.classList.remove('d-none');
        //}
    }
}

/**
 * This function Toggles the view of all passed HTML elements
 * @param  {...string} ids - The id of one or several HTML elements
 */
function toggle(...ids) {
    for (let i = 0; i < ids.length; i++) {
        getId(ids[i]).classList.toggle('d-none');
    }
}

/**
 * This Function Capitalizes the first letter of a string and returns the capitalized string
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirst(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function lowerFirstLetter(str) {
    return str[0].toLowerCase() + str.slice(1);
}


/**
 * This function empties the values of all passed html form and input elements.
 * @param  {...Object} elements - HTML elements
 */
function clearInputValues(...elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].value = '';
    }
}

/* ****** Navbar ****** */
/**
 * This function shows the navbar on responsive view
 */
function showNavbar() {
    getId('mobile-onclick-navbar').classList.remove('hide-mobile');
    hide('mobile-menu');
    show('mobile-x');
    // getId('mobile-x').classList.remove('d-none');
    // getId('mobile-menu').classList.add('d-none')
}
/**
 * This function hides the navbar on responsive view
 */
function closeNavbar() {
    getId('mobile-onclick-navbar').classList.add('hide-mobile');
    hide('mobile-x');
    show('mobile-menu');
    // getId('mobile-x').classList.add('d-none');
    // getId('mobile-menu').classList.remove('d-none')
}

/* ****** ****** */

/**
 * This function splits an array of strings and displays them nicely (with ', ' in between strings)
 * @param {string[]} namesArray 
 * @returns {string}
 */
function displayStringsArr(stringsArray) {
    let strings = '';
    for (let i = 0; i < stringsArray.length; i++) {
        let element = stringsArray[i];
        if (i == stringsArray.length - 1) {
            strings += stringsArray[i];
        } else {
            strings += stringsArray[i] + ', ';
        }
    }
    return strings;
}