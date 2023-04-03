



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
    if (ids.length == 1) getId(ids[0]).classList.add('d-none');
    ids.forEach(id => getId(id).classList.add('d-none'));
}

/**
 * This function Displays all passed HTML elements
 * @param  {...string} ids - The id of one or several HTML elements
 */
function openContainer(...ids) {
    if (ids.length == 1) getId(ids[0]).classList.remove('d-none');
    ids.forEach(id => getId(id).classList.remove('d-none'));
}

/**
 * This function Toggles the view of all passed HTML elements
 * @param  {...string} ids - The id of one or several HTML elements
 */
function toggleContainer(...ids) {
    ids.forEach(id => getId(id).classList.toggle('d-none'));
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
    elements.forEach(elements[i].value = '')
}

function lowerFirstLetter(str) {
    return str[0].toLowerCase() + str.slice(1);
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


