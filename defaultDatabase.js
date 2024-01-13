async function emptyDatabase() {
    let registeredUsers = [];
    let contactBook = [];
    let tasks = [];

    await saveToBackend('registeredUsers', registeredUsers);
    await saveBackendDataOf(contactBook);
    await saveToBackend('tasks', tasks);
    await saveToBackend('categories', categories);
}


async function loadDefaultDatabase() {
    tasks = await loadFromBackend('tasks', tasks);
    categories = await loadFromBackend('categories', categories);
    registeredUsers = await loadFromBackend('registeredUsers', registeredUsers);
    contactBookText = await loadFromBackend('ContactBookAsText');
    console.log(contactBookText, registeredUsers, tasks, categories);
}


let defaultCategories = [
    {
        "topic": "Sales",
        "color": "#FC71FF",
        "index": "0"
    },
    {
        "topic": "Backoffice",
        "color": "#1FD7C1",
        "index": "1"
    },
    {
        "topic": "Management",
        "color": "#E200BE",
        "index": "2"
    },
    {
        "topic": "Frontend",
        "color": "#0038FF",
        "index": "3"
    },
    {
        "topic": "Backend",
        "color": "#2AD300",
        "index": "4"
    }
]


let defaultRegisteredUsers = [{

}]


let defaultContacts = [{
    "contacts": [
        {
            "name": "Fabian Eichhorn",
            "email": "fabian@gmx.de",
            "phone": "012222",
            "initial": "FE",
            "color": "rgb(234, 11, 170, 1.0)",
            "firstNameInitial": "F",
            "assigned": false,
            "id": 1
        },
        {
            "name": "Ines Fritsch",
            "email": "fritsch@gmx.de",
            "phone": "012222",
            "initial": "IF",
            "color": "rgb(188, 57, 47, 1.0)",
            "firstNameInitial": "I",
            "assigned": false,
            "id": 0
        },
        {
            "name": "Marco Beer",
            "email": "marco@gmx.de",
            "phone": "012222",
            "initial": "MB",
            "color": "rgb(127, 32, 139, 1.0)",
            "firstNameInitial": "M",
            "assigned": false,
            "id": 2
        },
        {
            "name": "Stefan Herrmann",
            "email": "sth1812@posteo.de",
            "phone": "012222",
            "initial": "SH",
            "color": "rgb(35, 123, 149, 1.0)",
            "firstNameInitial": "S",
            "assigned": false,
            "id": 3
        }
    ],
    "initialList": [
        "F",
        "I",
        "M",
        "S"
    ]
}
]

