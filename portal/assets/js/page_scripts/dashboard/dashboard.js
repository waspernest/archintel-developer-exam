console.log('dashboard.js');

export const Dashboard = {

	main: {

		onLoad: async () => {
			
			//determine if user is Editor or Writer and call only the function for them
			const userType = Project.user_data.type;

			if (userType == "Writer") {
				await Dashboard.dashboard.loadWriterDashboard();
			} else {
				await Dashboard.dashboard.loadEditorDashboard();
			}

		}

	},

	dashboard: {

		loadWriterDashboard: async () => {

			const articles = await Dashboard.dashboard.getWriterArticles(Project.user_data.id);
			console.log(articles);

			let result = '';

			if (articles['code'] == 200 && articles['data'] && articles['data'].length > 0) {

				for (const item of articles['data']) {

					result = `<div class="inbox-item"> \
		                            <div class="inbox-item-img"><img src="${item.image}" class="rounded-circle" alt=""></div> \
		                            <p class="inbox-item-author"><a href="/view-article?link=${item.link}" target="_blank">${item.title}</a></p> \
		                            <p class="inbox-item-text">${moment(item.date).format("MMMM D, YYYY")}</p> \
		                            <p class="inbox-item-text">${item.first_name} ${item.last_name}</p> \
		                            <!--p class="inbox-item-date"> \
		                                <a href="#" class="btn btn-sm btn-link text-info fs-13"> Reply </a> \
		                            </p--> \
		                        </div>`;

		            if (item.status == 0) {
		            	$('.for-edit-wrapper').append(result);
		            }
				}

			}

		},

		getWriterArticles: async (id) => {

			let parameter = {
				model: 'assoc',
				method: 'custom_join_query',
				table: 'get_article_details_with_user_details',
				id: Project.user_data.id
			}

			try {
				let response = Project.main.startRequest(parameter);
				return response;
			} catch (error) {
				console.log("Error: ", error);
			}
		}

	}

}

window.Dashboard = Dashboard;