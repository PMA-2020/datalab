const url = window.location.href;

const show = () => {
	alert(url);
}

const getQuery = () => {
	let pieces = url.split('?');
	if (pieces.length == 2)
		return pieces[1];
	else return false;
}

const parseQuery = () => {
	const queryString = getQuery();
	let queryArray = queryString.split('&');
	let parseResult = [];
	queryArray.forEach((query)=>{
		const _temp = query.split('=');
		parseResult[_temp[0]] = _temp[1];
	});
	return parseResult;
}

const urlparse = {
	show,
	getQuery,
	parseQuery,
};

export default urlparse;