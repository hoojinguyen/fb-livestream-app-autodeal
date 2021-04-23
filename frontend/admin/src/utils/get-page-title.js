import defaultSettings from "@/settings";

const title = defaultSettings.title || "Apollo Prime Vue";

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title} Admin`;
}
