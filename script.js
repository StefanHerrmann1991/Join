/** 
 * A list of urgency levels, ordered from highest to lowest.
 * @type {Array<string>}
 */
let urgencies = ['High', 'Medium', 'Low'];

/**
 * A list of categories, where each category is a JSON with properties for the topic, color, and index.
 * @type {Array<JSON>}
 */
let categories = [{
    'topic': 'Sales',
    'color': '#FC71FF',
    'index': '0'
}, {
    'topic': 'Backoffice',
    'color': '#1FD7C1',
    'index': '1'
}];

/** 
 * A list of users.
 * @type {Array<JSON>}
 */
let users;

/** 
 * A list of tasks.
 * @type {Array<JSON>}
 */
let tasks = [];

/**
 * A list of subtasks.
 * @type {Array<JSON>}
 */
let subtasks = [];

/**
 * A list of invited users.
 * @type {Array<JSON>}
 */
let invitedUsers = [];

/**
 * A list of assigned users.
 * @type {Array<JSON>}
 */
let assignedUsers = [];

/**
 * An array of color codes for the color picker.
 * @type {Array<string>}
 */
let colorPicker = ['#8AA4FF', '#FF0000', '#2AD300', '#FF8A00', '#E200BE', '#0038FF'];

/**
 * The chosen color from the color picker.
 * @type {string}
 */
let chosenColor;

/**
 * The user who is currently logged in.
 * @type {JSON}
 */
let loggedInUser;

/**
 * The chosen board by the logged in user.
 * @type {JSON}
 */
let chosenBoard;

/**
 * A list of users who have registered on the platform.
 * @type {Array<JSON>}
 */
let registeredUsers = [];


/**
 * Splits a string identifier into an array of substrings.
 *
 * @param {string} id - The identifier string to be split.
 * @param {string} separator - The character or string that divides the identifier.
 * @returns {Array} arrayOfStrings - The resulting array of substrings.
 */
function splitID(id, separator) {
    let arrayOfStrings = id.split(separator);
    return arrayOfStrings;
}


/**
 * This function Returns an HTML element
 * @param {string} id - The id of an HTML element
 * @returns {Object} - The corresponding HTML element
 */
function getId(id) {
    return document?.getElementById(id);
}


/**
 * Returns the constructor name of a given parameter if it is an object, or returns the parameter itself.
 * @param {Object|string} paramAsText - The parameter to be processed.
 * @returns {string} The constructor name or the parameter itself.
 */
function newVariable(paramAsText) {
    let objectName;
    if (typeof paramAsText === 'object') objectName = paramAsText.constructor.name;
    else objectName = paramAsText;
    return `${objectName}`;
}


/**
 * Serializes an object and saves it to the backend under a key based on its constructor name.
 * @param {Object} dataObject - The object to be saved to the backend.
 */
async function saveBackendDataOf(dataObject) {
    let wordAsText = newVariable(dataObject) + `AsText`;
    let stringifyDataObject = JSON.stringify(dataObject);
    await setItem(`${wordAsText}`, stringifyDataObject);
};


/**
 * Serializes a value and saves it to the backend under a given key.
 * @param {string} key - The key under which the value will be saved.
 * @param {string} value - The value to be serialized and saved.
 */
async function saveToBackend(key, value) {
    if (event) event.preventDefault();
    keyAsText = JSON.stringify(value);
    await setItem(key, keyAsText);
    console.log(key, value, keyAsText);
}


/**
 *  This function loads and converts the tasks from text-format to a JSON-array. 
 *  The preventDefault() function is necessary to prevent the page from reloading when adding a new task.
 */
async function loadFromBackend(key, value) {
    if (event) event.preventDefault();
    let keyAsText = await getItem(key);
    if (keyAsText) value = JSON.parse(keyAsText);
    return value;
}


/**
 * This function returns an array with one or several HTML elements
 * @param {...string} idsArr - The id of one or several HTML elements
 * @returns {Object[]} elementArr - All corresponding HTML elements in an array
 */
function getIds(...idsArr) { // rest-operator
    elementArr = [];
    for (let i = 0; i < idsArr.length; i++) {
        elementArr.push(document?.getElementById(idsArr[i]));
    }
    return elementArr;
}


/**
 * This function Hides all passed HTML elements
 * @param  {...string} ids - The id of one or several HTML elements
 */
function closeContainer(...ids) {
    if (ids.length == 1) getId(ids[0])?.classList.add('d-none');
    ids.forEach(id => getId(id)?.classList.add('d-none'));
}


function closeContainerInTime(timeout, ...ids) {
    openContainer(...ids);
    setTimeout(() => {
        if (ids.length == 1) getId(ids[0])?.classList.add('d-none');
        ids.forEach(id => getId(id)?.classList.add('d-none'));
    }, timeout);
}


/**
 * This function Displays all passed HTML elements
 * @param  {...string} ids - The id of one or several HTML elements
 */
function openContainer(...ids) {
    if (ids.length == 1) getId(ids[0])?.classList.remove('d-none');
    ids.forEach(id => getId(id)?.classList.remove('d-none'));
}


/**
 * This function Toggles the view of all passed HTML elements
 * @param  {...string} ids - The id of one or several HTML elements
 */
function toggleContainer(...ids) {
    ids.forEach(id => getId(id)?.classList.toggle('d-none'));
}


/**
 * This Function Capitalizes the first letter of a string and returns the capitalized string
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirst(str) {
    return str[0].toUpperCase() + str.slice(1);
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


/**
 * Returns a new string with the first character of the input string converted to lowercase.
 * @param {string} str - The string to be processed.
 * @returns {string} The resulting string with the first character converted to lowercase.
 */
function lowerFirstLetter(str) {
    return str[0].toLowerCase() + str.slice(1);
}


/**
 * Removes a given class from an HTML element identified by its ID.
 * @param {string} element - The ID of the HTML element.
 * @param {string} className - The class to be removed.
 */
function removeClass(element, className) {
    getId(`${element}`).classList.remove(className);
}


/**
 * Adds a given class to an HTML element identified by its ID.
 * @param {string} element - The ID of the HTML element.
 * @param {string} className - The class to be added.
 */
function addClass(element, className) {
    getId(`${element}`).classList.add(className);
}


/**
 * This function splits an array of strings and displays them nicely (with ', ' in between strings)
 * @param {string[]} namesArray 
 * @returns {string}
 */
function displayStringsArr(stringsArray) {
    let strings = '';
    for (let i = 0; i < stringsArray.length; i++) {
        let element = stringsArray[i];
        if (i == stringsArray.length - 1) strings += element;
        else strings += element + ', ';
    }
    return strings;
}


/**
 * Logs the user out by redirecting them to the login page.
 */
function logout() {
    window.open('../00login-register/login.html');
}


/**
 * Checks whether the current window size corresponds to a mobile view.
 * @returns {boolean} true if the current view is a mobile view (width <= 768px), false otherwise.
 */
function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
}


/**
 * Loads the tasks array from the backend.
 */
function loadTasks() {
    tasks = loadFromBackend('tasks', tasks);
}


function highlightChosenMenu() {    
    navTitle = document.querySelectorAll('.nav-title')
    currentTitle = document.getElementsByTagName('h1')[0]
    navTitle.forEach(elementTitle => {
        if (elementTitle.textContent == currentTitle.textContent)  elementTitle.parentNode.parentNode.classList.add('selected-menu')
    })
}
 

function closeContainerEvent(event, containerId) {   
    if (event.target.id === containerId) closeContainer(containerId);    
    
  }