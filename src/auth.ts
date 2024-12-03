import readline from "readline";
import path from "path";
import { google } from 'googleapis'
import { loadOAuthConfig } from "./config";
import { execSync } from "child_process";
import * as puppeteer from 'puppeteer';

const jsonPath = path.join(__dirname, "google.auth.keys.json");
const { client_id, client_secret, redirect_uris } = loadOAuthConfig(jsonPath);

const automatedOAuth2 = async (url: string) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);
  await page.type('#identifierId','alexander.kovalev@innowise.com')
  await page.click('#identifierNext');

  const passwordInputSelector = 'input[type="password"]';
  const passwordInputText = '';

  await page.waitForFunction(
    (passwordInputSelector, text) => {
      const input = document.querySelector(passwordInputSelector) as HTMLInputElement;
      return !!input;
    },
    {},
    passwordInputSelector,
    passwordInputText
  );

  await page.type('input[type="password"]',passwordInputText)
  await page.click('#passwordNext')

  await page.waitForFunction(
    () => {
      const button = document.querySelector('#submit_approve_access') as HTMLButtonElement;
      return !!button;
    },
    {}
  );

  // Отправляем форму
  await Promise.all([
    page.click('#submit_approve_access'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  // Ожидаем перенаправления и получаем URL
  const redirectedUrl = page.url();
  console.log('Redirected URL:', redirectedUrl);

  // Извлекаем токен из URL
  const urlParams = new URLSearchParams(new URL(redirectedUrl).search);
  const code = urlParams.get('code');
  console.log('Code:', code);

  await browser.close();

  return code || '';
};
/**
 * Открывает URL или файл с использованием open-cli.
 * @param target URL или путь к файлу для открытия.
 */
const openTarget = (target: string): void => {
  try {
    // Выполняем команду open-cli через execSync
    execSync(`npx open-cli "${target}", { stdio: "inherit" }`);
  } catch (error) {
    console.error("Ошибка при открытии:", error);
  }
};

export const authorizeClient = async () => {

  const oauth2Client = new google.auth.OAuth2(
    client_id, 
    client_secret,
    redirect_uris?.[0]
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/documents.readonly"],
  });

  console.log("Откройте эту ссылку в браузере для авторизации:", authUrl);
  
  const code = await automatedOAuth2(authUrl);

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log("Токен успешно получен и установлен.");

  return oauth2Client;
};
