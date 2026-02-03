let classrooms = JSON.parse(localStorage.getItem('examSeatPlannerClassrooms')) || [];

// NAVIGATION
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.content-section');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.section).classList.add('active');

        if (btn.dataset.section === 'view-classrooms') {
            renderClassrooms();
        }
    });
});

// ADD CLASSROOM
document.getElementById('classroom-form').addEventListener('submit', e => {
    e.preventDefault();

    const roomId = roomIdInput.value.trim();
    const capacity = +capacityInput.value;
    const floorNo = +floorNoInput.value;
    const nearWashroom = nearWashroomInput.checked;

    if (classrooms.some(r => r.roomId === roomId)) {
        alert("Room already exists");
        return;
    }

    classrooms.push({ roomId, capacity, floorNo, nearWashroom });
    localStorage.setItem('examSeatPlannerClassrooms', JSON.stringify(classrooms));

    e.target.reset();
});

// VIEW CLASSROOMS
const roomIdInput = document.getElementById('roomId');
const capacityInput = document.getElementById('capacity');
const floorNoInput = document.getElementById('floorNo');
const nearWashroomInput = document.getElementById('nearWashroom');
const tbody = document.getElementById('classrooms-tbody');
const empty = document.getElementById('empty-classrooms');
const table = document.getElementById('classrooms-table');

function renderClassrooms() {
    if (!classrooms.length) {
        empty.style.display = 'block';
        table.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    table.style.display = 'block';
    tbody.innerHTML = '';

    classrooms.forEach(r => {
        tbody.innerHTML += `
        <tr>
            <td>${r.roomId}</td>
            <td>${r.capacity}</td>
            <td><span class="floor-badge floor-${r.floorNo}">Floor ${r.floorNo}</span></td>
            <td><span class="${r.nearWashroom ? 'yes-badge' : 'no-badge'}">
                ${r.nearWashroom ? 'Yes' : 'No'}
            </span></td>
            <td><button onclick="deleteRoom('${r.roomId}')">Delete</button></td>
        </tr>`;
    });
}

window.deleteRoom = id => {
    classrooms = classrooms.filter(r => r.roomId !== id);
    localStorage.setItem('examSeatPlannerClassrooms', JSON.stringify(classrooms));
    renderClassrooms();
};

// ALLOCATION
document.getElementById('allocate-btn').addEventListener('click', () => {
    let students = +document.getElementById('totalStudents').value;
    let sorted = [...classrooms].sort((a,b)=>a.floorNo-b.floorNo || b.capacity-a.capacity);

    let remaining = students;
    let used = [];

    for (let r of sorted) {
        if (remaining <= 0) break;
        used.push(r);
        remaining -= r.capacity;
    }

    document.getElementById('allocation-output').innerHTML =
        remaining > 0
        ? "Not enough seats"
        : `Allocated ${used.length} rooms for ${students} students`;
});
