// Task management
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskHistory = document.getElementById('taskHistory');
const streakCount = document.getElementById('streakCount');
let tasks = [];
let completedTasks = 0;

document.getElementById('addTaskBtn').addEventListener('click', addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = { id: Date.now(), text: taskText, completed: false };
        tasks.push(task);
        renderTask(task);
        taskInput.value = '';
        saveTasks();
    }
}

function renderTask(task) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
        <span class="${task.completed ? 'completed-task' : ''}">${task.text}</span>
        <div class="task-actions">
            <button class="btn btn-sm btn-success complete-btn">✓</button>
            <button class="btn btn-sm btn-danger delete-btn">✕</button>
        </div>
    `;
    
    li.querySelector('.complete-btn').addEventListener('click', () => completeTask(task.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
    
    taskList.appendChild(li);
}

function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        updateTaskDisplay();
        updateStreak();
        saveTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    updateTaskDisplay();
    saveTasks();
}

function updateTaskDisplay() {
    taskList.innerHTML = '';
    taskHistory.innerHTML = '';
    tasks.forEach(task => {
        if (task.completed) {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = task.text;
            taskHistory.appendChild(li);
        } else {
            renderTask(task);
        }
    });
}

function updateStreak() {
    completedTasks++;
    streakCount.textContent = completedTasks;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', completedTasks);
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        updateTaskDisplay();
    }
    if (savedCompletedTasks) {
        completedTasks = parseInt(savedCompletedTasks);
        streakCount.textContent = completedTasks;
    }
}

// Pomodoro Timer
const timerDisplay = document.getElementById('timerDisplay');
const startTimerBtn = document.getElementById('startTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const timerFill = document.getElementById('timerFill');
const customTimerInput = document.getElementById('customTimerInput');
const setCustomTimerBtn = document.getElementById('setCustomTimerBtn');
let timerDuration = 25 * 60; // Default to 25 minutes
let timerInterval;

startTimerBtn.addEventListener('click', startTimer);
resetTimerBtn.addEventListener('click', () => resetTimer(25*60));
setCustomTimerBtn.addEventListener('click', setCustomTimer);

function setCustomTimer() {
    const customTime = parseInt(customTimerInput.value);
    if (customTime && customTime > 0) {
        timerDuration = customTime * 60; // Convert minutes to seconds
        updateTimerDisplay();
        resetTimer(timerDuration); // Reset the timer to reflect the custom time
    } else {
        alert("Please enter a valid number greater than 0.");
    }
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
        startTimerBtn.textContent = 'Pause';
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        startTimerBtn.textContent = 'Resume';
    }
}

function resetTimer(x) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerDuration = x; // Reset to default 25 minutes
    updateTimerDisplay();
    startTimerBtn.textContent = 'Start';
    timerFill.style.transform = 'rotate(0deg)'; // Reset fill
}

function updateTimer() {
    if (timerDuration > 0) {
        timerDuration--;
        updateTimerDisplay();
        updateCircleFill();
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('Pomodoro session completed!');
        resetTimer();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerDuration / 60);
    const seconds = timerDuration % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateCircleFill() {
    const totalDuration = (timerDuration >= 25 * 60) ? (25 * 60) : timerDuration; // Adjust based on current duration
    const percentage = (totalDuration - timerDuration) / totalDuration * 100; // Calculate percentage based on remaining time
    const rotation = (percentage * 3.6); // 360 degrees for a full cycle
    timerFill.style.transform = `rotate(${rotation}deg)`;
}

// Load tasks on page load
loadTasks();


function exportCompletedTasks() {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length === 0) {
        alert("No completed tasks to export.");
        return;
    }
    
    const taskTexts = completedTasks.map(task => task.text).join('\n');
    const blob = new Blob([taskTexts], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'completed_tasks.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add this function call to a button or event listener where you'd like to trigger the export
document.getElementById('exportCompletedBtn').addEventListener('click', exportCompletedTasks);

function deleteCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    updateTaskDisplay();
    saveTasks();
}

// Add this function call to a button or event listener where you'd like to trigger the deletion
document.getElementById('deleteCompletedBtn').addEventListener('click', deleteCompletedTasks);
