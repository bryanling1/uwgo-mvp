import TypographyOrigin from "@material-ui/core/Typography";
import styled from "styled-components";

interface StyledTypography {
  bold?: boolean;
  lineheight?: number;
  $color?: string;
}
export const Typography = styled(TypographyOrigin)<StyledTypography>`
  && {
    margin: 0;
    line-height: ${props =>
      props.lineheight ? `${props.lineheight}px` : "initial"};
    color: ${props => props.$color ?? "initial"};
    font-weight: ${props => (props.bold ? "bold" : "initial")};
  }
`;
