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

    // Clear the content display when new files are chosen
    document.getElementById('fileContent').innerHTML = '';

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

        let fileSelectionForm = '<form id="fileSelectionForm">';
        files.forEach(file => {
            fileSelectionForm += `
                        <div>
                            <input type="checkbox" id="${file.name}" name="fileSelect" value="${file.name}">
                            <label for="${file.name}">${file.name}</label>
                            <input type="text" id="rename-${file.name}" placeholder="New name" />
                            <button type="button" onclick="renameFile('${file.name}', document.getElementById('rename-${file.name}').value)">Rename</button>
                            <button type="button" onclick="deleteFile('${file.name}')">Delete</button>
                        </div>
                    `;
        });
        fileSelectionForm += `<button type="button" onclick="loadSelectedFiles()">Load Selected Files</button></form>`;
        output.innerHTML += fileSelectionForm;
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
    let selectedFiles = Array.from(form.elements['fileSelect'])
        .filter(input => input.checked)
        .map(input => input.value);

    if (selectedFiles.length === 0) {
        alert("Please select at least one file to load.");
        return;
    }

    let transaction = db.transaction(['files'], 'readonly');
    let objectStore = transaction.objectStore('files');//loading the selevted file store

    selectedFiles.forEach(fileName => {
        let request = objectStore.get(fileName);

        request.onsuccess = function (event) {
            let fileData = event.target.result;
            if (fileData) {
                console.log(`Loaded file: ${fileData.name}`, fileData.content);
                // Display or process the file content as needed
                const data = JSON.parse(contents); // Parse the JSON data

                // Assuming data is an array of MCQs
                mcq_data.push(...data);
            }
        };

        request.onerror = function (event) {
            console.error(`Error loading file ${fileName}:`, event.target.errorCode);
        };
    });

    subjects = getSubjects();
    categories.push(...subjects);
    populateDropdown(); // Populate the dropdown with the subjects
    fullPopulate();
}


