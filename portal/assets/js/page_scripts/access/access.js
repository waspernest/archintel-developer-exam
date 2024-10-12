export const Access = {

	main: {

		onLoad: async () => {

			await Promise.all([
				Access.access.getAccessControll()
			]);

		}

	},

	access: {

		getAccessControll: async () => {

			let parameter = {
				model: 'access_control',
				method: 'retrieve',
				retrieve: '*'
			}

			let result = '';

			try {
				let response = await POS_GLOBAL.main.startRequest(parameter);
				console.log(response);

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					for (const item of response['data']) {

						result += `<tr> \
										<td>${Access.access.getAccessUserType(item.user_type)}</td> \
										<td> \
											<a href="/edit-access?id=${item.id}" class="btn btn-primary btn-sm" data-parent="users" ><i class="material-symbols-outlined" style="font-size:16px;">edit</i> </a> \
											<button type="button" class="btn btn-danger btn-sm" data-id="${item.id}" onclick="Access.access.removeAccess(this); return false;"><i class="material-symbols-outlined" style="font-size:16px;">delete</i> </button> \
										</td> \
									</tr>`;

					}

					$('.access_table tbody').html(result);

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		},

		getAccessUserType: (user_type) => {

			switch (parseInt(user_type)) {

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

		removeAccess: async (e) => {

			POS_GLOBAL.main.confirmAlertModal('info', 'confirm', 'Remove Access', 'Are you sure you want to remove this access?').then(async (confirmed) => {

				if (confirmed) {
					console.log("remove access");
				}

			});

		}

	}

}

window.Access = Access;