// ! for every page____________________

document.addEventListener('DOMContentLoaded', function () {
	// nav menu
	const menus = document.querySelectorAll('.side-menu');
	M.Sidenav.init(menus, { edge: 'right' });
	// add recipe form
	const forms = document.querySelectorAll('.side-form');
	M.Sidenav.init(forms, { edge: 'left' });
});

// ! for scanner page _____________________

var scanner = new Instascan.Scanner({
	video: document.getElementById('preview'),
	scanPeriod: 5,
	mirror: false,
});

// ? presentr date
let d = new Date();
date = d.getDate();
month = d.getMonth();
year = d.getFullYear();

let today = date + '-' + month + '-' + year;
console.log(today);
// ? when scanner detects something
scanner.addListener('scan', async (content) => {
	let promise = await db
		.collection('subjects')
		.doc('maths')
		.collection(today)
		.where('content', '==', content)
		.get()
		.then(async (snapshot) => {
			flag = false;
			snapshot.docs.forEach((doc) => {
				flag = true;
			});
			console.log(flag);
			if (flag) {
				swal('already counted your attendence this');
			} else {
				let p = await db
					.collection('subjects')
					.doc('maths')
					.collection(today)
					.add({ content })
					.then(() => {
						swal('attendence counted ' + content);
					})
					.catch((e) => {
						swal('Sorry try again!');
					});
			}
		})
		.catch(async (e) => {
			console.log(e);
			swal('sorry some error occured');
		});
});

// ? defining the initial value of camera
camnum = 0;

// ? scanner function
const scannerFunc = async (e) => {
	Instascan.Camera.getCameras()
		.then(function (cameras) {
			if (cameras.length > 0) {
				scanner.start(cameras[camnum]);
				console.log(cameras.length);
				// ? stopping the scanner
				$('#stopBtn').on('click', function () {
					scanner.stop();
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
				alert('No cameras found.');
			}
		})
		.catch(function (e) {
			console.error(e);
			alert(e);
		});
};

// ? ____________calling every function which initializes at start _____________

scannerFunc();
