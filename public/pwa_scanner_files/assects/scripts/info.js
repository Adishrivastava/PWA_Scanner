// ? getting the details of entity and displaying the details
const details = async () => {
	let snapshot = await user(username);

	snapshot.forEach(async (doc) => {
		let snapshot = await userCategories(doc.id);
		const catAll = document.getElementById('categoriesAll');

		let promise = await snapshot.forEach((doc) => {
			catAll.innerHTML +=
				'<option value="' +
				doc.data().category +
				'">' +
				doc.data().category +
				'</option>';
		});
		$('select').material_select();
	});
};

// * ___________________showing category function ________________________

const catAll = document.getElementById('categoriesAll');
const show = document.getElementById('show');

show.addEventListener('click', async (evt) => {
	evt.preventDefault();

	let promise = await catDetails(catAll.value);
	document.getElementById('com-n-ent').style.display = 'block';
});

// * ______________________ category details ______________________
const catDetails = async (cat) => {
	let p = await db
		.collection('categories')
		.where('category', '==', cat)
		.get()
		.then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				geo = doc.data().geo;
				unit = doc.data().unit;
				category = doc.data().category;
				delay = doc.data().delay;
				speDist = doc.data().maxDis;

				if (geo) {
					lat2 = doc.data().lat;
					lng2 = doc.data().lng;
				}

				document.getElementById('category').innerHTML = category;
				document.getElementById('unit').innerHTML = unit;
				document.getElementById('distance').innerHTML = speDist;
				document.getElementById('maxTime').innerHTML = delay;
				document.getElementById('geo').innerHTML = geo;
				document.getElementById('lat').innerHTML = lat2;
				document.getElementById('lng').innerHTML = lng2;
			});
		})
		.catch((e) => {
			console.log(e);
		});

	let snapshot2 = await getEntities(cat);

	let promise2 = await snapshot2.forEach((doc) => {
		$('#catTable')
			.DataTable()
			.row.add([
				doc.data().name,
				doc.data().scanned,

				'<button class="btn waves-effect black lighten-3 trigger-modal" id="' +
					doc.id +
					'" onclick="detailsEntity(this.id)">details</button>',
			])
			.draw(false);
	});

	document.getElementById('spinnerDiv').style.display = 'none'; // hiding the spinner
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
