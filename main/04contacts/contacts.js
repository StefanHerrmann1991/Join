
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
    console.log(contact)
    if (!this.initialList.includes(firstNameInitial)) {
      this.initialList.push(firstNameInitial);
      this.contacts.push({ [firstNameInitial]: [contact] });
    }
    else {
      for (let i = 0; i < this.contacts.length; i++) {
        const element = this.contacts[i];
        if (element.hasOwnProperty(firstNameInitial)) {
          element[firstNameInitial].push(contact);
          break;
        }
      }
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



function saveContacts() { };
function loadContacts() { };
function editContacts() { };

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

