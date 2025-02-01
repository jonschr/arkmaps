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

	// Create a section for user markers
	const userSection = document.createElement('div');
	userSection.className = 'filter-section user-filters';

	// Add checkbox for all dynamic markers
	const dynamicLabel = document.createElement('label');
	dynamicLabel.textContent = 'All custom markers';

	const dynamicCheckbox = document.createElement('input');
	dynamicCheckbox.type = 'checkbox';
	dynamicCheckbox.checked = getCheckboxState('dynamic-marker');
	dynamicCheckbox.addEventListener('change', () => {
		saveCheckboxState('dynamic-marker', dynamicCheckbox.checked);
		toggleCategory('dynamic-marker', dynamicCheckbox.checked);

		// Also update states of individual user category checkboxes
		userSection
			.querySelectorAll('input[type="checkbox"]')
			.forEach((checkbox) => {
				checkbox.checked = dynamicCheckbox.checked;
				const categoryClass = checkbox.dataset.category;
				if (categoryClass) {
					saveCheckboxState(categoryClass, dynamicCheckbox.checked);
					toggleCategory(categoryClass, dynamicCheckbox.checked);
				}
			});
	});

	dynamicLabel.prepend(dynamicCheckbox);
	userSection.appendChild(dynamicLabel);

	// Get unique categories from dynamic markers
	const userCategories = new Set();
	const dynamicMarkers =
		JSON.parse(localStorage.getItem(`dynamicMarkers:${getMapName()}`)) ||
		[];
	dynamicMarkers.forEach((marker) => {
		if (marker.category) userCategories.add(marker.category);
	});

	// Add individual category toggles for user markers
	userCategories.forEach((category) => {
		const categoryClass = category.toLowerCase().replace(/\s+/g, '-');

		const label = document.createElement('label');
		label.className = 'sub-category';
		label.textContent = category;

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = getCheckboxState(categoryClass);
		checkbox.dataset.category = categoryClass;
		checkbox.addEventListener('change', () => {
			saveCheckboxState(categoryClass, checkbox.checked);
			toggleCategory(categoryClass, checkbox.checked);
		});

		label.prepend(checkbox);
		userSection.appendChild(label);
	});

	// Add the user section to the filter container
	filterContainer.appendChild(userSection);

	// Create a section for static markers
	const staticSection = document.createElement('div');
	staticSection.className = 'filter-section static-filters';

	// Add static marker categories
	const staticCategories = new Set(
		window.staticLocations.map((loc) => loc.category)
	);

	staticCategories.forEach((category) => {
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
		staticSection.appendChild(label);
	});

	filterContainer.appendChild(staticSection);

	// Apply initial states
	toggleCategory('dynamic-marker', dynamicCheckbox.checked);
	userCategories.forEach((category) => {
		const categoryClass = category.toLowerCase().replace(/\s+/g, '-');
		toggleCategory(categoryClass, getCheckboxState(categoryClass));
	});
	staticCategories.forEach((category) => {
		const categoryClass = category.toLowerCase().replace(/\s+/g, '-');
		toggleCategory(categoryClass, getCheckboxState(categoryClass));
	});
}

function getMapName() {
	const path = window.location.pathname;
	const fileName = path.split('/').pop();
	return fileName.replace('.html', '');
}

function toggleCategory(categoryClass, isVisible) {
	document.querySelectorAll(`.${categoryClass}`).forEach((marker) => {
		marker.style.display = isVisible ? 'block' : 'none';
	});
}
