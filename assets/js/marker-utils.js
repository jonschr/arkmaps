// marker-utils.js
window.markerUtils = {
	deactivateAllMarkers() {
		document
			.querySelectorAll('.static-marker.active, .dynamic-marker.active')
			.forEach((marker) => marker.classList.remove('active'));
	},

	activateMarker(marker) {
		this.deactivateAllMarkers();
		marker.classList.add('active');
	},
};
