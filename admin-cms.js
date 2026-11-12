/* ==========================================================================
   DEAR HOWARD - 超級隱藏後台管理中心完整邏輯 (admin-cms.js)
   包含：6大分頁全文本編輯 / 動態增刪館藏・頻道・時間軸 / 點擊照片設定光點 / 自動壓縮 / GitHub同步
   ========================================================================== */

/********************************************************************
 * 1. 開啟隱藏後台觸發器（右上角連點 5 下 或 網址加上 ?admin=1）
 ********************************************************************/
let secretTapCount = 0;
let secretTapTimer = null;

document.getElementById('admin-secret-trigger').addEventListener('click', () => {
  secretTapCount++;
  clearTimeout(secretTapTimer);
  secretTapTimer = setTimeout(() => {
    secretTapCount = 0;
  }, 1800);

  if (secretTapCount >= 5) {
    secretTapCount = 0;
    openAdminModal();
  }
});

if (window.location.search.includes('admin=1') || window.location.search.includes('admin=true')) {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(openAdminModal, 650);
  });
}

// 後台 6 大分頁切換
document.querySelectorAll('.admin-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    const targetTab = document.getElementById(btn.dataset.tab);
    if (targetTab) targetTab.classList.add('active');
  });
});

document.getElementById('close-admin-btn').addEventListener('click', () => {
  document.getElementById('admin-modal').style.display = 'none';
});

function openAdminModal() {
  populateAdminFields();
  document.getElementById('admin-modal').style.display = 'flex';
}

/********************************************************************
 * 2. 將 CONFIG 資料載入至超級後台表單 (populateAdminFields)
 ********************************************************************/
function populateAdminFields() {
  const C = window.CONFIG;

  // 分頁 1：全局設定與混音參數
  setInputVal('cfg-passcode', C.passcode || '1119');
  setInputVal('cfg-totalKm', C.totalKm || 12680);
  setInputVal('cfg-stepKm', C.stepKm || 48);
  setInputVal('cfg-bgmVol', C.bgmVol ?? 0.45);
  setInputVal('cfg-duckVol', C.duckVol ?? 0.08);
  setInputVal('cfg-staticVol', C.staticVol ?? 0.22);
  setInputVal('cfg-bgmUrl', C.bgmUrl || '');

  // 分頁 2：開場動畫、第1章與跨章節轉場雙語字幕
  setInputVal('cfg-introSalutation', C.introSalutation || '');
  setInputVal('cfg-introZh', C.introZh || '');
  setInputVal('cfg-introEn', C.introEn || '');
  setInputVal('cfg-logoZh', C.logoZh || '');
  setInputVal('cfg-logoEn', C.logoEn || '');
  setInputVal('cfg-logoSub', C.logoSub || '');

  setInputVal('cfg-ch1Sub1Zh', C.ch1Sub1Zh || '');
  setInputVal('cfg-ch1Sub1En', C.ch1Sub1En || '');
  setInputVal('cfg-ch1Sub2Zh', C.ch1Sub2Zh || '');
  setInputVal('cfg-ch1Sub2En', C.ch1Sub2En || '');
  setInputVal('cfg-ch1Sub3Zh', C.ch1Sub3Zh || '');
  setInputVal('cfg-ch1Sub3En', C.ch1Sub3En || '');

  setInputVal('cfg-trans12Zh', C.trans12Zh || '');
  setInputVal('cfg-trans12En', C.trans12En || '');
  setInputVal('cfg-trans23Zh', C.trans23Zh || '');
  setInputVal('cfg-trans23En', C.trans23En || '');
  setInputVal('cfg-trans34Zh', C.trans34Zh || '');
  setInputVal('cfg-trans34En', C.trans34En || '');
  setInputVal('cfg-trans45Zh', C.trans45Zh || '');
  setInputVal('cfg-trans45En', C.trans45En || '');

  // 分頁 3、4、5、6 動態清單渲染
  renderAdminMuseumList();
  renderAdminRadioList();
  renderAdminPhoneList();
  renderAdminTimelineList();

  // 分頁 6：登機證、終極生日長信與 GitHub Token
  setInputVal('cfg-ticketTheme', C.ticketTheme || 'aggie');
  setInputVal('cfg-ticketPassenger', C.ticketPassenger || 'HOWARD');
  setInputVal('cfg-ticketGate', C.ticketGate || 'FLIGHT AI-1119 / GATE 19');
  setInputVal('cfg-ticketNote', C.ticketNote || '');
  setInputVal('cfg-bdayAudio', C.bdayAudio || '');
  setInputVal('cfg-finalLetter', C.finalLetter || '');

  setInputVal('gh-owner', localStorage.getItem('GH_OWNER') || '');
  setInputVal('gh-repo', localStorage.getItem('GH_REPO') || '');
  setInputVal('gh-branch', localStorage.getItem('GH_BRANCH') || 'main');
  setInputVal('gh-token', localStorage.getItem('GH_TOKEN') || '');
}

function setInputVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function getInputVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/********************************************************************
 * 3. 動態渲染與增刪：【第二章：午夜微型美術館】（支援直接點擊照片設定記憶光點！）
 ********************************************************************/
function renderAdminMuseumList() {
  const box = document.getElementById('admin-museum-list');
  if (!box) return;
  box.innerHTML = '';

  const list = window.CONFIG.museum || [];
  list.forEach((item, i) => {
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid rgba(246,211,101,0.3); border-radius:10px; padding:12px; margin-bottom:14px; background:#0d1424;';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <strong style="color:var(--gold); font-size:13.5px;">🖼️ 館藏畫作 #${i + 1}</strong>
        <button type="button" class="btn-admin btn-danger" style="padding:4px 10px; font-size:11.5px;" onclick="removeMuseumItem(${i})">🗑️ 刪除此畫作</button>
      </div>

      <div class="form-group">
        <label>STEP 1｜視訊破冰提問（點亮聚光燈前先問他的問題）</label>
        <input type="text" id="cfg-m-question-${i}" value="${escapeAttr(item.question)}" />
      </div>

      <div class="admin-grid-2">
        <div class="form-group">
          <label>畫作照片上傳（自動壓縮）＋ 點擊下方預覽圖可直接設定「✦ 記憶光點」位置</label>
          <input type="file" accept="image/*" onchange="handleListImageUpload(event, 'museum', ${i})" />
          <div style="position:relative; width:100%; max-width:260px; height:150px; margin-top:8px; border-radius:8px; overflow:hidden; border:1px solid var(--gold); cursor:crosshair;"
               onclick="setHotspotByClick(event, ${i})" title="點擊照片任意處設定記憶光點">
            <img id="preview-m-img-${i}" src="${escapeAttr(item.img)}" style="width:100%; height:100%; object-fit:cover; display:block;" />
            <div id="preview-m-dot-${i}" style="position:absolute; left:${item.hotspotX || 50}%; top:${item.hotspotY || 50}%; transform:translate(-50%,-50%); width:22px; height:22px; border-radius:50%; background:var(--gold); color:#000; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px #fff; pointer-events:none;">✦</div>
          </div>
        </div>

        <div>
          <div class="admin-grid-2">
            <div class="form-group">
              <label>記憶光點 X 座標 (%)</label>
              <input type="number" min="5" max="95" id="cfg-m-hx-${i}" value="${item.hotspotX ?? 50}" onchange="updateHotspotPreview(${i})" />
            </div>
            <div class="form-group">
              <label>記憶光點 Y 座標 (%)</label>
              <input type="number" min="5" max="95" id="cfg-m-hy-${i}" value="${item.hotspotY ?? 50}" onchange="updateHotspotPreview(${i})" />
            </div>
          </div>
          <div class="form-group">
            <label>STEP 2｜點擊記憶光點時彈出的驚喜小語</label>
            <input type="text" id="cfg-m-hnote-${i}" value="${escapeAttr(item.hotspotNote)}" />
          </div>
          <div class="form-group">
            <label>選配：館長導覽語音音檔 (網址或上傳 MP3/M4A)</label>
            <input type="text" id="cfg-m-audio-${i}" value="${escapeAttr(item.audio || '')}" />
            <input type="file" accept="audio/*" onchange="handleListAudioUpload(event, 'museum', ${i})" style="margin-top:4px;" />
          </div>
        </div>
      </div>

      <div class="admin-grid-2">
        <div class="form-group">
          <label>STEP 3｜黃銅銘牌標題</label>
          <input type="text" id="cfg-m-title-${i}" value="${escapeAttr(item.title)}" />
        </div>
        <div class="form-group">
          <label>STEP 3｜黃銅銘牌日期／英文副標</label>
          <input type="text" id="cfg-m-date-${i}" value="${escapeAttr(item.date)}" />
        </div>
      </div>

      <div class="form-group">
        <label>STEP 3｜黃銅典藏銘牌完整心裡話</label>
        <textarea id="cfg-m-desc-${i}">${item.desc || ''}</textarea>
      </div>
    `;
    box.appendChild(card);
  });
}

// 在後台直接點擊照片預覽圖，自動計算百分比座標並移動光點
window.setHotspotByClick = function(event, idx) {
  const rect = event.currentTarget.getBoundingClientRect();
  const xPct = Math.round(((event.clientX - rect.left) / rect.width) * 100);
  const yPct = Math.round(((event.clientY - rect.top) / rect.height) * 100);
  const clampedX = Math.max(5, Math.min(95, xPct));
  const clampedY = Math.max(5, Math.min(95, yPct));

  setInputVal(`cfg-m-hx-${idx}`, clampedX);
  setInputVal(`cfg-m-hy-${idx}`, clampedY);
  updateHotspotPreview(idx);
};

window.updateHotspotPreview = function(idx) {
  const dot = document.getElementById(`preview-m-dot-${idx}`);
  const x = getInputVal(`cfg-m-hx-${idx}`) || 50;
  const y = getInputVal(`cfg-m-hy-${idx}`) || 50;
  if (dot) {
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
  }
};

window.addMuseumItem = function() {
  collectAdminFieldsToConfig();
  const nextNum = (window.CONFIG.museum || []).length + 1;
  window.CONFIG.museum.push({
    question: `館長破冰提問 #0${nextNum}：猜猜看這幅畫背後藏著我們哪一段回憶？`,
    hotspotX: 50,
    hotspotY: 50,
    hotspotNote: "✦ 被你找到了！這是我最喜歡的一個小細節。",
    title: `典藏編號 #0${nextNum}｜專屬記憶`,
    date: `Collection #${nextNum}`,
    desc: "在這裡寫下你想對 Howard 說的典藏故事……",
    img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    audio: ""
  });
  renderAdminMuseumList();
};

