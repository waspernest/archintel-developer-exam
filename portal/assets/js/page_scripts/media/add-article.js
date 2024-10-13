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

			let parameter = {
				model: 'article',
				method: 'insert',
				insert: {
					image: form.find('input[name=image]').val(),
					title: form.find('input[name=title]').val(),
					link: Media.media.createURLSlugLink(form.find('input[name=link]').val()),
					date: form.find('input[name=article_date]').val(),
					content: quill.root.innerHTML,
					status: 0, //always set to 0 so it will be set to "For Edit",
					writer: Project.user_data['id']
				}
			}

			try {
				let response = await Project.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['id'] > 0) {
					Project.main.globalModal('success', 'succesful', 'Add Article', 'Article has been added.');
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

};

window.Media = Media;