console.log('script.js');

const isLoggedIn = localStorage.getItem('isLoggedIn') === "true";
let user_data = '';

export const Project = {

	user_data: user_data, // Expose user_data as part of Project
	
	main: {
        onLoad: async () => {

        	let url = new URL(window.location.href);
        	console.log(url.pathname);

        	console.log(isLoggedIn);

            if (!isLoggedIn) {

                // when in login form, clear all existing localStorage items
                //localStorage.clear();

            } else {
            	console.log('main');

            	//load user details
            	Project.main.setUserDetails();
            	

            	//load dynamic sidebar
            	Project.main.setSideBar();
            }

            Router.main.onLoad();
        },

		startRequest: async (data) => {

		    return new Promise(function (resolve, reject) {
		        const xhr = new XMLHttpRequest();

		        // Open the POST request to the API
		        xhr.open("POST", "/api");

		        // Set content-type header to JSON
		        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

		        // Convert data to JSON string
		        const body = JSON.stringify(data);

		        // Track the progress of the request
		        xhr.onreadystatechange = function () {
		            if (xhr.readyState === XMLHttpRequest.DONE) {
		                if (xhr.status === 200) {
		                    let res = JSON.parse(xhr.response);

		                    if (res.code === 200) {
		                        resolve(res);  // Request was successful
		                    } else {
		                        reject(res.message);  // Unsuccessful request
		                    }
		                } else {
		                    console.log(`Error: ${xhr.status}`);
		                    reject(`Error: ${xhr.status}`);
		                }
		            }
		        };

		        // Handle network or request failure
		        xhr.onerror = () => {
		            reject('Network error or request failed');
		        };

		        // Send the request with the body
		        xhr.send(body);
		    });
		},

		setUserDetails: () => {

			return new Promise((resolve, reject) => {
		        if (isLoggedIn) {
		            const userData = JSON.parse(localStorage.getItem('user_data'));
		            
		            Project.user_data = userData[0]; // Now it's part of the Project object

		            $('.user-name').html(Project.user_data['first_name'] + " " + Project.user_data['last_name']);
		            $('.user-type').html(Project.user_data['type']);

		            resolve(Project.user_data);
		        } else {
		            reject("User is not logged in or no user data available.");
		        }
		    });

		},

        setSideBar: () => {

		    $('.side-nav').html(''); // Clear sidebar
		    let sidebar_li = '';

		    const userAcl = JSON.parse(localStorage.getItem('user_acl'));
		    
		    // Check if userAcl exists and is not null or undefined
		    if (userAcl && userAcl[Project.user_data['type']] && userAcl[Project.user_data['type']].menu) {

		        const menus = userAcl[Project.user_data['type']].menu;

		        // Loop through the menus and generate the sidebar items
		        Object.keys(menus).forEach(key => {

		            sidebar_li += `<li class="side-nav-item"> \
		                                <a href="${menus[key].url}" class="side-nav-link"> \
		                                    <i class="material-symbols-outlined">${menus[key].material_icon}</i> \
		                                    <span> ${menus[key].title} </span> \
		                                </a> \
		                            </li>`;
		        });
		    } else {
		        console.error("user_acl is not available or doesn't match the user type.");
		        // You can handle what to show if there's no userAcl or menu (e.g., redirect to login)
		        //Router.page.handlePage("/");
		    }

		    // Add static logout menu
		    sidebar_li += `<li class="side-nav-item"> \
		                        <a href="/logout" class="side-nav-link"> \
		                            <i class="material-symbols-outlined">logout</i> \
		                            <span> Logout </span> \
		                        </a> \
		                    </li>`;

		    // Set the sidebar content
		    $('.side-nav').html(sidebar_li);
		},

        globalAlertMessage: (type, message, wrapper) => {

        	let alert_type = '', alert_icon = '';

        	switch (type) {

        		case 'error':
        			alert_type = 'danger';
        			alert_icon = 'ri-close-circle-line';
        			break;

        		case 'warning':
        			alert_type = 'warning';
        			alert_icon = 'ri-alert-line';
        			break;

        		case 'info':
        			alert_type = 'info';
        			alert_icon = 'ri-information-line';
        			break;

	        	default:
	        		alert_type = 'success';
        			alert_icon = 'ri-check-line';
	        		break;
        	}

        	let alert = `<div class="alert alert-${alert_type}" role="alert"> \
                            <i class="${alert_icon} me-1 align-middle fs-16"></i> ${message} \
                        </div>`;

            $('.'+wrapper).html(alert);

        },

        /*
			* Global Modal
        */

        globalModal: (type, task, title, message) => {

        	//clear and set the type of modal i.e success, warning, danger
        	$("#staticBackdrop .modal-header").removeClass((index, className) => {
        		return (className.match(/\bbg-\S+/g) || []).join(' ');
        	});

        	$("#staticBackdrop .modal-header").addClass(" bg-"+type);

        	$("#staticBackdrop .modal-footer button:last").removeClass((index, className) => {
        		return (className.match(/\bbtn-\S+/g) || []).join(' ');
        	});

        	$("#staticBackdrop .modal-footer button:last").addClass(" btn-"+type);

        	//set the modal title
        	$("#staticBackdrop .modal-title").html(title);
        	$("#staticBackdrop .modal-body p.message").html(message);

        	//set buttons based from task i.e submission, successful or failed
        	if (task == "submission") { // for submission
        		
        		$('#staticBackdrop .modal-body p.modal-icon').html('<div class="spinner-border text-'+type+' m-2" role="status" style="margin: 20px auto !important;display: block;"></div>');
        		$("#staticBackdrop .modal-header button").hide();
        		$("#staticBackdrop .modal-footer").hide();

        	} else { // for success or danger/failed

        		if ($('#staticBackdrop .modal-body .spinner-border').length > 0) $('#staticBackdrop .modal-body .spinner-border').remove();
        		
        		if (task == "succesful") {
        			$('#staticBackdrop .modal-body p.modal-icon').html('<i class="ri-check-line h1" style="color: #17a497;"></i>');
        		} else if (task == "warning") {
        			$('#staticBackdrop .modal-body p.modal-icon').html('<i class="ri-alert-line h1" style="color: #fec20d;"></i>');
				} else {
        			$('#staticBackdrop .modal-body p.modal-icon').html('<i class="ri-close-circle-line h1" style="color: #f7473a;"></i>');
        		}

        		$("#staticBackdrop .modal-header button").show();
        		$("#staticBackdrop .modal-footer button:first").hide();
        		$("#staticBackdrop .modal-footer button:last").text('Okay').attr('data-bs-dismiss','modal').show();

        	}

			$("#staticBackdrop").modal('show');


        },

        confirmAlertModal: (type, task, title, message) => {

			return new Promise((resolve, reject) => {

				//clear and set the type of modal i.e success, warning, danger
	        	$("#staticBackdrop .modal-header").removeClass((index, className) => {
	        		return (className.match(/\bbg-\S+/g) || []).join(' ');
	        	});

	        	$("#staticBackdrop .modal-header").addClass(" bg-"+type);

	        	$("#staticBackdrop .modal-footer button:last").removeClass((index, className) => {
	        		return (className.match(/\bbtn-\S+/g) || []).join(' ');
	        	});

	        	$("#staticBackdrop .modal-footer button:last").addClass(" btn-"+type);

	        	//set the modal title
	        	$("#staticBackdrop .modal-title").html(title);
	        	$("#staticBackdrop .modal-body p.modal-icon").html('<i class="ri-information-line h1 text-info"></i>');
	        	$("#staticBackdrop .modal-body p.message").html(message);

	        	//set modal footer buttons
	        	$("#staticBackdrop .modal-footer button:first").text("No");
	        	$("#staticBackdrop .modal-footer button:last").text("Yes");

	        	// If "No" is clicked, reject the promise
		       	$("#staticBackdrop .modal-footer button:first").off('click').on('click', function() {
					$("#staticBackdrop").modal('hide');
		            resolve(false);
		        });

		       	// If "yes" is clicked, resolve the promise
		        $("#staticBackdrop .modal-footer button:last").off('click').on('click', function() {
					$("#staticBackdrop").modal('hide');
		            resolve(true);
		        });


				$("#staticBackdrop").modal('show');

			});

        },

        closeModal: async (modalID) => {
			$('#'+modalID).modal('hide');
		},

		splitStringParts: (base64String, chunkSize) => {
            let parts = [];
            for (let i = 0; i < base64String.length; i += chunkSize) {
                parts.push(base64String.substring(i, i + chunkSize));
            }
            return parts;
        },

        uploadBase64Part: async (table, id, part, column) => {
            let parameter = {
                model: 'main',
                method: 'upload_parts_sequentially',
                table: table,
                column: column,
                parts: part,
                condition: {
                	id: id
                }
            }

            try {
                let response = await Project.main.startRequest(parameter);
                if (response['code'] == 200) return true;
            } catch (error) {
                console.log("Error: ", error);
            }

            return false;

        },

        uploadImageSequentially: (table, id, parts, part, column) => {
		    return new Promise(async (resolve, reject) => {
		        for (let n = part; n < parts.length; n++) {
		            try {
		                let response = await Project.main.uploadBase64Part(table, id, parts[n], column);
		                if (response) {
		                    console.log(`Part ${n + 1} of ${parts.length} is uploaded`); // +1 for better readability
		                }
		            } catch (error) {
		                console.log("Error: ", error);
		                return reject(error); // Reject the promise if an error occurs
		            }
		        }
		        resolve(true); // Resolve the promise when all parts are uploaded
		    });
		},
    },

    index: {
        authLogin: async (e) => {
            let form = $("#" + $(e).attr("id"));
            let parameter = {
                model: 'auth',
                method: 'auth_login',
                fields: {
                    first_name: form.find('input#first_name').val(),
                    last_name: form.find('input#last_name').val()
                }
            };

            try {
                let response = await Project.main.startRequest(parameter);
                console.log(response);

                if (response['code'] == 200) {
                	Project.main.globalAlertMessage(response['status'], response['message'], 'alert-wrapper');

                	if (response['status'] == "success") {

                		//store csrf token into localStorage
                		localStorage.setItem('isLoggedIn', true);
                		//localStorage.setItem('csrf_token', response['csrf_token']);
                		localStorage.setItem('user_data', JSON.stringify(response['data']));
                		localStorage.setItem('user_acl', JSON.stringify(response['user_acl']));

                		//redirect or reload the page to dashboard
                		setTimeout(()=>{
                			window.location.href = '/dashboard';
                		},2500);

                	}
                }

            } catch (error) {
                console.log(error);
            }

            //console.log("localStorage", localStorage);
        }
    }

}

window.Project = Project;
Project.main.onLoad();