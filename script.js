const defaultData = {
  name: 'Byron Mathews',
  title: 'Software Development Student',
  email: 'matbyron101@gmail.com',
  phone: '+254 715062330' ,
  location: 'Nairobi, Kenya',
  summary: 'Focused software development student building practical web and application projects. Passionate about clean code, problem solving and continuous learning.',
  portfolio: '#',
skills: ['HTML', 'CSS', 'JavaScript'],
onlineLinks: {
  github: 'https://github.com/your-username',
  linkedin: 'https://www.linkedin.com/in/your-name',
  instagram: 'https://www.instagram.com/your-handle'
}

};

// Load and save data
function loadData() {
  const raw = localStorage.getItem('cvData');
  return raw ? JSON.parse(raw) : defaultData;
}
function saveData(data) {
  localStorage.setItem('cvData', JSON.stringify(data));
}

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
let editing = false;
toggle.addEventListener('click', () => {
  editing = !editing;
  toggle.textContent = editing ? 'Save' : 'Edit';

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

render();
