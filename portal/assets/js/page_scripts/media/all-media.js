export const Media = {

	main: {

		onLoad: async () => {
			await Promise.all([
				Media.media.getArticles()
			]);
		}

	},

	media: {

		getArticles: async () => {

			let parameter = {
				model: 'article',
				method: 'retrieve',
				retrieve: '*',
				condition: { writer: Project.user_data['id'] }
			}

			let result = '';

			try {
				let response = await Project.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					for (const item of response['data']) {

						result += `<tr> \
										<td> \
											${
												(item.image != '')
												?
												'<img src="'+item.image+'" />'
												:
												'No image.'
											}
										</td> \
										<td>${item.title}</td> \
										<td>${item.link}</td> \
										<td>${item.date}</td> \
										<td>${item.writer}</td> \
										<td></td> \
										<td>${(item.status == 1) ? "Published" : "For Edit"}</td> \
										<td> \
											${
												(item.status == 0)
												?
												'<a href="/edit-article?id='+item.id+'" class="btn btn-primary btn-sm" ><i class="material-symbols-outlined" style="font-size:16px;">edit</i> </a>'
												:
												''
											}
										</td> \
									</tr>`;

					}

					$('.media_table tbody').html(result);

				}

			} catch (error) {
				console.log(error);
			}

		}

	}

};

window.Media = Media;