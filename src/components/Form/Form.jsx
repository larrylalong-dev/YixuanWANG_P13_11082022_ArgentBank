import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Button from "../Button/Button";
import Profile from "../Profile/Profile";
import Transaction from "../Transaction/Transaction";
import "./Form.css";
import axios from "../../app/axios";
import AuthContext from "../../app/AuthProvider";
import Account from "../../data/account.json"

const LOGIN_URL = "/user/login";

const Form = () => {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // reload page
    //console.log(email, password);

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: false, // if it's true?
        }
      );
      console.log(JSON.stringify(response));
      console.log(JSON.stringify(response?.data?.body.token));

      const accessToken = response?.data?.body.token;
     
      setAuth({email, password, accessToken})
      setEmail("");
      setPassword("");
      setSuccess(true);
    } catch (error) {
      if (!error.response){
        setErrMsg('No Server Response');
      } else if (error.response?.status === 400){
        setErrMsg('Wrong Email or Password')
      }else{
        setErrMsg('Login Failed');
      }
    }
  };
  console.log(email, password);

  return (
    <>
      {success ? (
        <section>
          <Profile/>
          {Account.map((account)=>{
            return ( 
              < Transaction
              key={account.id} 
              bank = {account.bank}
              amount = {account.amount}
              description={account.description}
              />
            );
          })}
        </section>
      ) : (
        <section className="login-content">
          <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
          <FaUserCircle className="sign-in-icon" />
          <h1>Sign In</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-login-wrapper">
              <label htmlFor="email">E-mail:</label>
              <input
                type="text"
                id="email"
                autoComplete="off"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-login-wrapper">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                required
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="remember-wrapper">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Button className="sign-in-btn">Sign In</Button>
          </form>
          <p>
            Need an account?
            <br />
            <Link to="/" className="sign-up-message">
              Sign Up
            </Link>
          </p>
        </section>
      )}
    </>
  );
};
export default Form;

/**
 * autoComplete="off"
 * [DOM] Input elements should have autocomplete attributes (suggested: "current-password"): (More info: https://goo.gl/9p2vKq)
 */
