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
      <div class="dialog-activity"><span>Actividad asignada</span><strong>${escapeHtml(p.activity)}</strong></div>
      <button class="btn btn-review dialog-review-btn" id="personReviewBtn" type="button">✎ Proponer un cambio para esta persona</button>`;
    document.getElementById('personReviewBtn').addEventListener('click', () => {
      if (dialog.open) dialog.close();
      openReviewPanel('Participantes', `${p.name} · ${p.group} · ${p.day} · ${p.time} · ${p.room} · ${p.activity}`);
    });
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

  const reviewForm = document.getElementById('reviewForm');
  const reviewAuthor = document.getElementById('reviewAuthor');
  const reviewSection = document.getElementById('reviewSection');
  const reviewType = document.getElementById('reviewType');
  const reviewCurrent = document.getElementById('reviewCurrent');
  const reviewProposal = document.getElementById('reviewProposal');
  const saveReview = document.getElementById('saveReview');
  const cancelReviewEdit = document.getElementById('cancelReviewEdit');
  const reviewFormStatus = document.getElementById('reviewFormStatus');
  const reviewCount = document.getElementById('reviewCount');
  const reviewEmpty = document.getElementById('reviewEmpty');
  const reviewItemsEl = document.getElementById('reviewItems');
  const reviewShareActions = document.getElementById('reviewShareActions');
  const reviewFabCount = document.getElementById('reviewFabCount');
  const reviewToast = document.getElementById('reviewToast');
  const REVIEW_STORAGE_KEY = 'modeloClinicoReviewV1';
  const REVIEW_AUTHOR_KEY = 'modeloClinicoReviewerV1';
  let editingReviewId = null;
  let toastTimer;
  let reviews = [];

  try {
    const savedReviews = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || '[]');
    reviews = Array.isArray(savedReviews) ? savedReviews : [];
    reviewAuthor.value = localStorage.getItem(REVIEW_AUTHOR_KEY) || '';
  } catch (_) {
    reviews = [];
  }

  function showReviewToast(message){
    reviewToast.textContent = message;
    reviewToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>reviewToast.classList.remove('show'), 2600);
  }

  function persistReviews(){
    try {
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
      localStorage.setItem(REVIEW_AUTHOR_KEY, reviewAuthor.value.trim());
    } catch (_) {
      reviewFormStatus.textContent = 'El navegador no permitió guardar automáticamente.';
    }
  }

  function formatReviewDate(value){
    try {
      return new Intl.DateTimeFormat('es-CL', {dateStyle:'medium', timeStyle:'short'}).format(new Date(value));
    } catch (_) {
      return '';
    }
  }

  function renderReviews(){
    const totalReviews = reviews.length;
    reviewCount.textContent = `${totalReviews} observación${totalReviews===1?'':'es'}`;
    reviewEmpty.hidden = totalReviews > 0;
    reviewShareActions.hidden = totalReviews === 0;
    reviewFabCount.hidden = totalReviews === 0;
    reviewFabCount.textContent = String(totalReviews);
    reviewItemsEl.innerHTML = reviews.map(item => `
      <article class="review-item">
        <div>
          <div class="review-item-tags">
            <span class="review-tag">${escapeHtml(item.section)}</span>
            <span class="review-tag type">${escapeHtml(item.type)}</span>
          </div>
          <h4>${item.current ? escapeHtml(item.current) : `Propuesta para ${escapeHtml(item.section)}`}</h4>
          <p class="review-item-proposal"><strong>Cambio propuesto:</strong> ${escapeHtml(item.proposal)}</p>
          <span class="review-item-meta">${item.author ? `${escapeHtml(item.author)} · ` : ''}${escapeHtml(formatReviewDate(item.updatedAt || item.createdAt))}</span>
        </div>
        <div class="review-item-buttons">
          <button type="button" data-action="edit" data-id="${escapeHtml(item.id)}">Editar</button>
          <button class="remove-review" type="button" data-action="remove" data-id="${escapeHtml(item.id)}">Quitar</button>
        </div>
      </article>`).join('');
  }

  function resetReviewForm(){
    editingReviewId = null;
    reviewForm.reset();
    try { reviewAuthor.value = localStorage.getItem(REVIEW_AUTHOR_KEY) || ''; } catch (_) {}
    reviewSection.value = 'Portada';
    reviewType.value = 'Contenido';
    saveReview.textContent = 'Agregar observación';
    cancelReviewEdit.hidden = true;
    reviewFormStatus.textContent = '';
  }

  function openReviewPanel(section, currentText=''){
    reviewSection.value = section;
    reviewCurrent.value = currentText;
    document.getElementById('revision').scrollIntoView({behavior:'smooth', block:'start'});
    setTimeout(()=>reviewProposal.focus(), 550);
  }

  function buildReviewSummary(){
    const author = reviewAuthor.value.trim() || reviews.find(item=>item.author)?.author || 'Sin nombre';
    const lines = [
      'REVISIÓN · DEMO MODELO CLÍNICO',
      `Revisor/a: ${author}`,
      `Fecha: ${new Intl.DateTimeFormat('es-CL', {dateStyle:'long', timeStyle:'short'}).format(new Date())}`,
      `Enlace revisado: ${window.location.href.split('#')[0]}`,
      '',
      `${reviews.length} CAMBIO${reviews.length===1?'':'S'} PROPUESTO${reviews.length===1?'':'S'}`,
      ''
    ];
    reviews.forEach((item,index)=>{
      lines.push(`${index+1}. ${item.section} · ${item.type}`);
      if(item.current) lines.push(`   Referencia: ${item.current}`);
      lines.push(`   Cambio propuesto: ${item.proposal}`);
      lines.push('');
    });
    lines.push('Estas observaciones fueron creadas desde el modo de revisión interactiva del demo.');
    return lines.join('\n');
  }

  async function copyReviewSummary(){
    const summary = buildReviewSummary();
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(summary);
    } else {
      const helper = document.createElement('textarea');
      helper.value = summary;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
  }

  reviewForm.addEventListener('submit', event=>{
    event.preventDefault();
    const proposal = reviewProposal.value.trim();
    if(!proposal){
      reviewFormStatus.textContent = 'Describe el cambio que propones.';
      reviewProposal.focus();
      return;
    }
    const now = new Date().toISOString();
    const draft = {
      id: editingReviewId || (window.crypto && typeof window.crypto.randomUUID==='function' ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      author: reviewAuthor.value.trim(),
      section: reviewSection.value,
      type: reviewType.value,
      current: reviewCurrent.value.trim(),
      proposal,
      createdAt: now,
      updatedAt: now
    };
    if(editingReviewId){
      const index = reviews.findIndex(item=>item.id===editingReviewId);
      if(index>=0) reviews[index] = {...reviews[index], ...draft, createdAt:reviews[index].createdAt};
      showReviewToast('Observación actualizada');
    } else {
      reviews.unshift(draft);
      showReviewToast('Observación agregada');
    }
    persistReviews();
    renderReviews();
    resetReviewForm();
  });

  reviewAuthor.addEventListener('input', persistReviews);
  cancelReviewEdit.addEventListener('click', resetReviewForm);
  document.querySelectorAll('[data-review-target]').forEach(button=>button.addEventListener('click',()=>openReviewPanel(button.dataset.reviewTarget)));

  reviewItemsEl.addEventListener('click', event=>{
    const button = event.target.closest('button[data-action]');
    if(!button) return;
    const item = reviews.find(review=>review.id===button.dataset.id);
    if(!item) return;
    if(button.dataset.action==='edit'){
      editingReviewId = item.id;
      reviewAuthor.value = item.author || reviewAuthor.value;
      reviewSection.value = item.section;
      reviewType.value = item.type;
      reviewCurrent.value = item.current;
      reviewProposal.value = item.proposal;
      saveReview.textContent = 'Guardar cambios';
      cancelReviewEdit.hidden = false;
      reviewFormStatus.textContent = '';
      reviewForm.scrollIntoView({behavior:'smooth', block:'center'});
      setTimeout(()=>reviewProposal.focus(), 450);
      return;
    }
    if(button.dataset.action==='remove' && window.confirm('¿Quitar esta observación?')){
      reviews = reviews.filter(review=>review.id!==item.id);
      persistReviews();
      renderReviews();
      if(editingReviewId===item.id) resetReviewForm();
      showReviewToast('Observación eliminada');
    }
  });

  document.getElementById('copyReviews').addEventListener('click', async()=>{
    try { await copyReviewSummary(); showReviewToast('Resumen copiado'); }
    catch (_) { showReviewToast('No se pudo copiar. Usa Descargar archivo.'); }
  });

  document.getElementById('downloadReviews').addEventListener('click', ()=>{
    const blob = new Blob([buildReviewSummary()], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `revision-modelo-clinico-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showReviewToast('Archivo de revisión descargado');
  });

  document.getElementById('shareReviews').addEventListener('click', async()=>{
    const summary = buildReviewSummary();
    if(navigator.share){
      try {
        await navigator.share({title:'Revisión del demo Modelo Clínico', text:summary});
        showReviewToast('Revisión compartida');
      } catch (error) {
        if(error && error.name!=='AbortError') showReviewToast('No se pudo compartir. Puedes copiar el resumen.');
      }
      return;
    }
    try { await copyReviewSummary(); showReviewToast('Resumen copiado para compartir'); }
    catch (_) { showReviewToast('Usa Descargar archivo para enviar la revisión.'); }
  });

  document.getElementById('clearReviews').addEventListener('click', ()=>{
    if(!window.confirm('¿Borrar todas las observaciones guardadas en este dispositivo?')) return;
    reviews = [];
    persistReviews();
    renderReviews();
    resetReviewForm();
    showReviewToast('Observaciones eliminadas');
  });

  renderReviews();

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
