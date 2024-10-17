console.log(Project.user_data);
let quill;
export const Media = {

	main: {

		onLoad: async () => {

			//initiate flatpickr 
			$('#article_date').flatpickr({
				defaultDate: new Date(),
				dateFormat: "Y-m-d"
			});

			//initiate quill editor from theme
			// Snow theme
			quill = new Quill('#snow-editor', {
			    theme: 'snow',
			    modules: {
			        'toolbar': [[{ 'font': [] }, { 'size': [] }], ['bold', 'italic', 'underline', 'strike'], [{ 'color': [] }, { 'background': [] }], [{ 'script': 'super' }, { 'script': 'sub' }], [{ 'header': [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'], [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], ['direction', { 'align': [] }], ['link', 'image', 'video'], ['clean']]
			    },
			});
		}

	},

	media: {

		saveArticle: async(e) => {

			let form = $("#"+$(e).attr('id'));

			Project.main.globalModal('warning', 'submission', 'Add Article', 'Adding article... Please wait...');

			//proccess the quill js editor
			let contentChunks = Project.main.splitStringParts(quill.root.innerHTML, 5000);
			let quillContent = contentChunks[0];

			let parameter = {
				model: 'article',
				method: 'insert',
				insert: {
					image: form.find('input[name=image]').val(),
					title: form.find('input[name=title]').val(),
					link: await Media.media.createURLSlugLink(form.find('input[name=link]').val()),
					date: form.find('input[name=article_date]').val(),
					content: quillContent,
					status: 0, //always set to 0 so it will be set to "For Edit",
					writer: Project.user_data['id']
				}
			}

			try {
				let response = await Project.main.startRequest(parameter);

				if (response['code'] == 200 && response['id'] > 0) {

					if (contentChunks.length > 1) {
						Project.main.uploadImageSequentially('article', response['id'], contentChunks, 1, 'content')
						.then(() => {

							Project.main.globalModal('success', 'succesful', 'Add Article', 'Article has been added.');


						})
						.catch((error) => {
							console.error("Error during upload: ", error);
						});
					} else {
						Project.main.globalModal('success', 'succesful', 'Add Article', 'Article has been added.');
					}

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		},

		createURLSlugLink: async (text) => {

			// Convert text to a slug format
		    let slug = text
		            .toLowerCase() // Convert to lowercase
		            .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
		            .replace(/\s+/g, '-') // Replace spaces with hyphens
		            .replace(/-+/g, '-'); // Merge multiple hyphens
		    
		    // Simulate a function to check for duplicates in the database
		    const isDuplicate = async (slug) => {
		        // Make a call to the backend to check if the slug exists in the database
		        let parameter = {
		        	model: 'article',
		        	method: 'retrieve',
		        	retrieve: '*',
		        	condition: {
		        		link: slug
		        	}
		        }

		        try {
		        	let response = await Project.main.startRequest(parameter);
		        	
		        	if (response['code'] == 200 && response['data'] && response['data'].length > 0) return true;

		        } catch (error) {
		        	console.log("Error: ", error);
		        }
		    };
		    
		    let attempt = 1;
		    let finalSlug = slug;

		    // Check if slug is a duplicate, append a number if needed
		    while (await isDuplicate(finalSlug)) {
		        attempt++;
		        finalSlug = `${slug}-${attempt}`;
		    }

		    return finalSlug;
			
		}

	}

};

window.Media = Media;