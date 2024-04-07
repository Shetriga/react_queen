import React, { useEffect, useState } from "react";
import classes from './LoginForm.module.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    // console.log('Latest log: ' + localStorage.getItem('some'));
    // localStorage.setItem('some', 'Mahmoud Atef');
    localStorage.clear();

    useEffect(() => {
        console.log('LOGIN FORM')
    }, [])

    const usernameChangeHandler = (event) => {
        setEnteredUsername(event.target.value);
    }

    const passwordChangeHandler = (event) => {
        setEnteredPassword(event.target.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        console.log('Form submit pressed!');
        // console.log(enteredUsername + ' ' + enteredPassword);
        setIsLoading(true);
        if (invalidCredentials) {
            setInvalidCredentials(false);
        }
        fetch('http://146.190.156.189:3000/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                'username': enteredUsername,
                'password': enteredPassword,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                setInvalidCredentials(true);
                return;
            }
            return response.json();
        }).then(data => {
            setIsLoading(false);
            console.log(data);
            setIsLoggedIn(true);
            setAuthUser({
                name: 'Test111'
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('type', data.user.type);
            navigate('/home');
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        })
    }

    return (
        <div className={classes.mainDiv}>
            <div className={classes.wrapper}>
                <form action="" onSubmit={onSubmitHandler}>
                    <h1>Login</h1>
                    <div className={classes.inputBox}>
                        <input type="text" placeholder="Username" required onChange={usernameChangeHandler} />
                        <FaUser className={classes.icon} />
                    </div>
                    <div className={classes.inputBox}>
                        <input type="password" placeholder="Password" required onChange={passwordChangeHandler} />
                        <FaLock className={classes.icon} />
                    </div>
                    {invalidCredentials ? <p className={classes.invalidCredentials}>Wrong username or password</p> : null}

                    <button disabled={isLoading} type="submit">{isLoading ? 'Loading...' : 'Login'}</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;