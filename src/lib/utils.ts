export function failMessageURL(url: string, message: string) {
	return encodeURI(url + "?failmessage=" + message)
}


export function download(filename: string, text: string | number | boolean) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}