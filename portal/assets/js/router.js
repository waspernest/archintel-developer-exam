const isLoggedIn = localStorage.getItem('isLoggedIn') === "true";

export const Router = {

	main: {

		onLoad: async () => {
		    let url = new URL(window.location.href);
		    let currentPath = url.pathname + url.search; // Include both pathname and query string
		    
		    let initialPage;

		    // Check if user is logged in or not
		    if (isLoggedIn) {
		        if (currentPath !== "/") {
		            initialPage = currentPath; // Preserve query string on initial page load
		        } else {
		            initialPage = "/dashboard"; // Redirect to dashboard if no specific page
		        }
		    } else {
		        initialPage = "/"; // Go to login page if not logged in
		    }

		    // Load the initial page, including query string if present
		    Router.page.handlePage(initialPage);

		    // Add event listener to all <a> tags for internal routing
		    $(document).on('click', 'a', (e) => {
			    const $link = $(e.currentTarget); // Get the clicked link
			    const href = $link.attr("href");

			    // Check if the link is a collapse toggle or anchor link
			    const isCollapseToggle = $link.attr('data-toggle') === 'collapse' || $link.attr('aria-expanded') !== undefined;
			    const isAnchorLink = href && href.indexOf('#') === 0; // Check if it's an anchor link

			    // Prevent the default link behavior only for regular navigation links
			    if (!isCollapseToggle && !isAnchorLink) {
			        e.preventDefault();

			        // Handle the page change only if the route exists (not a 404)
			        if (Router.page.routes(href) !== Router.page.routes(404)) {
			            // Push the new state to history with the href path
			            window.history.pushState({ path: href }, '', href);
			        }

			        // Handle the page change or logout
			        if (href === "/logout") {
			            Router.main.logoutUser();
			        } else {
			            Router.page.handlePage(href); // Only call handlePage if not a collapse toggle
			        }
			    }
			});

		    // Listen for the popstate event (back or forward button pressed)
		    window.addEventListener('popstate', (e) => {
		        // Retrieve the full current path from window.location (including query string)
		        const href = window.location.pathname + window.location.search; 

		        // Handle page change when back/forward buttons are clicked
		        Router.page.handlePage(href);
		    });
		},

		getSubPagesParents : (pathname) => {

			let parentPage = {

				//users
				'/users' : `users`,
				'/add-user' : `users`,
				'/edit-user' : `users`,

				//company
				'/company' : `company`,
				'/add-company' : `company`,
				'/edit-company' : `company`,
			}

			return parentPage[pathname]

		},

		logoutUser: async () => {

			setTimeout(() => {

				//clear all localStorage items
				localStorage.clear();

				Router.page.handlePage("/");
			},500);
			
		}

	},

	page: {

		routes: (pathname) => {

			let routes = {
				404: `pages/common/404.html`,
				'/': 'pages/common/login.html',
				'/dashboard': 'pages/dashboard/dashboard.html',

				//users
				'/users': 'pages/users/users.html',
				'/add-user': 'pages/users/add-user.html',
				'/edit-user': 'pages/users/edit-user.html',

				//company
				'/company': 'pages/company/company.html',
				'/add-company': 'pages/company/add-company.html',
				'/edit-company': 'pages/company/edit-company.html',
			}

			return routes[pathname] || routes[404];

		},

		handlePage: async (url) => {

		    // Use the URL object to get the pathname and the query string
		    const parsedUrl = new URL(url, window.location.origin);
		    const pathname = parsedUrl.pathname;  // This gives you current pathname without query string
		    const queryString = parsedUrl.search; 

		    // Combine pathname and query string for the routing
		    const route = Router.page.routes(pathname);
		    const content = await fetch(route).then((data) => data.text());

		    // Update the browser's URL without reloading the page, including the query string
		    if (window.location.pathname + window.location.search !== url) {
		        history.pushState({}, '', url); // This updates the browser's URL to "/edit-user?id=12"
		        //window.history.pushState({ path: url }, '', url);
		    }

		    // Render the content
		    if (route === 'pages/common/404.html') { // If route is 404, display 404 page
		        $('.body-wrapper .wrapper').html(content);

		    } else {
		        switch (pathname) {
		            case '/': // Default page - login and the function in here is found in script.js
		                $('.body-wrapper .wrapper').html(content);
		                break;

		            default: // For dynamic pages
		                $('.body-wrapper .wrapper .content-page .content').html(content);

		                // Load the correct JavaScript file for the dynamic page
		                let parentPage = Router.main.getSubPagesParents(pathname);

		                try {
						    // Dynamically import the module based on the parentPage and pathname
						    const module = await import(`/site/assets/js/page_scripts/${parentPage}/${pathname.replace("/", "")}.js`);
						    
						    // Dynamically determine which object to access (e.g., Users, Staff) based on parentPage
						    const objectName = parentPage.charAt(0).toUpperCase() + parentPage.slice(1); // Capitalize the first letter (e.g., 'users' becomes 'Users')

						    // Check if the module has the object you're looking for and call its onLoad function dynamically
						    if (module[objectName] && module[objectName].main && typeof module[objectName].main.onLoad === 'function') {
						        module[objectName].main.onLoad(); // Call the dynamic onLoad function
						    } else {
						        console.log(`Error: Could not find ${objectName}.main.onLoad() in the module`);
						    }
						} catch (error) {
						    console.log("Error loading module:", error);
						}

		                await Router.page.loadPageScript("site/assets/js/page_scripts/" + parentPage + "/" + pathname.replace("/", "") + ".js");
		                break;
		        }
		    }
		},

		loadPageScript: (src) => {
		    return new Promise((resolve, reject) => {
		        // Check if the script is already in the <head>
		        const existingScript = document.querySelector(`script[src="${src}"]`);

		        if (existingScript) {
		            // If the script is already loaded, resolve immediately
		            resolve();
		        } else {
		            // Create a new script element
		            const script = document.createElement('script');
		            script.src = src;
		            script.type = 'module'; // Set the type to module

		            // Resolve when the script has loaded successfully
		            script.onload = () => {
		                console.log(`Script loaded: ${src}`);
		                resolve();
		            };

		            // Reject if there is an error loading the script
		            script.onerror = (error) => {
		                console.error(`Error loading script: ${src}`, error);
		                reject(error);
		            };

		            // Append the script to the <head>
		            document.head.appendChild(script);
		        }
		    });
		}
	}

};

window.Router = Router;
