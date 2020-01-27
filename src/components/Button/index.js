import styled from "styled-components";
import {Button} from "@material-ui/core";
import {lighten} from "@material-ui/core/styles/colorManipulator";

const StyledButton = styled(Button)`
  && {
    font-family: 'Exo 2', sans-serif;
    margin: 2px;
    font-weight:900;
    background-color: ${props =>
    props.background ? props.background : "white"};
    color:${props =>
    props.textcolor ? props.textcolor : "black"};
      
    &:hover{
      outline: none;
      background-color:  ${props =>
      props.background ? lighten(props.background, 0.3) : "blue"};
    }
    @media (max-width: 640px) {
      font-size: 10px;
    } 
  }
  &:focus{outline: none;}
  }
`;
export default StyledButton;
