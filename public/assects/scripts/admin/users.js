// ? displaying the show entity section
document.getElementById('users').addEventListener('click', (evt) => {
	document.querySelector('#c-a-c').style.display = 'none';
	document.querySelector('#gen-qr').style.display = 'none';
	document.querySelector('#add-entity').style.display = 'none';
	document.querySelector('#com-n-ent').style.display = 'none';
	document.querySelector('#usersSec').style.display = 'block';
});

// ? ____________________user add form _____________________
const aUForm = document.getElementById('userAddForm');

aUForm.addEventListener('submit', async (evt) => {
	evt.preventDefault();

	spinner.style.display = 'flex';

	//// getting form values
	let name = aUForm.userNameInp.value;
	let email = aUForm.userEmailInp.value;
	let mobile = aUForm.userMobileInp.value;
	let password = aUForm.userPasswordInp.value;

	//// creating object
	let data = {
		name: name,
		email: email,
		mobile: mobile,
		password: password,
	};

	let promise = await addUser(data);

	spinner.style.display = 'none';
});

// ? __________________displaying users table _________________
const usersTableFunc = async () => {
	let snapshot = await getUsers();

	let promise = await snapshot.forEach((doc) => {
		$('#usersTable')
			.DataTable()
			.row.add([
				doc.data().name,
				doc.data().email,
				doc.data().mobile,
				doc.data().password,
				'<button class="btn waves-effect red darked-3" id="' +
					doc.id +
					'" onclick="delUser(this.id)">delete</button>',
				'<button class="btn waves-effect blue darked-3" id="' +
					doc.id +
					'" onclick="UserDetails(this.id)">Categories</button>',
			])
			.draw(false);
	});
};

// * ______________________ details functions in users _______________________
const hiddenId = document.getElementById('userId');
const UserDetails = async (id) => {
	spinner.style.display = 'flex';

	hiddenId.value = id;
	//// getting uer categories
	let snapshot = await userCategories(id);

	const userCatList = document.getElementById('categoriesList'); // ref to list
	userCatList.innerHTML = '';
	let categoryList = [];

	let promise = await snapshot.forEach((doc) => {
		console.log(doc.data().category);
		userCatList.innerHTML +=
			'	<li class="collection-item list-items"><span class="catNames">' +
			doc.data().category +
			'</span><button class="btn waves-effect" onclick="remUserCat(this.id)" id="' +
			doc.id +
			'">remove</button></li>';

		categoryList.push(doc.data().category);
	});

	//// checkbox for adding categories
	let snapshot2 = await getCategories();

	const userCatInp = document.getElementById('userCatAdd');
	userCatInp.innerHTML = '';
	let promise2 = await snapshot2.forEach((doc) => {
		let cat = doc.category;

		if (!categoryList.includes(cat)) {
			userCatInp.innerHTML +=
				'	<input type="checkbox" name="addCatInput" id="' +
				cat +
				'" value="' +
				cat +
				'"/><label for="' +
				cat +
				'">' +
				cat +
				'<label>';
		}
	});

	spinner.style.display = 'none';
	$('#modal2').modal('open');
};

// * ____________________ adding categories to user ______________________
const aUCat = document.getElementById('addUserCat');

aUCat.addEventListener('submit', async (evt) => {
	evt.preventDefault();

	let length = $('input[name="addCatInput"]:checked').length;
	let cats = aUCat.addCatInput;
	catsList = [];
	console.log(cats);
	if (length == 1) {
		catsList.push(cats.value);
	} else {
		// looping through all categories selected
		cats.forEach(async (category) => {
			catsList.push(category.value);
		});
	}

	const id = hiddenId.value;
	let p = await addCatUserFunc(id, catsList);
});

// * removing categories
const remUserCat = async (catId) => {
	let id = hiddenId.value;
	let promise = await remUserCatFunc(id, catId);
};

// ? ______________________starting functions ___________________
usersTableFunc();
