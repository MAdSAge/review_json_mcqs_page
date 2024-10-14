let categories = [];
let mcq_data = [];
let filteredData = [];
let filters = [];
let lastTapTime = 0;

//service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);

                // Check for updates
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // A new version is available
                                showUpdateNotification();
                            }
                        }
                    };
                };
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });

        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
                showUpdateNotification();
            }
        });
    });
}

// Function to show update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.innerText = 'A new version of this application is available. Get latest  🎁';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#d4edda';  // Light green background
    notification.style.color = '#155724';            // Dark green text color
    notification.style.padding = '10px';
    notification.style.border = '1px solid #c3e6cb'; // Green border color
    notification.style.zIndex = '1000';
    notification.style.cursor = 'pointer';


    // Add an event listener to refresh on click
    notification.onclick = () => {
        window.location.reload(); // Refresh the page
    };

    document.body.appendChild(notification);
}

// Function to populate the dropdown
function populateDropdown() {
    const selectElement = document.getElementById('category-select');
    selectElement.innerHTML = ''; // Clear previous options

    // Create and append a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Set the value for no selection
    defaultOption.textContent = 'All'; // Default message
    // defaultOption.disabled = true; // Disable the default option
    defaultOption.selected = true; // Make it selected by default
    selectElement.appendChild(defaultOption);

    // Populate dropdown with categories
    categories.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = `category${index + 1}`;
        option.textContent = category;
        selectElement.appendChild(option);
    });
}


function fullPopulate() {
    populateMcqs(mcq_data);
    CorrectList = document.getElementById('btncheck1');
    IncorrectList = document.getElementById('btncheck2');
    SkippedList = document.getElementById('btncheck3');
    checkboxR = document.getElementById('toggleAnswer');
    imgaeQ = document.getElementById('btncheck4');


    CorrectList.checked = true;
    IncorrectList.checked = true;
    SkippedList.checked = true;
    imgaeQ.checked = false;
    checkboxR.checked = true;


}

function filterPopulate() {


    dropdown = document.getElementById('category-select');
    selectedValue = dropdown.options[dropdown.selectedIndex].text;
    console.log('selectedValue', selectedValue);
    checkboxR.checked = true;


    daata = filterDataFromList(mcq_data, "subject", selectedValue);
    // console.log(daata);
    megaData = [];

    if (selectedValue === "All") {
        daata = mcq_data;
    }




    CorrectList = document.getElementById('btncheck1');
    IncorrectList = document.getElementById('btncheck2');
    SkippedList = document.getElementById('btncheck3');
    imageQ = document.getElementById('btncheck4');

    if (CorrectList.checked) {
        megaData = megaData.concat(filterDataFromList(daata, "stauts", "Correct"));
    }
    if (IncorrectList.checked) {
        megaData = megaData.concat(filterDataFromList(daata, "stauts", "Incorrect"));
    }
    if (SkippedList.checked) {
        megaData = megaData.concat(filterDataFromList(daata, "stauts", "Skipped"));
    } 
    if(imageQ.checked){
        megaData = filterDataByImages(megaData, "question_imag", "");

    }
    if (megaData.length === 0) {

    }

    // console.log(megaData);

    populateMcqs(megaData);

}



function populateMcqs(data) {
    let mcqView = document.getElementById("output");
    mcqView.innerHTML = ''; // Clear previous output
    flotingBtn = document.getElementById("floatingButton");
    flotingBtn.innerText = ''; // Clear previous floating button
    flotingBtn.innerText = '' + data.length



    for (let i = 0; i < data.length; i++) {
        const currentMCq = data[i];

        // Create a base structure of MCQ
        const mcq = document.createElement("div");
        mcq.className = 'mcq';
        mcq.id = `mcq${i}`;



        const question = document.createElement("div");
        question.className = 'question';
        question.innerHTML = currentMCq['question_title'] + currentMCq['question_ADD'] + currentMCq['question_imag'];

        const options = document.createElement("div");
        options.id = `options${i}`;
        options.className = 'options';

        // Assuming options are stored as optionA, optionB, etc.
        ['optionA', 'optionB', 'optionC', 'optionD'].forEach(optionKey => {
            const option = document.createElement("div");
            option.className = 'option';
            option.innerHTML = optionProcesser(i, currentMCq[optionKey]); // Set option text
            options.appendChild(option); // Append option to the options container
        });

        const explanation = document.createElement("div");
        explanation.id = `exp${i}`;
        explanation.className = 'explanation';
        explanation.innerHTML = currentMCq['explanation'] || 'No explanation provided.';

        // Append all elements to the MCQ container
        mcq.appendChild(question);
        mcq.appendChild(options);
        mcq.appendChild(explanation);

        mcqView.appendChild(mcq);
        customHR = document.createElement('hr');
        customHR.className = 'custom-hr';
        customHR.id = `custom-hr${i}`;
        mcqView.appendChild(customHR);
        addClickHandlerForListItem();


        options.addEventListener("dblclick", () => {
            // console.log(`MCQ ${i} clicked`); // Debugging
            toggleVisibility(`exp${i}`)
            toggleVisibilityAnswers(`${i}w`)
            toggleVisibilityAnswers(`${i}r`)
        })
    }
}

