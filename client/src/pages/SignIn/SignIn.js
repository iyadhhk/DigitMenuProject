import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../features/authSlice';
import { ImSpinner9 } from 'react-icons/im';
import { IconContext } from 'react-icons';
import './SignIn.css';

const SignIn = () => {
  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const { username, password } = values;
  const { authStatus, authErrors } = useSelector((state) => state.auth);

  let history = useHistory();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(login({ history, username, password }));
  };
  return (
    <div className='signin'>
      <div className='signin__container'>
        <h1>Se connecter</h1>
        <form>
          <div className='signin__form__group'>
            <h5>Nom d'utilisateur</h5>
            <span>
              {authStatus.authUser === 'failed' &&
                authErrors.authUser &&
                authErrors.authUser.data.filter((err) => err.param === 'username')[0] &&
                authErrors.authUser.data.filter((err) => err.param === 'username')[0].msg}
            </span>
            <input
              type='text'
              className='signin__container__form__input valid__input'
              name='username'
              value={username}
              onChange={handleChange}
            />
          </div>
          <div className='signin__form__group'>
            <h5>Mot de passe</h5>
            <span>
              {authStatus.authUser === 'failed' &&
                authErrors.authUser &&
                authErrors.authUser.data.filter((err) => err.param === 'password')[0] &&
                authErrors.authUser.data.filter((err) => err.param === 'password')[0].msg}
            </span>

            <input
              type='password'
              className='signin__container__form__input valid__input'
              name='password'
              value={password}
              onChange={handleChange}
            />
          </div>
          <button type='submit' className='signin__signInButton' onClick={handleClick}>
            {authStatus.authUser === 'loading' ? (
              <IconContext.Provider value={{ className: 'spinner' }}>
                <div>
                  <ImSpinner9 />
                </div>
              </IconContext.Provider>
            ) : (
              <span>connexion</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
