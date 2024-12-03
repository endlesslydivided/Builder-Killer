import { getGoogleDocContent } from "./getDocument";

const GOOGLE_DOC_URL = 'https://docs.google.com/document/d/1Q61hb69EE3bBhx3L37Xs08H4qnwhi7F_SaU6RVFQxPM/edit?tab=t.0';

const main = async () => {
  const docId = GOOGLE_DOC_URL.match(/[-\w]{25,}/)?.[0];
  if (!docId) {
    console.error("Не удалось извлечь ID документа из ссылки.");
    return;
  }
  const content = getGoogleDocContent(docId);
};

main().catch(console.error);