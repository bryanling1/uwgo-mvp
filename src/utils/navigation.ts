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
      return "leftArrow.png";
    case ArrowType.RIGHT:
      return "rightArrow.png";
    default:
      return "straightArrow.png";
  }
};
