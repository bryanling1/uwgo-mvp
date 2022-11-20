import React, { useState, useEffect, useRef } from "react";
import { Avoidances } from "types/types";
import { NavigationViewState } from "components/Navigation/NavigationViewState";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";
import styled from "styled-components";
import { BottomNav } from "components/Navigation/BottomNav/BottomNav";
import { TopNav } from "components/Navigation/TopNav/TopNav";
import { calcGroundYOffset, getArrowImgSrc } from "utils/navigation";
import { Progress } from "components/Navigation/Progress/Progress";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";

interface INavigation {
  start: string;
  end: string;
  avoidances: Avoidances;
}

const PERCENTAGE_FROM_BOTTOM_OF_IMAGE = 0.5;
const DIV_ROTATION_DEGREES = 77;
const TEMP_ARROW_PADDING_Y = 200;
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd9lEphyZS1CkJFt885Ws31evnETsymqPgZtjL2q9dIjwADbA/viewform";

export const Navigation = observer(
  ({ start, end, avoidances }: INavigation) => {
    const [viewState] = useState(() => new NavigationViewState());
    const [areImagesLoading, setAreImagesLoading] = useState(true);
    const [groundYOffset, setGroundYOffset] = useState(0);
    const {
      currentNode,
      goNext,
      goPrev,
      hasNext,
      hasPrev,
      navResponse,
      instructionTitle,
      instructionDescription,
      instructionIcon,
      arrow,
      progress,
      showTooltip,
      isLastStep,
    } = viewState;

    useEffect(
      () =>
        autorun(() => {
          viewState.init(start, end, avoidances);
        }),
      []
    );

    useEffect(() => {
      if (!viewState.isLoading) {
        cacheImages([...viewState.images]);
      }
    }, [viewState.isLoading]);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const groundPosition = async () => {
        const containerWidth = ref.current?.clientWidth ?? 0;
        const containerHeight = ref.current?.clientHeight ?? 0;
        setGroundYOffset(
          await calcGroundYOffset(
            containerWidth,
            containerHeight,
            currentNode.imageURL,
            PERCENTAGE_FROM_BOTTOM_OF_IMAGE
          )
        );
      };
      if (viewState.isLoading || areImagesLoading) {
        return;
      }
      groundPosition();
    }, [currentNode, viewState, areImagesLoading]);

    const cacheImages = async (images: string[]) => {
      const promises = await images.map(src => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      });

      await Promise.all(promises);
      setAreImagesLoading(false);
    };

    if (viewState.isLoading || areImagesLoading) {
      return (
        <LoaderWrapper>
          <CircularProgress />
        </LoaderWrapper>
      );
    }
    return (
      <MainWrapper>
        <NavWrapper>
          <TopNav
            title={instructionTitle}
            description={instructionDescription}
            icon={instructionIcon}
          />
          <ImageWrapper src={currentNode?.imageURL ?? ""} ref={ref}>
            <GroundWrapper height={groundYOffset}>
              {arrow ? (
                <StyledImage
                  src={getArrowImgSrc(arrow.type)}
                  x={arrow.x}
                  y={arrow.y + TEMP_ARROW_PADDING_Y}
                />
              ) : null}
            </GroundWrapper>
            <FabWrapper>
              <StyledFab
                size="large"
                variant="extended"
                color="primary"
                show={isLastStep}
                href={FORM_URL}
              >
                End Navigation <CloseIcon />
              </StyledFab>
            </FabWrapper>
          </ImageWrapper>
          <Progress percentage={progress} />
          <BottomNav
            onNext={goNext}
            onPrev={goPrev}
            canNext={hasNext}
            canPrev={hasPrev}
            arrivalTime={navResponse?.arrivalTime ?? ""}
            showTooltip={showTooltip}
          />
        </NavWrapper>
      </MainWrapper>
    );
  }
);

interface IStyledFab {
  show: boolean;
}
const StyledFab = styled(Fab)<IStyledFab>`
  &&& {
    position: absolute;
    top: ${props => (props.show ? 0 : 100)}px;
    transition: top 0.3s ease;
    background-color: ${green[700]};
  }
`;

const FabWrapper = styled.div`
  height: 72px;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  position: relative;
`;
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const NavWrapper = styled.div`
  height: 100%;
  max-height: 1180px;
  width: 100%;
  max-width: 820px;
  display: flex;
  flex-direction: column;
`;

interface IImageWrapper {
  src: string;
}

const ImageWrapper = styled.div<IImageWrapper>`
  background-image: url(${props => props.src});
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  overflow: hidden;
  align-items: center;
`;

interface IGroundWrapper {
  height: number;
}
const GroundWrapper = styled.div<IGroundWrapper>`
  width: 100%;
  position: absolute;
  height: 100%;
  top: ${props => props.height}px;
  transform: perspective(50em) rotateX(${DIV_ROTATION_DEGREES}deg);
  transform-origin: center top;
  display: flex;
  justify-content: center;
`;
interface IStyledImage {
  x: number;
  y: number;
}
const StyledImage = styled.img<IStyledImage>`
  margin-left: ${props => props.x}px;
  margin-top: ${props => props.y}px;
  image-rendering: -webkit-optimize-contrast;
  width: 220px;
  height: 880px;
  animation-name: pulse;
  animation-duration: 2.4s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;

  @keyframes pulse {
    0% {
      opacity: 0.96;
    }
    50% {
      opacity: 0.86;
    }
    100% {
      opacity: 0.96;
    }
  }
`;