// Function to extract unique subjects from mcq_data
function getSubjects() {
    const subjects = [];

    for (let i = 0; i < mcq_data.length; i++) {
        const element = mcq_data[i]["subject"];

        if (element && !subjects.includes(element)) {
            subjects.push(element); // Add unique subjects
        }
    }
    return subjects;
}

// Function to read JSON data from a file input
function readJSON(event) {
    const files = event.target.files; // Get all selected files

    if (!files.length) {
        alert("Please select at least one file.");
        return;
    }

    const reader = new FileReader();

    // This function will process each file one by one
    const processFile = (file) => {
        return new Promise((resolve, reject) => {
            reader.onload = function (e) {
                try {
                    const contents = e.target.result;
                    const data = JSON.parse(contents); // Parse the JSON data

                    // Assuming data is an array of MCQs
                    mcq_data.push(...data); // Spread the data into the mcq_data array

                    resolve(); // Resolve promise when the file is processed
                } catch (error) {
                    reject(`Error processing file ${file.name}: ${error.message}`);
                }
            };
            reader.onerror = function () {
                reject(`Error reading file ${file.name}`);
            };

            reader.readAsText(file); // Read file as text
        });
    };

    // Process each file and then perform final actions
    const processAllFiles = async () => {
        for (const file of files) {
            try {
                await processFile(file); // Wait for each file to be processed
            } catch (error) {
                alert(error); // Handle any errors in file processing
            }
        }

        // After all files have been processed, update the dropdown and log results
        subjects = getSubjects();
        categories.push(...subjects);
        populateDropdown(); // Populate the dropdown with the subjects
        fullPopulate(); // Perform any other necessary updates

        // console.log(mcq_data); // Log the combined MCQ data from all files
    };

    processAllFiles(); // Start processing the files
}

// Function to filter data by a key-value pair
function filterDataFromList(data, key, value) {
    return data.filter(item => item[key] && item[key].toLowerCase() === value.toLowerCase());
}
//filter data by images
function filterDataByImages(data, key, value){

        return data.filter(item => item[key] && item[key] !== "");
    
    

}

// Function to display the filtered data
function displayData(data) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    if (data.length === 0) {
        outputDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    let output = '<ul>'; // Create a list to display the data
    data.forEach(item => {
        output += '<li>' + JSON.stringify(item) + '</li>'; // Display each item as a list entry
    });
    output += '</ul>';
    outputDiv.innerHTML = output; // Update the output div with the generated list
}



