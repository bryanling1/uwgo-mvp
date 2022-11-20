import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Navigation as NavigationComp } from "components/Navigation/Navigation";
import { useNavigate } from "react-router-dom";

// A custom hook that builds on useLocation to parse
// the query string for you. (from react rouver v5 docs)
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const Navigation = (): JSX.Element => {
  const query = useQuery();
  const start = query.get("start");
  const end = query.get("end");
  const avoidances =
    query.get("avoidances") !== null
      ? JSON.parse(query.get("avoidances") || "")
      : {};
  const navigate = useNavigate();

  useEffect(() => {
    if (start === null || end === null) {
      navigate("/");
    }
  }, [start, end]);

  return (
    <MainWrapper>
      {start && end ? (
        <NavigationComp start={start} end={end} avoidances={avoidances} />
      ) : null}
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  height: 100vh;
  box-sizing: border-box;
`;
