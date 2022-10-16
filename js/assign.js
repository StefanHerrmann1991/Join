/** This function gets all selected user values from an HTML multiple select field and returns the values in an array
 * @returns {string[]} - selected users
 */
function getAssignedUsers() {
    let assignedUsers = [];
    let selectOptions = getId('assignUser').options;

    for (let i = 0; i < selectOptions.length; i++) {
        if (selectOptions[i].selected) {
            assignedUsers.push(selectOptions[i].value);
        }
    }
    return assignedUsers;
}

/**
 * This function Clears user icons when resetting the addToTask.html form
 */
function clearAssignments() {
    getId('iconsContainer').innerHTML = renderAssignedUsers([]);
}

/**
 * This function Renders several user icons for all passed users in an array
 * @param {string[]} usersArr - array with usernames
 * @returns {(string | string)} - user-icon  HTML code for all passed users | replacement image
 */
function renderAssignedUsers(usersArr) {
    let iconsHTML = '';
    if (usersArr && usersArr.length > 0) {
        for (let i = 0; i < usersArr.length; i++) {
            let user = usersArr[i];
            iconsHTML += renderUserIcon(user);
        }
    } else {
        iconsHTML = '<img src="img/icon-plus.png" alt="" class="icon-replacement">';
    }
    return iconsHTML;
}

/**
 * This function Extracts max 2 initials of a given username
 * @param {string} userName - a username
 * @returns {string} initials - the users initials
 */
// returns up to 2 initials of a given user name
function extractInitials(userName) {
    let splitNameArr = userName.split(' ');
    let initials = '';
    if (splitNameArr.length > 1) {
        for (let i = 0; i < 2; i++) { // max 2 initials 
            initials += splitNameArr[i][0] + ' '; // get first character (with a space) of every string/ name
        }
    } else {
        initials = splitNameArr[0][0]; // get first character
    }
    return initials;
}

/**
 * This function Searches a single userobject by name and returns their user icon HTML
 * @param {string} userName - a username
 * @returns {string} - HTML code for the users icon
 */
function renderUserIcon(userName) {
    let user = users.filter(usr => usr.name == userName);
    // get initials (max 2 or 3)
    let initials = extractInitials(userName);
    return /*html*/ `<span id="icon-${userName}" class="user-icon" alt="user icon" style="background-color: ${user[0].color}">${initials}</span>`;
}

/**
 * This function gets all selected users from a select field and shows their user icons
 */
function showSelectedUserIcon() { // ...iconS !
    let selectedUsersArr = getAssignedUsers();
    //if(selectedUsersArr){
    getId('iconsContainer').innerHTML = renderAssignedUsers(selectedUsersArr);
    //}
}

/**
 * This function Finds userobject of given username strings, and returns the color code for the first assigned user
 * @param {string[]} namesArr - array with all assigned users of a task
 * @returns {string} - color code
 * @issue - Only one border-color is shown, and for multiple assigned users always the user with the lowest index will be shown.
 */
function getLogBorderColor(namesArr) {
    if (namesArr) {
        let userName = namesArr[0]; // so right now only first user will be marked by border-color (which will always be user with index 0, need better ideas
        let user = users.filter(usr => usr.name == userName);
        if (user && user.length > 0) {
            return user[0].color;
        }
    }
}