const errResponse = async(errors, res, message) => {
    try {
        if (!errors.isEmpty()) {
            const response = {};
            for (let i = 0; i < errors.array().length; i += 1) {
                response[errors.array()[i].param] = errors.array()[i].msg;
            }
            return { message, dataErr: response };
        }
        return null;
    } catch (e) {
        return res.status(400).send(e);
    }
}

module.exports = {
    errResponse
}