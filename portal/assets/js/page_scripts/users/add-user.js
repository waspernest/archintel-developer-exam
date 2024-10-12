console.log('add-user.js');

export const Users = {
	
	main: {
		onLoad: () => {
			
		}
	},

	user: {

		saveUser: async (e) => {

			let form = $('#'+$(e).attr('id'));

			Project.main.globalModal('warning', 'submission', 'Add User', 'Adding user... Please wait...');

			let parameter = {
				model: 'user',
				method: 'insert',
				insert: {
					first_name: form.find('input[name=first_name]').val(),
					last_name: form.find('input[name=last_name]').val(),
					type: form.find('select[name=type]').val(),
					status: form.find('select[name=status]').val()
				}
			}
			
			try {
                let response = await Project.main.startRequest(parameter);
                console.log(response);

                if (response['code'] == 200 && response['id']) {

                	Project.main.globalModal('success', 'succesful', 'Add User', 'User has been added successfuly.');

                	setTimeout(() => {
                		Project.main.closeModal('staticBackdrop');
                		Router.page.handlePage("/users");
                	}, 1500);
                }

            } catch (error) {
                console.log(error);
            }

		}

	}

};

window.Users = Users;