window.removeMuseumItem = function(idx) {
  if ((window.CONFIG.museum || []).length <= 1) {
    alert('美術館至少需要保留 1 幅館藏畫作喔！');
    return;
  }
  collectAdminFieldsToConfig();
  window.CONFIG.museum.splice(idx, 1);
  renderAdminMuseumList();
};

/********************************************************************
 * 4. 動態渲染與增刪：【第三章：微光收音機頻道】（支援無限擴充頻道）
 ********************************************************************/
function renderAdminRadioList() {
  const box = document.getElementById('admin-radio-list');
  if (!box) return;
  box.innerHTML = '';

  const list = window.CONFIG.radio || [];
  list.forEach((ch, i) => {
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid rgba(246,211,101,0.3); border-radius:10px; padding:12px; margin-bottom:12px; background:#0d1424;';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <strong style="color:var(--gold); font-size:13.5px;">📻 收音機專屬頻道 #${i + 1}</strong>
        <button type="button" class="btn-admin btn-danger" style="padding:4px 10px; font-size:11.5px;" onclick="removeRadioChannel(${i})">🗑️ 刪除此頻道</button>
      </div>
      <div class="admin-grid-2">
        <div class="form-group">
          <label>目標頻率數字 (建議 88.5 ~ 107.5，小數點1位)</label>
          <input type="number" step="0.1" min="88.0" max="108.0" id="cfg-r-freq-${i}" value="${escapeAttr(ch.freq)}" />
        </div>
        <div class="form-group">
          <label>鎖定頻道時顯示的標題名稱</label>
          <input type="text" id="cfg-r-label-${i}" value="${escapeAttr(ch.label)}" />
        </div>
      </div>
      <div class="form-group">
        <label>頻道播放時的語音文字字幕</label>
        <textarea id="cfg-r-trans-${i}">${ch.transcript || ''}</textarea>
      </div>
      <div class="form-group">
        <label>預錄語音音檔 (可貼上音檔網址或直接選取手機/電腦錄音檔上傳)</label>
        <input type="text" id="cfg-r-audio-${i}" value="${escapeAttr(ch.audio || '')}" />
        <input type="file" accept="audio/*" onchange="handleListAudioUpload(event, 'radio', ${i})" style="margin-top:4px;" />
      </div>
    `;
    box.appendChild(card);
  });
}

window.addRadioChannel = function() {
  collectAdminFieldsToConfig();
  const nextIdx = (window.CONFIG.radio || []).length + 1;
  const randomFreq = (90 + nextIdx * 3.4).toFixed(1);
  window.CONFIG.radio.push({
    freq: String(Math.min(107.5, Number(randomFreq))),
    label: `第 ${nextIdx} 道頻率｜跨海秘密訊號`,
    transcript: "「這是一段新增的收音機秘密語音，請在後台修改你想對 Howard 說的話……」",
    audio: ""
  });
  renderAdminRadioList();
};

window.removeRadioChannel = function(idx) {
  if ((window.CONFIG.radio || []).length <= 1) {
    alert('收音機至少需要保留 1 組頻道喔！');
    return;
  }
  collectAdminFieldsToConfig();
  window.CONFIG.radio.splice(idx, 1);
  renderAdminRadioList();
};

/********************************************************************
 * 5. 動態渲染：【第四章：跨時空公共電話亭】（過去・現在・未來）
 ********************************************************************/
function renderAdminPhoneList() {
  const box = document.getElementById('admin-phone-list');
  if (!box) return;
  box.innerHTML = '';

  const phoneObj = window.CONFIG.phone || {};
  const eras = [
    { key: 'past', title: '🕰️ 第一顆按鍵：【過去 PAST】' },
    { key: 'present', title: '🌟 第二顆按鍵：【現在 PRESENT】' },
    { key: 'future', title: '🚀 第三顆按鍵：【未來 FUTURE】' }
  ];

  eras.forEach(e => {
    const data = phoneObj[e.key] || { label: e.key.toUpperCase(), number: '1119', transcript: '', audio: '' };
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid rgba(110,231,183,0.3); border-radius:10px; padding:12px; margin-bottom:12px; background:#0d1424;';
    card.innerHTML = `
      <strong style="color:#6ee7b7; font-size:13.5px; display:block; margin-bottom:8px;">${e.title}</strong>
      <div class="admin-grid-2">
        <div class="form-group">
          <label>按鍵顯示名稱</label>
          <input type="text" id="cfg-p-label-${e.key}" value="${escapeAttr(data.label)}" />
        </div>
        <div class="form-group">
          <label>模擬撥號音號碼 (例如 0101 / 1119 / 9999)</label>
          <input type="text" id="cfg-p-num-${e.key}" value="${escapeAttr(data.number || '1119')}" />
        </div>
      </div>
      <div class="form-group">
        <label>接通電話後顯示的通話文字字幕</label>
        <textarea id="cfg-p-trans-${e.key}">${data.transcript || ''}</textarea>
      </div>
      <div class="form-group">
        <label>此階段預錄電話語音音檔 (網址或上傳 MP3/M4A)</label>
        <input type="text" id="cfg-p-audio-${e.key}" value="${escapeAttr(data.audio || '')}" />
        <input type="file" accept="audio/*" onchange="handlePhoneAudioUpload(event, '${e.key}')" style="margin-top:4px;" />
      </div>
    `;
    box.appendChild(card);
  });
}

/********************************************************************
 * 6. 動態渲染與增刪：【第五章：蜿蜒星軌時間軸畫布】
 ********************************************************************/
function renderAdminTimelineList() {
  const box = document.getElementById('admin-timeline-list');
  if (!box) return;
  box.innerHTML = '';

  const list = window.CONFIG.timeline || [];
  list.forEach((node, i) => {
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid rgba(246,211,101,0.3); border-radius:10px; padding:12px; margin-bottom:12px; background:#0d1424;';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <strong style="color:var(--gold); font-size:13.5px;">✨ 星軌時間軸回憶節點 #${i + 1}</strong>
        <button type="button" class="btn-admin btn-danger" style="padding:4px 10px; font-size:11.5px;" onclick="removeTimelineNode(${i})">🗑️ 刪除此節點</button>
      </div>
      <div class="admin-grid-2">
        <div class="form-group">
          <label>拍立得底部日期／英文標記</label>
          <input type="text" id="cfg-t-date-${i}" value="${escapeAttr(node.date)}" />
        </div>
        <div class="form-group">
          <label>回憶短標題</label>
          <input type="text" id="cfg-t-title-${i}" value="${escapeAttr(node.title)}" />
        </div>
      </div>
      <div class="form-group">
        <label>照片旁浮現的溫柔短句（幾句話即可，營造時間流動敘事感）</label>
        <textarea id="cfg-t-quote-${i}">${node.quote || ''}</textarea>
      </div>
      <div class="form-group">
        <label>上傳此節點照片（內建自動壓縮）</label>
        <input type="file" accept="image/*" onchange="handleListImageUpload(event, 'timeline', ${i})" />
        <img id="preview-t-img-${i}" src="${escapeAttr(node.img)}" style="height:75px; border-radius:6px; margin-top:6px; border:1px solid rgba(255,255,255,0.2); display:block;" />
      </div>
    `;
    box.appendChild(card);
  });
}

