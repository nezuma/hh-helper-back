import puppeteer from "puppeteer";
import { FastifyReply, FastifyRequest } from "fastify";

let cachedCookies: string | null = null;

export const hhLoginHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const { username, password } = req.body as any;
  let browser = null;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://hh.ru/account/login", { waitUntil: "networkidle2" });
    await page.type('input[name="login"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    if (page.url().includes("account/login")) {
      return reply
        .status(401)
        .send({ success: false, message: "Неверный логин или пароль" });
    }

    const cookies = await page.cookies();
    cachedCookies = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    await browser.close();

    return reply.status(200).send({ success: true, message: "Авторизация успешна" });
  } catch (error) {
    if (browser) await browser.close();
    return reply.status(500).send({ success: false, message: "Ошибка авторизации" });
  }
};

export const hhGetNegotiations = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!cachedCookies) {
    return reply.status(401).send({ success: false, message: "Не авторизован" });
  }

  const response = await fetch("https://hh.ru/applicant/negotiations", {
    headers: { Cookie: cachedCookies, "X-Requested-With": "XMLHttpRequest" },
  });
  console.log(response);

  const data = await response.json();
  return reply.send(data);
};