function toggleExplanations() {
    const question = document.getElementById('floatingButton');

    // Get all hr elements in the content
    const hrs = document.querySelectorAll('hr');

    // Get the initial position of the question relative to the viewport
    const initialRect = question.getBoundingClientRect();

    // Find the nearest upper and lower hr elements
    let upperHr = null;
    let lowerHr = null;

    hrs.forEach(hr => {
        const hrRect = hr.getBoundingClientRect();
        if (hrRect.bottom < initialRect.top) {
            upperHr = hr; // Found upper hr
        } else if (hrRect.top > initialRect.bottom && !lowerHr) {
            lowerHr = hr; // Found lower hr
        }
    });

    // Get the initial position of the upper and lower hr elements
    const upperHrInitialTop = upperHr ? upperHr.getBoundingClientRect().top : null;
    const lowerHrInitialTop = lowerHr ? lowerHr.getBoundingClientRect().top : null;

    const explanations = document.querySelectorAll('.explanation');
    const checkbox = document.getElementById('toggleAnswer');

    const choices = document.querySelectorAll('.choice');
    choices.forEach(function (choice) {
        // hide or unhide choice class
        choice.style.display = checkbox.checked ? 'inline' : 'none'; // Show if checked, hide if unchecked
    });

    explanations.forEach(explanation => {
        explanation.style.display = checkbox.checked ? 'block' : 'none'; // Show if checked, hide if unchecked
    });

    const newQuestionTop = question.getBoundingClientRect().top;
    const scrollAdjustment = newQuestionTop - (upperHrInitialTop + lowerHrInitialTop) / 2;

    // Use setTimeout to allow the layout to settle after the display toggle
    setTimeout(() => {
        // Get the new positions of the upper and lower hr elements after the toggle
        const upperHrNewTop = upperHr ? upperHr.getBoundingClientRect().top : null;
        const lowerHrNewTop = lowerHr ? lowerHr.getBoundingClientRect().top : null;

        // Calculate the distance to scroll for upper and lower hr elements
        const scrollDistanceToUpper = upperHrInitialTop !== null ? upperHrNewTop - upperHrInitialTop : 0;
        const scrollDistanceToLower = lowerHrInitialTop !== null ? lowerHrNewTop - lowerHrInitialTop : 0;

        // Determine the scroll distance to apply based on which hr is closer
        if (Math.abs(scrollDistanceToUpper) < Math.abs(scrollDistanceToLower)) {
            window.scrollTo(0, window.scrollY + scrollDistanceToUpper); // Instant scroll to upper HR
        } else {
            window.scrollTo(0, window.scrollY + scrollDistanceToLower); // Instant scroll to lower HR
        }
    }, 0);
}

// Add an event listener to call readJSON when a file is selected


function optionProcesser(ids, option) {

    let newSentence = option.replace("Incorrect", `<span id="${ids}w" class='choice'>❌</span>`);
    newSentence = newSentence.replace("Correct", `<span id="${ids}r" class='choice'>✅</span>`);
    words = newSentence.split(' '); // Split by spaces

    // Create a merged sentence without the symbols
    let mergedSentence = words.join(' ')


    return mergedSentence;

}



const doubleTapArea = document.getElementById('output');

doubleTapArea.addEventListener('dblclick', function (event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;

    // If the time between taps is less than 300ms, consider it a double tap
    if (tapLength < 300 && tapLength > 0) {
        // Execute your double-tap logic here
        alert('Double tapped!');
    }

    lastTapTime = currentTime;
});


//floating buttton
const button = document.getElementById('floatingButton');

let isDragging = false;
let offsetX, offsetY;

button.addEventListener('click', (e) => {
    // toggleExplanations();
    toggleButtonColor()
});

button.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - button.getBoundingClientRect().left;
    offsetY = e.clientY - button.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        button.style.left = `${e.clientX - offsetX}px`;
        button.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});


function toggleButtonColor() {
    if (button.style.backgroundColor === "grey") {
        button.style.backgroundColor = "#007bff"; // Change back to original color
    } else {
        button.style.backgroundColor = "grey"; // Change to grey
    }
}



// Touch start event
button.addEventListener('touchstart', (e) => {
    isDragging = true; // Start dragging
    const touch = e.touches[0]; // Get the first touch point
    offsetX = touch.clientX - button.getBoundingClientRect().left; // Calculate offsetX
    offsetY = touch.clientY - button.getBoundingClientRect().top; // Calculate offsetY
    button.style.position = "fixed";
});

// Touch move event
document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0]; // Get the first touch point
        const x = touch.clientX - offsetX; // Calculate new X position
        const y = touch.clientY - offsetY; // Calculate new Y position
        button.style.left = `${x}px`; // Set new left position
        button.style.top = `${y}px`; // Set new top position
    }
});

// Touch end event
document.addEventListener('touchend', () => {
    isDragging = false; // Stop dragging
});

