
let contactBookId;
let sortByLastName = false;


function newContact(name, email, phone, initial) {
  let contact = {
    'name': name,
    'email': email,
    'phone': phone,
    'initial': initial
  }
  return contact;
}

class ContactBook {
  contacts;
  initialList;

  constructor() {
    this.contacts = [];
    this.initialList = [];
  }

  addContact(name, email, phone) {
    let [firstNameInitial, initials] = this.getInitials(name);
    let contact = newContact(name, email, phone, initials);

    if (!this.initialList.includes(firstNameInitial)) {
      this.initialList.push(firstNameInitial);
      this.contacts.push({ [firstNameInitial]: [contact] });
    } else {
      let index = this.contacts.findIndex(element => element.hasOwnProperty(firstNameInitial));
      this.contacts[index][firstNameInitial].push(contact);
    }
  }




  getInitials(name) {
    const nameArray = name.split(' ');
    const firstNameInitial = nameArray.shift().substring(0, 1).toUpperCase();
    let lastNameInitial = "";
    if (nameArray.length > 0) lastNameInitial = nameArray.pop().substring(0, 1);
    const initials = firstNameInitial + lastNameInitial;
    return [firstNameInitial, initials]
  }

  sortContacts() { }

}

const contactBook = new ContactBook();


function openContactDialog() {
  document.getElementById('addContactDialog').classList.remove('d-none');
}


function closeContactDialog() {
  document.getElementById('addContactDialog').classList.add('d-none');
}


function createContact(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  contactBook.addContact(name, email, phone);
  contactBook.sortContacts();
  closeContactDialog();
  renderContacts();
  console.log(contactBook)
}




function newVariable(paramAsText) {
  let objectName;
  if (typeof paramAsText === 'object') objectName = paramAsText.constructor.name;
  else objectName = paramAsText;
  return `${objectName}`;
}


async function saveDataToBackend(dataObject) {
  let wordAsText = newVariable(dataObject);
  let stringifyDataObject = JSON.stringify(dataObject);
  await backend.setItem(`${wordAsText}`, stringifyDataObject);  
};


async function loadDataFromBackend(dataObject) {
  let name = newVariable(dataObject);
  name = await backend.getItem(`${dataObject}`);
  if (name) dataObject = JSON.parse(name);
};


async function editDataInBackend(dataObject, i) {
  // check: async no diff
  let task = await processTaskInputs();
  task.board = dataObject[i].board; // keep the right board
  dataObject[i] = task;
  saveTasks();
  hide('overlay');
  // check if sent from boards page or backlog page and render content
  if (getId('todoBoard')) renderBoards()
};

/**
 * Deletes an element from an array, updates the data on the server,  and renders boards.
 * @param {dataArray} @type {Array}
 * @param {i} @type {Number}
 */

async function deleteDataFromBackend(dataObject, i) {
  dataObject.splice(i, 1);
  saveTasks();
};

function initContactBook() {
  renderContacts();
}


function renderContacts() {

  contactBookId = document.getElementById('contactBookId');
  contactBook.contacts.forEach((element, index) => {
    let initial = Object.keys(element)[0];
    contactBookId.innerHTML = ''
    contactBookId.innerHTML += `<h3>${initial}</h3><div id="${initial + index}"></div>`;
    let initialID = document?.getElementById(`${initial + index}`);
    element[initial].forEach(contact => {
      initialID.innerHTML += `<li>${contact.name}</li>`;
    });
  });
}

