import React from "react";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import LeftIcon from "@material-ui/icons/ChevronLeft";
import RightIcon from "@material-ui/icons/ChevronRight";
import blue from "@material-ui/core/colors/blue";
import { Spacer } from "components/Spacer/Spacer";
import { observer } from "mobx-react-lite";
import { Typography } from "components/MUI/Typography";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";

interface IButtonNav {
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
  canPrev: boolean;
  arrivalTime: string;
  showTooltip: boolean;
}

const useStylesBootstrap = makeStyles((theme: Theme) => ({
  arrow: {
    color: "#131313",
  },
  tooltip: {
    backgroundColor: "#131313",
    fontSize: 18,
    padding: 16,
    top: 16,
  },
}));

function BootstrapTooltip(props: TooltipProps) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}

export const BottomNav = observer(
  ({
    onNext,
    onPrev,
    canNext,
    canPrev,
    arrivalTime,
    showTooltip,
  }: IButtonNav) => {
    return (
      <MainWrapper>
        <TextWrapper>
          <Typography variant="subtitle2" lineheight={20} $color="white">
            ARRIVAL TIME:
          </Typography>
          <Typography variant="h4" bold lineheight={30} $color="white">
            {arrivalTime}
          </Typography>
        </TextWrapper>
        <IconButtonWrapper isDisabled={!canPrev}>
          <Fab onClick={onPrev}>
            <StyledLeftIcon />
          </Fab>
        </IconButtonWrapper>
        <Spacer width={8} />
        <IconButtonWrapper isDisabled={!canNext}>
          <BootstrapTooltip
            title="Tap this arrow to continue"
            arrow
            open={showTooltip}
            placement="top"
          >
            <Fab onClick={onNext}>
              <StyledRightIcon />
            </Fab>
          </BootstrapTooltip>
        </IconButtonWrapper>
      </MainWrapper>
    );
  }
);

const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${blue[800]};
  padding: 8px;
  box-sizing: border-box;
  position: relative;
  min-height: 80px;
`;

const StyledLeftIcon = styled(LeftIcon).attrs({
  fontSize: "large",
})`
  width: 56px;
`;

const StyledRightIcon = styled(RightIcon).attrs({
  fontSize: "large",
})``

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  left: 16px;
  height: 100%;
`;
interface IIconButton {
  isDisabled?: boolean;
}
const IconButtonWrapper = styled.div<IIconButton>`
  opacity: ${props => (props.isDisabled ? "0.2" : "1")};
`;

const StyledTooltip = styled(Tooltip)`
  .MuiTooltip-popper .MuiTooltip-tooltip {
    background-color: red !important;
  }
`;
interface IFab{
  isDisabled: boolean
}
