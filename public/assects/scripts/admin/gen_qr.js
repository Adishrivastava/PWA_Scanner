// ? displaying the qr generator component
document.getElementById('generateQR').addEventListener('click', () => {
	document.querySelector('#c-a-c').style.display = 'none';
	document.querySelector('#add-entity').style.display = 'none';
	document.querySelector('#com-n-ent').style.display = 'none';
	document.querySelector('#usersSec').style.display = 'none';
	document.querySelector('#gen-qr').style.display = 'block';
});

// ? generating qr code ________________
const genForm = document.getElementById('gen-form');
const codeCont = document.getElementById('codeRow');

// var element = $('#codes-container'); // global variable
// var getCanvas; // global variable

genForm.addEventListener('submit', async (evt) => {
	evt.preventDefault();

	var wi = window.open('/codes.html?names=' + genForm['codeNames'].value);
});
