// ============================================================
// BLENDING BEATZ — register.js
// ============================================================

/* ------------------------------------------------------------
   CONFIG — paste your deployed Google Apps Script Web App URL here.
   See /apps-script/README.md for deployment instructions.
   ------------------------------------------------------------ */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCvGH24pWBoxWTmUNcUVTW-rPMul6Tt5vPnHIgT_TsNJkDRcFtWMo_dPUYZLOvB20fCg/exec";

const MEMBER_COUNT = 20;

/* ---------- Nav scroll state (shared behaviour with main.js) ---------- */
const nav = document.getElementById('siteNav');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
}

/* ---------- Generate 20 member cards ---------- */
const membersContainer = document.getElementById('membersContainer');
for (let i = 1; i <= MEMBER_COUNT; i++) {
  const card = document.createElement('div');
  card.className = 'member-card';
  card.innerHTML = `
    <div class="member-card-head">
      <div class="member-num">${i}</div>
      <h4>Member ${i}</h4>
    </div>
    <div class="member-fields">
      <div class="field">
        <label>Full Name <span class="req">*</span></label>
        <input type="text" name="member${i}_name" required placeholder="Full name">
      </div>
      <div class="field">
        <label>Instrument <span class="req">*</span></label>
        <input type="text" name="member${i}_instrument" required placeholder="e.g. Trumpet">
      </div>
      <div class="field">
        <label>Grade</label>
        <input type="text" name="member${i}_grade" placeholder="e.g. Grade 10">
      </div>
      <div class="field">
        <label>Contact No.</label>
        <input type="tel" name="member${i}_contact" placeholder="Optional">
      </div>
    </div>
  `;
  membersContainer.appendChild(card);
}

/* ---------- Photo upload handling ---------- */
let captainPhotoData = null; // { base64, mimeType, filename }
let groupPhotoData = null;

function setupPhotoUpload(uploadId, inputId, previewId, statusId, onLoaded) {
  const upload = document.getElementById(uploadId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const status = document.getElementById(statusId);

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Please choose an image under 8MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result; // "data:image/jpeg;base64,...."
      const base64 = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/jpeg';

      preview.innerHTML = `<img src="${dataUrl}" alt="Preview">`;
      upload.classList.add('filled');
      status.textContent = 'Uploaded';

      onLoaded({ base64, mimeType, filename: file.name });
      updateProgress();
      checkSubmitEnabled();
    };
    reader.readAsDataURL(file);
  });
}

setupPhotoUpload('captainUpload', 'captainPhotoInput', 'captainPreview', 'captainStatus', (data) => { captainPhotoData = data; });
setupPhotoUpload('groupUpload', 'groupPhotoInput', 'groupPreview', 'groupStatus', (data) => { groupPhotoData = data; });

/* ---------- Progress bar ---------- */
const form = document.getElementById('regForm');
const progressFill = document.getElementById('progressFill');
const progressPct = document.getElementById('progressPct');

function updateProgress() {
  const requiredFields = Array.from(form.querySelectorAll('[required]'));
  let filled = 0;
  requiredFields.forEach(f => {
    if (f.type === 'checkbox') { if (f.checked) filled++; }
    else if (f.value && f.value.trim() !== '') filled++;
  });
  // photos count as two extra required items
  const totalPhotos = 2;
  let photosFilled = (captainPhotoData ? 1 : 0) + (groupPhotoData ? 1 : 0);

  const total = requiredFields.length + totalPhotos;
  const done = filled + photosFilled;
  const pct = Math.min(100, Math.round((done / total) * 100));

  progressFill.style.width = pct + '%';
  progressPct.textContent = pct + '%';
}

form.addEventListener('input', updateProgress);
form.addEventListener('change', updateProgress);
updateProgress();

/* ---------- Enable submit only once both required photos are uploaded ---------- */
const submitBtn = document.getElementById('submitBtn');
const submitNote = document.getElementById('submitNote');

function checkSubmitEnabled() {
  const ready = !!captainPhotoData && !!groupPhotoData;
  submitBtn.disabled = !ready;
  submitNote.textContent = ready
    ? 'Photos uploaded — review your details and submit'
    : 'Upload both photos to enable submission';
}
checkSubmitEnabled();

/* ---------- Submit ---------- */
const formError = document.getElementById('formError');
const regSuccess = document.getElementById('regSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.classList.remove('show');

  if (!form.checkValidity() || !captainPhotoData || !groupPhotoData) {
    formError.classList.add('show');
    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const fd = new FormData(form);
  const members = [];
  for (let i = 1; i <= MEMBER_COUNT; i++) {
    members.push({
      name: fd.get(`member${i}_name`) || '',
      instrument: fd.get(`member${i}_instrument`) || '',
      grade: fd.get(`member${i}_grade`) || '',
      contact: fd.get(`member${i}_contact`) || ''
    });
  }

  const payload = {
    schoolName: fd.get('schoolName'),
    bandName: fd.get('bandName'),
    captainName: fd.get('captainName'),
    captainRole: fd.get('captainRole'),
    captainPhone: fd.get('captainPhone'),
    captainEmail: fd.get('captainEmail'),
    members: members,
    captainPhoto: captainPhotoData,
    groupPhoto: groupPhotoData,
    submittedAt: new Date().toISOString()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  try {
    if (SCRIPT_URL.includes('PASTE_YOUR_APPS_SCRIPT')) {
      throw new Error('Backend not configured yet. See /apps-script/README.md.');
    }

    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' } // avoids CORS preflight on Apps Script
    });
    const result = await res.json();

    if (!result.success) throw new Error(result.message || 'Submission failed.');

    form.style.display = 'none';
    document.querySelector('.progress-shell').style.display = 'none';
    regSuccess.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    formError.textContent = err.message || 'Something went wrong. Please try again.';
    formError.classList.add('show');
    formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Registration';
  }
});
