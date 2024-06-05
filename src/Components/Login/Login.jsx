import React, { useContext, useState } from "react";
import "./Login.css";
import "../../App.css";
import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { BsShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

//import our assets
import video from "../../LoginAssets/video.mp4";
import logo from "../../LoginAssets/iamalive.png";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../../context/UserProvider";

const Login = () => {
     const navigate = useNavigate();
     const [formInfo, setFormInfo] = useState({
          email: "",
          password: "",
     });
     const { setToken, setUser } = useContext(UserContext);

     function handleChange(e) {
          const { value, name } = e.target;
          setFormInfo((prev) => ({
               ...prev,
               [name]: value,
          }));
     }

     const { mutate: login, isPending } = useMutation({
          mutationFn: async (loginData) => {
               const { data } = await axios.post("/auth/signIn", loginData);
               return data;
          },
          onSuccess: (data) => {
               if (data.role === "Victim") {
                    toast.error("You are not allowed to sign in here.");
               } else {
                    // localStorage.setItem("token", data.token);
                    setToken(data.token);
                    setUser(data.user);
                    navigate("/dashboard");
               }
          },
          onError: (error) => {
               toast.error(
                    error.response.data.message || "Something went wrong!!"
               );
          },
     });



     return (
          <div className="loginPage flex">
               <div className="container flex">
                    <div className="videoDiv">
                         <video src={video} autoPlay muted loop></video>

                         <div className="textDiv">
                              <h2 className="title">I AM ALIVE</h2>
                              <p>Is this peace! So why peace!</p>
                         </div>
                         <div className="footerDiv flex">
                              <span className="text">
                                   Don't have an account?
                              </span>
                              <Link to={"/register"}>
                                   <button className="btn">Sign Up</button>
                              </Link>
                         </div>
                    </div>

                    <div className="formDiv flex">
                         <div className="headerDiv">
                              <img src={logo} alt="Logo Image" />
                              <h3>Welcome Back!</h3>
                         </div>

                         <form
                              action=""
                              className="form grid"
                              onSubmit={(e) => {
                                   e.preventDefault();
                                   login(formInfo);
                              }}
                         >
                              <div className="inputDiv">
                                   <div className="input flex">
                                        <FaUserShield className="icon" />
                                        <input
                                             type="email"
                                             required
                                             name="email"
                                             value={formInfo.email}
                                             onChange={handleChange}
                                             placeholder="Enter Email"
                                        />
                                   </div>
                              </div>
                              <div className="inputDiv">
                                   <div className="input flex">
                                        <BsShieldLockFill className="icon" />
                                        <input
                                             type="password"
                                             required
                                             name="password"
                                             value={formInfo.password}
                                             onChange={handleChange}
                                             placeholder="********"
                                        />
                                   </div>
                              </div>

                              <button type="submit" className="btn flex">
                                   <span>
                                        {isPending ? "Loading..." : "Login"}
                                   </span>
                                   <AiOutlineSwapRight className="icon" />
                              </button>

                              <span className="forgotPassword">
                                   Forgot your password?{" "}
                                   <Link to="/sendcode">Click Here!</Link>
                              </span>
                         </form>
                    </div>
               </div>
          </div>
     );
};

export default Login;
