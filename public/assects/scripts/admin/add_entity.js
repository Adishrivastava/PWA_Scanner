// ? displaying the add entity section
document.getElementById('addEntity').addEventListener('click', (evt) => {
	document.querySelector('#c-a-c').style.display = 'none';
	document.querySelector('#gen-qr').style.display = 'none';
	document.querySelector('#com-n-ent').style.display = 'none';
	document.querySelector('#usersSec').style.display = 'none';
	document.querySelector('#add-entity').style.display = 'block';
});

console.log('added');

// ? Checking if admin is logged in
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		//	swal('logged in');
		console.log(user);
	} else {
		window.location.href = 'login_admin.html';
	}
});

// ref to spinner div
const spinner = document.getElementById('spinnerDiv');

// ! ___________ form javascripts here ___________

// getting ref to all elements of geo input fields
const geo = document.getElementById('geoRes');
const geoInputs = document.getElementById('geo-inputs');
let lat = document.getElementById('lat');
let log = document.getElementById('log');

// function which changes the required property in geo field inputs
geo.addEventListener('change', (evt) => {
	//// displaying if geo restriction is enabled else dont
	if (geo.checked) {
		geoInputs.style.display = 'block';
		lat.setAttribute('required', '');
		lng.setAttribute('required', '');
		dist.setAttribute('required', '');
	} else {
		geoInputs.style.display = 'none';
		lat.removeAttribute('required');
		lng.removeAttribute('required');
		dist.removeAttribute('required');
	}
});

// getting current location
const currBtn = document.getElementById('currLoc');

currBtn.addEventListener('click', (evt) => {
	evt.preventDefault();

	//// lat and lng of current location
	navigator.geolocation.getCurrentPosition(function (position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		};

		//// adding them to input in form
		lat.value = pos.lat;
		lng.value = pos.lng;
	});
});

// ? ____________________ adding category ___________________________
const aEform = document.getElementById('add-e-form');

//* category addition form handler function
aEform.addEventListener('submit', async (evt) => {
	evt.preventDefault();

	// getting the values from form
	let category = aEform.category.value;
	let unit = aEform.unit.value;
	let delay = parseInt(aEform.delay.value);

	latVal = '';
	lngVal = '';

	// object of all data from form
	let data = {
		category: category,
		unit: unit,
		delay: delay,
		geo: false,
	};

	// getting coordinates if geo restricted
	// (geo is defined above)
	if (geo.checked) {
		latVal = parseFloat(aEform.lat.value);
		lngVal = parseFloat(aEform.lng.value);
		let maxDis = parseInt(aEform.dist.value);

		data.lat = latVal;
		data.lng = lngVal;
		data.maxDis = maxDis;
		data.geo = true;
	}

	//// calling addCategory function to add it
	let promise = await addCategory(data);

	aEform.reset();
});

// ? ____________________ adding entity ______________________
const sForm = document.getElementById('addForm2');

// * entity form handling
sForm.addEventListener('submit', async (evt) => {
	evt.preventDefault();

	let catSel = sForm.catSel.value;
	let entName = sForm.entName.value;
	console.log(catSel);
	console.log(entName);
	let data = {
		category: catSel,
		name: entName,
		scanned: 0,
	};

	let promise = await addEntity(data);
});

//?________________ adding entity through bulk csv file ______________

const bulkForm = document.getElementById('bulkForm'); // bulk form

//// csv file handler form
bulkForm.addEventListener('submit', async (evt) => {
	evt.preventDefault();

	let file = bulkForm.csv.files[0];

	// parsing the csv file
	Papa.parse(file, {
		header: true,
		dynamicTyping: true,
		before: () => {
			spinner.style.display = 'flex';
		},
		error: (e) => {
			console.log(e);
		},
		complete: (results) => {
			arrObj = results.data;

			let len = data.length;

			addBulkEntities(arrObj, len);
			spinner.style.display = 'none';
		},
	});
});

// ? _________________ other functions in this section ________________

// * adding autocomplete to adding entities form
const autocompleteInputs = async () => {
	let promise = await db
		.collection('categories')
		.get()
		.then(async (snapshot) => {
			let pro = await snapshot.docs.forEach(async (doc) => {
				// adding components to array
				console.log(doc.id);
				document.getElementById('catSel').innerHTML +=
					'	<option value="' +
					doc.data().category +
					'">' +
					doc.data().category +
					'</option>';
			});
		})
		.catch((e) => {
			console.log(e);
		});
};

// ? ________________________calling functions ____________________

autocompleteInputs();
