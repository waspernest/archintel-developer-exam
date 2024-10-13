let comp_id = '';
export const Company = {

	main: {

		onLoad: async () => {

			let url = new URL(window.location.href);
			comp_id = url.searchParams.get('id');

			await Promise.all([
				Company.company.getCompany()
			]);

		}

	},

	company: {

		getCompany: async () => {

			let parameter = {
				model: 'company',
				method: 'retrieve',
				retrieve: '*',
				condition: { id: comp_id }
			}

			try {
				let response = await Project.main.startRequest(parameter);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					$('input[name=logo]').val(response['data'][0]['logo']);
					$('input[name=name]').val(response['data'][0]['name']);

					$('select[name=status] option').filter(function() {
	                    return parseInt($(this).val()) === parseInt(response['data'][0]['status']);
	                }).prop('selected', true);

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		},

		saveCompany: async (e) => {

			let form = $("#"+$(e).attr('id'));

			Project.main.globalModal('warning', 'submission', 'Edit Company', 'Updating company... Please wait...');

            let parameter = {
                model: 'company',
                method: 'update',
                update: {
                    logo: form.find('input[name=logo]').val(),
                    name: form.find('input[name=name]').val(),
                    status: form.find('select[name=status]').val()
                },
                condition: { id: comp_id }
            }

            console.log(parameter);

            try {
                let response = await Project.main.startRequest(parameter);
                console.log(response);

                if (response['code'] == 200) {

                    Project.main.globalModal('success', 'succesful', 'Edit Company', 'Company has been updated successfuly.');

                }

            } catch (error) {
                console.log(error);
            }

		}
		
	}

};

window.Company = Company;