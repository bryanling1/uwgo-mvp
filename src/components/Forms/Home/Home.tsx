import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { Spacer } from "components/Spacer/Spacer";
import Button from "@material-ui/core/Button";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { HomeViewstate, Avoidance } from "components/Forms/Home/HomeViewstate";
import { observer } from "mobx-react-lite";
import CircularProgress from "@material-ui/core/CircularProgress";

export const Home = observer(() => {
  const [viewState] = useState(() => new HomeViewstate());
  useEffect(() => {
    viewState.init();
  }, []);
  const {
    isLoading,
    currentId,
    setCurrentId,
    destinationId,
    setDestinationId,
    avoidances,
    setAvoidance,
    locations,
    queryParams,
  } = viewState;
  return (
    <PaperWrapper variant="outlined">
      <ImageWrapper>
        <Img src="logo.png" />
      </ImageWrapper>
      <Spacer />
      <FormWrapper>
        {isLoading ? (
          <ProgressWrapper>
            <CircularProgress />
          </ProgressWrapper>
        ) : null}
        <FormOpacityWrapper isLoading={isLoading}>
          <FormControlWrapper>
            <InputLabel>Current Location</InputLabel>
            <Spacer height={8} />
            <SelectWrapper
              native
              variant="outlined"
              disabled={isLoading}
              value={currentId}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setCurrentId(event.target.value as string);
              }}
            >
              {locations.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </SelectWrapper>
          </FormControlWrapper>
          <Spacer />
          <FormControlWrapper>
            <InputLabel>Destination</InputLabel>
            <Spacer height={8} />
            <SelectWrapper
              native
              variant="outlined"
              disabled={isLoading}
              value={destinationId}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setDestinationId(event.target.value as string);
              }}
            >
              {locations.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </SelectWrapper>
          </FormControlWrapper>
          <Spacer />
          <InputLabel>Avoidance Options</InputLabel>
          <Spacer height={8} />
          <AvoidanceOptionsWrapper>
            {Object.values(Avoidance).map(key => {
              return (
                <div key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={key in avoidances}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setAvoidance(key, event.target.checked);
                        }}
                      />
                    }
                    label={key}
                    disabled={isLoading}
                  />
                </div>
              );
            })}
          </AvoidanceOptionsWrapper>
          <Spacer />
          <ButtonWrapper
            variant="contained"
            color="primary"
            endIcon={<ArrowRightAltIcon />}
            disabled={isLoading}
            href={`/route?${queryParams}`}
            disableElevation
          >
            Let's Go!
          </ButtonWrapper>
        </FormOpacityWrapper>
      </FormWrapper>
    </PaperWrapper>
  );
});

const PaperWrapper = styled(Paper)`
  max-width: 400px;
  width: 100%;
  padding: 16px;
`;

const FormControlWrapper = styled.div`
  width: 100%;
`;

const SelectWrapper = styled(Select)`
  width: 100%;
`;

const ButtonWrapper = styled(Button)`
  width: 100%;
  height: 48px;
  font-weight: bold !important;
`;

const Img = styled.img`
  width: 112px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const AvoidanceOptionsWrapper = styled.div`
  padding: 8px;
  background-color: #ddd;
  border-radius: 8px;
`;

const FormWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const ProgressWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -60px;
`;

interface IFormOpacityWrapper {
  isLoading: boolean;
}
const FormOpacityWrapper = styled.div<IFormOpacityWrapper>`
  opacity: ${props => (props.isLoading ? "0.6" : "1")};
`;
