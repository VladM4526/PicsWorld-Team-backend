import HttpErrorMessages from '../../const/httpErrorMessages.js';

class HttpError extends Error {
	constructor(
		statusCode = 500,
		message = HttpErrorMessages[statusCode] || HttpErrorMessages.default
	) {
		super(message);
		this.statusCode = statusCode;
	}
}

export default HttpError;
