// markers-dynamic.js
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
let currentMarkerIndex = null;
let dynamicMarkers =
	JSON.parse(localStorage.getItem(`dynamicMarkers:${getMapName()}`)) || [];
let dynamicMarkerElements = [];

function getMapName() {
	const path = window.location.pathname;
	const fileName = path.split('/').pop();
	const mapName = fileName.replace('.html', '');
	return mapName;
}

function addDynamicMarker(x, y, z, title, description) {
	console.log(`Adding marker: ${title} at (${x}, ${y})`);

	const markerKey = `${title}-${x}-${y}`;
	if (dynamicMarkers.some((m) => `${m.title}-${m.x}-${m.y}` === markerKey)) {
		console.log('Marker already exists');
		return;
	}

	const dynamicMarker = document.createElement('div');
	dynamicMarker.className = 'dynamic-marker';
	dynamicMarker.style.left = `${(x / 100) * mapContainer.clientWidth}px`;
	dynamicMarker.style.top = `${(y / 100) * mapContainer.clientHeight}px`;
	dynamicMarker.title = `${title}: ${description}`;

	const label = document.createElement('div');
	label.className = 'marker-label dynamic-marker-label';
	label.textContent = title;
	dynamicMarker.appendChild(label);

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

	dynamicMarker.addEventListener('mouseover', () => {
		window.markerUtils.activateMarker(dynamicMarker);
	});

	attachMarkerEvents(dynamicMarker, { x, y, z, title, description });

	mapContainer.appendChild(dynamicMarker);
	dynamicMarkers.push({ x, y, z, title, description });
	dynamicMarkerElements.push(dynamicMarker);
	saveMarkersToLocalStorage();
}

document.addEventListener('click', (event) => {
	if (
		!event.target.closest('.dynamic-marker') &&
		!event.target.closest('.static-marker')
	) {
		window.markerUtils.deactivateAllMarkers();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		window.markerUtils.deactivateAllMarkers();
	}
});

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
			titleInput.focus();
		}
	});
}

function loadDynamicMarkers() {
	const mapName = getMapName();
	const storageKey = `dynamicMarkers:${mapName}`;

	const storedMarkers = JSON.parse(localStorage.getItem(storageKey)) || [];

	dynamicMarkerElements.forEach((marker) => marker.remove());
	dynamicMarkers = [];
	dynamicMarkerElements = [];

	const uniqueMarkers = [];
	const uniqueTitles = new Set();

	storedMarkers.forEach((marker) => {
		const markerKey = `${marker.title}-${marker.x}-${marker.y}`;
		if (!uniqueTitles.has(markerKey)) {
			uniqueTitles.add(markerKey);
			uniqueMarkers.push(marker);
		}
	});

	uniqueMarkers.forEach((marker) => {
		addDynamicMarker(
			marker.x,
			marker.y,
			marker.z,
			marker.title,
			marker.description
		);
	});
}

function saveMarkersToLocalStorage() {
	const mapName = getMapName();
	const storageKey = `dynamicMarkers:${mapName}`;
	localStorage.setItem(storageKey, JSON.stringify(dynamicMarkers));
}

window.addEventListener('resize', () => {
	dynamicMarkerElements.forEach((marker, index) => {
		const { x, y } = dynamicMarkers[index];
		marker.style.left = `${(x / 100) * mapContainer.clientWidth}px`;
		marker.style.top = `${(y / 100) * mapContainer.clientHeight}px`;
	});
});

mapContainer.addEventListener('click', (event) => {
	if (
		event.target.classList.contains('lat') ||
		event.target.classList.contains('long')
	) {
		return;
	}

	event.preventDefault();

	if (currentMarkerIndex === null) {
		const rect = mapContainer.getBoundingClientRect();
		clickX = ((event.clientX - rect.left) / rect.width) * 100;
		clickY = ((event.clientY - rect.top) / rect.height) * 100;

		xInput.value = clickX.toFixed(2);
		yInput.value = clickY.toFixed(2);
		zInput.value = 0;
		titleInput.value = '';
		descriptionInput.value = '';
		dialog.showModal();
		overlay.style.display = 'block';
		titleInput.focus();
	}
});

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
	currentMarkerIndex = null;
});

deleteMarkerButton.addEventListener('click', () => {
	if (currentMarkerIndex !== null) {
		dynamicMarkers.splice(currentMarkerIndex, 1);
		const markerToRemove = dynamicMarkerElements[currentMarkerIndex];
		markerToRemove.remove();
		dynamicMarkerElements.splice(currentMarkerIndex, 1);
		saveMarkersToLocalStorage();
		dialog.close();
		overlay.style.display = 'none';
		clearDialogInputs();
		currentMarkerIndex = null;
	}
});

document.getElementById('close-dialog').addEventListener('click', () => {
	dialog.close();
	overlay.style.display = 'none';
	clearDialogInputs();
	currentMarkerIndex = null;
});

function clearDialogInputs() {
	xInput.value = '';
	yInput.value = '';
	zInput.value = '';
	titleInput.value = '';
	descriptionInput.value = '';
}

document.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' && dialog.open) {
		saveMarkerButton.click();
	}
});

window.addEventListener('load', loadDynamicMarkers);
