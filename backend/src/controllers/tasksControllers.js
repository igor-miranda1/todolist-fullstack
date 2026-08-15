const tasksModel = require('../models/tasksModel');


const getAll = async (_request, response) => {

    const tasks = await tasksModel.getAll();

    return response.status(200).json(tasks);
};

const createTask = async (request, response) => {
    const createdTaks = await tasksModel.createTask(request.body);

    return response.status(201).json(createdTaks);

}

const deleteTask = async (request, response) => {
    const { id } = request.params;

    await tasksModel.deleteTask(id);
    return response.status(204).json("Task deleted successfully");
}

const updateTask = async (request, response) => {
    const { id } = request.params;
    const task = request.body;

    await tasksModel.updateTask(id, task);
    return response.status(204).json("Task updated successfully");
}


module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
};