import { getRequestConfig } from "next-intl/server";
import trMessages from "../messages/tr.json";
import enMessages from "../messages/en.json";

const messagesMap: Record<string, any> = {
  tr: trMessages,
  en: enMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && ["tr", "en"].includes(requested) ? requested : "tr";

  return {
    locale,
    messages: messagesMap[locale] || trMessages,
  };
});
