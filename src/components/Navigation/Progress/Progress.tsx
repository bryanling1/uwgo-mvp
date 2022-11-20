import React from "react";
import styled from "styled-components";
import LocationIcon from "@material-ui/icons/LocationOn";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";

interface IProgress {
  percentage: number;
}
export const Progress = ({ percentage }: IProgress) => {
  return (
    <MainWrapper>
      <StyledLocationIcon progress={percentage} />
      <ProgressStrip progress={percentage} />
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  height: 8px;
  background-color: white;
  position: relative;
  overflow-x: clip;
`;

interface IProgressStrip {
  progress: number;
}
const ProgressStrip = styled.div<IProgressStrip>`
  background-color: ${props=>props.progress === 100 ? green[400] : blue[300]};
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.5s ease;
`;
interface IProgressStrip {
  progress: number;
}
const StyledLocationIcon = styled(LocationIcon)<IProgressStrip>`
  && {
    width: 32px;
    height: 32px;
    position: absolute;
    left: calc(${props => props.progress}% - 16px);
    bottom: -3px;
    fill:  ${props=>props.progress === 100 ? green[900] : blue[900]};
    transition: left 0.5s ease;
  }
`;
