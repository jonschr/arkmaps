const mapContainer = document.getElementById('map-container');
const coordinatesDisplay = document.getElementById('coordinates');
const dialog = document.getElementById('dialog');
const overlay = document.getElementById('overlay');
const xInput = document.getElementById('x');
const yInput = document.getElementById('y');
const zInput = document.getElementById('z');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const saveMarkerButton = document.getElementById('save-marker');
const deleteMarkerButton = document.getElementById('delete-marker');

let clickX = 0;
let clickY = 0;
let currentMarkerIndex = null; // Track the current marker index for updates
let markers = []; // Store markers in an array
let markerElements = []; // Store marker DOM elements

// Function to add a marker
function addMarker(x, y, z, title, description) {
	console.log(`Adding marker: ${title} at (${x}, ${y})`); // Debugging log

	// Create a new marker element
	const marker = document.createElement('div');
	marker.className = 'marker';
	marker.style.left = `${(x / 100) * mapContainer.clientWidth}px`;
	marker.style.top = `${(y / 100) * mapContainer.clientHeight}px`;
	marker.title = `${title}: ${description}`;

	// Create coordinates display for the marker
	const markerCoordinates = document.createElement('div');
	markerCoordinates.className = 'marker-coordinates';
	markerCoordinates.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
	marker.appendChild(markerCoordinates);

	// Add click event to the marker for editing
	marker.addEventListener('click', () => {
		currentMarkerIndex = markers.findIndex(
			(m) => m.title === title && m.x === x && m.y === y
		);
		if (currentMarkerIndex !== -1) {
			xInput.value = x.toFixed(2);
			yInput.value = y.toFixed(2);
			zInput.value = z.toFixed(2);
			titleInput.value = title;
			descriptionInput.value = description;
			dialog.showModal();
			overlay.style.display = 'block';
			titleInput.focus(); // Focus on the title input
		}
	});

	// Append the marker to the map container
	mapContainer.appendChild(marker);
	markers.push({ x, y, z, title, description });
	markerElements.push(marker); // Store the marker element
	saveMarkersToLocalStorage();
}

// Load markers from local storage
function loadMarkers() {
	markers = JSON.parse(localStorage.getItem('markers')) || [];

	// Remove duplicates
	const uniqueMarkers = [];
	const uniqueTitles = new Set();

	markers.forEach((marker) => {
		const markerKey = `${marker.title}-${marker.x}-${marker.y}`;
		if (!uniqueTitles.has(markerKey)) {
			uniqueTitles.add(markerKey);
			uniqueMarkers.push(marker);
		}
	});

	// Clear the existing markers array and add unique markers
	markers = uniqueMarkers;
	markers.forEach((marker) => {
		console.log(
			`Loading marker: ${marker.title} at (${marker.x}, ${marker.y})`
		); // Debugging log
		addMarker(
			marker.x,
			marker.y,
			marker.z,
			marker.title,
			marker.description
		);
	});
}

// Save markers to local storage
function saveMarkersToLocalStorage() {
	localStorage.setItem('markers', JSON.stringify(markers));
}

// Show coordinates on hover
mapContainer.addEventListener('mousemove', (event) => {
	const rect = mapContainer.getBoundingClientRect();
	const x = ((event.clientX - rect.left) / rect.width) * 100;
	const y = ((event.clientY - rect.top) / rect.height) * 100;
	coordinatesDisplay.textContent = `Coordinates: (${x.toFixed(
		2
	)}, ${y.toFixed(2)})`;
});

// Click to add marker
mapContainer.addEventListener('click', (event) => {
	event.preventDefault(); // Prevent default behavior
	if (currentMarkerIndex === null) {
		// Only add if not editing
		const rect = mapContainer.getBoundingClientRect();
		clickX = ((event.clientX - rect.left) / rect.width) * 100;
		clickY = ((event.clientY - rect.top) / rect.height) * 100;

		// Prepopulate dialog with coordinates
		xInput.value = clickX.toFixed(2);
		yInput.value = clickY.toFixed(2);
		zInput.value = 0; // Default Z coordinate
		titleInput.value = '';
		descriptionInput.value = '';
		dialog.showModal();
		overlay.style.display = 'block';
		titleInput.focus(); // Focus on the title input
	}
});

// Save marker
saveMarkerButton.addEventListener('click', () => {
	const x = parseFloat(xInput.value);
	const y = parseFloat(yInput.value);
	const z = parseFloat(zInput.value);
	const title = titleInput.value;
	const description = descriptionInput.value;

	addMarker(x, y, z, title, description);
	dialog.close();
	overlay.style.display = 'none';
	clearDialogInputs();
	currentMarkerIndex = null; // Reset index
});

// Delete marker
deleteMarkerButton.addEventListener('click', () => {
	if (currentMarkerIndex !== null) {
		// Remove marker from array and DOM
		markers.splice(currentMarkerIndex, 1); // Remove marker from array
		const markerToRemove = markerElements[currentMarkerIndex];
		markerToRemove.remove(); // Remove marker from DOM
		markerElements.splice(currentMarkerIndex, 1); // Remove from markerElements array
		saveMarkersToLocalStorage(); // Update local storage
		dialog.close();
		overlay.style.display = 'none';
		clearDialogInputs();
		currentMarkerIndex = null; // Reset index
	}
});

// Close dialog when clicking the close button (X)
document.getElementById('close-dialog').addEventListener('click', () => {
	dialog.close();
	overlay.style.display = 'none';
	clearDialogInputs();
	currentMarkerIndex = null; // Reset index
});

// Cancel dialog on escape key
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		dialog.close();
		overlay.style.display = 'none';
		clearDialogInputs();
		currentMarkerIndex = null; // Reset index
	}
});

// Clear dialog inputs
function clearDialogInputs() {
	xInput.value = '';
	yInput.value = '';
	zInput.value = '';
	titleInput.value = '';
	descriptionInput.value = '';
}

// Save marker with Cmd/Ctrl + Enter
document.addEventListener('keydown', (event) => {
	if (
		event.key === 'Enter' &&
		(event.ctrlKey || event.metaKey) &&
		dialog.open
	) {
		saveMarkerButton.click();
	}
});

// Load markers on page load
window.onload = () => {
	loadMarkers();
	createGrid(); // Create the grid overlay

	// Close dialog when clicking the close button (X)
	document.getElementById('close-dialog').addEventListener('click', () => {
		dialog.close();
		overlay.style.display = 'none';
		clearDialogInputs();
		currentMarkerIndex = null; // Reset index
	});
};
