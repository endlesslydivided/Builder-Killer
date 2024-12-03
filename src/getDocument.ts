import { google } from "googleapis";
import { authorizeClient } from "./auth";

export const getGoogleDocContent = async (docId: string): Promise<void> => {

  const oauth2Client = await authorizeClient();
  const docs = google.docs({ version: "v1", auth: oauth2Client });

  try {
    const response = await docs.documents.get({ documentId: docId });
    const content = response.data;

    console.log("Содержимое документа:\n", content.body);
  } catch (error: any) {
    console.error("Ошибка при получении документа:", error?.message);
  }
};