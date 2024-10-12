console.log('add-company.js');

export const Company = {
	
	main: {
		onLoad: () => {
			
		}
	},

	company: {

		saveCompany: async (e) => {

			let form = $('#'+$(e).attr('id'));

			Project.main.globalModal('warning', 'submission', 'Add Company', 'Adding company... Please wait...');

			let parameter = {
				model: 'company',
				method: 'insert',
				insert: {
					logo: form.find('input[name=logo]').val(),
					name: form.find('input[name=name]').val(),
					status: form.find('select[name=status]').val()
				}
			}
			
			try {
                let response = await Project.main.startRequest(parameter);
                console.log(response);

                if (response['code'] == 200 && response['id']) {

                	Project.main.globalModal('success', 'succesful', 'Add Company', 'Company has been added successfuly.');

                	setTimeout(() => {
                		Project.main.closeModal('staticBackdrop');
                		Router.page.handlePage("/company");
                	}, 1500);
                }

            } catch (error) {
                console.log(error);
            }

		}

	}

};

window.Company = Company;