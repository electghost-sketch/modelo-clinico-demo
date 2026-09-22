(() => {
  const data = window.MODELO_DATA;
  if (!data) return;

  const statsGrid = document.getElementById('statsGrid');
  const total = data.stats.reduce((sum, item) => sum + item.value, 0);
  statsGrid.innerHTML = data.stats.map(item => `
    <article class="stat-card reveal" style="--accent:${item.accent}">
      <div class="n">${item.value}</div>
      <div class="label">${item.label}</div>
    </article>`).join('') + `
    <article class="stat-card total reveal">
      <div class="n">${total}</div>
      <div class="label">Total participantes</div>
    </article>`;

  const agendaTabs = document.getElementById('agendaTabs');
  const agendaPanel = document.getElementById('agendaPanel');
  let activeDay = 0;
  function renderAgenda(){
    agendaTabs.innerHTML = data.agenda.map((d,i)=>`
      <button class="agenda-tab ${i===activeDay?'active':''}" type="button" data-index="${i}" role="tab" aria-selected="${i===activeDay}">
        <strong>${d.day}</strong><span>${d.date}</span>
      </button>`).join('');
    const day = data.agenda[activeDay];
    agendaPanel.innerHTML = `
      <div class="agenda-panel-top">
        <div><p class="eyebrow">${day.date}</p><h3>${day.day}</h3></div>
        <div class="agenda-place">Lugar principal<br><strong>${day.place}</strong></div>
      </div>
      <div class="agenda-list">
        ${day.items.map(item=>`
          <div class="agenda-item">
            <time>${item.time}</time>
            <div><strong>${item.title}</strong><p>${item.detail}</p></div>
            <span class="agenda-badge">${item.badge}</span>
          </div>`).join('')}
      </div>`;
    agendaTabs.querySelectorAll('.agenda-tab').forEach(btn => btn.addEventListener('click', () => {
      activeDay = Number(btn.dataset.index); renderAgenda();
    }));
  }
  renderAgenda();

  const peopleGrid = document.getElementById('peopleGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const filterRow = document.getElementById('filterRow');
  const finderCount = document.getElementById('finderCount');
  const dialog = document.getElementById('personDialog');
  const dialogContent = document.getElementById('dialogContent');
  const categories = ['Todos', ...new Set(data.people.map(p=>p.category))];
  let selectedCategory = 'Todos';

  filterRow.innerHTML = categories.map((c,i)=>`<button type="button" class="filter-chip ${i===0?'active':''}" data-category="${c}">${c}</button>`).join('');
  filterRow.querySelectorAll('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{
    selectedCategory = btn.dataset.category;
    filterRow.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x===btn));
    renderPeople();
  }));

  const escapeHtml = str => String(str).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  function normalized(str){return str.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
  function showPerson(p){
    dialogContent.innerHTML = `
      <div class="dialog-kicker">${escapeHtml(p.category)}</div>
      <h3 class="dialog-title">${escapeHtml(p.name)}</h3>
      <div class="dialog-grid">
        <div class="dialog-info"><span>Grupo</span><strong>${escapeHtml(p.group)}</strong></div>
        <div class="dialog-info"><span>Día</span><strong>${escapeHtml(p.day)}</strong></div>
        <div class="dialog-info"><span>Horario</span><strong>${escapeHtml(p.time)}</strong></div>
        <div class="dialog-info"><span>Sala</span><strong>${escapeHtml(p.room)}</strong></div>
      </div>
      <div class="dialog-activity"><span>Actividad asignada</span><strong>${escapeHtml(p.activity)}</strong></div>`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }
  function renderPeople(){
    const q = normalized(searchInput.value.trim());
    const list = data.people.filter(p => (selectedCategory==='Todos' || p.category===selectedCategory) && (!q || normalized(p.name).includes(q)));
    finderCount.textContent = `${list.length} resultado${list.length===1?'':'s'} en esta demostración`;
    if(!list.length){
      peopleGrid.innerHTML = `<div class="empty-state"><strong>No encontramos coincidencias.</strong><br>Prueba con otro nombre o cambia el filtro.</div>`;
      return;
    }
    peopleGrid.innerHTML = list.map((p,i)=>`
      <button class="person-card" type="button" data-person="${data.people.indexOf(p)}">
        <div class="person-top"><h3>${escapeHtml(p.name)}</h3><span class="cat">${escapeHtml(p.category)}</span></div>
        <div class="person-meta">
          <div><span>Grupo</span><strong>${escapeHtml(p.group)}</strong></div>
          <div><span>Día</span><strong>${escapeHtml(p.day)}</strong></div>
          <div><span>Horario</span><strong>${escapeHtml(p.time)}</strong></div>
        </div>
      </button>`).join('');
    peopleGrid.querySelectorAll('.person-card').forEach(btn=>btn.addEventListener('click',()=>showPerson(data.people[Number(btn.dataset.person)])));
  }
  searchInput.addEventListener('input',renderPeople);
  clearSearch.addEventListener('click',()=>{searchInput.value='';searchInput.focus();renderPeople()});
  renderPeople();

  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  menuBtn.addEventListener('click',()=>{
    const open = mainNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded',String(open));
  });
  mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mainNav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
    }), {threshold:.08});
    reveals.forEach(el=>io.observe(el));
  } else {
    reveals.forEach(el=>el.classList.add('visible'));
  }
})();
