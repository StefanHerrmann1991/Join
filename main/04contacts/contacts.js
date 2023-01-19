class Contact {
    constructor(name) {
      this.name = name;
    }
  }
  
  class ContactBook {
    constructor() {
      this.contacts = [];
    }
  
    addContact(name) {
      this.contacts.push(new Contact(name));
    }
  
    sortContacts() {
      this.contacts.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }
  } 

  const contactBook = new ContactBook();
  contactBook.addContact("Alice");
  contactBook.addContact("Bob");
  contactBook.addContact("Charlie");
  
  // Sort the contacts by name
  contactBook.sortContacts();

  