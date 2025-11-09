const defaultData = {
  name: 'Byron Mathews',
  title: 'Software Development Student',
  email: 'matbyron101@gmail.com',
  phone: '+254 715062330' ,
  location: 'Nairobi, Kenya',
  summary: 'Focused software development student building practical web and application projects. Passionate about clean code, problem solving and continuous learning.',
  portfolio: '#',
  skills: ['HTML', 'CSS', 'JavaScript'],
  projects: [
    {
      title: 'Magical Kenya Travel Site',
      description: 'A travel agency demo site built with HTML/CSS/JS.'
    },
    {
      title: 'Electronic company website',
      description: 'Triumph Electronics full company website that showcase the company structure, what the company is about and the product they deal with using HTML/CSS/JS.'
    }
  ],
  onlineLinks: {
    github: 'https://github.com/your-username',
    linkedin: 'https://www.linkedin.com/in/your-name',
    instagram: 'https://www.instagram.com/your-handle'
  }
};

// Load and save data
function loadData() {
  const raw = localStorage.getItem('cvData');
  const data = raw ? JSON.parse(raw) : defaultData;
  // Ensure projects array exists
  if (!data.projects) {
    data.projects = [];
  }
  return data;
}
function saveData(data) {
  // Ensure projects array exists before saving
  if (!data.projects) {
    data.projects = [];
  }
  localStorage.setItem('cvData', JSON.stringify(data));
}

// Global editing state
let editing = false;

// Render data to page
function render() {
  const d = loadData();
  document.getElementById('fullName').textContent = d.name;
  document.getElementById('title').textContent = d.title;
  document.getElementById('email').textContent = d.email;
  document.getElementById('phone').textContent = d.phone;
  document.getElementById('location').textContent = d.location;
  document.getElementById('summary').textContent = d.summary;
  document.getElementById('portfolio').setAttribute('href', d.portfolio);

  const skillsWrap = document.getElementById('skillsList');
  skillsWrap.innerHTML = '';
  d.skills.forEach(s => {
    const el = document.createElement('span');
    el.className = 'skill';
    el.textContent = s;
    skillsWrap.appendChild(el);
  });

  // Render projects
  const projectsList = document.getElementById('projects');
  projectsList.innerHTML = '';
  if (d.projects && Array.isArray(d.projects)) {
    d.projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${project.title}</strong> — ${project.description}`;
      if (editing) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-project';
        deleteBtn.onclick = () => deleteProject(index);
        li.appendChild(deleteBtn);
      }
      projectsList.appendChild(li);
    });
  }

  // Toggle add project form visibility
  document.querySelector('.add-project').style.display = editing ? 'block' : 'none';

  const initials = d.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  document.getElementById('avatar').textContent = initials;
}

// Add new skill
document.getElementById('addSkillBtn').addEventListener('click', () => {
  const val = document.getElementById('newSkill').value.trim();
  if (!val) return;
  const d = loadData();
  if (!d.skills.includes(val)) d.skills.push(val);
  saveData(d);
  render();
  document.getElementById('newSkill').value = '';
});

document.getElementById('newSkill').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('addSkillBtn').click();
  }
});

// Edit toggle
const toggle = document.getElementById('toggleEdit');
toggle.addEventListener('click', () => {
  editing = !editing;
  toggle.textContent = editing ? 'Save' : 'Edit';

  // Toggle visibility of add project form
  const addProjectForm = document.querySelector('.add-project');
  if (addProjectForm) {
    addProjectForm.style.display = editing ? 'block' : 'none';
  }

  const fields = ['fullName', 'title', 'email', 'phone', 'location', 'summary'];
  fields.forEach(id => {
    document.getElementById(id).contentEditable = editing;
  });

  if (!editing) {
    const d = loadData();
    d.name = document.getElementById('fullName').textContent.trim();
    d.title = document.getElementById('title').textContent.trim();
    d.email = document.getElementById('email').textContent.trim();
    d.phone = document.getElementById('phone').textContent.trim();
    d.location = document.getElementById('location').textContent.trim();
    d.summary = document.getElementById('summary').textContent.trim();
    saveData(d);
    render();
  }
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset CV to default values?')) {
    localStorage.removeItem('cvData');
    render();
  }
});

// Double-click remove skill (in edit mode)
document.getElementById('skillsList').addEventListener('dblclick', e => {
  if (!editing) return;
  if (e.target.classList.contains('skill')) {
    const val = e.target.textContent;
    if (confirm(`Remove skill "${val}"?`)) {
      const d = loadData();
      d.skills = d.skills.filter(s => s !== val);
      saveData(d);
      render();
    }
  }
});

// Project management functions
function addProject() {
  const titleInput = document.getElementById('projectTitle');
  const descInput = document.getElementById('projectDescription');
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title || !description) return;

  const d = loadData();
  d.projects.push({ title, description });
  saveData(d);
  render();

  // Clear inputs
  titleInput.value = '';
  descInput.value = '';
}

function deleteProject(index) {
  if (confirm('Are you sure you want to delete this project?')) {
    const d = loadData();
    d.projects.splice(index, 1);
    saveData(d);
    render();
  }
}

// Add project button event listener
document.getElementById('addProjectBtn').addEventListener('click', addProject);

// Add project form keyboard support
document.getElementById('projectTitle').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    document.getElementById('projectDescription').focus();
  }
});

document.getElementById('projectDescription').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addProject();
  }
});

render();
