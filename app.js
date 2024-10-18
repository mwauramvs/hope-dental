// Patient data structure
let patients = JSON.parse(localStorage.getItem('patients')) || [];

// Function to add a patient to the queue
function addPatient() {
    const patientName = document.getElementById('patientName').value;
    const doctorName = document.getElementById('doctorName').value;

    if (patientName && doctorName) {
        // Add patient object to the list
        patients.push({
            name: patientName,
            doctor: doctorName,
            biography: '',
            investigations: '',
            findings: '',
            treatmentPlan: '',
            treatmentDone: '',
            treatmentCompletion: '',
            treatments: []  // Array to store treatment history
        });

        // Clear input fields
        document.getElementById('patientName').value = '';
        document.getElementById('doctorName').value = '';

        // Save updated patients array to local storage
        localStorage.setItem('patients', JSON.stringify(patients));

        // Render the updated queue
        renderQueue();
    } else {
        alert("Please fill out both patient and doctor's names.");
    }
}

// Function to render the patient queue
function renderQueue() {
    const queue = document.getElementById('patientQueue');
    queue.innerHTML = ''; // Clear existing queue

    patients.forEach((patient, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${patient.name}</strong></td>
            <td>${patient.doctor}</td>
            <td>
                <button onclick="openPatientCard(${index})">Open Card</button>
                <button onclick="deletePatientFromQueue(${index})">Delete</button>
            </td>
        `;
        queue.appendChild(row);
    });
}

// Function to filter patients in the queue
function filterPatients() {
    const searchValue = document.getElementById('searchBox').value.toLowerCase();
    const queue = document.getElementById('patientQueue');
    queue.innerHTML = ''; // Clear the current table rows

    patients.forEach((patient, index) => {
        if (patient.name.toLowerCase().includes(searchValue)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${patient.name}</strong></td>
                <td>${patient.doctor}</td>
                <td>
                    <button onclick="openPatientCard(${index})">Open Card</button>
                    <button onclick="deletePatientFromQueue(${index})">Delete</button>
                </td>
            `;
            queue.appendChild(row);
        }
    });
}

// Function to open a patient's card
function openPatientCard(index) {
    const modal = document.getElementById('patientCardModal');
    const patient = patients[index];

    // Populate the modal with patient name and doctor, but leave other fields empty
    document.getElementById('modalPatientName').textContent = patient.name;
    document.getElementById('modalDoctorName').textContent = patient.doctor;

    // Always leave fields empty, even for subsequent visits
    document.getElementById('patientBiography').value = '';
    document.getElementById('investigations').value = '';
    document.getElementById('findings').value = '';
    document.getElementById('treatmentPlan').value = '';
    document.getElementById('treatmentDone').value = '';
    document.getElementById('treatmentCompletion').value = '';

    // Clear treatment history display
    const treatmentList = document.getElementById('treatmentHistory');
    treatmentList.innerHTML = '';
    patient.treatments.forEach((treatment, treatmentIndex) => {
        const treatmentItem = document.createElement('li');
        treatmentItem.innerHTML = `
            <strong>Date:</strong> ${treatment.date} | 
            <strong>Biography:</strong> ${treatment.biography} | 
            <strong>Investigation:</strong> ${treatment.investigation} | 
            <strong>Treatment Done:</strong> ${treatment.treatmentDone}
            <button onclick="deleteTreatment(${index}, ${treatmentIndex})">Delete</button>
        `;
        treatmentList.appendChild(treatmentItem);
    });

    // Save index for later use
    document.getElementById('saveButton').onclick = function() {
        savePatientNotes(index);
    };

    modal.style.display = 'block'; // Show the modal
}

// Function to close the patient card modal
function closePatientCard() {
    document.getElementById('patientCardModal').style.display = 'none';
}

// Function to save the doctor's notes and treatments
function savePatientNotes(index) {
    const patient = patients[index];
    patient.biography = document.getElementById('patientBiography').value;
    patient.investigations = document.getElementById('investigations').value;
    patient.findings = document.getElementById('findings').value;
    patient.treatmentPlan = document.getElementById('treatmentPlan').value;
    patient.treatmentDone = document.getElementById('treatmentDone').value;
    patient.treatmentCompletion = document.getElementById('treatmentCompletion').value;

    // Add treatment history data
    const treatmentDate = prompt("Enter treatment date (YYYY-MM-DD):");
    if (treatmentDate) {
        patient.treatments.push({
            date: treatmentDate,
            biography: patient.biography,
            investigation: patient.investigations,
            treatmentDone: patient.treatmentDone
        });
    }

    // Save updated patients array to local storage
    localStorage.setItem('patients', JSON.stringify(patients));

    renderQueue(); // Update the queue display
    closePatientCard(); // Close the modal
}

// Function to delete a patient from the queue with a confirmation prompt
function deletePatientFromQueue(index) {
    const patient = patients[index];
    const confirmation = confirm(`Are you sure you want to delete patient ${patient.name} from the queue?`);
    
    if (confirmation) {
        // Proceed with deletion if the user confirms
        patients.splice(index, 1);
        localStorage.setItem('patients', JSON.stringify(patients)); // Update local storage
        renderQueue();
    } else {
        // Do nothing if the user cancels the deletion
        console.log("Patient deletion cancelled.");
    }
}

// Function to delete a treatment from the treatment history with a confirmation prompt
function deleteTreatment(patientIndex, treatmentIndex) {
    const patient = patients[patientIndex];
    const treatment = patient.treatments[treatmentIndex];
    const confirmation = confirm(`Are you sure you want to delete the treatment done on ${treatment.date}?`);

    if (confirmation) {
        // Proceed with deletion if the user confirms
        patient.treatments.splice(treatmentIndex, 1);
        localStorage.setItem('patients', JSON.stringify(patients)); // Update local storage
        openPatientCard(patientIndex); // Refresh the patient card
    } else {
        // Do nothing if the user cancels the deletion
        console.log("Treatment deletion cancelled.");
    }
}

// Initial rendering of the queue on page load
window.onload = renderQueue;
