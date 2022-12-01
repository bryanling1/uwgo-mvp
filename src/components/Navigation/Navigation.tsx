import React, { useState, useEffect, useRef } from "react";
import { Avoidances, ArrowType} from "types/types";
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
import green from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import HomeIcon from '@material-ui/icons/Home';
import DirectionsIcon from '@material-ui/icons/Directions';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from "components/MUI/Typography";
import ButtonBase from "@material-ui/core/ButtonBase"


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
      images,
      currentIndex,
      arrowTypes,
      showFullPath,
      setShowFullPath,
      instructions,
      setIndexFromDescription
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

    const RenderInstructions = () => {
      {
        return showFullPath ? <> 
        <CloseButtonWrapper onClick={()=>setShowFullPath(false)}><CloseIcon/></CloseButtonWrapper>
        <InstructionsWrapper>
          {
            instructions.map(({title, description, icon}, i)=>(
              <StyledButtonBase key={i} onClick={()=>{setIndexFromDescription(i)}}>
              <InstructionWrapper  isCurrent={currentIndex === i}>
                <InstructionsNumberWrapper>
                  <Typography variant="h5">{`${i+1}. `}</Typography>
                </InstructionsNumberWrapper>
                <InstructionsInnerWrapper>
                <TopNav 
                  title={title}
                  description={description}
                  icon={icon}
                  justify="start"
                />
                </InstructionsInnerWrapper>
              </InstructionWrapper>
              </StyledButtonBase>
            ))
          }
        </InstructionsWrapper></> : null
      }
    }
    return (
      <MainWrapper>
        <NavWrapper>
          <TopNav
            title={instructionTitle}
            description={instructionDescription}
            icon={instructionIcon}
          />
          <ImageWrapper ref={ref}>
            {
              images.map((imageURL, i)=>
                <SingleImage 
                  src={imageURL} hide={i > currentIndex}
                  arrowType={arrowTypes[i]} 
                  key={imageURL}
                  zoom={i < currentIndex}
                />
              )
            }
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
            <HomeButton size="small" href="/"><HomeIcon/></HomeButton>
            <DescriptionButton size="small" onClick={()=>setShowFullPath(true)}><DirectionsIcon/></DescriptionButton>
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
          <RenderInstructions />
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
  position: relative;
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
  max-width: 520px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  overflow: hidden;
  align-items: center;
`;

interface ISingleImage {
  src: string;
  hide: boolean;
  zoom: boolean;
  arrowType?: ArrowType;
}

const SingleImage = styled.div<ISingleImage>`
  background-image: url(${props => props.src});
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props=>props.hide ? "0" : "1"};
  transform: ${props=>props.zoom ? "scale(1.5)" : "scale(1)"};
  transform-origin: center ${
    props=>(props.arrowType === undefined) ? "center" : 
    (props.arrowType === ArrowType.LEFT ? "left" : (
      props.arrowType === ArrowType.RIGHT? "right": "center"
    ))
  };
  transition: opacity 0.8s ease , transform 0.4s ease;
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

const HomeButton = styled(Fab)`
  &&& {
    position: absolute;
    left: 16px;
    top: 16px;
    background-color: ${blue[800]};
    color: white;
  }
`

const DescriptionButton = styled(Fab)`
  &&& {
    position: absolute;
    left: 16px;
    top: 65px;
    background-color: ${blue[800]};
    color: white;
  }
`

const InstructionsWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 3;
  box-sizing: border-box;
`

const CloseButtonWrapper = styled(IconButton)`
  && {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 4;
  }
`

interface IInstructionWrapper{
  isCurrent: boolean;
}

const InstructionWrapper = styled.div<IInstructionWrapper>`
  display: flex;
  border-bottom: 1px solid #ddd;
  background-color: ${props=>props.isCurrent ? blue[300]: "white"};
  width: 100%;
`

const InstructionsInnerWrapper = styled.div`
  flex: 1
`

const InstructionsNumberWrapper = styled.div`
  display: flex;
  justift-content: center;
  align-items: center;
  padding: 16px;
`

const StyledButtonBase = styled(ButtonBase)`
  width: 100%;
`