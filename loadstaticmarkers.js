const dataFiles = ['assets/locations/drops.js'];

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

	// Create hover label element
	const hoverLabel = document.createElement('div');
	hoverLabel.className = 'static-marker-label-hover';

	const title = document.createElement('p');
	title.className = 'title';
	title.textContent = location.label;
	hoverLabel.appendChild(title);

	const coords = document.createElement('p');
	coords.className = 'coordinates';

	const lat = document.createElement('span');
	lat.className = 'lat';
	lat.textContent = `${location.lat}`;
	coords.appendChild(lat);

	const long = document.createElement('span');
	long.className = 'long';
	long.textContent = `${location.long}`;
	coords.appendChild(long);

	hoverLabel.appendChild(coords);
	staticMarker.appendChild(hoverLabel);

	container.appendChild(staticMarker);
}

window.addEventListener('load', loadStaticMarkers);

// Prevent dialog from opening when clicking lat/long
document.addEventListener('click', (event) => {
	if (
		event.target.classList.contains('lat') ||
		event.target.classList.contains('long')
	) {
		event.preventDefault();
		event.stopPropagation();
		const text = event.target.textContent;
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log(`Copied to clipboard: ${text}`);
				event.target.textContent = 'Copied!';
				setTimeout(() => {
					event.target.textContent = text;
				}, 1000);
			})
			.catch((err) => console.error('Failed to copy text: ', err));
	}
});

// Add active class to the parent .static-marker
document.addEventListener('click', (event) => {
	const staticMarkers = document.querySelectorAll('.static-marker');
	staticMarkers.forEach((marker) => {
		if (marker.contains(event.target)) {
			marker.classList.add('active');
		} else {
			marker.classList.remove('active');
		}
	});
});

// Remove active class when clicking outside .static-marker or pressing Esc
document.addEventListener('click', (event) => {
	if (!event.target.closest('.static-marker')) {
		document.querySelectorAll('.static-marker.active').forEach((marker) => {
			marker.classList.remove('active');
		});
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		document.querySelectorAll('.static-marker.active').forEach((marker) => {
			marker.classList.remove('active');
		});
	}
});
