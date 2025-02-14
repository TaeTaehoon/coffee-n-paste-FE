import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux/es/exports";

function MainImage() {
  const currBrandId = useSelector((state) => state.mainSlice.currBrand.brandId);
  const mainImageUrl = useSelector(
    (state) =>
      state.mainSlice.brands.find((el) => el.brandId === currBrandId).brandImg
  );

  return <StWrap imageUrl={mainImageUrl}></StWrap>;
}

const StWrap = styled.div`
  width: 100vw;
  height: 50vh;
  background: radial-gradient(
      70% 50.83% at 70% 50.15%,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0.5) 100%
    ),
    url(${({ imageUrl }) => imageUrl});

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

export default MainImage;
