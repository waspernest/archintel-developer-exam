export const Staffs = {

	main: {

		onLoad: async () => {

			await Promise.all([
				Staffs.staff.getStaffs()
			]);

		}

	},

	staff: {

		getStaffs: async () => {

			let parameter = {
				model: 'assoc',
				method: 'custom_join_query',
				table: 'get_owners_staffs',
				uid: user_data['id']
			}

			let result = '';

			try {
				let response = await POS_GLOBAL.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					for (const item of response['data']) {

						result += `<tr> \
										<td>${item.first_name} ${item.middle_name} ${item.last_name}</td> \
										<td>${item.email}</td> \
										<td>${item.contact}</td> \
										<td>${item.street_brgy} ${item.city} ${item.province}</td> \
										<td>${item.location_name}</td> \
										<td>${Staffs.staff.getUserLevel(item.user_level)}</td> \
										<td> \
											<a href="/edit-staff?id=${item.id}" class="btn btn-primary btn-sm" data-parent="staffs" ><i class="material-symbols-outlined" style="font-size:16px;">edit</i> </a> \
											<button type="button" class="btn btn-danger btn-sm" data-id="${item.id}" onclick="Staffs.staff.removeStaff(this); return false;"><i class="material-symbols-outlined" style="font-size:16px;">delete</i> </button> \
										</td> \
									</tr>`;

					}

					$('.staffs_table tbody').html(result);

				}


			} catch (error) {
				console.log("Error: ", error);
			}

		},

		getUserLevel: (user_level) => {

			switch (parseInt(user_level)) {

				case 5:
					return "Owner";
					break;
				case 1:
					return "Staff";
					break;

				default:
					return "Admin";
					break;

			}

		},

		removeStaff: async () => {

			POS_GLOBAL.main.confirmAlertModal('info', 'confirm', 'Remove Staff', 'Are you sure you want to remove this staff?').then(async (confirmed) => {

				if (confirmed) {
					console.log('remove staff');
				}

			});

		}

	}

}

window.Staffs = Staffs;