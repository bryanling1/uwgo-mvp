import React from "react";
import styled from "styled-components";
import { Typography } from "components/MUI/Typography";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { Spacer } from "components/Spacer/Spacer";
import { IconType } from "types/types";
import LeftIcon from "@material-ui/icons/KeyboardBackspace";
import RightIcon from '@material-ui/icons/ArrowRightAlt';

interface ITopNav {
  title: string;
  description: string;
  icon: IconType;
  justify?: string;
}

const getIcon = (id: IconType) => {
  switch (id) {
    case IconType.LEFT:
      return <LeftIcon fontSize="large" />;
    case IconType.RIGHT:
      return <RightIcon fontSize="large" />; 
    default:
      return <ArrowUpwardIcon fontSize="large" />;
  }
};

export const TopNav = ({ title, description, icon, justify}: ITopNav) => {
  return (
    <MainWrapper justify={justify}>
      {getIcon(icon)}
      <Spacer width={8} />
      <TextWrapper justify={justify}>
        <Typography variant="subtitle1" lineheight={20} align={justify == "start" ? "left" : "center"}>
          {title.toUpperCase()}
        </Typography>
        <Typography variant="h6" bold lineheight={20} align={justify == "start" ? "left" : "center"}>
          {description}
        </Typography>
      </TextWrapper>
    </MainWrapper>
  );
};

interface IMainWrapper{
  justify?: string;
}
const MainWrapper = styled.div<IMainWrapper>`
  display: flex;
  align-items: center;
  justify-content: ${props=>props.justify ?? "center"};
  background-color: white;
  padding: 16px;
  box-sizing: border-box;
`;

const TextWrapper = styled.div<IMainWrapper>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:  ${props=>props.justify ?? "initial"};
`;
