const API_URL = 'http://localhost:3000/tasks';

const form = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescriptionInput = document.getElementById('task-description');
const taskStatusSelect = document.getElementById('task-status');
const submitButton = document.getElementById('submit-button');
const cancelEditButton = document.getElementById('cancel-edit');
const taskFormTitle = document.getElementById('form-title');
const statusPill = document.querySelector('.status-pill');
const tasksContainer = document.getElementById('tasks-container');
const totalCount = document.getElementById('total-count');
const pendingCount = document.getElementById('pending-count');
const doneCount = document.getElementById('done-count');
const taskCardTemplate = document.getElementById('task-card-template');

let editingTaskId = null;

const setConnectionStatus = (isOnline) => {
  statusPill.textContent = isOnline ? 'Online' : 'Offline';
  statusPill.classList.toggle('online', isOnline);
  statusPill.classList.toggle('offline', !isOnline);
};

const formatDate = (value) => {
  if (!value) return 'Sem data';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const updateSummary = (tasks) => {
  totalCount.textContent = String(tasks.length);
  pendingCount.textContent = String(tasks.filter((task) => task.status === 'pendente').length);
  doneCount.textContent = String(tasks.filter((task) => task.status === 'concluída').length);
};

const renderEmptyState = () => {
  tasksContainer.innerHTML = `
    <div class="empty-state">
      <p>Nenhuma tarefa cadastrada ainda.<br />Adicione sua primeira tarefa no formulário.</p>
    </div>
  `;
};

const renderTasks = (tasks) => {
  if (!tasks || tasks.length === 0) {
    renderEmptyState();
    updateSummary([]);
    return;
  }

  tasksContainer.innerHTML = '';

  tasks.forEach((task) => {
    const fragment = taskCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.task-card');
    const title = fragment.querySelector('.task-title');
    const date = fragment.querySelector('.task-date');
    const status = fragment.querySelector('.task-status');
    const description = fragment.querySelector('.task-description');
    const editButton = fragment.querySelector('.edit-btn');
    const deleteButton = fragment.querySelector('.delete-btn');

    title.textContent = task.title;
    date.textContent = `Criada em ${formatDate(task.created_at)}`;
    status.textContent = task.status;
    status.classList.add(task.status);

    if (description) {
      const descriptionText = task.description && task.description.trim() ? task.description.trim() : 'Sem descrição';
      description.textContent = descriptionText;
    }

    editButton.addEventListener('click', () => startEdit(task));
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    card.dataset.id = task.id;
    tasksContainer.appendChild(fragment);
  });

  updateSummary(tasks);
};

const fetchTasks = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Erro ao buscar tarefas');
    }

    const tasks = await response.json();
    setConnectionStatus(true);
    renderTasks(tasks);
  } catch (error) {
    setConnectionStatus(false);
    tasksContainer.innerHTML = `
      <div class="empty-state">
        <p>Não foi possível carregar as tarefas.<br />Verifique a API do backend.</p>
      </div>
    `;
    console.error(error);
  }
};

const createTask = async (payload) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro ao criar tarefa' }));
    throw new Error(errorData.error || 'Erro ao criar tarefa');
  }

  return response.json();
};

const updateTask = async (id, payload) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro ao atualizar tarefa' }));
    throw new Error(errorData.error || 'Erro ao atualizar tarefa');
  }

  return response.json();
};

const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro ao excluir tarefa' }));
    throw new Error(errorData.error || 'Erro ao excluir tarefa');
  }

  fetchTasks();
};

const resetForm = () => {
  editingTaskId = null;
  form.reset();
  taskDescriptionInput.value = '';
  taskStatusSelect.value = 'pendente';
  submitButton.textContent = 'Salvar tarefa';
  taskFormTitle.textContent = 'Nova tarefa';
  cancelEditButton.classList.add('hidden');
};

const startEdit = (task) => {
  editingTaskId = task.id;
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description || '';
  taskStatusSelect.value = task.status;
  taskFormTitle.textContent = 'Editar tarefa';
  submitButton.textContent = 'Atualizar tarefa';
  cancelEditButton.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const status = taskStatusSelect.value;

  if (!title) {
    alert('O título da tarefa é obrigatório.');
    return;
  }

  const payload = { title, description, status };

  try {
    if (editingTaskId) {
      await updateTask(editingTaskId, payload);
    } else {
      await createTask(payload);
    }

    resetForm();
    await fetchTasks();
  } catch (error) {
    alert(error.message);
  }
});

cancelEditButton.addEventListener('click', resetForm);

setConnectionStatus(true);
fetchTasks();

setInterval(() => {
  fetchTasks();
}, 5000);
