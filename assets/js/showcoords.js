// Show coordinates on hover
document
	.getElementById('map-container')
	.addEventListener('mousemove', (event) => {
		const rect = mapContainer.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		coordinatesDisplay.textContent = `${y.toFixed(2)}, ${x.toFixed(
			2
		)} (lat,long)`;
	});
