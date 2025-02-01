const gridContainer = document.getElementById('grid');

// Function to create the grid overlay
function createGrid() {
	const gridSize = 10; // Grid every 10 units
	const gridLines = 100; // Assuming the grid goes from 0 to 100

	// Create vertical lines and labels, skipping 0 and 100
	for (let i = gridSize; i < gridLines; i += gridSize) {
		const line = document.createElement('div');
		line.className = 'grid-line';
		line.style.width = '1px';
		line.style.height = '100%';
		line.style.left = `${(i / gridLines) * 100}%`;
		line.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Ensure lines are visible
		gridContainer.appendChild(line);

		// Create label for the left side
		const label = document.createElement('div');
		label.className = 'grid-label grid-label-left';
		label.style.top = `${(i / gridLines) * 100}%`;
		label.textContent = i;
		gridContainer.appendChild(label);
	}

	// Create horizontal lines and labels, skipping 0 and 100
	for (let i = gridSize; i < gridLines; i += gridSize) {
		const line = document.createElement('div');
		line.className = 'grid-line';
		line.style.height = '1px';
		line.style.width = '100%';
		line.style.top = `${(i / gridLines) * 100}%`;
		line.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Ensure lines are visible
		gridContainer.appendChild(line);

		// Create label for the bottom
		const labelBottom = document.createElement('div');
		labelBottom.className = 'grid-label grid-label-bottom';
		labelBottom.style.left = `${(i / gridLines) * 100}%`;
		labelBottom.textContent = i;
		gridContainer.appendChild(labelBottom);

		// Create label for the top
		const labelTop = document.createElement('div');
		labelTop.className = 'grid-label grid-label-top';
		labelTop.style.left = `${(i / gridLines) * 100}%`;
		labelTop.textContent = i;
		gridContainer.appendChild(labelTop);
	}
}

// Load markers on page load
document.addEventListener('DOMContentLoaded', () => {
	createGrid();
});
