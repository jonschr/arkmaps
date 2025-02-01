document.addEventListener('DOMContentLoaded', () => {
	const mapContainer = document.getElementById('map-container');

	mapContainer.addEventListener('mousemove', (e) => {
		const rect = mapContainer.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		document.getElementById('coordinates').textContent = `X: ${x.toFixed(
			2
		)}, Y: ${y.toFixed(2)}`;
	});
});
