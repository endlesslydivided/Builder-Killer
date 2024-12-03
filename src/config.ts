import fs from "fs";

interface OAuthConfig {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
}

// Функция для извлечения данных из JSON
export const loadOAuthConfig = (filePath: string): OAuthConfig => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(fileContent);

  // Проверяем, существует ли ключ "installed" в JSON
  if (!json.installed) {
    throw new Error("Неверный формат JSON: отсутствует ключ 'installed'.");
  }

  const { client_id, client_secret, redirect_uris } = json.installed;

  if (!client_id && !client_secret && !redirect_uris) {
    throw new Error("Некорректный JSON: отсутствуют необходимые поля.");
  }

  return { client_id, client_secret, redirect_uris };
};
