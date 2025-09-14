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

	document.addEventListener('DOMContentLoaded', function () {
		initializeSupabase();
		handleForm('#form-corporate');
		handleForm('#form-university');
		handleForm('#form-contact');
	});
})();