window.addTimelineNode = function() {
  collectAdminFieldsToConfig();
  const nextNum = (window.CONFIG.timeline || []).length + 1;
  window.CONFIG.timeline.push({
    date: `MEMORY 0${nextNum} • STARLIGHT`,
    title: `第 ${nextNum} 段星光記憶`,
    quote: "在這裡寫下屬於這張照片的簡短幾句話……",
    img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
  });
  renderAdminTimelineList();
};

window.removeTimelineNode = function(idx) {
  if ((window.CONFIG.timeline || []).length <= 1) {
    alert('時間軸畫布至少需要保留 1 個回憶節點喔！');
    return;
  }
  collectAdminFieldsToConfig();
  window.CONFIG.timeline.splice(idx, 1);
  renderAdminTimelineList();
};

/********************************************************************
 * 7. 收集所有後台表單欄位回寫至 window.CONFIG
 ********************************************************************/
function collectAdminFieldsToConfig() {
  const C = window.CONFIG;

  C.passcode = getInputVal('cfg-passcode').trim() || '1119';
  C.totalKm = Number(getInputVal('cfg-totalKm')) || 12680;
  C.stepKm = Number(getInputVal('cfg-stepKm')) || 48;
  C.bgmVol = Number(getInputVal('cfg-bgmVol')) || 0.45;
  C.duckVol = Number(getInputVal('cfg-duckVol')) || 0.08;
  C.staticVol = Number(getInputVal('cfg-staticVol')) || 0.22;
  C.bgmUrl = getInputVal('cfg-bgmUrl').trim();

  C.introSalutation = getInputVal('cfg-introSalutation');
  C.introZh = getInputVal('cfg-introZh');
  C.introEn = getInputVal('cfg-introEn');
  C.logoZh = getInputVal('cfg-logoZh');
  C.logoEn = getInputVal('cfg-logoEn');
  C.logoSub = getInputVal('cfg-logoSub');

  C.ch1Sub1Zh = getInputVal('cfg-ch1Sub1Zh');
  C.ch1Sub1En = getInputVal('cfg-ch1Sub1En');
  C.ch1Sub2Zh = getInputVal('cfg-ch1Sub2Zh');
  C.ch1Sub2En = getInputVal('cfg-ch1Sub2En');
  C.ch1Sub3Zh = getInputVal('cfg-ch1Sub3Zh');
  C.ch1Sub3En = getInputVal('cfg-ch1Sub3En');

  C.trans12Zh = getInputVal('cfg-trans12Zh');
  C.trans12En = getInputVal('cfg-trans12En');
  C.trans23Zh = getInputVal('cfg-trans23Zh');
  C.trans23En = getInputVal('cfg-trans23En');
  C.trans34Zh = getInputVal('cfg-trans34Zh');
  C.trans34En = getInputVal('cfg-trans34En');
  C.trans45Zh = getInputVal('cfg-trans45Zh');
  C.trans45En = getInputVal('cfg-trans45En');

  // 收集美術館清單
  (C.museum || []).forEach((m, i) => {
    if (document.getElementById(`cfg-m-question-${i}`)) {
      m.question = getInputVal(`cfg-m-question-${i}`);
      m.hotspotX = Number(getInputVal(`cfg-m-hx-${i}`)) || 50;
      m.hotspotY = Number(getInputVal(`cfg-m-hy-${i}`)) || 50;
      m.hotspotNote = getInputVal(`cfg-m-hnote-${i}`);
      m.title = getInputVal(`cfg-m-title-${i}`);
      m.date = getInputVal(`cfg-m-date-${i}`);
      m.desc = getInputVal(`cfg-m-desc-${i}`);
      m.audio = getInputVal(`cfg-m-audio-${i}`);
    }
  });

  // 收集收音機頻道清單
  (C.radio || []).forEach((r, i) => {
    if (document.getElementById(`cfg-r-freq-${i}`)) {
      r.freq = getInputVal(`cfg-r-freq-${i}`);
      r.label = getInputVal(`cfg-r-label-${i}`);
      r.transcript = getInputVal(`cfg-r-trans-${i}`);
      r.audio = getInputVal(`cfg-r-audio-${i}`);
    }
  });

  // 收集公共電話過去、現在、未來
  if (!C.phone) C.phone = {};
  ['past', 'present', 'future'].forEach(key => {
    if (document.getElementById(`cfg-p-label-${key}`)) {
      C.phone[key] = {
        label: getInputVal(`cfg-p-label-${key}`),
        number: getInputVal(`cfg-p-num-${key}`),
        transcript: getInputVal(`cfg-p-trans-${key}`),
        audio: getInputVal(`cfg-p-audio-${key}`)
      };
    }
  });

  // 收集星軌時間軸清單
  (C.timeline || []).forEach((t, i) => {
    if (document.getElementById(`cfg-t-date-${i}`)) {
      t.date = getInputVal(`cfg-t-date-${i}`);
      t.title = getInputVal(`cfg-t-title-${i}`);
      t.quote = getInputVal(`cfg-t-quote-${i}`);
    }
  });

  // 登機證與最終長信
  C.ticketTheme = getInputVal('cfg-ticketTheme') || 'aggie';
  C.ticketPassenger = getInputVal('cfg-ticketPassenger') || 'HOWARD';
  C.ticketGate = getInputVal('cfg-ticketGate') || 'FLIGHT AI-1119 / GATE 19';
  C.ticketNote = getInputVal('cfg-ticketNote');
  C.bdayAudio = getInputVal('cfg-bdayAudio');
  C.finalLetter = getInputVal('cfg-finalLetter');
}

