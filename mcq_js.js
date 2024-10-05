let categories = [];
let mcq_data = [];
let filteredData = [];
let filters = [];
let lastTapTime = 0;


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


    CorrectList.checked = true;
    IncorrectList.checked = true;
    SkippedList.checked = true;
    checkboxR.checked = true;


}

function filterPopulate() {


    dropdown = document.getElementById('category-select');
    selectedValue = dropdown.options[dropdown.selectedIndex].text;
    console.log('selectedValue', selectedValue);
    checkboxR.checked = true;


    daata = filterDataFromList(mcq_data, "subject", selectedValue);
    console.log(daata);
    megaData = [];

    if (selectedValue === "All") {
        daata = mcq_data;
    }




    CorrectList = document.getElementById('btncheck1');
    IncorrectList = document.getElementById('btncheck2');
    SkippedList = document.getElementById('btncheck3');

    if (CorrectList.checked) {
        megaData = megaData.concat(filterDataFromList(daata, "stauts", "Correct"));
    }
    if (IncorrectList.checked) {
        megaData = megaData.concat(filterDataFromList(daata, "stauts", "Incorrect"));
    }
    if (SkippedList.checked) {
        megaData = megaData.concat(filterDataFromList(daata, "stauts", "Skipped"));
    } if (megaData.length === 0) {

    }

    console.log(megaData);

    populateMcqs(megaData);

}

function populateMcqs(data) {
    let mcqView = document.getElementById("output");
    mcqView.innerHTML = ''; // Clear previous output



    for (let i = 0; i < data.length; i++) {
        const currentMCq = data[i];

        // Create a base structure of MCQ
        const mcq = document.createElement("div");
        mcq.className = 'mcq';

        const question = document.createElement("div");
        question.className = 'question';
        question.innerHTML = currentMCq['question_title'] + currentMCq['question_ADD'] + currentMCq['question_imag'];

        const options = document.createElement("div");
        options.className = 'options';

        // Assuming options are stored as optionA, optionB, etc.
        ['optionA', 'optionB', 'optionC', 'optionD'].forEach(optionKey => {
            const option = document.createElement("div");
            option.className = 'option';
            option.innerHTML = optionProcesser(currentMCq[optionKey]); // Set option text
            options.appendChild(option); // Append option to the options container
        });

        const explanation = document.createElement("div");
        explanation.className = 'explanation';
        explanation.innerHTML = currentMCq['explanation'] || 'No explanation provided.';

        // Append all elements to the MCQ container
        mcq.appendChild(question);
        mcq.appendChild(options);
        mcq.appendChild(explanation);

        mcqView.appendChild(mcq);
        customHR = document.createElement('hr');
        customHR.className = 'custom-hr';
        mcqView.appendChild(customHR);
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

        console.log(mcq_data); // Log the combined MCQ data from all files
    };

    processAllFiles(); // Start processing the files
}

// Function to filter data by a key-value pair
function filterDataFromList(data, key, value) {
    return data.filter(item => item[key] && item[key].toLowerCase() === value.toLowerCase());
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
    const explanations = document.querySelectorAll('.explanation');
    const checkbox = document.getElementById('toggleAnswer');

    const choices = document.querySelectorAll('.choice');
    choices.forEach(function (choice) {
        // hide or unhide chooice class
        choice.style.display = checkbox.checked ? 'inline' : 'none'; // Show if checked, hide if unchecked

    });

    explanations.forEach(explanation => {
        explanation.style.display = checkbox.checked ? 'block' : 'none'; // Show if checked, hide if unchecked
    });


}

// Add an event listener to call readJSON when a file is selected


function optionProcesser(option) {

    newSentence = option.replace("Incorrect", "<span class='choice'>❌</span>"); // Replace "fox" with "cat"
    newSentence = newSentence.replace("Correct", "<span class='choice'>✅</span>");
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





