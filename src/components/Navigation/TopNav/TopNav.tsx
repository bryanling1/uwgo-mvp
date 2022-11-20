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

export const TopNav = ({ title, description, icon }: ITopNav) => {
  return (
    <MainWrapper>
      {getIcon(icon)}
      <Spacer width={8} />
      <TextWrapper>
        <Typography variant="subtitle1" lineheight={20}>
          {title.toUpperCase()}
        </Typography>
        <Typography variant="h6" bold lineheight={20}>
          {description}
        </Typography>
      </TextWrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 16px;
  box-sizing: border-box;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
