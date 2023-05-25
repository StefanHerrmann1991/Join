let urgencies = ['High', 'Medium', 'Low'];
let categories = [{
    'topic': 'Sales',
    'color': 'FC71FF',
    'index': '0'
}, {
    'topic': 'Backoffice',
    'color': '#1FD7C1',
    'index': '1'
}];
let users
let tasks
let subtasks = [];
let invitedUsers = [];
let assignedUsers = [];
let colorPicker = ['#8AA4FF', '#FF0000', '#2AD300', '#FF8A00', '#E200BE', '#0038FF']
let chosenColor;
let loggedInUser;
let chosenBoard;
let registeredUsers = [];



function splitID(id, separator) {
    let arrayOfStrings = id.split(separator);
    return arrayOfStrings;
}

/* ********* generic functions ********* */

/**
 * This function Returns an HTML element
 * @param {string} id - The id of an HTML element
 * @returns {Object} - The corresponding HTML element
 */
function getId(id) {
    return document?.getElementById(id);
}

function newVariable(paramAsText) {
    let objectName;
    if (typeof paramAsText === 'object') objectName = paramAsText.constructor.name;
    else objectName = paramAsText;
    return `${objectName}`;
}

async function saveBackendDataOf(dataObject) {
    let wordAsText = newVariable(dataObject) + `AsText`;
    let stringifyDataObject = JSON.stringify(dataObject);
    await backend.setItem(`${wordAsText}`, stringifyDataObject);
};



async function saveToBackend(key, value) {    
    if (event) event.preventDefault();
    keyAsText = JSON.stringify(value);
    await backend.setItem(key, keyAsText);
    console.log(key, value, keyAsText);
}

/**
 * Saves tasks in the backend in form of an JSON string */
async function saveCategories() { //check async: no diff
    if (event) event.preventDefault();
    let categoriesAsText = JSON.stringify(categories);
    await backend.setItem('categories', categoriesAsText);
}

/**
 *  This function loads and converts the tasks from text-format to a JSON-array. 
 *  The preventDefault() function is necessary to prevent the page from reloading when adding a new task.
 */
function loadFromBackend(key, value) {
    debugger
    if (event) event.preventDefault();
    let keyAsText = backend.getItem(key);
    if (keyAsText) value = JSON.parse(keyAsText);
}


function loadCategories() {
    if (event) event.preventDefault();
    let categoriesAsText = backend.getItem('categories');
    if (categoriesAsText) categories = JSON.parse(categoriesAsText);
}





/**
 * This function Returns an array with one or several HTML elements
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

function lowerFirstLetter(str) {
    return str[0].toLowerCase() + str.slice(1);
}

function removeClass(element, className) {
    getId(`${element}`).classList.remove(className);
}
function addClass(element, className) {
    getId(`${element}`).classList.add(className);
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
        if (i == stringsArray.length - 1) strings += element;
        else strings += element + ', ';
    }
    return strings;
}

function logout() {
    window.open('../00login-register/login.html');
}


function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
}