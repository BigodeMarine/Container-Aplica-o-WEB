'use strict';
const KEY = 'apache-tasks-v1';
const list = document.querySelector('#tasks');
const error = document.querySelector('#error');
let tasks = [];
let filter = 'all';

function report(message) {
  error.textContent = message;
  error.hidden = false;
}
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
  if (!Array.isArray(saved)) throw new Error('Dados inválidos');
  tasks = saved.filter(task => task && typeof task.id === 'string' &&
    typeof task.title === 'string' && typeof task.done === 'boolean');
} catch {
  report('Não foi possível carregar os dados salvos. Você pode continuar usando a lista.');
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    report('Não foi possível salvar no navegador. As alterações durarão apenas nesta página.');
  }
}
function render() {
  list.replaceChildren();
  const visible = tasks.filter(task => filter === 'all' ||
    (filter === 'done' ? task.done : !task.done));
  for (const task of visible) {
    const row = document.createElement('li');
    row.classList.toggle('done', task.done);
    const label = document.createElement('label');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = task.done;
    check.addEventListener('change', () => {
      task.done = check.checked;
      save();
      render();
    });
    const title = document.createElement('span');
    title.textContent = task.title;
    label.append(check, title);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = 'Excluir';
    remove.setAttribute('aria-label', 'Excluir tarefa: ' + task.title);
    remove.addEventListener('click', () => {
      tasks = tasks.filter(item => item.id !== task.id);
      save();
      render();
    });
    row.append(label, remove);
    list.append(row);
  }
  document.querySelector('#empty').hidden = visible.length > 0;
  const pending = tasks.filter(task => !task.done).length;
  document.querySelector('#summary').textContent =
    tasks.length + ' tarefa(s) · ' + pending + ' pendente(s)';
}
document.querySelector('#form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#title');
  const title = input.value.trim();
  if (!title) {
    input.setCustomValidity('Digite uma tarefa.');
    input.reportValidity();
    return;
  }
  tasks.push({id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    title, done: false});
  save();
  render();
  input.value = '';
  input.focus();
});
document.querySelector('#title').addEventListener('input', event =>
  event.target.setCustomValidity(''));
document.querySelectorAll('[data-filter]').forEach(button =>
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item =>
      item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));
render();
