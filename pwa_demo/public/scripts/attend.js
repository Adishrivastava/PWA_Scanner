// ! for every page____________________

document.addEventListener('DOMContentLoaded', function () {
	// nav menu
	const menus = document.querySelectorAll('.side-menu');
	M.Sidenav.init(menus, { edge: 'right' });
	// add recipe form
	const forms = document.querySelectorAll('.side-form');
	M.Sidenav.init(forms, { edge: 'left' });
});

// ! for attendence page __________________

let d = new Date();
date = d.getDate();
month = d.getMonth();
year = d.getFullYear();

today = date + '-' + month + '-' + year;

//document.getElementById('date').innerHTML = today;

// todo bringing the attendence in  the attendence page
const displayNames = async () => {
	let promise = await db
		.collection('subjects')
		.doc('maths')
		.collection(today)
		.get()
		.then((snapshot) => {
			let i = 0;
			console.log('here');
			let ul = document.getElementById('names');
			snapshot.docs.forEach((doc) => {
				console.log('imin');
				i++;
				ul.innerHTML +=
					'<li class="collection-item">' +
					i +
					' . ' +
					doc.data().content +
					'</li>';
			});
		});

	let promise2 = db.collection('subjects').doc('maths').collection();
};

// ? calling initial functions ___
displayNames();
