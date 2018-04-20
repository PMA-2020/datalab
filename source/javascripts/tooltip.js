const initialize = () => {
	$('.tooltip-btn-chart').tooltip({
		title: 'You must select Country-Rounds of data, an indicator, an option to break the data down, and a chart type in order to generate a chart.'
	});
	$('.tooltip-btn-chart').mouseover(function() {
		if (!$('#submit-chart').is(':disabled')) {
			$('.tooltip-btn-chart').tooltip('hide');
		}
	});

	$('.tooltip-pie-chart').tooltip({
		title: 'Pie charts are available to graph indicators that present data on various parts or portions that make up a whole. For example, method mix, which shows the portion of contraceptive users by each method type, may be graphed with a pie chart.'
	});
};

const tooltips = {
	initialize,
};

export default tooltips;