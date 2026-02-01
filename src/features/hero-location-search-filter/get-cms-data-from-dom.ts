import { getMultipleHtmlElements } from "@taj-wf/utils";

export const getPropsCmsDataFromDom = () => {
  const propCmsItems = getMultipleHtmlElements({
    selector: "[search-property-item]",
    log: "error",
  });
  if (!propCmsItems) return null;

  const propNames = new Set<string>();
  const propAreas = new Set<string>();

  for (const item of propCmsItems) {
    const subLocality = item.getAttribute("sub-locality");
    const locality = item.getAttribute("locality");

    if (!subLocality || !locality) {
      console.error("Missing sub-locality or locality attribute on property item:", item);
      continue;
    }

    const propName = `${subLocality}, ${locality}`;
    const propArea = locality;

    propNames.add(propName);
    propAreas.add(propArea);
  }
  return { propNames, propAreas };
};

export const getOffplanCmsDataFromDom = () => {
  const propCmsItems = getMultipleHtmlElements({ selector: "[search-offplan-item]", log: "error" });
  if (!propCmsItems) return null;

  const propNames = new Set<string>();

  for (const item of propCmsItems) {
    const name = item.getAttribute("offplan-name");
    if (!name) {
      console.error("Missing offplan-name attribute on offplan item:", item);
      continue;
    }
    propNames.add(name);
  }
  return { propNames };
};
