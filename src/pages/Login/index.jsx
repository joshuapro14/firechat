import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom'
import Style from './login.module.css';
import Invalids from '../../components/Invalids/Invalids';
import Password from '../../components/Password/Password';
import Errors from '../../components/Modal/Errors';
import { debounce } from '../../utility';
import { isEmailValid, isNonEmptyText } from '../../utility/validators';
import Loading from '../../components/Modal/Loading';
import {signInUser} from "../../firebase/services"
import Logo from '../../components/Logo';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [invalids, setInvalids] = useState([]);

  const emailRef = useRef();
  const passwordRef = useRef();

  const validateEmail = useCallback(async () => {
    const email = emailRef.current && emailRef.current.value;
    return await isEmailValid(email);
  }, [emailRef]);

  const validatePassword = useCallback(async () => {
    const password = passwordRef.current && passwordRef.current.value;
    return await isNonEmptyText(password);
  }, [passwordRef]);

  const onInputChange = debounce(() => {
    validate();
  }, 500);

  const validate = async () => {
    const validations = {};
    validations.email = await validateEmail();
    validations.password = await validatePassword();

    let validObj = Object.keys(validations)
      .reduce((acc, key) => {
        if (validations[key].isValid == false) {
          acc.isValid = false;
          acc.invalids.push(`${key} : ${validations[key].reason}`)
        }
        return acc;
      }, { isValid: true, invalids: [] });
    setInvalids(validObj.invalids);
    setIsValid(validObj.isValid);
    return validObj.isValid;
  }

  const reset = (e) => {
    e.stopPropagation();
    emailRef.current.value = "";
    passwordRef.current.value = "";
  }

  const signInUserWithFirebase = async() => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      setError(null);
      setIsLoading(true);
      setLoadingMessage("User Signing In");
      await signInUser({ email, password });
      setLoadingMessage("User Registered");
    } catch (error) {
      setError([`${error}`])
    }
    setIsLoading(false);
    setLoadingMessage(null);
  }

  const signIn = async(e) => {
    e.stopPropagation();
    const isValid = await validate();
    if (isValid) {
      signInUserWithFirebase();
    }
  }


  return (
    <div className={Style.container}>
      <Loading {...{ isLoading, loadingMessage }} />
      <div className={Style.loginBox}>
        <span className={Style.chatTitle}>
        <Logo /> Fire Chat
        </span>
        <span className={Style.loginTitle}>Login</span>
        <div className={Style.formBox}>
          <input type="email" placeholder='Email' ref={emailRef} className={Style.input} onChange={onInputChange} />
          <Password ref={passwordRef} onChange={onInputChange} />
          <div className={Style.actionBox}>
            <button className={Style.signInBtn} onClick={reset} disabled={isLoading}>
              Reset
            </button>
            <button className={Style.signInBtn} onClick={signIn} disabled={!isValid || isLoading}>
              Sign in
            </button>
          </div>
          <Invalids {...{ isValid, invalids }} />
          <Errors error={error} />
          <span className={Style.centerPara}>
            You don't have an account? 
            <Link to="/register"> Register </Link>
          </span>
        </div>

      </div>
    </div>
  )
}

export default Login