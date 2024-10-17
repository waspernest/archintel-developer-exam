let art_id = '';
let quill;

//determine if user is Editor or Writer and call only the function for them
const userType = Project.user_data.type;

export const Media = {

	main: {

		onLoad: async () => {

			let url = new URL(window.location.href);
			art_id = url.searchParams.get('id');

			if (userType == "Editor") {
				$('<button class="btn btn-success article-publish-btn" type="button" onclick="Media.media.publishArticle(); return false;"> Publish </button>').insertAfter('.article-save-btn');
			}

			//initiate quill editor from theme
			// Snow theme
			quill = new Quill('#snow-editor', {
			    theme: 'snow',
			    modules: {
			        'toolbar': [[{ 'font': [] }, { 'size': [] }], ['bold', 'italic', 'underline', 'strike'], [{ 'color': [] }, { 'background': [] }], [{ 'script': 'super' }, { 'script': 'sub' }], [{ 'header': [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'], [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], ['direction', { 'align': [] }], ['link', 'image', 'video'], ['clean']]
			    },
			});

			await Promise.all([
				Media.media.getCompany(),
				Media.media.getArticle()
			]);

		}

	},

	media: {
		publishArticle: async () => {

			let parameter = {
				model: 'article',
				method: 'update',
				update: {
					editor: Project.user_data['id'],
					status: 1
				}, 
				condition : { id: art_id }
			}

			try {
				let response = await Project.main.startRequest(parameter);

				if (response['code'] == 200) Project.main.globalModal('success', 'succesful', 'Edit Article', 'Article has been published.');
			
			} catch (error) {
				console.log("Error: ", error);
			}


		},

		saveArticle: async (e) => {

			let form = $("#"+$(e).attr('id'));

			if (form.find('select[name=company]').val() == 0) {
				
				Project.main.globalModal('warning', 'warning', 'Edit Article', 'Please select a valid Company');

			} else {

				Project.main.globalModal('warning', 'submission', 'Edit Article', 'Updating article... Please wait...');

				//proccess the quill js editor
				let contentChunks = Project.main.splitStringParts(quill.root.innerHTML, 5000);
				let quillContent = contentChunks[0];

				let parameter = {
					model: 'article',
					method: 'update',
					update: {
						image: form.find('input[name=image]').val(),
						title: form.find('input[name=title]').val(),
						link: Media.media.createURLSlugLink(form.find('input[name=link]').val()),
						date: form.find('input[name=article_date]').val(),
						content: quillContent, //insert initial or base chunks.
						status: 0, //always set to 0 so it will be set to "For Edit",
						company: form.find('select[name=company]').val()
					},
					condition: { id : art_id }
				}

				if (userType == "Editor") {
					parameter.update.editor = Project.user_data['id'];
				}

				try {
					let response = await Project.main.startRequest(parameter);
					console.log(response);

					if (response['code'] == 200) {

						if (contentChunks.length > 1) {
							Project.main.uploadImageSequentially('article', art_id, contentChunks, 1, 'content')
							.then(() => {

								Project.main.globalModal('success', 'succesful', 'Edit Article', 'Article has been updated.');

							})
							.catch((error) => {
								console.error("Error during upload: ", error);
							});
						} else {
							Project.main.globalModal('success', 'succesful', 'Edit Article', 'Article has been updated.');
						}

					}

				} catch (error) {
					console.log("Error: ", error);
				}

			}
		},

		getArticle: async() => {

			let parameter = {
				model: 'article',
				method: 'retrieve',
				retrieve: '*',
				condition: { id: art_id }

			}

			try {
				let response = await Project.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					$('input[name=image]').val(response['data'][0]['image']);
					$('input[name=title]').val(response['data'][0]['title']);
					$('input[name=link]').val(response['data'][0]['link']);
					$('input[name=article_date]').val(response['data'][0]['date']);

					quill.root.innerHTML = response['data'][0].content;

					$('select[name=company] option').filter(function() {
	                    return parseInt($(this).val()) === parseInt(response['data'][0]['company']);
	                }).prop('selected', true);

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		},

		getCompany: async () => {

			let parameter = {
				model: 'company',
				method: 'retrieve',
				retrieve: '*'
			}

			let result = '';

			try {
				let response = await Project.main.startRequest(parameter);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					for (const item of response['data']) {

						result += `<option value="${item.id}">${item.name}</option>`;

						$("#company").append(result);
					}

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		},

		createURLSlugLink: (text) => {
			return text
					.toLowerCase() // Convert to lowercase
            		.replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
            		.replace(/\s+/g, '-') // Replace spaces with hyphens
           			.replace(/-+/g, '-'); // Merge multiple hyphens
		}

	}

}

window.Media = Media;