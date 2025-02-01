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
let dynamicMarkers =
	JSON.parse(localStorage.getItem(`dynamicMarkers:${getMapName()}`)) || []; // Initialize with namespaced markers
let dynamicMarkerElements = []; // Store marker DOM elements

// Function to get the current map name from the URL
function getMapName() {
	// Get the current path
	const path = window.location.pathname;

	// Remove .html extension and any directory names
	const fileName = path.split('/').pop();
	const mapName = fileName.replace('.html', '');

	return mapName;
}

// Function to add a dynamic marker
function addDynamicMarker(x, y, z, title, description) {
	console.log(`Adding marker: ${title} at (${x}, ${y})`);

	// Check if marker already exists
	const markerKey = `${title}-${x}-${y}`;
	if (dynamicMarkers.some((m) => `${m.title}-${m.x}-${m.y}` === markerKey)) {
		console.log('Marker already exists');
		return;
	}

	// Create a new marker element
	const dynamicMarker = document.createElement('div');
	dynamicMarker.className = 'dynamic-marker';
	dynamicMarker.style.left = `${(x / 100) * mapContainer.clientWidth}px`;
	dynamicMarker.style.top = `${(y / 100) * mapContainer.clientHeight}px`;
	dynamicMarker.title = `${title}: ${description}`;

	// Create label element
	const label = document.createElement('div');
	label.className = 'marker-label dynamic-marker-label';
	label.textContent = title;
	dynamicMarker.appendChild(label);

	// Create hover label element
	const hoverLabel = document.createElement('div');
	hoverLabel.className = 'marker-label-hover dynamic-marker-label-hover';

	const hoverTitle = document.createElement('p');
	hoverTitle.className = 'title';
	hoverTitle.textContent = title;
	hoverLabel.appendChild(hoverTitle);

	const hoverCoords = document.createElement('p');
	hoverCoords.className = 'coordinates';

	const lat = document.createElement('span');
	lat.className = 'lat';
	lat.textContent = `${x.toFixed(2)}`;
	hoverCoords.appendChild(lat);

	const long = document.createElement('span');
	long.className = 'long';
	long.textContent = `${y.toFixed(2)}`;
	hoverCoords.appendChild(long);

	hoverLabel.appendChild(hoverCoords);
	dynamicMarker.appendChild(hoverLabel);

	// Add hover functionality
	dynamicMarker.addEventListener('mouseover', () => {
		dynamicMarker.classList.add('active');
	});

	dynamicMarker.addEventListener('mouseout', () => {
		dynamicMarker.classList.remove('active');
	});

	// Attach event listeners to the marker
	attachMarkerEvents(dynamicMarker, { x, y, z, title, description });

	// Append the marker to the map container
	mapContainer.appendChild(dynamicMarker);
	dynamicMarkers.push({ x, y, z, title, description });
	dynamicMarkerElements.push(dynamicMarker); // Store the marker element
	saveMarkersToLocalStorage();
}

// Function to attach event listeners to a marker
function attachMarkerEvents(markerElement, markerData) {
	markerElement.addEventListener('click', () => {
		currentMarkerIndex = dynamicMarkers.findIndex(
			(m) =>
				m.title === markerData.title &&
				m.x === markerData.x &&
				m.y === markerData.y
		);
		if (currentMarkerIndex !== -1) {
			xInput.value = markerData.x.toFixed(2);
			yInput.value = markerData.y.toFixed(2);
			zInput.value = markerData.z.toFixed(2);
			titleInput.value = markerData.title;
			descriptionInput.value = markerData.description;
			dialog.showModal();
			overlay.style.display = 'block';
			titleInput.focus(); // Focus on the title input
		}
	});
}

// Load dynamic markers from local storage without duplicates
function loadDynamicMarkers() {
	const mapName = getMapName();
	const storageKey = `dynamicMarkers:${mapName}`;

	const storedMarkers = JSON.parse(localStorage.getItem(storageKey)) || [];

	// Clear existing markers
	dynamicMarkerElements.forEach((marker) => marker.remove());
	dynamicMarkers = [];
	dynamicMarkerElements = [];

	// Add unique markers
	const uniqueMarkers = [];
	const uniqueTitles = new Set();

	storedMarkers.forEach((marker) => {
		const markerKey = `${marker.title}-${marker.x}-${marker.y}`;
		if (!uniqueTitles.has(markerKey)) {
			uniqueTitles.add(markerKey);
			uniqueMarkers.push(marker);
		}
	});

	// Add each unique marker
	uniqueMarkers.forEach((marker) => {
		console.log(
			`Loading marker: ${marker.title} at (${marker.x}, ${marker.y})`
		);
		addDynamicMarker(
			marker.x,
			marker.y,
			marker.z,
			marker.title,
			marker.description
		);
	});
}

// Save dynamic markers to local storage
function saveMarkersToLocalStorage() {
	const mapName = getMapName();
	const storageKey = `dynamicMarkers:${mapName}`;
	localStorage.setItem(storageKey, JSON.stringify(dynamicMarkers));
}

// Recalculate marker positions on window resize
window.addEventListener('resize', () => {
	dynamicMarkerElements.forEach((marker, index) => {
		const { x, y } = dynamicMarkers[index];
		marker.style.left = `${(x / 100) * mapContainer.clientWidth}px`;
		marker.style.top = `${(y / 100) * mapContainer.clientHeight}px`;
	});
});

// Click to add a dynamic marker
mapContainer.addEventListener('click', (event) => {
	if (
		event.target.classList.contains('lat') ||
		event.target.classList.contains('long')
	) {
		return; // Stop execution if clicking lat/long
	}

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
	const title = titleInput.value.trim();
	const description = descriptionInput.value.trim();

	if (isNaN(x) || isNaN(y) || isNaN(z)) {
		alert('Please enter valid numeric values for coordinates.');
		return;
	}
	if (!title) {
		alert('Title is required.');
		return;
	}

	addDynamicMarker(x, y, z, title, description);
	dialog.close();
	overlay.style.display = 'none';
	clearDialogInputs();
	currentMarkerIndex = null; // Reset index
});

// Delete marker
deleteMarkerButton.addEventListener('click', () => {
	if (currentMarkerIndex !== null) {
		dynamicMarkers.splice(currentMarkerIndex, 1); // Remove marker from array
		const markerToRemove = dynamicMarkerElements[currentMarkerIndex];
		markerToRemove.remove(); // Remove marker from DOM
		dynamicMarkerElements.splice(currentMarkerIndex, 1); // Remove from markerElements array
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

// Load dynamic markers on page load
window.addEventListener('load', loadDynamicMarkers);
