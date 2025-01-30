const dataFiles = ['assets/locations/drops2.js'];

function loadStaticMarkers() {
	console.log('Loading static markers...');
	const staticMapContainer = document.getElementById('map-container');

	let scriptsLoaded = 0;
	dataFiles.forEach((file) => {
		const script = document.createElement('script');
		script.src = file;
		script.onload = () => {
			console.log(`${file} loaded`);
			scriptsLoaded++;

			// Once all scripts are loaded, process locations
			if (scriptsLoaded === dataFiles.length) {
				processStaticMarkers(staticMapContainer);
				createCategoryFilters();
			}
		};
		document.head.appendChild(script);
	});
}

function processStaticMarkers(container) {
	if (window.staticLocations && window.staticLocations.length > 0) {
		console.log(
			`Processing ${window.staticLocations.length} static markers`
		);
		window.staticLocations.forEach((location) =>
			addStaticMarker(location, container)
		);
	} else {
		console.warn('No static locations found');
	}
}

function addStaticMarker(location, container) {
	const staticMarker = document.createElement('div');
	staticMarker.className = 'static-marker';
	staticMarker.style.left = `${
		(location.long / 100) * container.clientWidth
	}px`;
	staticMarker.style.top = `${
		(location.lat / 100) * container.clientHeight
	}px`;
	staticMarker.style.backgroundColor = location.color;

	if (location.category) {
		const categoryClass = location.category
			.toLowerCase()
			.replace(/\s+/g, '-');
		staticMarker.classList.add(categoryClass);
	}

	staticMarker.title = location.label;

	// Create label element
	const label = document.createElement('div');
	label.className = 'static-marker-label';
	label.textContent = location.label;
	staticMarker.appendChild(label);

	container.appendChild(staticMarker);
}

window.addEventListener('load', loadStaticMarkers);
