import styled from 'styled-components';

const CardBoard = styled.div`
  font-family:'Exo 2', sans-serif;
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.4);
  margin: 5px;
  display:flex;
  justify-content:space-between;
  border-radius:7px;
  padding:5px;
  border:1px solid black;
  width: -webkit-fill-available;
   &:hover, &:focus {
    cursor: pointer;
    background: yellow;
  }

`
export default CardBoard;
