function createCategoryFilters() {
	const filterContainer = document.getElementById('filter-container');
	if (!filterContainer) return;

	// Add checkbox for dynamic markers
	const dynamicLabel = document.createElement('label');
	dynamicLabel.textContent = 'User-added markers';

	const dynamicCheckbox = document.createElement('input');
	dynamicCheckbox.type = 'checkbox';
	dynamicCheckbox.checked = true;
	dynamicCheckbox.addEventListener('change', () =>
		toggleCategory('dynamic-marker', dynamicCheckbox.checked)
	);

	dynamicLabel.prepend(dynamicCheckbox);
	filterContainer.appendChild(dynamicLabel);

	const categories = new Set(
		window.staticLocations.map((loc) => loc.category)
	);

	categories.forEach((category) => {
		const categoryClass = category.toLowerCase().replace(/\s+/g, '-');

		const label = document.createElement('label');
		label.textContent = category;

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = true;
		checkbox.addEventListener('change', () =>
			toggleCategory(categoryClass, checkbox.checked)
		);

		label.prepend(checkbox);
		filterContainer.appendChild(label);
	});
}

function toggleCategory(categoryClass, isVisible) {
	document.querySelectorAll(`.${categoryClass}`).forEach((marker) => {
		marker.style.display = isVisible ? 'block' : 'none';
	});
}
