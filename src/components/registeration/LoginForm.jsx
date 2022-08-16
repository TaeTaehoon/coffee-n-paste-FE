import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function LoginForm({ onRegister }) {
  const idRef = useRef();
  const pwRef = useRef();
  const handleSubmitLogin = useCallback((e) => {
    e.preventDefault();
    const id = idRef.current.value;
    const pw = pwRef.current.value;
    idRef.current.value = "";
    pwRef.current.value = "";
  });

  return (
    <StFormContainer onSubmit={handleSubmitLogin}>
      <label htmlFor="idInput">ID</label>
      <StInput type="text" id="idInput" name="id" ref={idRef} />
      <label htmlFor="pwInput">PASSWORD</label>
      <StInput type="password" id="pwInput" name="pw" ref={pwRef} />
      <StButton>로그인</StButton>
      <StButton onClick={onRegister}>회원가입</StButton>
    </StFormContainer>
  );
}

const StFormContainer = styled.form`
  padding-bottom: 20px;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  label {
    width: 90%;
    text-align: left;
    margin-top: 10px;
    padding-left: 5px;
    font-size: 1.6rem;
    font-family: var(--english-font);
  }
  button {
    :nth-of-type(1) {
      :hover {
        background-color: var(--green-color);
        color: var(--bg-color);
      }
    }
    :nth-of-type(2) {
      :hover {
        background-color: var(--blue-color);
        color: var(--yellow-color);
      }
    }
  }
`;

const StInput = styled.input`
  margin-top: 10px;
  width: 90%;
  height: 70px;
  font-size: 2.5rem;
  letter-spacing: 0.2rem;
  padding: 0 5px;
  font-family: var(--english-font);
`;

const StButton = styled.button`
  margin-top: 20px;
  width: 90%;
  height: 70px;
  font-size: 2.5rem;
  letter-spacing: 0.3rem;
  font-family: var(--korean-font);
  border: var(--border-style);
  background-color: var(--bg-color);
`;

export default LoginForm;
