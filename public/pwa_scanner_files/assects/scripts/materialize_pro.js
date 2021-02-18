// * starting selection for materialize css
$('select').material_select();
// ? for starting the materialize modal
(function ($) {
	$(function () {
		//initialize all modals
		$('.modal').modal();

		// //or by click on trigger
	});
})(jQuery); //

// ? datatables
$(document).ready(function () {
	$('.modal1').modal();

	$('select').material_select();
	$('#comTable').DataTable({
		columnDefs: [
			{
				targets: [0, 1, 2],
				className: 'mdl-data-table__cell--non-numeric',
			},
		],
	});
});
