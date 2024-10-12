export const Staffs = {

	main: {

		onLoad: async () => {

			await Promise.all([
				Staffs.location.getLocations()
			]);

		}

	},

	staff: {

		saveStaff: async (e) => {

			let form = $('#'+$(e).attr('id'));

			POS_GLOBAL.main.globalModal('warning', 'submission', 'Add User', 'Adding user... Please wait...');

			let parameter = {
				model: 'staff',
				method: 'insert',
				insert: {
					first_name: form.find('input[name=first_name]').val(),
					middle_name: form.find('input[name=middle_name]').val(),
					last_name: form.find('input[name=last_name]').val(),
					email: form.find('input[name=email]').val(),
					contact: form.find('input[name=contact]').val(),
					street_brgy: form.find('input[name=street_brgy]').val(),
					city: form.find('input[name=city]').val(),
					province: form.find('input[name=province]').val()
				}
			}

			try {
				let response = await POS_GLOBAL.main.startRequest(parameter);

				if (response['code'] == 200 && response['id'] > 0) {

					await POS_GLOBAL.main.startRequest({
						model: 'assoc',
						method: 'insert',
						table: 'staff_assoc',
						insert: {
							owner_id: user_data['id'],
							loc_id: $('select[name=location]').val(),
							staff_id: response['id'],
							user_level: $('select[name=user_level]').val(),
							status: 1
						}
					});

					POS_GLOBAL.main.globalModal('success', 'succesful', 'Add Staf', 'Staff has been added and assigned to the location.');
					setTimeout(() => {
						POS_GLOBAL.main.closeModal('staticBackdrop');
                		Router.page.handlePage("/staffs");
					},1500);

				}
			} catch (error) {
				console.log("Error: ", error);
			}

		}

	},

	location: {

		getLocations: async () => {

			let parameter = {
				model: 'assoc',
				method: 'custom_join_query',
				table: 'get_user_locations',
				uid: user_data['id']
			}

			let locs = '';

			try {
				let response = await POS_GLOBAL.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					for (const item of response['data']) {

						locs += `<option value="${item.id}">${item.location_name}</option>`;

					}

					$('.select_location').html(locs);

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		}

	}

}

window.Staffs = Staffs;