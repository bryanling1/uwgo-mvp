import styled from "styled-components";
import { Home as HomeForm } from "components/Forms/Home/Home";

export const Home = (): JSX.Element => {
  return (
    <MainWrapper>
      <HomeForm />
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  background-color: #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  height: 100vh;
  box-sizing: border-box;
`;
