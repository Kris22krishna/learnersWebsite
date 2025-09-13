(function () {
	// Supabase configuration
	var SUPABASE_URL = 'https://eacuowuqkgrndqvlnixb.supabase.co';
	var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhY3Vvd3Vxa2dybmRxdmxuaXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxOTExOTEsImV4cCI6MjA3MTc2NzE5MX0.kgDzZp4PKH-qCoj8IAvd_E8Gt8t0SDG2n05JYJETxKs';

	// Initialize Supabase client
	var supabase;

	function qs(selector, scope) {
		return (scope || document).querySelector(selector);
	}

	function submitToSupabase(tableName, data) {
		return supabase
			.from(tableName)
			.insert([data])
			.then(function (response) {
				if (response.error) {
					throw new Error(response.error.message);
				}
				return response;
			});
	}

	function handleForm(formId) {
		var form = qs(formId);
		if (!form) return;
		var successEl = qs(formId + ' .success');
		var submitBtn = qs(formId + ' button[type="submit"]');

		form.addEventListener('submit', function (e) {
			e.preventDefault();

			// Check if Supabase is loaded
			if (!supabase) {
				alert('System not ready. Please refresh the page and try again.');
				return;
			}

			// Disable submit button and show loading state
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = 'Submitting...';
			}

			var payload = formToJson(form);
			var tableName;

			// Determine which table to insert into
			if (formId === '#form-corporate') {
				tableName = 'corporate_inquiries';
			} else if (formId === '#form-university') {
				tableName = 'university_inquiries';
			} else {
				tableName = 'contact_submissions';
			}

			console.log('Submitting to table:', tableName, 'with data:', payload);

			submitToSupabase(tableName, payload)
				.then(function () {
					// Success
					form.reset();
					if (successEl) successEl.classList.add('show');
					setTimeout(function () {
						if (successEl) successEl.classList.remove('show');
					}, 5000);
				})
				.catch(function (error) {
					console.error('Submission error:', error);
					alert('Submission failed: ' + error.message + '. Please try again or contact us directly.');
				})
				.finally(function () {
					// Re-enable submit button
					if (submitBtn) {
						submitBtn.disabled = false;
						if (formId === '#form-corporate') {
							submitBtn.textContent = 'Request Proposal';
						} else if (formId === '#form-university') {
							submitBtn.textContent = 'Request Consultation';
						} else {
							submitBtn.textContent = 'Send Message';
						}
					}
				});
		});
	}

	function formToJson(form) {
		var entries = new FormData(form).entries();
		var obj = {};
		for (var pair = entries.next(); !pair.done; pair = entries.next()) {
			obj[pair.value[0]] = pair.value[1];
		}
		return obj;
	}

	function initializeSupabase() {
		if (window.supabase && window.supabase.createClient) {
			supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
			console.log('Supabase initialized successfully');
		} else {
			console.error('Supabase library not loaded');
			setTimeout(initializeSupabase, 100); // Retry after 100ms
		}
	}

	// Media Display Functions
	function initializeTabs() {
		var tabButtons = document.querySelectorAll('.tab-btn');
		var tabPanels = document.querySelectorAll('.tab-panel');

		tabButtons.forEach(function (button) {
			button.addEventListener('click', function () {
				var targetTab = this.getAttribute('data-tab');

				// Remove active class from all buttons and panels
				tabButtons.forEach(function (btn) { btn.classList.remove('active'); });
				tabPanels.forEach(function (panel) { panel.classList.remove('active'); });

				// Add active class to clicked button and corresponding panel
				this.classList.add('active');
				document.getElementById(targetTab).classList.add('active');
			});
		});
	}

	// Media Data - Loaded from JSON file
	var videoData = [];
	var photoData = [];
	var documentData = [];
	var totalVideos = 0;

	// University Media Data
	var universityVideoData = [];
	var universityPhotoData = [];
	var universityDocumentData = [];
	var totalUniversityVideos = 0;

	// Function to load all media from JSON file
	function loadMediaData() {
		fetch('assets/media/corporates/media-data.json')
			.then(function (response) {
				if (!response.ok) {
					throw new Error('Failed to load media data');
				}
				return response.json();
			})
			.then(function (data) {
				// Sort videos by ID in descending order (highest number first)
				videoData = data.videos.sort(function (a, b) { return b.id - a.id; });
				photoData = data.photos || [];
				documentData = data.documents || [];

				totalVideos = videoData.length;

				// Initialize displays
				if (totalVideos > 0) {
					initializeVideoSlider();
					updateVideoDisplay();
				}

				initializePhotoGallery();
				initializeDocumentList();
			})
			.catch(function (error) {
				console.error('Error loading media data:', error);
			});
	}

	// Function to load university media from JSON file
	function loadUniversityMediaData() {
		fetch('assets/media/universities/media-data.json')
			.then(function (response) {
				if (!response.ok) {
					throw new Error('Failed to load university media data');
				}
				return response.json();
			})
			.then(function (data) {
				// Sort videos by ID in descending order (highest number first)
				universityVideoData = data.videos.sort(function (a, b) { return b.id - a.id; });
				universityPhotoData = data.photos || [];
				universityDocumentData = data.documents || [];

				totalUniversityVideos = universityVideoData.length;

				// Initialize displays
				if (totalUniversityVideos > 0) {
					initializeUniversityVideoSlider();
					updateUniversityVideoDisplay();
				}

				initializeUniversityPhotoGallery();
				initializeUniversityDocumentList();
			})
			.catch(function (error) {
				console.error('Error loading university media data:', error);
			});
	}

	// Video Slider Functions
	var currentVideo = 0;
	var totalVideos = 0;

	// University Video Slider Functions
	var currentUniversityVideo = 0;

	function getYouTubeVideoId(url) {
		var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		var match = url.match(regExp);
		return (match && match[2].length === 11) ? match[2] : null;
	}

	function initializeVideoSlider() {
		var videoContainer = document.getElementById('video-track');
		var indicatorsContainer = document.querySelector('.video-indicators');

		if (!videoContainer || !indicatorsContainer) return;

		// Clear existing content
		videoContainer.innerHTML = '';
		indicatorsContainer.innerHTML = '';

		// Create video slides
		videoData.forEach(function (video, index) {
			var videoId = getYouTubeVideoId(video.ytLink);
			if (videoId) {
				var slide = document.createElement('div');
				slide.className = 'video-container';
				slide.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId +
					'" title="' + video.title + '" frameborder="0" ' +
					'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
					'allowfullscreen></iframe>';
				videoContainer.appendChild(slide);

				// Create indicator
				var indicator = document.createElement('div');
				indicator.className = 'video-indicator';
				if (index === 0) indicator.classList.add('active');
				indicator.onclick = function () { goToVideo(index); };
				indicatorsContainer.appendChild(indicator);
			}
		});
	}

	function initializePhotoGallery() {
		var photoGrid = document.querySelector('.photo-grid');
		if (!photoGrid) return;

		photoGrid.innerHTML = '';

		photoData.forEach(function (photo) {
			var photoItem = document.createElement('div');
			photoItem.className = 'photo-item';
			photoItem.innerHTML = '<img src="assets/media/corporates/photos/' + photo.filename +
				'" alt="' + photo.title + '" onclick="openLightbox(this)">';
			photoGrid.appendChild(photoItem);
		});
	}

	function initializeDocumentList() {
		var documentList = document.querySelector('.document-list');
		if (!documentList) return;

		documentList.innerHTML = '';

		documentData.forEach(function (doc) {
			var docItem = document.createElement('div');
			docItem.className = 'document-item';
			docItem.innerHTML =
				'<div class="doc-icon">📄</div>' +
				'<div class="doc-info">' +
				'<h4>' + doc.title + '</h4>' +
				'<p>' + doc.description + '</p>' +
				'</div>';
			docItem.onclick = function () {
				window.open('assets/media/corporates/pdfs/' + doc.filename, '_blank');
			};
			documentList.appendChild(docItem);
		});
	}

	function updateVideoDisplay() {
		var track = document.getElementById('video-track');
		var indicators = document.querySelectorAll('.video-indicator');
		var title = document.getElementById('video-title');
		var description = document.getElementById('video-description');
		var counter = document.getElementById('video-counter');
		var prevBtn = document.getElementById('prev-video');
		var nextBtn = document.getElementById('next-video');

		if (totalVideos === 0) return;

		if (track) {
			track.style.transform = 'translateX(-' + (currentVideo * 100) + '%)';
		}

		// Update indicators
		indicators.forEach(function (indicator, index) {
			indicator.classList.toggle('active', index === currentVideo);
		});

		// Update info
		var currentVideoData = videoData[currentVideo];
		if (title && currentVideoData) title.textContent = currentVideoData.title;
		if (description && currentVideoData) description.textContent = currentVideoData.description;
		if (counter) counter.textContent = (currentVideo + 1) + ' of ' + totalVideos;

		// Update button states
		if (prevBtn) prevBtn.disabled = currentVideo === 0;
		if (nextBtn) nextBtn.disabled = currentVideo === totalVideos - 1;
	}

	window.changeVideo = function (direction) {
		var newVideo = currentVideo + direction;
		if (newVideo >= 0 && newVideo < totalVideos) {
			currentVideo = newVideo;
			updateVideoDisplay();
		}
	};

	window.goToVideo = function (index) {
		if (index >= 0 && index < totalVideos) {
			currentVideo = index;
			updateVideoDisplay();
		}
	};

	// Lightbox functions (global scope for onclick handlers)
	window.openLightbox = function (img) {
		var lightbox = document.getElementById('lightbox');
		var lightboxImg = document.getElementById('lightbox-img');
		lightbox.style.display = 'block';
		lightboxImg.src = img.src;
	};

	window.closeLightbox = function () {
		document.getElementById('lightbox').style.display = 'none';
	};

	// University Video Slider Functions
	function initializeUniversityVideoSlider() {
		var videoContainer = document.getElementById('university-video-track');
		var indicatorsContainer = document.getElementById('university-video-indicators');

		if (!videoContainer || !indicatorsContainer) return;

		// Clear existing content
		videoContainer.innerHTML = '';
		indicatorsContainer.innerHTML = '';

		// Create video slides
		universityVideoData.forEach(function (video, index) {
			var videoId = getYouTubeVideoId(video.ytLink);
			if (videoId) {
				var slide = document.createElement('div');
				slide.className = 'video-container';
				slide.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId +
					'" title="' + video.title + '" frameborder="0" ' +
					'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
					'allowfullscreen></iframe>';
				videoContainer.appendChild(slide);

				// Create indicator
				var indicator = document.createElement('div');
				indicator.className = 'video-indicator';
				if (index === 0) indicator.classList.add('active');
				indicator.onclick = function () { goToUniversityVideo(index); };
				indicatorsContainer.appendChild(indicator);
			}
		});
	}

	function initializeUniversityPhotoGallery() {
		var photoGrid = document.getElementById('university-photo-grid');
		if (!photoGrid) return;

		photoGrid.innerHTML = '';

		universityPhotoData.forEach(function (photo) {
			var photoItem = document.createElement('div');
			photoItem.className = 'photo-item';
			photoItem.innerHTML = '<img src="assets/media/universities/photos/' + photo.filename +
				'" alt="' + photo.title + '" onclick="openLightbox(this)">';
			photoGrid.appendChild(photoItem);
		});
	}

	function initializeUniversityDocumentList() {
		var documentList = document.getElementById('university-document-list');
		if (!documentList) return;

		documentList.innerHTML = '';

		universityDocumentData.forEach(function (doc) {
			var docItem = document.createElement('div');
			docItem.className = 'document-item';
			docItem.innerHTML =
				'<div class="doc-icon">📄</div>' +
				'<div class="doc-info">' +
				'<h4>' + doc.title + '</h4>' +
				'<p>' + doc.description + '</p>' +
				'</div>';
			docItem.onclick = function () {
				window.open('assets/media/universities/pdfs/' + doc.filename, '_blank');
			};
			documentList.appendChild(docItem);
		});
	}

	function updateUniversityVideoDisplay() {
		var track = document.getElementById('university-video-track');
		var indicators = document.querySelectorAll('#university-video-indicators .video-indicator');
		var title = document.getElementById('university-video-title');
		var description = document.getElementById('university-video-description');
		var counter = document.getElementById('university-video-counter');
		var prevBtn = document.getElementById('prev-university-video');
		var nextBtn = document.getElementById('next-university-video');

		if (totalUniversityVideos === 0) return;

		if (track) {
			track.style.transform = 'translateX(-' + (currentUniversityVideo * 100) + '%)';
		}

		// Update indicators
		indicators.forEach(function (indicator, index) {
			indicator.classList.toggle('active', index === currentUniversityVideo);
		});

		// Update info
		var currentVideoData = universityVideoData[currentUniversityVideo];
		if (title && currentVideoData) title.textContent = currentVideoData.title;
		if (description && currentVideoData) description.textContent = currentVideoData.description;
		if (counter) counter.textContent = (currentUniversityVideo + 1) + ' of ' + totalUniversityVideos;

		// Update button states
		if (prevBtn) prevBtn.disabled = currentUniversityVideo === 0;
		if (nextBtn) nextBtn.disabled = currentUniversityVideo === totalUniversityVideos - 1;
	}

	window.changeUniversityVideo = function (direction) {
		var newVideo = currentUniversityVideo + direction;
		if (newVideo >= 0 && newVideo < totalUniversityVideos) {
			currentUniversityVideo = newVideo;
			updateUniversityVideoDisplay();
		}
	};

	window.goToUniversityVideo = function (index) {
		if (index >= 0 && index < totalUniversityVideos) {
			currentUniversityVideo = index;
			updateUniversityVideoDisplay();
		}
	};

	document.addEventListener('DOMContentLoaded', function () {
		initializeSupabase();
		initializeTabs();
		loadMediaData(); // Load all media from JSON file
		loadUniversityMediaData(); // Load university media from JSON file
		handleForm('#form-corporate');
		handleForm('#form-university');
		handleForm('#form-contact');
	});
})();
