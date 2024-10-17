console.log('view-article.js');
let slug_link = '';
export const Media = {

	main: {

		onLoad: async () => {

			let url = new URL(window.location.href);
			slug_link = url.searchParams.get('link');
			console.log(slug_link);

			await Promise.all([
				Media.media.getArticleBySlug()
			]);
		}

	},

	media: {

		getArticleBySlug: async () => {

			let parameter = {
				model: 'assoc',
				method: 'custom_join_query',
				table: 'get_article_details_with_user_details_by_slug',
				slug: slug_link
			}

			try {
				let response = await Project.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					$('.article-image').html(`<img src="${response['data'][0].image}" />`);
					$('.article-title').html(`<h5 class="display-5">${response['data'][0].title}</h5>`);
					$('.article-author').html(`Writer: <p class="lead">${response['data'][0].first_name} ${response['data'][0].last_name}</p>`);
					$('.article-date').html(`Date: <p class="lead">${moment(response['data'][0].date).format("MMMM D, YYYY")}</p>`);
					$('.ql-editor').html(response['data'][0].content);

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		}

	}

};

window.Media = Media;