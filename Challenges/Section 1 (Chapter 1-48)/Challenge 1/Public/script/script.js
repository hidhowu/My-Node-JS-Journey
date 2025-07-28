

// DOM elements
const tasksContainer = document.getElementById('tasks-container');
const taskModal = document.getElementById('taskModal');
const addTaskModal = document.getElementById('addTaskModal');
const addTaskForm = document.getElementById('addTaskForm');


const totalTask = document.getElementById('total-tasks');
const completedTasks = document.getElementById('completed-tasks');
const pendingTasks = document.getElementById('pending-tasks');

// Popup message element
const popupMessage = document.createElement('div');
popupMessage.id = 'popup-message';
popupMessage.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: #333;
    padding: 30px 40px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 3000;
    font-size: 1.2rem;
    font-weight: 500;
    display: none;
    text-align: center;
`;
popupMessage.innerHTML = `<span id="popup-message-text"></span><br><br><button id="popup-close-btn" style="margin-top:10px;padding:8px 20px;border:none;border-radius:8px;background:#764ba2;color:white;font-weight:600;cursor:pointer;">Close</button>`;
document.body.appendChild(popupMessage);
document.getElementById('popup-close-btn').onclick = function () {
    popupMessage.style.display = 'none';
};

// Initialize the app
function init() {
    getAndRenderTasks();
    // updateStats();
}

// Render tasks
async function getAndRenderTasks() {
    tasksContainer.innerHTML = '';

    // fetch tasks from the server
    const tasks = (await (await fetch('http://localhost:3000/api/tasks')).json()).data.tasks;

    const totalTaskCount = tasks.length;
    const pendingTasksCount = tasks.filter(task => !task.completed).length;
    const completedTasksCount = tasks.filter(task => task.completed).length;

    totalTask.textContent = totalTaskCount;
    pendingTasks.textContent = pendingTasksCount;
    completedTasks.textContent = completedTasksCount;


    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${task.completed ? 'completed' : 'pending'}`;
        taskCard.onclick = () => openModal(task);

        taskCard.innerHTML = `
                    <div class="task-id">ID: ${task.id}</div>
                    <div class="task-header">
                        <div class="task-title">${task.title}</div>
                        <span class="task-status ${task.completed ? 'status-completed' : 'status-pending'}">
                            ${task.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                `;

        tasksContainer.appendChild(taskCard);
    });
}


// Open task details modal
function openModal(task) {
    if (!task) {
        showPopupMessage('Task does not exist!');
        return;
    }
    document.getElementById('modal-task-id').textContent = `Task #${task.id}`;
    document.getElementById('modal-task-title').textContent = task.title;
    document.getElementById('modal-task-description').textContent = task.description;

    const statusElement = document.getElementById('modal-task-status');
    statusElement.textContent = task.completed ? 'Completed' : 'Pending';
    statusElement.className = `modal-task-status ${task.completed ? 'status-completed' : 'status-pending'}`;

    taskModal.style.display = 'block';
}

// Close task details modal
function closeTaskModal() {
    taskModal.style.display = 'none';
}

// Open add task modal
function openAddTaskModal() {
    addTaskModal.style.display = 'block';
}

// Close add task modal
function closeAddTaskModal() {
    addTaskModal.style.display = 'none';
    addTaskForm.reset();
}

// Add new task
async function addNewTask(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const completed = document.getElementById('taskCompleted').checked;

    if (!title || !description) {
        showPopupMessage('Please fill in all required fields.');
        return;
    }

    // Simulate backend request (replace with real fetch in production)
    try {
        // Example: Replace with your backend API endpoint
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, completed })
        });
        // const result = await response.json();

        if (response.ok == false) throw new Error(result.error || 'Unknown error');


        // Add to tasks array
        getAndRenderTasks();

        // Close modal and reset form
        closeAddTaskModal();

        // Show success message
        showNotification('Task added successfully!');
    } catch (err) {
        showPopupMessage('Error occurred while adding task: ' + err.message);
    }
}

// Show notification (simple implementation)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
                z-index: 2000;
                font-weight: 500;
                animation: slideInRight 0.3s ease;
            `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show popup message (for errors and non-existent tasks)
function showPopupMessage(message) {
    document.getElementById('popup-message-text').textContent = message;
    popupMessage.style.display = 'block';
}

// Event listeners
addTaskForm.addEventListener('submit', addNewTask);

window.onclick = function (event) {
    if (event.target === taskModal) {
        closeTaskModal();
    }
    if (event.target === addTaskModal) {
        closeAddTaskModal();
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);

// Initialize the app when page loads
init();
