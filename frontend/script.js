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

const normalizeStatus = (status) => (status === 'em andamento' ? 'pendente' : status || 'pendente');

const setStatusOptions = (isEditingMode) => {
  const options = Array.from(taskStatusSelect.options);

  options.forEach((option) => {
    const shouldShow = option.value !== 'em andamento' || isEditingMode;
    option.hidden = !shouldShow;
    option.disabled = !shouldShow;
  });

  if (!isEditingMode && !['pendente', 'concluída'].includes(taskStatusSelect.value)) {
    taskStatusSelect.value = 'pendente';
  }
};

const updateSummary = (tasks) => {
  const normalizedTasks = tasks.map((task) => ({ ...task, status: normalizeStatus(task.status) }));

  totalCount.textContent = String(normalizedTasks.length);
  pendingCount.textContent = String(normalizedTasks.filter((task) => task.status === 'pendente').length);
  doneCount.textContent = String(normalizedTasks.filter((task) => task.status === 'concluída').length);
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
    const normalizedTask = { ...task, status: normalizeStatus(task.status) };
    const fragment = taskCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.task-card');
    const title = fragment.querySelector('.task-title');
    const date = fragment.querySelector('.task-date');
    const status = fragment.querySelector('.task-status');
    const description = fragment.querySelector('.task-description');
    const toggleButton = fragment.querySelector('.toggle-status-btn');
    const editButton = fragment.querySelector('.edit-btn');
    const deleteButton = fragment.querySelector('.delete-btn');

    const isCompleted = normalizedTask.status === 'concluída';

    title.textContent = normalizedTask.title;
    date.textContent = `Criada em ${formatDate(normalizedTask.created_at)}`;
    status.textContent = normalizedTask.status;
    status.classList.add(normalizedTask.status);
    card.classList.toggle('completed', isCompleted);
    toggleButton.textContent = isCompleted ? 'Marcar como pendente' : 'Marcar como concluída';

    if (description) {
      const descriptionText = normalizedTask.description && normalizedTask.description.trim() ? normalizedTask.description.trim() : 'Sem descrição';
      description.textContent = descriptionText;
    }

    editButton.addEventListener('click', () => startEdit(normalizedTask));
    deleteButton.addEventListener('click', () => deleteTask(normalizedTask.id));
    toggleButton.addEventListener('click', () => toggleTaskStatus(normalizedTask));

    card.dataset.id = normalizedTask.id;
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
    const errorData = await response.text().catch(() => '');
    const parsed = errorData ? (() => { try { return JSON.parse(errorData); } catch { return { error: errorData }; } })() : { error: 'Erro ao atualizar tarefa' };
    throw new Error(parsed.error || 'Erro ao atualizar tarefa');
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return null;
};

const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.text().catch(() => '');
    const parsed = errorData ? (() => { try { return JSON.parse(errorData); } catch { return { error: errorData }; } })() : { error: 'Erro ao excluir tarefa' };
    throw new Error(parsed.error || 'Erro ao excluir tarefa');
  }

  fetchTasks();
};

const toggleTaskStatus = async (task) => {
  const currentStatus = normalizeStatus(task.status);
  const nextStatus = currentStatus === 'concluída' ? 'pendente' : 'concluída';

  try {
    await updateTask(task.id, {
      title: task.title,
      description: task.description || '',
      status: nextStatus,
    });

    await fetchTasks();
  } catch (error) {
    alert(error.message);
  }
};

const resetForm = () => {
  editingTaskId = null;
  form.reset();
  taskDescriptionInput.value = '';
  taskStatusSelect.value = 'pendente';
  setStatusOptions(false);
  submitButton.textContent = 'Salvar tarefa';
  taskFormTitle.textContent = 'Nova tarefa';
  cancelEditButton.classList.add('hidden');
};

const startEdit = (task) => {
  const normalizedTask = { ...task, status: normalizeStatus(task.status) };

  editingTaskId = normalizedTask.id;
  taskTitleInput.value = normalizedTask.title;
  taskDescriptionInput.value = normalizedTask.description || '';
  taskStatusSelect.value = normalizedTask.status;
  setStatusOptions(true);
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
setStatusOptions(false);
fetchTasks();

setInterval(() => {
  fetchTasks();
}, 5000);
