////////////////////////////////////////////////////
//////// Slider ////////////////////////////////////
////////////////////////////////////////////////////
var slider = {};

/*
 * Initialize slider, cache related DOM elements.
 */
slider.init = function() {
	slider.previous = document.querySelector('.js-previous-slide');
	slider.answers = document.querySelectorAll('.js-answer');
	slider.slides = document.querySelector('.js-slides');
	slider.slidePanel = document.querySelector('.js-panel');
	slider.slideCount = document.querySelectorAll('.js-slide').length;
	slider.expandClass = 'slide-panel--expanded';
	slider.currentSlide = 1;
	slider.eventHandlers();
}

/**
 * Initialize event handlers.
 */
slider.eventHandlers = function() {
	// slider.previous.addEventListener('click', slider.syncSliderProgress);
	Array.prototype.slice.call(slider.answers).forEach(function(answer) {
		answer.addEventListener('click', slider.syncSliderProgress);
	});
	window.addEventListener('resize', slider.updateSliderSize);
}

/*
 * Resize slider offset to account for window resizing.
 */
slider.updateSliderSize = function() {
	var slideWidth = -(document.querySelector('.js-slide').offsetWidth);
	var newOffset = (slider.currentSlide - 1) * slideWidth;
	slider.slides.style.transform = 'translate(' + newOffset + 'px)';
}


/*
 * Syncs the progress bar with the current question in the form.
 */
slider.syncSliderProgress = function(event, direction) {
	var selectedStep = event.target.getAttribute('data-step');

	if (direction == 'reverse') {
		progressbar.reverse(slider.currentSlide);
		slider.reverse(slider.currentSlide);
	} else {
		progressbar.advance(slider.currentSlide);
		// Only advance slider if we are not on the last slide.
		if (slider.currentSlide < slider.slideCount) {
			slider.advance(slider.currentSlide);
		}
	}
}

/*
 * Advance the slider to a given step in the process.
 */
slider.advance = function(slide) {
	var slideWidth = -(document.querySelector('.js-slide').offsetWidth);
	var newOffset =  slide * slideWidth;
	slider.slides.style.transform = 'translate(' + newOffset + 'px)';
	slider.currentSlide++;
}

/*
 * Reverse the slider to a given step in the process.
 */
slider.reverse = function(slide) {
	var slideWidth = -(document.querySelector('.js-slide').offsetWidth);
	var newOffset =  (slide - 1) * slideWidth;
	slider.slides.style.transform = 'translate(' + newOffset + 'px)';
}

slider.init();


////////////////////////////////////////////////////
////// Progressbar /////////////////////////////////
////////////////////////////////////////////////////
var progressbar = {};

/*
 * Initialize progressbar, cache related DOM elements.
 */
progressbar.init = function() {
	progressbar.paths = document.querySelectorAll('.progressbar__path');
	progressbar.steps =  document.querySelectorAll('.progressbar__number');
	progressbar.eventHandlers();
}

/*
 * Initialize event handlers.
 */
progressbar.eventHandlers = function() {
	Array.prototype.slice.call(progressbar.steps).forEach(function(step) {
		step.addEventListener('click', progressbar.jumpTo);
	});	
}

/*
 * Move progress bar forward.
 */
progressbar.advance = function(step) {
	var currentPath = progressbar.paths[step - 1];
	var currentStep = document.querySelector('.progressbar__number.current') || progressbar.steps[slider.currentSlide - 1]; // fallback to last step.
	var nextStep = progressbar.steps[step];

	// Complete the current step.
	currentStep.classList.add('complete');
	currentStep.classList.remove('current');

	// Update UI to complete current step and indicate next step.
	// Last step has no path or next step.
	if (currentPath && nextStep) {
		currentPath.classList.add('complete');
		nextStep.classList.add('current');
	}

}

/*
 * Move the progress bar backwards.
 */
progressbar.reverse = function(step) {
	var currentStep = document.querySelector('.progressbar__number.current') || progressbar.steps[slider.currentSlide]; // fallback to first step
	currentStep.classList.remove('current');

	// Undo progess that has already been made beyond a given step.
	var completedSteps = document.querySelectorAll('.progressbar__number.complete');
	completedSteps = Array.prototype.slice.call(completedSteps).slice(step);
	completedSteps.forEach(function(completedStep) {
		completedStep.classList.remove('complete');
		// If this step has a path, undo progress on it as well.
		if (completedStep.previousElementSibling) {
			completedStep.previousElementSibling.classList.remove('complete');
		}
	});

	// Undo selected step.
	progressbar.steps[step - 1].classList.add('current');
	progressbar.steps[step - 1].classList.remove('complete');
	progressbar.paths[step - 1].classList.remove('complete');
}

/*
 * Update UI if user clicks specific step that has already been completed.
 */
progressbar.jumpTo = function(event) {
	var step = parseInt(this.getAttribute('data-step'), 10);

	// If selected step is before the current step, we need to go in reverse
	if (step < slider.currentSlide) {
		slider.currentSlide = step;
		slider.syncSliderProgress(event, 'reverse');
	}
}

progressbar.init();
