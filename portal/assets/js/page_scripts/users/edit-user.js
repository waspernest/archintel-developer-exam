// edit-user.js
console.log('edit-user.js'); 

let user_id = '';

export const Users = {

    main: {

        onLoad: async () => {

            let url = new URL(window.location.href);
            user_id = url.searchParams.get('id');
            
            await Promise.all([Users.user.getUserDetails()]);

        }

    },

    user: {
        getUserDetails: async () => {
            let parameter = {
                model: 'user',
                method: 'retrieve',
                retrieve: '*',
                condition: { id: user_id }
            };

            try {

            let response = await Project.main.startRequest(parameter);

            if (response['code'] === 200 && response['data'].length > 0) {
                $('input[name=first_name]').val(response['data'][0]['first_name']);
                $('input[name=last_name]').val(response['data'][0]['last_name']);

                $('select[name=type] option').filter(function() {
                    return $(this).text() === response['data'][0]['type'];
                }).prop('selected', true);

                $('select[name=status] option').filter(function() {
                    return parseInt($(this).val()) === parseInt(response['data'][0]['status']);
                }).prop('selected', true);
                

            }

            } catch (error) {
                console.log('Error: ', error);
            }
        },

        saveUser: async (e) => {
            let form = $('#'+$(e).attr('id'));

            Project.main.globalModal('warning', 'submission', 'Edit User', 'Updating user... Please wait...');

            let parameter = {
                model: 'user',
                method: 'update',
                update: {
                    first_name: form.find('input[name=first_name]').val(),
                    last_name: form.find('input[name=last_name]').val(),
                    type: form.find('select[name=type]').val(),
                    status: form.find('select[name=status]').val()
                },
                condition: { id: user_id }
            }

            console.log(parameter);

            try {
                let response = await Project.main.startRequest(parameter);
                console.log(response);

                if (response['code'] == 200) {

                    Project.main.globalModal('success', 'succesful', 'Edit User', 'User has been updated successfuly.');

                }

            } catch (error) {
                console.log(error);
            }
        }
    }
};

// Expose Users to global scope
window.Users = Users;