let defaultTasks = [
    {
        "title": "Client Research",
        "description": "Conduct in-depth research to identify and profile potential clients in various industries, understanding their needs and how the product can meet them.",
        "category": {
            "topic": "Frontend",
            "color": "#0038FF",
            "index": "3"
        },
        "priority": "low",
        "date": "2023-12-23",
        "board": "board-2",
        "assignedTo": [
            {
                "name": "Fabian Eichhorn",
                "email": "fabian@gmx.de",
                "phone": "012222",
                "initial": "FE",
                "color": "rgb(234, 11, 170, 1.0)",
                "firstNameInitial": "F",
                "assigned": true,
                "id": 1
            },
            {
                "name": "Ines Fritsch",
                "email": "fritsch@gmx.de",
                "phone": "012222",
                "initial": "IF",
                "color": "rgb(188, 57, 47, 1.0)",
                "firstNameInitial": "I",
                "assigned": true,
                "id": 0
            }
        ],
        "subtasks": [
            {
                "title": "Identify target industries",
                "checked": true
            },
            {
                "title": "Profile key companies.",
                "checked": true
            }
        ]
    },
    {
        "title": "Server-Side Rendering",
        "description": "If possible, handle the inclusion and ID modification on the server side. When the server sends the HTML to the client, it can ensure that all IDs are unique. This approach is more efficient because it offloads processing from the client to the server.",
        "category": {
            "topic": "Backoffice",
            "color": "#1FD7C1",
            "index": "1"
        },
        "priority": "medium",
        "date": "2023-12-22",
        "board": "board-1",
        "assignedTo": [
            {
                "name": "Marco Beer",
                "email": "marco@gmx.de",
                "phone": "012222",
                "initial": "MB",
                "color": "rgb(127, 32, 139, 1.0)",
                "firstNameInitial": "M",
                "assigned": true,
                "id": 2
            },
            {
                "name": "Stefan Herrmann",
                "email": "sth1812@posteo.de",
                "phone": "012222",
                "initial": "SH",
                "color": "rgb(35, 123, 149, 1.0)",
                "firstNameInitial": "S",
                "assigned": true,
                "id": 3
            }
        ],
        "subtasks": []
    },
    {
        "title": "Financial Processing",
        "description": "Handle financial tasks such as invoicing, payments processing, and expense tracking.",
        "category": {
            "topic": "Backoffice",
            "color": "#1FD7C1",
            "index": "1"
        },
        "priority": "low",
        "date": "2023-12-23",
        "board": "board-0",
        "assignedTo": [
            {
                "name": "Marco Beer",
                "email": "marco@gmx.de",
                "phone": "012222",
                "initial": "MB",
                "color": "rgb(127, 32, 139, 1.0)",
                "firstNameInitial": "M",
                "assigned": true,
                "id": 2
            },
            {
                "name": "Stefan Herrmann",
                "email": "sth1812@posteo.de",
                "phone": "012222",
                "initial": "SH",
                "color": "rgb(35, 123, 149, 1.0)",
                "firstNameInitial": "S",
                "assigned": true,
                "id": 3
            }
        ],
        "subtasks": [
            {
                "title": " Process invoices.",
                "checked": false
            },
            {
                "title": "Track and reconcile expenses.",
                "checked": false
            }
        ]
    },
    {
        "title": "Neuer Task",
        "description": "asdf",
        "category": {
            "topic": "Management",
            "color": "#E200BE",
            "index": "2"
        },
        "priority": "medium",
        "date": "2023-12-22",
        "board": "board-1",
        "assignedTo": [
            {
                "name": "Ines Fritsch",
                "email": "fritsch@gmx.de",
                "phone": "012222",
                "initial": "IF",
                "color": "rgb(188, 57, 47, 1.0)",
                "firstNameInitial": "I",
                "assigned": true,
                "id": 0
            },
            {
                "name": "Peter Münzer",
                "email": "p.muenzer@gmx.de",
                "phone": "11222222",
                "initial": "PM",
                "color": "rgb(81, 78, 16, 1.0)",
                "firstNameInitial": "P",
                "assigned": true,
                "id": 4
            }
        ],
        "subtasks": [
            {
                "title": "Neuer Task",
                "checked": true
            },
            {
                "title": "Neuer Task 2",
                "checked": true
            }
        ],
        "id": 4
    },
    {
        "title": "HR Administration",
        "description": "Manage human resources tasks including payroll, benefits administration, and employee records.",
        "category": {
            "topic": "Backoffice",
            "color": "#1FD7C1",
            "index": "1"
        },
        "priority": "low",
        "date": "2023-12-29",
        "board": "board-0",
        "assignedTo": [
            {
                "name": "Ines Fritsch",
                "email": "fritsch@gmx.de",
                "phone": "012222",
                "initial": "IF",
                "color": "rgb(188, 57, 47, 1.0)",
                "firstNameInitial": "I",
                "assigned": true,
                "id": 0
            },
            {
                "name": "Marco Beer",
                "email": "marco@gmx.de",
                "phone": "012222",
                "initial": "MB",
                "color": "rgb(127, 32, 139, 1.0)",
                "firstNameInitial": "M",
                "assigned": true,
                "id": 2
            },
            {
                "name": "Stefan Herrmann",
                "email": "sth1812@posteo.de",
                "phone": "012222",
                "initial": "SH",
                "color": "rgb(35, 123, 149, 1.0)",
                "firstNameInitial": "S",
                "assigned": true,
                "id": 3
            }
        ],
        "subtasks": [
            {
                "title": "Process payroll.",
                "checked": false
            },
            {
                "title": "Manage employee files.",
                "checked": false
            }
        ]
    },
    {
        "title": "UI Development",
        "description": "Design and develop user interfaces for web applications, ensuring they are visually appealing and user-friendly.",
        "category": {
            "topic": "Frontend",
            "color": "#0038FF",
            "index": "3"
        },
        "priority": "low",
        "date": "2023-12-31",
        "board": "board-2",
        "assignedTo": [
            {
                "name": "Ines Fritsch",
                "email": "fritsch@gmx.de",
                "phone": "012222",
                "initial": "IF",
                "color": "rgb(188, 57, 47, 1.0)",
                "firstNameInitial": "I",
                "assigned": true,
                "id": 0
            },
            {
                "name": "Marco Beer",
                "email": "marco@gmx.de",
                "phone": "012222",
                "initial": "MB",
                "color": "rgb(127, 32, 139, 1.0)",
                "firstNameInitial": "M",
                "assigned": true,
                "id": 2
            }
        ],
        "subtasks": [
            {
                "title": "Create UI mockups.",
                "checked": false
            },
            {
                "title": "Implement designs in code.",
                "checked": false
            }
        ]
    },
    {
        "title": "Networking",
        "description": "Actively participate in industry events to build a network, generate leads, and stay informed about industry developments.",
        "category": {
            "topic": "Sales",
            "color": "#FC71FF",
            "index": "0"
        },
        "priority": "urgent",
        "date": "2024-01-27",
        "board": "board-1",
        "assignedTo": [
            {
                "name": "Marco Beer",
                "email": "marco@gmx.de",
                "phone": "012222",
                "initial": "MB",
                "color": "rgb(127, 32, 139, 1.0)",
                "firstNameInitial": "M",
                "assigned": true,
                "id": 2
            },
            {
                "name": "Ines Fritsch",
                "email": "fritsch@gmx.de",
                "phone": "012222",
                "initial": "IF",
                "color": "rgb(188, 57, 47, 1.0)",
                "firstNameInitial": "I",
                "assigned": true,
                "id": 0
            },
            {
                "name": "Fabian Eichhorn",
                "email": "fabian@gmx.de",
                "phone": "012222",
                "initial": "FE",
                "color": "rgb(234, 11, 170, 1.0)",
                "firstNameInitial": "F",
                "assigned": true,
                "id": 1
            },
            {
                "name": "Stefan Herrmann",
                "email": "sth1812@posteo.de",
                "phone": "012222",
                "initial": "SH",
                "color": "rgb(35, 123, 149, 1.0)",
                "firstNameInitial": "S",
                "assigned": true,
                "id": 3
            },
            {
                "name": "Peter Münzer",
                "email": "p.muenzer@gmx.de",
                "phone": "11222222",
                "initial": "PM",
                "color": "rgb(81, 78, 16, 1.0)",
                "firstNameInitial": "P",
                "assigned": true,
                "id": 4
            }
        ],
        "subtasks": [
            {
                "title": " Attend events.",
                "checked": false
            },
            {
                "title": "Follow up with contacts.",
                "checked": false
            }
        ]
    },
    {
        "title": "asdf",
        "description": "asdf",
        "category": {
            "topic": "Management",
            "color": "#E200BE",
            "index": "2"
        },
        "priority": "low",
        "date": "2024-01-06",
        "board": "board-0",
        "assignedTo": [],
        "subtasks": [
            {
                "title": "Neuer Task",
                "checked": false
            }
        ],
        "id": 8
    }
]