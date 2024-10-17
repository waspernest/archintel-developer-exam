export const Media = {

	main: {

		onLoad: async () => {

			//determine if user is Editor or Writer and call only the function for them
			const userType = Project.user_data.type;

			if (userType == "Writer") {
				await Media.media.getWriterArticles();
			} else {
				//remove the Add Article button for Editor
				$('.add-article-btn').remove();

				await Media.media.getEditorArticles();
				console.log("editor on load");
			}

		}

	},

	media: {

		getWriterArticles: async () => {

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
										<td><a href='/view-article?link=${item.link}' target="_blank">${item.link}</a></td> \
										<td>${item.date}</td> \
										<td>${item.writer}</td> \
										<td>${(item.editor == 0) ? "No Editor yet." : "Editor"}</td> \
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

		},

		getEditorArticles: async () => {

			let parameter = {
				model: 'article',
				method: 'retrieve',
				retrieve: '*'
			}

			let result = '';

			try {
				let response = await Project.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					for (const item of response['data']) {

						const writer_details = await Media.media.getUserDetails(item.writer);
						const editor_details = await Media.media.getUserDetails(item.editor);

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
										<td><a href='/view-article?link=${item.link}' target="_blank">${item.link}</a></td> \
										<td>${item.date}</td> \
										<td>${writer_details}</td> \
										<td>${(item.editor == 0) ? "No Editor yet." : editor_details}</td> \
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

		},

		getUserDetails: async (id) => {

			let parameter = {
				model: 'user',
				method: 'retrieve',
				retrieve: ['first_name', 'last_name'],
				condition: { id: id }
			}

			try {
				let response = await Project.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					return response['data'][0]['first_name']+" "+response['data'][0]['last_name'];

				} else {

					return "-";

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		}

	}

};

window.Media = Media;