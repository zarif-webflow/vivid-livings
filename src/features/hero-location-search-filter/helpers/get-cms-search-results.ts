import { getOffplanCmsDataFromDom, getPropsCmsDataFromDom } from "./get-cms-data-from-dom";

export const getPropsCmsSearchResults = () => {
  const cmsData = getPropsCmsDataFromDom();

  if (!cmsData) return null;

  return [...cmsData.propNames, ...cmsData.propAreas];
};

export const getOffplanCmsSearchResults = () => {
  const cmsData = getOffplanCmsDataFromDom();

  if (!cmsData) return null;

  return [...cmsData.propNames, ...cmsData.propAreas];
};
