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
	console.log(queryArray);
}

const urlparse = {
  show,
  getQuery,
  parseQuery,
};

export default urlparse;