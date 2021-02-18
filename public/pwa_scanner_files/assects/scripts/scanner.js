// ! for scanner page _____________________

var scanner = new Instascan.Scanner({
	video: document.getElementById('preview'),
	scanPeriod: 5,
	mirror: false,
});

geo = false; //// decalring geo

// ? getting current location
const locationFunc = async (lat2, lng2) => {
	// lat and lng of current location

	return navigator.geolocation.getCurrentPosition(async (position) => {
		pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		};
		// adding them to input in form
		let lat1 = pos.lat;
		let lng1 = pos.lng;

		// calling function to calculate distance btw coordinates

		return distanceFunc(lat1, lng1, lat2, lng2);
	});
};

//? calculating the distance btw coordinates
const distanceFunc = (lat1, lon1, lat2, lon2) => {
	if (lat1 == lat2 && lon1 == lon2) {
		console.log('came in distance 0');
		return 0;
	} else {
		console.log('came in distance');
		var radlat1 = (Math.PI * lat1) / 180;
		var radlat2 = (Math.PI * lat2) / 180;
		var theta = lon1 - lon2;
		var radtheta = (Math.PI * theta) / 180;
		var dist =
			Math.sin(radlat1) * Math.sin(radlat2) +
			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;

		dist = dist * 1.609344 * 1000;
		distance = dist;

		return dist;
	}
};

// ? ____________________ when scanner detects something _______________________

scanner.addListener('scan', async (name) => {
	spinner.style.display = 'flex'; // displaying the spinner for loading

	let promise = await db
		.collection('entities')
		.where('name', '==', name)
		.get()
		.then(async (snapshot) => {
			let p = await snapshot.docs.forEach(async (doc) => {
				let pro = await db
					.collection('categories')
					.where('category', '==', doc.data().category)
					.get()
					.then(async (snapshot2) => {
						let pro2 = await snapshot2.docs.forEach(async (docRef) => {
							if (docRef.data().geo) {
								navigator.geolocation.getCurrentPosition(
									async (position) => {
										pos = {
											lat: position.coords.latitude,
											lng: position.coords.longitude,
										};
										// adding them to input in form
										let lat1 = pos.lat;
										let lng1 = pos.lng;

										// calling function to calculate distance btw coordinates
										let pp = distanceFunc(
											lat1,
											lng1,
											docRef.data().lat,
											docRef.data().lng
										);
										// c = JSON.stringify(pp);
										// b = JSON.stringify(lat1);
										// a = JSON.stringify(lng1);
										// swal(a + ' ' + b + ' ' + c);
										if (pp <= docRef.data().maxDis) {
											let promise2 = await updateScan(name);
										} else {
											swal('Sorry You are outside the max radius!');
										}
									}
								);
							} else {
								swal('here2');
								let promise2 = await updateScan(name);
							}
						});
					});
			});
		});

	spinner.style.display = 'none'; // displaying the spinner for loading
});

//// defining the initial value of camera
camnum = 0;
cam = '';

// ? scanner function
const scannerFunc = async (e) => {
	//// displaying the spinner for loading
	document.getElementById('spinnerDiv').style.display = 'flex';
	let promise = await Instascan.Camera.getCameras()
		.then(function (cameras) {
			if (cameras.length > 0) {
				flags = true;
				cam = cameras;
				if (cameras.length > 1) {
					scanner.start(cameras[1]);
					camnum = 1;
				} else {
					scanner.start(cameras[camnum]);
				}

				// ? stopping the scanner
				$('#stopBtn').on('click', function () {
					stopSca();
				});

				// ? switching camera
				$('#switchCamera').on('click', (e) => {
					if (camnum == 1) {
						scanner.start(cameras[camnum]);
						camnum = 0;
						console.log(camnum);
					} else {
						scanner.start(cameras[camnum]);
						camnum = 1;
						console.log(camnum);
					}
				});

				// ? starting camera if stopped
				$('#startBtn').on('click', function () {
					scanner.start(cameras[camnum]);
				});
			} else {
				console.error('No cameras found.');
				swal('No cameras found.'); // todo
			}
		})
		.catch(function (e) {
			console.error(e);
			alert(e);
		});
	//// displaying the spinner for loading
	document.getElementById('spinnerDiv').style.display = 'none';
};

// ? ____________calling every function which initializes at start _____________
//details();
scannerFunc();
