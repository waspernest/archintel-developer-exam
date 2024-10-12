console.log('edit-user.js');
(function() { //encapsulate using IIFE to avoid redeclaring

	let user_id = '';

	let Users = {

		main: {

			onLoad: async () => {

				let url = new URL(window.location.href);
				user_id = url.searchParams.get('id');

				await Promise.all([
					Users.user.getUserDetails()
				]);
			}

		},

		user: {

			getUserDetails: async() => {

				let parameter = {
					model: 'user',
					method: 'retrieve',
					retrieve: '*',
					condition: {
						id: user_id
					}
				}

				try {
					let response = await POS_GLOBAL.main.startRequest(parameter);
					
					if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

						$('input[name=first_name]').val(response['data'][0]['first_name']);
						$('input[name=middle_name]').val(response['data'][0]['middle_name']);
						$('input[name=last_name]').val(response['data'][0]['last_name']);
						$('input[name=email]').val(response['data'][0]['email']);
						$('input[name=contact]').val(response['data'][0]['contact']);
						$('input[name=street_brgy]').val(response['data'][0]['street_brgy']);
						$('input[name=city]').val(response['data'][0]['city']);
						$('input[name=province]').val(response['data'][0]['province']);
						$('input[name=business_name]').val(response['data'][0]['business_name']);
						$('input[name=business_email]').val(response['data'][0]['business_email']);

					}

				} catch (error) {
					console.log('Error: ', error);
				}

			},

			saveUser: async (e) => {

				let form = $('#'+$(e).attr('id'));

				POS_GLOBAL.main.globalModal('warning', 'submission', 'Edit User', 'Updating user... Please wait...');

				let parameter = {
					model: 'user',
					method: 'update',
					update: {
						first_name: form.find('input[name=first_name]').val(),
						middle_name: form.find('input[name=middle_name]').val(),
						last_name: form.find('input[name=last_name]').val(),
						email: form.find('input[name=email]').val(),
						contact: form.find('input[name=contact]').val(),
						street_brgy: form.find('input[name=street_brgy]').val(),
						city: form.find('input[name=city]').val(),
						province: form.find('input[name=province]').val(),
						business_name: form.find('input[name=business_name]').val(),
						business_email: form.find('input[name=business_email]').val()
					},
					condition: {
						id: user_id
					}
				}

				console.log(parameter);
				
				// try {
	            //     let response = await POS_GLOBAL.main.startRequest(parameter);
	            //     console.log(response);

	            //     if (response['code'] == 200 && response['id']) {

	            //     	POS_GLOBAL.main.globalModal('success', 'succesful', 'Edit User', 'User has been updated successfuly.');

	            //     	setTimeout(() => {
	            //     		POS_GLOBAL.main.closeModal('staticBackdrop');
	            //     		Router.page.handlePage("/users");
	            //     	}, 1500);
	            //     }

	            // } catch (error) {
	            //     console.log(error);
	            // }

			}

		}

	}

	Users.main.onLoad();

})();