console.log('edit-location.js');

let loc_id = '';

export const Locations = {

	main: {

		onLoad: async () => {

			let url = new URL(window.location.href);
			loc_id = url.searchParams.get('id');

			await Promise.all([
				Locations.location.getLocation()
			]);

		}

	},

	location: {

		getLocation: async () => {

			let parameter = {
				model: 'location',
				method: 'retrieve',
				retrieve: '*',
				condition: { id: loc_id }
			}

			try {
				let response = await POS_GLOBAL.main.startRequest(parameter);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					$('input[name=location_name').val(response['data'][0]['location_name']);
					$('input[name=location_email').val(response['data'][0]['location_email']);
					$('input[name=location_contact').val(response['data'][0]['location_contact']);
					$('input[name=street_brgy').val(response['data'][0]['street_brgy']);
					$('input[name=city').val(response['data'][0]['city']);
					$('input[name=province').val(response['data'][0]['province']);

				}

			} catch (error) {
				console.log("Error: ", error)
			}

		},

		saveLocation: async (e) => {

			let form = $("#"+$(e).attr('id'));

			POS_GLOBAL.main.globalModal('warning', 'submission', 'Edit Location', 'Updating location... Please wait...');

			let parameter = {
				model: 'location',
				method: 'update',
				update: {
					location_name: form.find('input[name=location_name').val(),
					location_email: form.find('input[name=location_email').val(),
					location_contact: form.find('input[name=location_contact').val(),
					street_brgy: form.find('input[name=street_brgy').val(),
					city: form.find('input[name=city').val(),
					province: form.find('input[name=province').val(),
				},
				condition: { id: loc_id }
			}

			try {
				let response = await POS_GLOBAL.main.startRequest(parameter);
				
				if (response['code'] == 200) {

					POS_GLOBAL.main.globalModal('success', 'succesful', 'Edit Location', 'Location has been updated.');

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		}

	}

};

window.Locations = Locations;