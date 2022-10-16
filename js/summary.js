
function initSummary() {
renderSummary();
}


function renderSummary() {

    getId('summaryMenu').innerHTML = `
    
    
    <div>Tasks in Board</div>
    <div>Task in Progress</div>
    <div>Awaiting Feedback</div>
    <div>Priority</div>
    <div>To-Do</div>
    <div>Done</div>    
    `
}