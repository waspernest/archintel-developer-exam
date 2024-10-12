console.log('add-location.js');

export const Locations = {

	main: {

		onLoad: () => {

		}

	},

	location: {

		saveLocation: async (e) => {

			let form = $("#"+$(e).attr('id'));

			POS_GLOBAL.main.globalModal('warning', 'submission', 'Add Location', 'Adding location... Please wait...');

			let parameter = {
				model: 'location',
				method: 'insert',
				insert: {
					location_name: form.find('input[name=location_name').val(),
					location_email: form.find('input[name=location_email').val(),
					location_contact: form.find('input[name=location_contact').val(),
					street_brgy: form.find('input[name=street_brgy').val(),
					city: form.find('input[name=city').val(),
					province: form.find('input[name=province').val(),
				}
			}

			try {
				let response = await POS_GLOBAL.main.startRequest(parameter);
				
				if (response['code'] == 200 && response['id'] > 0) {

					//add into assoc table
					await POS_GLOBAL.main.startRequest({
						model: 'assoc',
						method: 'insert',
						table: 'location_assoc',
						insert: {
							uid: user_data['id'],
							loc_id: response['id']
						}
					})
					POS_GLOBAL.main.globalModal('success', 'succesful', 'Add Location', 'Location has been added.');

					setTimeout(() => {
						POS_GLOBAL.main.closeModal('staticBackdrop');
                		Router.page.handlePage("/locations");
					},1500);
				}

			} catch (error) {
				console.log("Error: ", error);
			}

		}

	}

};

window.Locations = Locations;