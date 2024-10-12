export const Company = {
	
	main: {

		onLoad: async () => {

			await Promise.all([
				Company.company.getCompanies()
			]);

			$('.company_table').DataTable({ordering: false});
		}

	},

	company: {

		getCompanies: async () => {

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

						result += `<tr class="company-row-${item.id}"> \
										<td> \
											${
												(item.logo != '')
												?
												'<img src="'+item.logo+'" />'
												:
												'No logo.'
											}
										</td> \
										<td>${item.name}</td> \
										<td>${(item.status == 1) ? "Active" : "Inactive"}</td> \
										<td> \
											<a href="/edit-company?id=${item.id}" class="btn btn-primary btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="info-tooltip" data-bs-title="This top tooltip is themed via CSS variables."><i class="material-symbols-outlined" style="font-size:16px;">edit</i> </a> \
											<button type="button" class="btn btn-danger btn-sm" data-id="${item.id}" onclick="Company.company.removeCompany(this); return false;"><i class="material-symbols-outlined" style="font-size:16px;">delete</i> </button> \
										</td> \
									</tr>`;

					}

					$('.company_table tbody').html(result);

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		}

	}

};

window.Company = Company;