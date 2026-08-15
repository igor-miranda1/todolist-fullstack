const validateFieldTitle = (request, response, next) => {
    const { title } = request.body;

    if (title === undefined) {
        return response.status(400).json({ error: 'The field "title" is required.' });
    }

      if (title === '') {
        return response.status(400).json({ error: 'title cannot be empty.' });
    }

    next() ;
};

const validateFieldStatus = (request, response, next) => {
    const { status } = request.body;

    if (status === undefined) {
        return response.status(400).json({ error: 'The field "status" is required.' });
    }

      if (status === '') {
        return response.status(400).json({ error: 'status cannot be empty.' });
    }

    next() ;
};

module.exports = {
    validateFieldTitle,
    validateFieldStatus,
}