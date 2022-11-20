import { ArrowType } from "types/types";

function getMeta(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
}

export const calcGroundYOffset = async (
  containerWidth: number,
  containerHeight: number,
  imgUrl: string,
  percentageFromBottom: number
) => {
  const containerRatio = containerWidth / containerHeight;
  const img = await getMeta(imgUrl);
  const w = img.width;
  const h = img.height;
  const imgRatio = w / h;
  if (imgRatio > containerRatio) {
    // match height
    return containerHeight - containerHeight * percentageFromBottom;
  }
  const newHeight = (containerWidth * h) / w;
  return containerHeight - newHeight * percentageFromBottom;
};

export const getArrowImgSrc = (id: ArrowType) => {
  switch (id) {
    case ArrowType.LEFT:
      return "https://i.ibb.co/1GtNVv4/left-Arrow.png";
    case ArrowType.RIGHT:
      return "https://i.ibb.co/Gvjc705/right-Arrow.png";
    default:
      return "https://i.ibb.co/2NH94kx/straight-Arrow.png";
  }
};