// Optional: Mouse events for desktop compatibility
button.addEventListener('mousedown', (e) => {
    isDragging = true; // Start dragging
    offsetX = e.clientX - button.getBoundingClientRect().left; // Calculate offsetX
    offsetY = e.clientY - button.getBoundingClientRect().top; // Calculate offsetY
    button.style.position = 'fixed'; // Change position to fixed when dragging starts

});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX; // Calculate new X position
        const y = e.clientY - offsetY; // Calculate new Y position
        button.style.left = `${x}px`; // Set new left position
        button.style.top = `${y}px`; // Set new top position
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false; // Stop dragging
});



function toggleVisibility(itemId) {
    const item = document.getElementById(itemId);

    if (item) {
        // Toggle the display property
        item.style.display = item.style.display === "none" ? "block" : "none";
    }
}

function toggleVisibilityAnswers(itemId) {
    const item = document.getElementById(itemId);

    if (item) {
        // Toggle the display property
        item.style.display = item.style.display === "none" ? "inline" : "none";
    }
}




// Fetch the quotes from the API and store them
// Fetch the quotes from the API and store them
async function getapi(url) {
    try {
        const response = await fetch(url);
        const quotes = await response.json();
        quotesArray = quotes;
        displayRandomQuote();
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
    }
}

// Display a random quote from the stored quotes
let quotes = [];

// Fetch quotes from the JSON file
async function fetchQuotes() {
    try {
        const response = await fetch('quotes.json'); // Adjust the path if necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        quotes = await response.json();
        displayRandomQuote(); // Display a random quote after fetching
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// Display a random quote
function displayRandomQuote() {
    const quoteElement = document.getElementById('output');

    if (quotes.length > 0) {
        // Randomly select a quote from the array
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex]["h"];
        quoteElement.innerHTML += `<span style="font-size: 24px; color: #333; font-family: 'Arial', sans-serif; text-align: right;">${randomQuote}</span>`;
    } else {
        quoteElement.innerHTML += "No quotes available.";
    }
}

// Fetch the quotes and display a random one when the page loads
window.onload = () => {
    fetchQuotes(); // Fetch quotes when the page loads
};


// adding the store local fuctionality to the page 
let db;

// Open or create the IndexedDB database
window.onload = function () {
    let request = indexedDB.open('FilesDatabase', 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('files')) {
            db.createObjectStore('files', { keyPath: 'name' });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        displayStoredFilesForSelection(); // Display files on page load
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.errorCode);
    };
};

// Function to read and store selected files
function readAndStoreFiles(event) {
    let files = event.target.files;


    for (let file of files) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let fileContent = e.target.result;
            let transaction = db.transaction(['files'], 'readwrite');
            let objectStore = transaction.objectStore('files');
            let fileData = { name: file.name, content: fileContent };

            let request = objectStore.add(fileData);
            request.onsuccess = function () {
                console.log(`File ${file.name} saved.`);
            };
            request.onerror = function (event) {
                console.error(`Error saving file ${file.name}:`, event.target.errorCode);
            };
        };
        reader.readAsText(file);
    }

    // Refresh the displayed file list after storing the files
    setTimeout(displayStoredFilesForSelection, 100); // Added delay to ensure files are stored before displaying
}

// Function to display stored files with selection checkboxes, rename, and delete options
function displayStoredFilesForSelection() {
    let transaction = db.transaction(['files'], 'readonly');
    let objectStore = transaction.objectStore('files');

    let request = objectStore.getAll();

    request.onsuccess = function (event) {
        let files = event.target.result;

        if (files.length === 0) {
            document.getElementById('output').innerHTML = '<p>No stored files found. Please upload files.</p>';
            return;
        }

        let output = document.getElementById('output');
        output.innerHTML = '<h3>Select Files to Load:</h3>';
        fetchQuotes();

        let fileSelectionForm = '<form id="fileSelectionForm">';
        files.forEach(file => {
            fileSelectionForm += `
                        <div class="file-container">
    <input type="checkbox" id="${file.name}" name="fileSelect" value="${file.name}" class="file-checkbox" aria-label="Select ${file.name}">
    <label for="${file.name}" class="file-label">${file.name}</label>
    
    <input type="text" id="rename-${file.name}" placeholder="New name" class="rename-input" aria-label="Rename ${file.name}" />
    
    <button class="icon-button rename-button" type="button" 
            onclick="renameFile('${file.name}', document.getElementById('rename-${file.name}').value)">
        <img class=".rename-button" src="icons/edit.png" alt="Rename ${file.name}" />
    </button>
    
    <button class="icon-button delete-button" type="button" onclick="deleteFile('${file.name}')" aria-label="Delete ${file.name}">
        <img class=".delete-button" src="icons/delete.png" alt="Delete" />
    </button>
</div>
                    `;
        });
        fileSelectionForm += `<button type="button" onclick="loadSelectedFiles()">Load Selected Files</button></form>`;
        output.innerHTML += fileSelectionForm;
        // Display a random quote after fetching

    };

    request.onerror = function (event) {
        console.error("Error retrieving files from IndexedDB:", event.target.errorCode);
    };
}

