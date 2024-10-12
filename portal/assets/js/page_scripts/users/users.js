console.log('users.js');

export const Users = {

	main: {

		onLoad: async () => {

			await Promise.all([
				Users.user.getUsers()
			]);

		}

	},

	user: {

		getUsers: async() => {

			let parameter = {
				model: 'user',
				method: 'retrieve',
				retrieve: '*'
			}

			try {
				let response = await Project.main.startRequest(parameter);
				
				let users = '';

				if (response['code'] == 200 && response['data'] && response['data'].length > 0) {

					for (const item of response['data']) {

						users += `<tr class="user-row-${item.id}"> \
									<td>${item.first_name} ${item.last_name}</td> \
									<td>${item.type}</td> \
									<td>${(item.status == 1) ? "Active" : "Inactive"}</td> \
									<td> \
										<a href="/edit-user?id=${item.id}" class="btn btn-primary btn-sm" data-parent="users" ><i class="material-symbols-outlined" style="font-size:16px;">edit</i> </a> \
										<button type="button" class="btn btn-danger btn-sm" data-id="${item.id}" onclick="Users.user.removeUser(this); return false;"><i class="material-symbols-outlined" style="font-size:16px;">delete</i> </button> \
									</td> \
								</tr>`;

					}

					$('.users_table tbody').html(users);

				}

			} catch (error) {
				console.log("Error: ", error);
			}

		},

		removeUser: async (e) => {

			Project.main.confirmAlertModal('info', 'confirm', 'Remove User', 'Are you sure you want to remove this user?').then( async (confirmed) => {

				if (confirmed) {
					console.log("user removed");

					let parameter = {
						model: 'user',
						method: 'delete',
						condition: { id: $(e).data('id') }
					}

					try {
						let response = await Project.main.startRequest(parameter);

						if (response['code'] == 200) {

							Project.main.globalModal('success', 'succesful', 'Remove User', 'User has been removed.');

							$('.users_table tbody tr.user-row-'+$(e).data('id')).remove();

						}
					} catch (error) {
						console.log("Error: ", error);
					}

				} 

			});

		}

	}

};

window.Users = Users;