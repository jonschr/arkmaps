let resizeTimer;

window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(() => {
		location.reload();
	}, 50);
});
