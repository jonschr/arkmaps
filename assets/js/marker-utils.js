// marker-utils.js
export function deactivateAllMarkers() {
	document
		.querySelectorAll('.static-marker.active, .dynamic-marker.active')
		.forEach((marker) => marker.classList.remove('active'));
}

export function activateMarker(marker) {
	deactivateAllMarkers();
	marker.classList.add('active');
}
