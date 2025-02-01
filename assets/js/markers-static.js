function loadStaticMarkers() {
	console.log('Loading static markers...');
	const staticMapContainer = document.getElementById('map-container');

	if (!Array.isArray(dataFiles) || dataFiles.length === 0) {
		console.error('No data files provided for static markers.');
		return;
	}

	let scriptsLoaded = 0;
	dataFiles.forEach((file) => {
		const script = document.createElement('script');
		script.src = file;
		script.onload = () => {
			console.log(`${file} loaded`);
			scriptsLoaded++;

			if (scriptsLoaded === dataFiles.length) {
				processStaticMarkers(staticMapContainer);
				createCategoryFilters();
			}
		};
		document.head.appendChild(script);
	});
}

function processStaticMarkers(container) {
	if (!window.staticLocations || window.staticLocations.length === 0) {
		console.warn('No static locations found.');
		return;
	}

	console.log(`Processing ${window.staticLocations.length} static markers`);
	window.staticLocations.forEach((location) =>
		addStaticMarker(location, container)
	);
}

function addStaticMarker(location, container) {
	const staticMarker = document.createElement('div');
	staticMarker.className = 'static-marker';
	staticMarker.dataset.lat = location.lat;
	staticMarker.dataset.long = location.long;

	// Position the marker
	staticMarker.style.left = `${
		(location.long / 100) * container.clientWidth
	}px`;
	staticMarker.style.top = `${
		(location.lat / 100) * container.clientHeight
	}px`;

	// Apply the color dynamically
	if (location.color) {
		staticMarker.style.backgroundColor = location.color;
	}

	// Add category class if it exists
	const sanitizeClassName = (name) =>
		name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
	if (location.category) {
		staticMarker.classList.add(sanitizeClassName(location.category));
	}

	// Add accessibility attributes
	staticMarker.setAttribute('role', 'button');
	staticMarker.setAttribute('aria-label', location.label);

	// Create label element
	const label = document.createElement('div');
	label.className = 'marker-label static-marker-label';
	label.textContent = location.label;
	staticMarker.appendChild(label);

	// Create hover label element
	const hoverLabel = document.createElement('div');
	hoverLabel.className = 'marker-label-hover static-marker-label-hover';

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

	// Add hover functionality
	staticMarker.addEventListener('mouseover', () => {
		staticMarker.classList.add('active');
	});

	staticMarker.addEventListener('mouseout', () => {
		staticMarker.classList.remove('active');
	});

	container.appendChild(staticMarker);
}

window.addEventListener('resize', () => {
	const staticMapContainer = document.getElementById('map-container');
	document.querySelectorAll('.static-marker').forEach((marker) => {
		const lat = parseFloat(marker.dataset.lat);
		const long = parseFloat(marker.dataset.long);
		marker.style.left = `${
			(long / 100) * staticMapContainer.clientWidth
		}px`;
		marker.style.top = `${(lat / 100) * staticMapContainer.clientHeight}px`;
	});
});

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
