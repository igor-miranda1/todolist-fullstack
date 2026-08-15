const express = require('express');

const tasksController = require('./controllers/tasksControllers');
const tasksMiddleware = require('./middlewares/tasksMiddlewares');

const router = express.Router();

router.get('/tasks', tasksController.getAll);

router.post('/tasks', 
    tasksMiddleware.validateFieldTitle, 
    tasksMiddleware.validateFieldStatus, 
    tasksController.createTask);

router.delete('/tasks/:id', 
    tasksController.deleteTask);

router.put('/tasks/:id', 

    tasksMiddleware.validateFieldTitle, 
    tasksMiddleware.validateFieldStatus, 
    tasksController.updateTask);

module.exports = router;