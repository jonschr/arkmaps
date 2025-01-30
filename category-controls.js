function createCategoryFilters() {
	const filterContainer = document.getElementById('filter-container');
	if (!filterContainer) return;

	// Function to get saved state from localStorage
	function getCheckboxState(category) {
		return localStorage.getItem(`filter_${category}`) !== 'false';
	}

	// Function to save state to localStorage
	function saveCheckboxState(category, state) {
		localStorage.setItem(`filter_${category}`, state);
	}

	// Add checkbox for dynamic markers
	const dynamicLabel = document.createElement('label');
	dynamicLabel.textContent = 'User-added markers';

	const dynamicCheckbox = document.createElement('input');
	dynamicCheckbox.type = 'checkbox';
	dynamicCheckbox.checked = getCheckboxState('dynamic-marker');
	dynamicCheckbox.addEventListener('change', () => {
		saveCheckboxState('dynamic-marker', dynamicCheckbox.checked);
		toggleCategory('dynamic-marker', dynamicCheckbox.checked);
	});

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
		checkbox.checked = getCheckboxState(categoryClass);
		checkbox.addEventListener('change', () => {
			saveCheckboxState(categoryClass, checkbox.checked);
			toggleCategory(categoryClass, checkbox.checked);
		});

		label.prepend(checkbox);
		filterContainer.appendChild(label);

		// Apply the saved state on page load
		toggleCategory(categoryClass, checkbox.checked);
	});

	// Ensure dynamic marker state is applied on page load
	toggleCategory('dynamic-marker', dynamicCheckbox.checked);
}

function toggleCategory(categoryClass, isVisible) {
	document.querySelectorAll(`.${categoryClass}`).forEach((marker) => {
		marker.style.display = isVisible ? 'block' : 'none';
	});
}
