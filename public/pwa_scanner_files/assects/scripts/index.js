username = sessionStorage.getItem('username');
const spinner = document.getElementById('spinnerDiv');

// ! logout btn
document.getElementById('logout').addEventListener('click', (evt) => {
	sessionStorage.setItem('username', '');
	infoDiv.style.display = 'none';
	loginDiv.style.display = 'none';
	scaDiv.style.display = 'block';
});

// ? side nav
document.addEventListener('DOMnameUidLoaded', function () {
	// nav menu
	const menus = document.querySelectorAll('.side-menu');
	M.Sidenav.init(menus, { edge: 'left' });

	// add recipe form
	const forms = document.querySelectorAll('.side-form');
	M.Sidenav.init(forms, { edge: 'left' });
});

//// bottom bar js
const scaBtn = document.getElementById('scannerBtn');
const infoBtn = document.getElementById('infoBtn');

const scaDiv = document.getElementById('scanner-div');
const infoDiv = document.getElementById('info-div');
const loginDiv = document.getElementById('login-cont');

// ? displaying scanner div
scaBtn.addEventListener('click', (evt) => {
	infoDiv.style.display = 'none';
	loginDiv.style.display = 'none';
	scaDiv.style.display = 'block';
	scanner.start(cam[1]);
});

// ? displaying info div
infoBtn.addEventListener('click', (evt) => {
	// ! checking if user logged in
	if (
		sessionStorage.getItem('username') == '' ||
		sessionStorage.getItem('username') == null
	) {
		//window.location.href = 'user_login.html';
		scaDiv.style.display = 'none';
		infoDiv.style.display = 'none';
		loginDiv.style.display = 'block';
	} else {
		scaDiv.style.display = 'none';
		loginDiv.style.display = 'none';
		infoDiv.style.display = 'block';
		details();
		//	scanner.stop(); // todo delete stop
	}
});

// * logging in the user
const form = document.getElementById('login-form');
form.addEventListener('submit', async (evt) => {
	evt.preventDefault();

	username = form.usernameInput.value;
	password = form.passwordInput.value;

	let promise = await db
		.collection('users')
		.where('password', '==', password)
		.where('name', '==', username)
		.get()
		.then((snapshot) => {
			flag = true;
			snapshot.docs.forEach((doc) => {
				flag = false;
				sessionStorage.setItem('username', username);
				scaDiv.style.display = 'none';
				loginDiv.style.display = 'none';
				infoDiv.style.display = 'block';
				details();
			});
			if (flag) {
				swal('Sorry wrong username or password!');
			}
		})
		.catch((e) => {
			console.log(e);
		});
});