/********************************************************************
 * 8. 照片自動壓縮瘦身器 (Canvas Auto-Compressor) 與音檔上傳處理
 ********************************************************************/
function compressImageFile(file, callback) {
  const origKB = Math.round(file.size / 1024);
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1100;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round(h * (maxDim / w));
          w = maxDim;
        } else {
          w = Math.round(w * (maxDim / h));
          h = maxDim;
        }
      }
      const cvs = document.createElement('canvas');
      cvs.width = w;
      cvs.height = h;
      const ctx = cvs.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = cvs.toDataURL('image/jpeg', 0.82);
      const newKB = Math.round((dataUrl.length * 3) / 4 / 1024);
      const statusEl = document.getElementById('compress-status');
      if (statusEl) {
        statusEl.textContent = `✅ 照片自動壓縮成功！原圖 ${origKB} KB ➔ 瘦身後 ${newKB} KB`;
      }
      callback(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 單一欄位照片上傳 (ch1PhotoTw, ch1PhotoUs, ticketPhoto)
window.handleImageUpload = function(event, targetKey) {
  const file = event.target.files[0];
  if (!file) return;
  compressImageFile(file, dataUrl => {
    window.CONFIG[targetKey] = dataUrl;
  });
};

// 動態陣列照片上傳 (museum[i].img, timeline[i].img)
window.handleListImageUpload = function(event, listName, idx) {
  const file = event.target.files[0];
  if (!file) return;
  compressImageFile(file, dataUrl => {
    if (window.CONFIG[listName] && window.CONFIG[listName][idx]) {
      window.CONFIG[listName][idx].img = dataUrl;
      const previewId = listName === 'museum' ? `preview-m-img-${idx}` : `preview-t-img-${idx}`;
      const pImg = document.getElementById(previewId);
      if (pImg) pImg.src = dataUrl;
    }
  });
};

// 音檔上傳處理
window.handleAudioUpload = function(event, targetKey) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    setInputVal(`cfg-${targetKey}`, e.target.result);
    const statusEl = document.getElementById('compress-status');
    if (statusEl) statusEl.textContent = `✅ 音檔「${file.name}」已載入！請點擊下方儲存或同步。`;
  };
  reader.readAsDataURL(file);
};

