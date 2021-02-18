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
				window.location.href = 'index.html';
			});
			if (flag) {
				swal('Sorry wrong username or password!');
			}
		})
		.catch((e) => {
			console.log(e);
		});
});
