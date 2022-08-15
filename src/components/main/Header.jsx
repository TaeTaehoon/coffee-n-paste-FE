import React from "react";
import styled from "styled-components";
import big_logo from "../../static/big_logo.png";
import BrandList from "./BrandList";
import MenuBar from "./MenuBar";

function Header() {
  return (
    <StHeader>
      <Stlogo />
      <StWrap>
        <BrandList />
        <MenuBar />
      </StWrap>
    </StHeader>
  );
}

const StHeader = styled.header`
  width: 100vw;
  height: 150px;
  background-color: var(--bg-color);
  display: flex;
  border: var(--border-style);
  border-left: none;
  border-right: none;
`;

const Stlogo = styled.div`
  background-image: url(${big_logo});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 90%;
  border-right: var(--border-style);
  width: 260px;
  height: 100%;
`;

const StWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 260px);
`;
export default React.memo(Header);