// Function to rename a file in IndexedDB
function renameFile(oldName, newName) {
    if (!newName) {
        alert("Please enter a new name.");
        return;
    }

    let transaction = db.transaction(['files'], 'readwrite');
    let objectStore = transaction.objectStore('files');

    // Retrieve the file data
    let request = objectStore.get(oldName);

    request.onsuccess = function (event) {
        let fileData = event.target.result;
        if (fileData) {
            // Delete the old file entry
            objectStore.delete(oldName);
            // Add the file with the new name
            fileData.name = newName;
            objectStore.add(fileData);
            displayStoredFilesForSelection(); // Refresh the file list
        } else {
            alert("File not found.");
        }
    };

    request.onerror = function (event) {
        console.error(`Error renaming file ${oldName}:`, event.target.errorCode);
    };
}

// Function to delete a file from IndexedDB
function deleteFile(fileName) {
    let transaction = db.transaction(['files'], 'readwrite');
    let objectStore = transaction.objectStore('files');

    let request = objectStore.delete(fileName);

    request.onsuccess = function () {
        console.log(`File ${fileName} deleted.`);
        displayStoredFilesForSelection(); // Refresh the file list
    };

    request.onerror = function (event) {
        console.error(`Error deleting file ${fileName}:`, event.target.errorCode);
    };
}

// Function to load selected files
function loadSelectedFiles() {
    let form = document.getElementById('fileSelectionForm');
    let fileSelects = form.elements['fileSelect'];
    let selectedFiles = [];

    if (fileSelects.length === undefined) {
        // Single checkbox
        if (fileSelects.checked) {
            selectedFiles.push(fileSelects.value);
        }
    } else {
        // Multiple checkboxes
        selectedFiles = Array.from(fileSelects)
            .filter(input => input.checked)
            .map(input => input.value);
    }

    let transaction = db.transaction(['files'], 'readonly');
    let objectStore = transaction.objectStore('files');

    // Use Promise.all to wait for all file loading operations to complete
    let fileLoadPromises = selectedFiles.map(fileName => {
        return new Promise((resolve, reject) => {
            let request = objectStore.get(fileName);

            request.onsuccess = function (event) {
                let fileData = event.target.result;
                if (fileData) {
                    // console.log(`Loaded file: ${fileData.name}`, fileData.content);
                    const data = JSON.parse(fileData.content);
                    mcq_data.push(...data);
                    resolve();
                } else {
                    reject(`File ${fileName} not found`);
                }
            };

            request.onerror = function (event) {
                console.error(`Error loading file ${fileName}:`, event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    });

    // Wait for all files to be loaded before proceeding
    Promise.all(fileLoadPromises)
        .then(() => {
            console.log("All files loaded successfully");
            // console.log(mcq_data);

            fullPopulate();

            subjects = getSubjects();
            categories.push(...subjects);
            populateDropdown();
        })
        .catch(error => {
            console.error("Error loading files:", error);
        });
}




async function addClickHandlerForListItem() {

    listItems = document.querySelectorAll('.explanation li');


    listItems.forEach(item => {
        let clickCount = 0; // To track the number of clicks
        let clickTimeout; // To reset click count

        item.addEventListener('click', () => {
            clickCount++;

            // Reset click count after 400 milliseconds
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(() => {
                clickCount = 0;
            }, 400);

            // Check for triple click
            if (clickCount === 3) {
                item.innerHTML = item.textContent; // Change inner HTML to plain text
                item.classList.add('clicked'); // Add class for styling if needed
                clickCount = 0; // Reset click count
            }
        });
    });


}