window.handleListAudioUpload = function(event, listName, idx) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const inputId = listName === 'museum' ? `cfg-m-audio-${idx}` : `cfg-r-audio-${idx}`;
    setInputVal(inputId, e.target.result);
    const statusEl = document.getElementById('compress-status');
    if (statusEl) statusEl.textContent = `✅ 音檔「${file.name}」已載入至 #${idx + 1}！`;
  };
  reader.readAsDataURL(file);
};

window.handlePhoneAudioUpload = function(event, eraKey) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    setInputVal(`cfg-p-audio-${eraKey}`, e.target.result);
    const statusEl = document.getElementById('compress-status');
    if (statusEl) statusEl.textContent = `✅ 電話語音「${file.name}」已載入！`;
  };
  reader.readAsDataURL(file);
};

/********************************************************************
 * 9. 本機儲存、下載備份與 GitHub 雲端一鍵同步 API
 ********************************************************************/
window.saveAdminToLocal = function() {
  collectAdminFieldsToConfig();
  localStorage.setItem('DEAR_HOWARD_CONFIG_V2', JSON.stringify(window.CONFIG));
  applyConfigToUI();
  alert('✅ 已套用所有修改並儲存於本機瀏覽器！你現在可以使用分頁 1 的「快速跳轉器」立即預覽各章節效果。');
};

