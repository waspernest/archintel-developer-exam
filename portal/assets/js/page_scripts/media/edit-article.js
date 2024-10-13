let art_id = '';
let quill;
export const Media = {

	main: {

		onLoad: async () => {

			let url = new URL(window.location.href);
			art_id = url.searchParams.get('id');

			//initiate quill editor from theme
			// Snow theme
			quill = new Quill('#snow-editor', {
			    theme: 'snow',
			    modules: {
			        'toolbar': [[{ 'font': [] }, { 'size': [] }], ['bold', 'italic', 'underline', 'strike'], [{ 'color': [] }, { 'background': [] }], [{ 'script': 'super' }, { 'script': 'sub' }], [{ 'header': [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'], [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], ['direction', { 'align': [] }], ['link', 'image', 'video'], ['clean']]
			    },
			});

			await Promise.all([
				Media.media.getArticle()
			]);

		}

	},

	media: {

		saveArticle: async (e) => {

			let form = $("#"+$(e).attr('id'));

			Project.main.globalModal('warning', 'submission', 'Edit Article', 'Updating article... Please wait...');

			let parameter = {
				model: 'article',
				method: 'update',
				update: {
					image: form.find('input[name=image]').val(),
					title: form.find('input[name=title]').val(),
					link: Media.media.createURLSlugLink(form.find('input[name=link]').val()),
					date: form.find('input[name=article_date]').val(),
					content: quill.root.innerHTML,
					status: 0 //always set to 0 so it will be set to "For Edit",
				},
				condition: { id : art_id }
			}

			try {
				let response = await Project.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200) {

					Project.main.globalModal('success', 'succesful', 'Edit Article', 'Article has been updated.');

				}

			} catch (error) {
				console.log("Error: ", error);
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