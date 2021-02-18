// ? signing in the admin
const signinForm = document.getElementById('login-form');

signinForm.addEventListener('submit', (evt) => {
	evt.preventDefault();

	//// getting form info
	let email = signinForm.email.value;
	let password = signinForm.password.value;

	//// logging admin in
	auth
		.signInWithEmailAndPassword(email, password)
		.then((cred) => {
			//window.location.href = 'admin_panel.html';
			user();
		})
		.catch((e) => {
			swal("Credentials doesn't match");
		});
});

// ? initialzing the side navbar
$('document').ready(function () {
	$('.buttons').sideNav();
});

const user = () => {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			console.log(user);
		} else {
			// No user is signed in.
			console.log('no user');
		}
	});
};

user();
