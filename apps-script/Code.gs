const XLSX_FILE_ID = '';
const SHEET_NAME = '';
const CONFIG_FILE_NAME = 'musso-edilizia-config.json';
const ADMIN_KEY = '';
const CACHE_MINUTES = 10;

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : '';
  if (action) return handleApiGet_(e);
  return HtmlService.createHtmlOutputFromFile('Admin')
    .setTitle('Pannello Admin - MUSSO EDILIZIA S.N.C.')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.SAMEORIGIN);
}

function doPost(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const action = params.action ? String(params.action) : '';
  if (action !== 'save') return json_(400, { ok: false, error: 'Azione non valida' });
  if (!isAuthorized_(params)) return json_(403, { ok: false, error: 'Non autorizzato' });

  let payload;
  try { payload = JSON.parse(e.postData.contents || '{}'); } catch (err) { payload = null; }
  if (!payload || typeof payload.config !== 'object') return json_(400, { ok: false, error: 'Payload non valido' });

  const cfgFile = getOrCreateConfigFile_();
  cfgFile.setContent(JSON.stringify(payload.config, null, 2));
  PropertiesService.getScriptProperties().setProperty('CONFIG_SAVED_AT', new Date().toISOString());
  return json_(200, { ok: true, savedAt: PropertiesService.getScriptProperties().getProperty('CONFIG_SAVED_AT') });
}

function handleApiGet_(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const action = String(params.action || '');
  if (!isAuthorized_(params)) return json_(403, { ok: false, error: 'Non autorizzato' });

  if (action === 'list') {
    const items = getCachedItems_();
    const config = readConfig_();
    const savedAt = PropertiesService.getScriptProperties().getProperty('CONFIG_SAVED_AT');
    return json_(200, { ok: true, items, config, savedAt });
  }

  if (action === 'health') {
    return json_(200, { ok: true, time: new Date().toISOString() });
  }

  return json_(400, { ok: false, error: 'Azione non valida' });
}

function isAuthorized_(params) {
  const key = params && params.key ? String(params.key) : '';
  const expected = ADMIN_KEY ? String(ADMIN_KEY) : String(PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') || '');
  if (!expected) return true;
  return key && key === expected;
}

function getCachedItems_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('items_v1');
  if (cached) {
    try { return JSON.parse(cached); } catch (err) {}
  }
  const items = readItemsFromDriveXlsx_();
  cache.put('items_v1', JSON.stringify(items), Math.max(60, CACHE_MINUTES * 60));
  return items;
}

function readItemsFromDriveXlsx_() {
  const sourceId = XLSX_FILE_ID || PropertiesService.getScriptProperties().getProperty('XLSX_FILE_ID');
  if (!sourceId) throw new Error('XLSX_FILE_ID non impostato');

  const sheetId = ensureGoogleSheetFromXlsx_(sourceId);
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
  if (!sheet) throw new Error('Foglio non trovato');

  const values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) return [];

  const headers = values[0].map(h => normalizeHeader_(h));
  const idx = buildColumnIndex_(headers);

  const out = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const code = pick_(row, idx.code);
    const name = pick_(row, idx.name);
    const brand = pick_(row, idx.brand);
    const category = pick_(row, idx.category);
    const price = parsePrice_(pick_(row, idx.price));

    if (!code && !name) continue;
    out.push({
      id: String(r),
      code: code ? String(code) : '',
      name: name ? String(name) : '',
      brand: brand ? String(brand) : '',
      category: category ? String(category) : '',
      price: price
    });
  }

  return out;
}

function ensureGoogleSheetFromXlsx_(xlsxFileId) {
  const props = PropertiesService.getScriptProperties();
  const existing = props.getProperty('GSHEET_ID');
  if (existing) return existing;

  const converted = convertXlsxToSheet_(xlsxFileId);
  props.setProperty('GSHEET_ID', converted);
  return converted;
}

function convertXlsxToSheet_(xlsxFileId) {
  const file = DriveApp.getFileById(xlsxFileId);
  const blob = file.getBlob();
  const resource = { title: file.getName().replace(/\.xlsx$/i, '') + ' (Converted)' };
  const created = Drive.Files.insert(resource, blob, { convert: true });
  return created.id;
}

function readConfig_() {
  const cfgFile = getOrCreateConfigFile_();
  const raw = cfgFile.getBlob().getDataAsString('UTF-8') || '';
  if (!raw.trim()) return {};
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === 'object' ? obj : {};
  } catch (err) {
    return {};
  }
}

function getOrCreateConfigFile_() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty('CONFIG_FILE_ID');
  if (existingId) return DriveApp.getFileById(existingId);

  const files = DriveApp.getFilesByName(CONFIG_FILE_NAME);
  if (files.hasNext()) {
    const f = files.next();
    props.setProperty('CONFIG_FILE_ID', f.getId());
    return f;
  }

  const f = DriveApp.createFile(CONFIG_FILE_NAME, '{}', MimeType.PLAIN_TEXT);
  props.setProperty('CONFIG_FILE_ID', f.getId());
  return f;
}

function json_(status, obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeHeader_(v) {
  return String(v || '')
    .trim()
    .toLowerCase()
    .replace(/[àá]/g, 'a')
    .replace(/[èé]/g, 'e')
    .replace(/[ìí]/g, 'i')
    .replace(/[òó]/g, 'o')
    .replace(/[ùú]/g, 'u')
    .replace(/[^a-z0-9]+/g, '');
}

function buildColumnIndex_(headers) {
  const findIdx = (candidates) => {
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i];
      if (candidates.indexOf(h) >= 0) return i;
    }
    return -1;
  };

  return {
    code: findIdx(['codice', 'cod', 'codarticolo', 'articolo', 'id']),
    name: findIdx(['descrizione', 'nome', 'prodotto', 'articolo']),
    brand: findIdx(['marchio', 'marca', 'brand']),
    category: findIdx(['categoria', 'reparto', 'famiglia', 'gruppo']),
    price: findIdx(['prezzo', 'prezzovendita', 'prezzodivendita', 'prezzounitario', 'prezzolistino'])
  };
}

function pick_(row, idx) {
  if (idx == null || idx < 0) return '';
  return row[idx];
}

function parsePrice_(v) {
  if (v == null || v === '') return '';
  if (typeof v === 'number') return v;
  const s = String(v).trim().replace('€', '').replace(/\s+/g, '');
  const normalized = s.replace(/\./g, '').replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : '';
}
