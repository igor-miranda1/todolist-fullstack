const allowedStatuses = ['pendente', 'em andamento', 'concluída'];

const validateFieldTitle = (request, response, next) => {
    const { title } = request.body;

    if (title === undefined) {
        return response.status(400).json({ error: 'The field "title" is required.' });
    }

    if (typeof title !== 'string' || title.trim() === '') {
        return response.status(400).json({ error: 'title cannot be empty.' });
    }

    next();
};

const validateFieldStatus = (request, response, next) => {
    const { status } = request.body;

    if (status === undefined) {
        return response.status(400).json({ error: 'The field "status" is required.' });
    }

    if (typeof status !== 'string' || status.trim() === '') {
        return response.status(400).json({ error: 'status cannot be empty.' });
    }

    const normalizedStatus = status.trim();

    if (!allowedStatuses.includes(normalizedStatus)) {
        return response.status(400).json({ error: 'Status invalid. Use: pendente, em andamento ou concluída.' });
    }

    request.body.status = normalizedStatus;
    next();
};

module.exports = {
    validateFieldTitle,
    validateFieldStatus,
}