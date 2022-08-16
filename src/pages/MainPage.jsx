import React, { useReducer, useRef, useCallback } from "react";
import Header from "../components/main/Header";
import DetailModalBody from "../components/main/detailModal/Body";
import NavigationGroup from "../components/main/fixNavigation/NavigationGroup";
import GuestModal from "../components/registeration/GuestModal";
import { useLocation } from "react-router-dom";

function MainPage(props) {
  let location = useLocation();
  let state = location.state;
  const userToken = window.localStorage.getItem("token");
  const modalRef = useRef();
  const guestModalRef = useRef();
  const handleModalOpen = () => {
    modalRef.current.classList.add("modalOn");
  };
  const handleLoginnSubmitHandler = useCallback(() => {
    if (userToken === null) {
      guestModalRef.current.classList.add("modalOn");
    } else {
    }
  }, [userToken]);
  return (
    <>
      <Header userToken={userToken} onClick={handleLoginnSubmitHandler} />
      <NavigationGroup />
      <button onClick={handleModalOpen}>모달을 띄워봐요</button>
      <DetailModalBody Ref={modalRef} />
      <GuestModal Ref={guestModalRef} />
    </>
  );
}

export default MainPage;
