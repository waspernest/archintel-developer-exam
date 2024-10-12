let staff_id = '';
export const Staffs = {

	main: {

		onLoad: async () => {

			let url = new URL(window.location.href);
			staff_id = url.searchParams.get('id');

			await Promise.all([
				Staffs.staff.getStaff(),
				Staffs.location.getLocations()
			]);

		}

	},

	staff: {

		getStaff: async () => {

			let parameter = {
				model: 'assoc',
				method: 'custom_join_query',
				table: 'get_staff_detail',
				uid: staff_id
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

					$('select[name=location] option').filter(function() {
					    return $(this).text() === response['data'][0]['location_name'];
					}).prop('selected', true);

					$('select[name=user_level] option').filter(function() {
					    return parseInt($(this).val()) === parseInt(response['data'][0]['user_level']);
					}).prop('selected', true);

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		},

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