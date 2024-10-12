const isLoggedIn = localStorage.getItem('isLoggedIn') === "true";
let user_data = '';

let POS_GLOBAL = {

    main: {
        onLoad: async () => {

        	let url = new URL(window.location.href);
        	console.log(url.pathname);

            if (!isLoggedIn) {

                // when in login form, clear all existing localStorage items
                //localStorage.clear();

            } else {
            	console.log('main');

            	//load user details
            	POS_GLOBAL.main.setUserDetails();
            	

            	//load dynamic sidebar
            	POS_GLOBAL.main.setSideBar();
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

		        // Check if the user is logged in and if CSRF token is available
		        const csrfToken = localStorage.getItem('csrf_token');

		        // If the request is for login, skip CSRF and user ID headers
		        if (data.model === 'auth' && data.method === 'auth_login') {
		            // Login request; no need for CSRF or user ID headers
		            console.log('Login request detected. Skipping CSRF and User ID headers.');
		        } else {
		            // For other requests, ensure the user is logged in and CSRF token exists
		            if (isLoggedIn && csrfToken && user_data['id']) {
		                xhr.setRequestHeader("X-CSRF-Token", csrfToken);
		                xhr.setRequestHeader("X-User-ID", user_data['id']);  // Pass user ID securely in the header
		            } else {
		                console.warn('User is not logged in or missing CSRF token/user ID.');
		                return reject('User is not logged in or missing CSRF token/user ID.');
		            }
		        }

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

			if (isLoggedIn) {

				const userData = JSON.parse(localStorage.getItem('user_data'));
				user_data = userData[0];

				$('.user-name').html(user_data['first_name']+" "+user_data['last_name']);

				switch (parseInt(user_data['user_level'])) {

					case 5: 
						$('.user-type').html("Owner");
						break;

					default:
						$('.user-type').html("Admin");
						break;
				}
			}

		},

        setSideBar: () => {

        	$('.side-nav').html('');
        	let sidebar_li = '';

        	console.log(localStorage);

        	const userAcl = JSON.parse(localStorage.getItem('user_acl'));
        	
        	if (userAcl && userAcl.menu) {

        		// const acl = JSON.parse(localStorage.getItem('user_acl'));
        	
	        	// $.each(acl.menu, (index, item) => {

	        	// 	sidebar_li += `<li class="side-nav-item"> \
			    //                         <a href="${item.url}" class="side-nav-link"> \
			    //                             <i class="material-symbols-outlined">${item.material_icon}</i> \
			    //                             <span> ${item.title} </span> \
			    //                         </a> \
			    //                     </li>`;
	        		
			    //     if (typeof item.sub_menus !== "undefined") {
			    //     	item.sub_menus.forEach(item => {
				// 		    // Iterate through the keys of the object (Products, Stocks)
				// 		    Object.keys(item).forEach(key => {
				// 		        const menu = item[key];
				// 		        console.log(`Title: ${menu.title}`);
				// 		        console.log(`URL: ${menu.url}`);
				// 		        console.log(`Enabled: ${menu.enabled}`);
				// 		        console.log(`Icon: ${menu.icon}`);
				// 		        console.log(`Material Icon: ${menu.material_icon}`);
				// 		        console.log('-----------------------');
				// 		    });
				// 		});

			    //     } else {
			        	
			    //     }
	        	// });

	        	const menuItems = Object.keys(userAcl.menu);

	        	menuItems.forEach(itemKey => {

	        		const menuItem = userAcl.menu[itemKey];

	        		// Check if the menu item has sub_menus (and if they are enabled)
			        if (menuItem.sub_menus && Array.isArray(menuItem.sub_menus)) {

			        	sidebar_li += `<li class="side-nav-item">
					                        <a data-bs-toggle="collapse" href="#sidebar${menuItem.title}" aria-expanded="false" aria-controls="sidebar${menuItem.title}" class="side-nav-link collapse">
					                            <i class="material-symbols-outlined">${menuItem.material_icon}</i> \
					                            <span> ${menuItem.title} </span>
					                            <span class="menu-arrow"></span>
					                        </a>
					                        <div class="collapse" id="sidebar${menuItem.title}" style="">
					                            <ul class="side-nav-second-level">`;

			            menuItem.sub_menus.forEach(subMenu => {
			                // Iterate over the submenu items (keys inside sub_menus array)
			                Object.keys(subMenu).forEach(subMenuKey => {
			                    const subMenuItem = subMenu[subMenuKey];
			                    console.log(`Submenu Title: ${subMenuItem.title}, URL: ${subMenuItem.url}`);

			                    sidebar_li += `<li>
			                    					<a href="${subMenuItem.url}">${subMenuItem.title}</a>
			                    				</li>`;

			                });
			            });

			            sidebar_li += `</ul>
			            				</div>
			            				</li>`;

			        } else {
			        		sidebar_li += `<li class="side-nav-item"> \
					                            <a href="${menuItem.url}" class="side-nav-link"> \
					                                <i class="material-symbols-outlined">${menuItem.material_icon}</i> \
					                                <span> ${menuItem.title} </span> \
					                            </a> \
					                        </li>`;
			        }
	        	});

        	}
        	
        	//add static logout menu
        	sidebar_li += `<li class="side-nav-item"> \
	                            <a href="/logout" class="side-nav-link"> \
	                               	<i class="material-symbols-outlined">logout</i> \
	                                <span> Logout </span> \
	                            </a> \
	                        </li>`;

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
        			$('#staticBackdrop .modal-body p.modal-icon').html('<i class="ri-check-line h1" style="color: #17a497;"></i></i>');
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
		}
    },

    index: {
        authLogin: async (e) => {
            let form = $("#" + $(e).attr("id"));
            let parameter = {
                model: 'auth',
                method: 'auth_login',
                fields: {
                    email: form.find('input#emailaddress').val(),
                    password: form.find('input#password').val()
                }
            };

            try {
                let response = await POS_GLOBAL.main.startRequest(parameter);
                console.log(response);

                if (response['code'] == 200) {
                	POS_GLOBAL.main.globalAlertMessage(response['status'], response['message'], 'alert-wrapper');

                	if (response['status'] == "success") {
                		console.log(localStorage.getItem('isLoggedIn'));

                		//store csrf token into localStorage
                		localStorage.setItem('isLoggedIn', true);
                		localStorage.setItem('csrf_token', response['csrf_token']);
                		localStorage.setItem('user_data', JSON.stringify(response['data']));
                		localStorage.setItem('user_acl', JSON.stringify(response['acl']));

                		//redirect or reload the page to dashboard
                		setTimeout(()=>{
                			window.location.href = '/dashboard';
                		},2500);

                	}
                }

            } catch (error) {
                console.log(error);
            }

            console.log("localStorage", localStorage);
        }
    }
}

POS_GLOBAL.main.onLoad();
