
const enableBtnSubmitChart = () => {
	$('.tooltip-btn-chart').tooltip({
		title: 'You must select Country-Rounds of data, an indicator, an option to break the data down, and a chart type in order to generate a chart.'
	});
}
const disableBtnSubmitChart = () => {
	$('.tooltip-btn-chart').tooltip('destroy');
}
const enablePieChart = () => {
	$('.tooltip-pie-chart').tooltip({
		title: 'Pie charts are available to graph indicators that present data on various parts or portions that make up a whole. For example, method mix, which shows the portion of contraceptive users by each method type, may be graphed with a pie chart.'
	});
}
const enableOverTime = () => {
	$('.overtime-wrapper').tooltip({
		title: 'To chart data overtime, select multiple rounds of data from the same country.'
	});
}
const initialize = () => {
	enablePieChart();
	enableBtnSubmitChart();
	enableOverTime();
};
const tooltips = {
	initialize,
	disableBtnSubmitChart,
	enableBtnSubmitChart,
};

export default tooltips;