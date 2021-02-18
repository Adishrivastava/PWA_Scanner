var url = window.location.href;

var queryStart = url.indexOf('?') + 1,
	queryEnd = url.indexOf('#') + 1 || url.length + 1,
	query = url.slice(queryStart, queryEnd - 1),
	pairs = query.replace(/\+/g, ' ').split('&'),
	parms = {},
	i,
	n,
	v,
	nv;

for (i = 0; i < pairs.length; i++) {
	nv = pairs[i].split('=', 2);
	n = decodeURIComponent(nv[0]);
	v = decodeURIComponent(nv[1]);

	if (!parms.hasOwnProperty(n)) parms[n] = [];
	parms[n].push(nv.length === 2 ? v : null);
}

// ? generating qr code ________________

var element = $('#codes-container'); // global variable
var getCanvas; // global variable

//document.getElementById('view').addEventListener('click', async (evt) => {
const view = async () => {
	//evt.preventDefault();

	//// getting the names
	let names = parms.names[0];
	let namesArr = names.split(',');

	//// looping through all the names and adding qr code
	for (let i = 0; i < namesArr.length; i++) {
		id = 'code' + i;
		let a = await qrcoder(id, namesArr[i]);
	}

	//// generating the image of the codes
	let stop = await html2canvas(element, {
		onrendered: function (canvas) {
			getCanvas = canvas;
		},
	});
	imageData = getCanvas.toDataURL('image/png');
};

// ? template for qr codes
const qrcoder = async (id, text) => {
	let promise = await new QRCode(id, {
		text: text,
		width: 170,
		height: 170,
		colorDark: '#000000',
		colorLight: '#ffffff',
		correctLevel: QRCode.CorrectLevel.H,
	});
};

// ? downloading the image of codes
$('#downloadBtn').on('click', async function () {
	window.print();
});

view();
