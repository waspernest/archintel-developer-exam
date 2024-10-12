console.log('locations.js');

export const Locations = {

	main: {

		onLoad: async () => {

			await Promise.all([
				Locations.location.getUserLocations()
			]);

		}

	},

	location: {

		getUserLocations: async () => {

			let parameter = {
				model: 'assoc',
				method: 'custom_join_query',
				table: 'get_user_locations',
				uid: user_data['id']
			}

			let locations = '';

			try {
				let response = await POS_GLOBAL.main.startRequest(parameter);
				
				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {
					
					for (const item of response['data']) {

						locations += `<tr> \
										<td>${item.location_name}</td> \
										<td>${item.location_email}</td> \
										<td>${item.location_contact}</td> \
										<td>${item.street_brgy} ${item.city} ${item.province}</td> \
										<td> \
											<a href="/edit-location?id=${item.id}" class="btn btn-primary btn-sm"><i class="material-symbols-outlined" style="font-size:16px;">edit</i> </a> \
											<button type="button" class="btn btn-danger btn-sm" data-id="${item.id}" onclick="Locations.location.removeLocation(this); return false;"><i class="material-symbols-outlined" style="font-size:16px;">delete</i> </button> \
										</td> \
									</tr>`;

					}

					$('.locations_table tbody').html(locations);

				}
				

			} catch (error) {
				console.log("Error: ", error);
			}
		},

		removeLocation: async (e) => {

			POS_GLOBAL.main.confirmAlertModal('info', 'confirmation', 'Remove Location', 'Are you sure you want to remove this location?').then(async (confirmed) => {

				if (confirmed) {
					console.log('remove location')
				}

			});

		}

	}

};

window.Locations = Locations;