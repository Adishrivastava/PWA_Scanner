//// general variables

const categoryColl = db.collection('category');
const entitiesColl = db.collection('entities');
const usersColl = db.collection('users');

// * updating scans
const updateScan = async (name) => {
	let promise = await entitiesColl
		.where('name', '==', name)
		.get()
		.then((snapshot) => {
			let flag = true;
			snapshot.docs.forEach((doc) => {
				flag = false;
				if (!doc.exists) {
					throw 'Document does not exist!';
				}

				var newScan = doc.data().scanned + 1;

				// * Current timing
				let c = new Date();

				curr =
					c.getFullYear() +
					'-' +
					c.getMonth() +
					'-' +
					c.getDate() +
					' ' +
					c.getHours() +
					':' +
					c.getMinutes();

				// * adding a scan value
				doc.ref
					.collection('scans')
					.add({ scanNo: newScan, timing: curr })
					.then((doc) => {
						swal('Scan Registered !');
					})
					.catch((e) => {
						console.log(e);
					});

				// * updating scanned value in entity
				doc.ref.update({ scanned: newScan });
			});

			if (flag) {
				swal('QR code is not registered!');
			}
		});
};

// * getting user
const user = async (name) => {
	console.log(name);
	return usersColl
		.where('name', '==', name)
		.get()
		.then(async (snapshot) => {
			return snapshot.docs;
		});
};

// * getting user categories
const userCategories = async (id) => {
	return usersColl
		.doc(id)
		.collection('categories')
		.get()
		.then((snapshot) => {
			return snapshot.docs;
		});
};

// * _______________getting categories __________
const getEntities = async (cat) => {
	return entitiesColl
		.where('category', '==', cat)
		.get()
		.then((snapshot) => {
			return snapshot;
		});
};

// * __________________________getting specific entity _________________
const getDetailsEnt = async (id) => {
	return entitiesColl.doc(id).get();
};
