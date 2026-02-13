const STORAGE_KEY = 'shop-cars-board-v1';

const carForm = document.getElementById('car-form');
const cancelEditButton = document.getElementById('cancel-edit');
const clearBoardButton = document.getElementById('clear-board');
const carList = document.getElementById('car-list');
const emptyState = document.getElementById('empty-state');
const cardTemplate = document.getElementById('car-card-template');

let cars = loadCars();
let editingId = null;

render();

carForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(carForm);
  const vehicle = formData.get('vehicle').toString().trim();
  const type = formData.get('type').toString();
  const location = formData.get('location').toString().trim();
  const driver = formData.get('driver').toString().trim();
  const energy = Number(formData.get('energy'));
  const notes = formData.get('notes').toString().trim();

  const record = {
    id: editingId ?? crypto.randomUUID(),
    vehicle,
    type,
    location,
    driver,
    energy,
    notes,
    updatedAt: new Date().toISOString(),
  };

  if (editingId) {
    cars = cars.map((car) => (car.id === editingId ? record : car));
  } else {
    cars.push(record);
  }

  persistCars();
  resetForm();
  render();
});

cancelEditButton.addEventListener('click', resetForm);

clearBoardButton.addEventListener('click', () => {
  if (!cars.length) {
    return;
  }

  const shouldClear = window.confirm('Clear all vehicle entries?');
  if (!shouldClear) {
    return;
  }

  cars = [];
  persistCars();
  resetForm();
  render();
});

function render() {
  carList.innerHTML = '';

  if (!cars.length) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  const sortedCars = [...cars].sort((a, b) => a.vehicle.localeCompare(b.vehicle));
  sortedCars.forEach((car) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.car-card');

    fragment.querySelector('.vehicle-name').textContent = car.vehicle;
    fragment.querySelector('.vehicle-type').textContent = car.type;
    fragment.querySelector('.vehicle-location').textContent = car.location;
    fragment.querySelector('.vehicle-driver').textContent = car.driver;
    fragment.querySelector('.vehicle-energy').textContent = String(car.energy);
    fragment.querySelector('.vehicle-notes').textContent = car.notes || '—';
    fragment.querySelector('.updated-at').textContent = `Last updated: ${formatDate(car.updatedAt)}`;

    fragment.querySelector('.edit-btn').addEventListener('click', () => {
      populateForEdit(car);
    });

    fragment.querySelector('.delete-btn').addEventListener('click', () => {
      cars = cars.filter((entry) => entry.id !== car.id);
      persistCars();
      if (editingId === car.id) {
        resetForm();
      }
      render();
    });

    card.dataset.id = car.id;
    carList.appendChild(fragment);
  });
}

function populateForEdit(car) {
  editingId = car.id;
  carForm.vehicle.value = car.vehicle;
  carForm.type.value = car.type;
  carForm.location.value = car.location;
  carForm.driver.value = car.driver;
  carForm.energy.value = car.energy;
  carForm.notes.value = car.notes;
  cancelEditButton.classList.remove('hidden');
  carForm.querySelector('button[type="submit"]').textContent = 'Update vehicle';
}

function resetForm() {
  editingId = null;
  carForm.reset();
  carForm.type.value = 'EV';
  cancelEditButton.classList.add('hidden');
  carForm.querySelector('button[type="submit"]').textContent = 'Save vehicle';
}

function persistCars() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
}

function loadCars() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (car) =>
        typeof car.id === 'string' &&
        typeof car.vehicle === 'string' &&
        typeof car.type === 'string' &&
        typeof car.location === 'string' &&
        typeof car.driver === 'string' &&
        Number.isFinite(car.energy)
    );
  } catch {
    return [];
  }
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
