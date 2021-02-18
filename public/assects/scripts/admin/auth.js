// // setting for side bar
$('document').ready(function () {
	$('.buttons').sideNav();

	$('ul.side-nav li').click(function (e) {
		$('.side-nav').sideNav('hide');
	});
});

// const side = document.getElementsByClassName('sideli');

// side.addEventListener('click', (evt) => {
// 	$('.buttons').sideNav('close');
// });
console.log('sdfds');
// ? Checking if admin is logged in
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		//	swal('logged in');
		console.log(user);
	} else {
		window.location.href = 'login_admin.html';
	}
});

// ? logging out the admin _____________________
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', (evt) => {
	evt.preventDefault();

	//// logging out the user
	auth
		.signOut()
		.then(() => {
			window.location.href = 'login_page.html';
		})
		.catch((e) => {
			swal("Sorry can't log out");
			console.log(e);
		});
});
