// ? displaying the show entity section
document.getElementById('entities').addEventListener('click', (evt) => {
	document.querySelector('#c-a-c').style.display = 'none';
	document.querySelector('#gen-qr').style.display = 'none';
	document.querySelector('#add-entity').style.display = 'none';
	document.querySelector('#usersSec').style.display = 'none';
	document.querySelector('#com-n-ent').style.display = 'block';
});

//// displaying the spinner until selection loaded
document.getElementById('spinnerDiv').style.display = 'flex';

// ? ____________adding options to select________________
const selcate = document.getElementById('catSelect');

const selectionCat = async () => {
	spinner.style.display = 'flex';

	//// getting categories data from function
	let snapshot = await getCategories();

	// looping through docs
	let a = await snapshot.forEach((doc) => {
		selcate.innerHTML +=
			'<option value="' + doc.category + '">' + doc.category + '</option>';
	});
	$('select').material_select();

	spinner.style.display = 'none'; // displaying the spinner for loading
};

seletedCat = ''; // selected component

//// getting the value of selected components
document.getElementById('show').addEventListener('click', (evt) => {
	evt.preventDefault();

	selectedCat = selcate.value;

	//// calling display component function
	displayComDet();
});

// ? displaing the component details
const displayComDet = async () => {
	spinner.style.display = 'flex'; // showing the spinner

	$('#comTable').DataTable().clear().draw(false); // deleting all rows in the table

	document.getElementById('com-container').style.display = 'block';

	let sc = selectedCat;

	document.getElementById('component-name').innerHTML = sc; // setting the name of component
	document
		.getElementById('reset-com')
		.setAttribute('onclick', 'resetComponent(' + sc + ')');

	if (selectedCat != 'none') {
		//// getting category details
		let snapshot = await getDetailsCat('category', selectedCat);

		document.getElementById('unit-cat').innerHTML = snapshot[0].unit;
		document.getElementById('delay-cat').innerHTML = snapshot[0].delay;
		document.getElementById('geo-cat').innerHTML = snapshot[0].geo;

		// checking if geo is on
		if (snapshot[0].geo) {
			document.getElementById('lat-cat').innerHTML = snapshot[0].lat;
			document.getElementById('lng-cat').innerHTML = snapshot[0].lng;
			document.getElementById('maxDis-cat').innerHTML = snapshot[0].maxDis;
		}

		//// displaying all entities in this categories
		let snapshot2 = await getEntities(selectedCat);

		let p = await snapshot2.forEach((doc) => {
			$('#catTable')
				.DataTable()
				.row.add([
					doc.data().name,
					doc.data().scanned,
					'<button class="btn waves-effect red darked-3" id="' +
						doc.id +
						'" onclick="deleteEntity(this.id)">delete</button>',
					'<button class="btn waves-effect blue darked-3" id="' +
						doc.id +
						'" onclick="resetEntity(this.id)">reset</button>',
					'<button class="btn waves-effect blue darked-3" id="' +
						doc.data().name +
						'" onclick="genQr(this.id)">Generate QR</button>',
					'<button class="btn waves-effect black lighten-3 trigger-modal" id="' +
						doc.id +
						'" onclick="detailsEntity(this.id)">details</button>',
				])
				.draw(false);
		});
	}

	document.getElementById('spinnerDiv').style.display = 'none'; // hiding the spinner
};

// ? deleting and reseting functions here____________

// * deleting entity
const deleteEntity = async (doc) => {
	console.log('deleting entity');
	let p = await db.collection('entities').doc(doc).delete();
	displayComDet();
};

// * resetting entity
const resetEntity = async (doc) => {
	console.log('reseting entity');
	let p = await db
		.collection('entities')
		.doc(doc)
		.update({
			scanned: 0,
		})
		.then(async () => {
			let p = await db
				.collection('entities')
				.doc(doc)
				.collection('scans')
				.get()
				.then(async (snapshot2) => {
					let p = await snapshot2.docs.forEach((doc) => {
						doc.ref.delete().then(() => {});
					});
				});
			console.log('entity updated');
		})
		.catch((e) => {
			console.log(e);
		});
};

// * generating individual qr
const genQr = async (name) => {
	var wi = window.open('/codes.html?names=' + name);
};

// * resetting the component
const resetComponent = async (cat) => {
	let p = await db
		.collection('entities')
		.where('category', '==', cat)
		.get()
		.then(async (snapshot) => {
			let p = await snapshot.docs.forEach((doc) => {
				doc.ref.delete();
			});
			displayComDet();
			swal('category reset Reset');
		})
		.catch((e) => {
			console.log(e);
		});
};

//  ? displaying  the details of a entity _____________

// * displaying details of individual entity
const detailsEntity = async (doc) => {
	spinner.style.display = 'flex'; // displaying the spinner for loading

	//// getting name of entity
	let docRef = await getDetailsEnt(doc);
	document.getElementById('entity-name').innerHTML = docRef.data().name;

	spinner.style.display = 'none'; // displaying the spinner for loading

	document.getElementById('scansList').innerHTML = ''; // removing all previous results

	//// displaying the scans details
	document.getElementById('scansList').innerHTML =
		'<li class="collection-item flex blue lighten-2"><div class="c1">s.no.</div><div class="c2">timing</div><div class="c3">time interval</div></li>';

	pretiming = '';

	let pro = await docRef.ref
		.collection('scans')
		.orderBy('scanNo')
		.get()
		.then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				if (doc.data().scanNo == 1) {
					document.getElementById('scansList').innerHTML +=
						'<li class="collection-item flex lighten-2"><div class="c1">' +
						doc.data().scanNo +
						'</div><div class="c2">' +
						doc.data().timing +
						'</div><div class="c3">' +
						'-' +
						'</div></li>';
					pretiming = doc.data().timing; // updating previous time

					console.log(pretiming);
				} else {
					// getting time diff
					let diff = timediff(pretiming, doc.data().timing);

					//adding this scan
					document.getElementById('scansList').innerHTML +=
						'<li class="collection-item flex lighten-2"><div class="c1">' +
						doc.data().scanNo +
						'</div><div class="c2">' +
						doc.data().timing +
						'</div><div class="c3">' +
						diff +
						'</div></li>';
					pretiming = doc.data().timing; // updating previous time

					console.log(pretiming);
				}
			});
			$('#modal1').modal('open');
		});
};

// * calculating time
const timediff = (pre, after) => {
	pretime = new Date(pre);
	aftertime = new Date(after);

	p = pretime.getTime();
	a = aftertime.getTime();

	console.log(p);
	console.log(a);

	let diffInMilliSeconds = Math.abs(a - p) / 1000;

	// calculate days
	const days = Math.floor(diffInMilliSeconds / 86400);
	diffInMilliSeconds -= days * 86400;

	// calculate hours
	const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
	diffInMilliSeconds -= hours * 3600;

	// calculate minutes
	const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
	diffInMilliSeconds -= minutes * 60;

	let difference = '';
	if (days > 0) {
		difference += days === 1 ? `${days} day, ` : `${days} days, `;
	}

	difference += hours === 0 || hours === 1 ? `${hours} h, ` : `${hours} h, `;

	difference +=
		minutes === 0 || hours === 1 ? `${minutes} m ` : `${minutes} m `;
	console.log(difference);
	return difference;
};

// ? ________________ initial functions _________________

selectionCat();
