import api from './client';

// ======= ABOUT PAGE ENDPOINT (Laravel API v1) =======
//   GET /about?lang=ar   ->   { data: { ...page } }
//
// The page arrives already translated and grouped by block type, so the view
// never parses HTML:
//   sections -> text blocks      { heading, body }
//   stats    -> numbers          { label, value }
//   contact  -> contact details  { label, value }
//   social   -> social links     { platform, url }
//   images   -> gallery          [{ id, url, sortOrder, createdAt, updatedAt }]
//
// The endpoint is public and cheap to revalidate server-side (ETag + max-age
// 300) because the content changes rarely, but we still request it per locale
// so Arabic gets its own translated payload.
const localeParams = (lang) => (lang ? { lang } : {});

export const getAboutPage = (lang) => api.get('/about', { params: localeParams(lang) });
