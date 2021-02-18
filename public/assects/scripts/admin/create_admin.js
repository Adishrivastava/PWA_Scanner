// ? diplaying the container ____________________
document.getElementById('createAdmin').addEventListener('click', () => {
	document.querySelector('#gen-qr').style.display = 'none';
	document.querySelector('#add-entity').style.display = 'none';
	document.querySelector('#com-n-ent').style.display = 'none';
	document.querySelector('#usersSec').style.display = 'none';
	document.querySelector('#c-a-c').style.display = 'block';
});

// ? signing-up new admin ________________________
const signinForm = document.getElementById('login-form');

signinForm.addEventListener('submit', (evt) => {
	evt.preventDefault();

	//// displaying the spinner until selection loaded
	document.getElementById('spinnerDiv').style.display = 'flex';

	//// getting form info
	let email = signinForm.email.value;
	let password = signinForm.password.value;
	let cPassword = signinForm.cpassword.value;

	//// checking if password and confirm passwords match
	if (password != cPassword) {
		swal('passwords does not match!');
	} else {
		//// else creating new admin
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((cred) => {
				console.log(cred.user);
				//// displaying the spinner until selection loaded
				document.getElementById('spinnerDiv').style.display = 'none';

				swal('new admin created');
			})
			.catch((e) => {
				console.log(e);
				swal('sorry this mail is already taken!');
			});
	}
	//// displaying the spinner until selection loaded
	document.getElementById('spinnerDiv').style.display = 'none';
});