window.exportConfigJson = function() {
  collectAdminFieldsToConfig();
  const blob = new Blob([JSON.stringify(window.CONFIG, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'config.json';
  link.click();
};

window.syncConfigToGitHub = async function() {
  collectAdminFieldsToConfig();
  localStorage.setItem('DEAR_HOWARD_CONFIG_V2', JSON.stringify(window.CONFIG));
  applyConfigToUI();

  const owner = getInputVal('gh-owner').trim();
  const repo = getInputVal('gh-repo').trim();
  const branch = getInputVal('gh-branch').trim() || 'main';
  const token = getInputVal('gh-token').trim();
  const statusEl = document.getElementById('gh-sync-status');

  if (!owner || !repo || !token) {
    if (statusEl) statusEl.textContent = '⚠️ 請先在分頁 6 最下方填寫 GitHub 帳號、倉庫名稱與 Token！';
    alert('請先在「分頁 6：GitHub 雲端一鍵同步設定」填寫帳號、倉庫名稱與 Token！');
    return;
  }

  localStorage.setItem('GH_OWNER', owner);
  localStorage.setItem('GH_REPO', repo);
  localStorage.setItem('GH_BRANCH', branch);
  localStorage.setItem('GH_TOKEN', token);

  if (statusEl) statusEl.textContent = '⏳ 正在將最新設定、照片與音檔推送至 GitHub 雲端 config.json...';

  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/config.json`;
    let sha = undefined;

    const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    const jsonStr = JSON.stringify(window.CONFIG, null, 2);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    const base64Content = btoa(binary);

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update DEAR HOWARD config.json via Super Admin CMS v2.0',
        content: base64Content,
        branch: branch,
        ...(sha ? { sha } : {})
      })
    });

    if (putRes.ok) {
      if (statusEl) statusEl.textContent = '🎉 雲端同步成功！約 30~60 秒後，德州的 Howard 打開網址就是最新版本！';
      alert('🎉 GitHub 雲端同步成功！');
    } else {
      const err = await putRes.json();
      if (statusEl) statusEl.textContent = `❌ 同步失敗：${err.message || '請確認 Token 權限或檔案大小'}`;
    }
  } catch (err) {
    if (statusEl) statusEl.textContent = `❌ 網路或權限錯誤：${err.message}`;
  }
};
