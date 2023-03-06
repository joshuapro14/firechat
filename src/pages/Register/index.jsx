import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom'
import Style from './register.module.css';
import { isEmailValid, isNonEmptyText } from '../../utility/validators';
import { debounce } from '../../utility'
import Invalids from '../../components/Invalids/Invalids';
import Password from '../../components/Password/Password';
import Errors from '../../components/Modal/Errors';
import Loading from '../../components/Modal/Loading';
import { registerUser } from '../../firebase/services';
import Logo from '../../components/Logo';

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [invalids, setInvalids] = useState([]);

  const emailRef = useRef();
  const passwordRef = useRef();
  const dnRef = useRef();

  const validateEmail = useCallback(async () => {
    const email = emailRef.current && emailRef.current.value;
    return await isEmailValid(email);
  }, [emailRef]);

  const validatePassword = useCallback(async () => {
    const password = passwordRef.current && passwordRef.current.value;
    return await isNonEmptyText(password);
  }, [passwordRef]);

  const validateDisplayName = useCallback(async () => {
    const dn = dnRef.current && dnRef.current.value;
    return await isNonEmptyText(dn);
  }, [dnRef]);

  const onInputChange = debounce(() => {
    validate();
  }, 500);

  const validate = async () => {
    const validations = {};
    validations.email = await validateEmail();
    validations.password = await validatePassword();
    validations.displayName = await validateDisplayName();

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

  const registerUserWithFirebase = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const displayName = dnRef.current.value;
    try {
      setError(null);
      setIsLoading(true);
      setLoadingMessage("Registering User");
      await registerUser({ email, password, displayName });
      setLoadingMessage("User Registered");
    } catch (error) {
      setError([`${error}`])
    }
    setIsLoading(false);
    setLoadingMessage(null);
  }

  const register = async (e) => {
    e.stopPropagation();
    const isValid = await validate();
    if (isValid) {
      registerUserWithFirebase();
    }
  }

  const reset = (e) => {
    e.stopPropagation();
    emailRef.current.value = "";
    passwordRef.current.value = "";
    dnRef.current.value = "";
  }

  return (
    <div className={Style.container}>
      <Loading {...{ isLoading, loadingMessage }} />
      <div className={Style.loginBox}>
        <span className={Style.chatTitle}>
          <Logo /> Fire Chat
        </span>
        <span className={Style.loginTitle}>Register</span>
        <div className={Style.formBox}>
          <input type="text" placeholder='Display Name' ref={dnRef} className={Style.input} onChange={onInputChange} />
          <input type="email" placeholder='Email' ref={emailRef} className={Style.input} onChange={onInputChange} />
          <Password ref={passwordRef} onChange={onInputChange} />
          <div className={Style.actionBox}>
            <button className={Style.registerBtn} onClick={reset} disabled={isLoading}>
              Reset
            </button>
            <button className={Style.registerBtn} onClick={register} disabled={!isValid || isLoading}>
              Register
            </button>
          </div>
          <Invalids {...{ isValid, invalids }} />
          <Errors error={error} />
          <span className={Style.centerPara}>
            You have an account?
            <Link to="/login"> Login </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register