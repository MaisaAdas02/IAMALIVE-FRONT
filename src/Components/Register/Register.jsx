import React, { useState } from "react";
import "./Register.css";
import "../../App.css";
import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { BsShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { MdMarkEmailRead, MdLocationCity } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../../context/UserProvider";
import { registerSchema } from "../validation/validate";
import axios from "axios";

// import our assets
import video from "../../LoginAssets/video.mp4";
import logo from "../../LoginAssets/iamalive.png";

const Register = () => {
     const [formdata, setFormdata] = useState({
          name: "",
          email: "",
          city: "",
          password: "",
          isVictim: false,
     });
     function handleChange(e) {
          const { value, name } = e.target;
          setFormdata((prev) => ({
               ...prev,
               [name]: value,
          }));
     }
     


     const { mutate: signup, isPending } = useMutation({
          mutationFn: async (signupData) => {
               const { data } = await axios.post("/auth/signup", signupData);
               return data;
          },
          onSuccess: (data) => {
               if (data.role === "Victim") {
                    toast.error("You are not allowed to sign in here.");
               } else {
                    // localStorage.setItem("token", data.token);
                    setToken(data.token);
                    setUser(data.user);
                    navigate("/");
               }
          },
          onError: (error) => {
               toast.error(
                    error.response.data.message || "Something went wrong!!"
               );
          },
     });


     //const formik = useFormik({
     //     initialValues,
     //     onSubmit,
     //     validationSchema: registerSchema,
     //});

     return (
          <div className="registerPage flex">
               <div className="container flex">
                    <div className="videoDiv">
                         <video src={video} autoPlay muted loop></video>
                         <div className="textDiv">
                              <h2 className="title">I AM ALIVE</h2>
                              <p>Is this peace! So why peace!</p>
                         </div>

                         <div className="footerDiv flex">
                              <span className="text">Have an account?</span>
                              <Link to={"/"}>
                                   <button className="btn">Login</button>
                              </Link>
                         </div>
                    </div>

                    <div className="formDiv flex">
                         <div className="headerDiv">
                              <img src={logo} alt="Logo Image" />
                              <h3>Let Us Know You!</h3>
                         </div>

                         <form
                              action=""
                              className="form grid"
                              onSubmit={(e) => {
                                   e.preventDefault();
                                   signup(formdata);
                              }}
                         >
                              <div className="inputDiv">
                                   <div className="input flex">
                                        <FaUserShield className="icon" />
                                        <input
                                             type="text"
                                             name="name"
                                             placeholder="Enter Username"
                                             value={formdata.name}
                                             onChange={handleChange}
                                        />
                                   </div>
                                   
                              </div>

                              <div className="inputDiv">
                                   <div className="input flex">
                                        <MdMarkEmailRead className="icon" />
                                        <input
                                             type="email"
                                             name="email"
                                             placeholder="Enter Email"
                                             value={formdata.email}
                                             onChange={handleChange}
                                        />
                                   </div>
                                   
                              </div>

                              <div className="inputDiv">
                                   <div className="input flex">
                                        <MdLocationCity className="icon" />
                                        <input
                                             type="text"
                                             name="city"
                                             placeholder="Enter City"
                                             value={formdata.city}
                                             onChange={handleChange}
                                        />
                                   </div>
                                   
                              </div>

                              <div className="inputDiv">
                                   <div className="input flex">
                                        <BsShieldLockFill className="icon" />
                                        <input
                                             type="password"
                                             name="password"
                                             placeholder="Enter Password"
                                             value={formdata.password}
                                             onChange={handleChange}
                                        />
                                   </div>
                                   
                              </div>

                              <div className="inputDiv">
                                   <div className="input flex">
                                        <BsShieldLockFill className="icon" />
                                        <input
                                             type="password"
                                             id="confirmPassword"
                                             placeholder="Confirm Password"
                                             //value={formik.values.confirmPassword}
                                             //onChange={formik.handleChange}
                                        />
                                   </div>
                                   
                              </div>
                              <button
                                   type="submit"
                                   className="btn flex"
                                   //disabled={!formik.isValid}
                              >
                                   <span>Register</span>
                                   <AiOutlineSwapRight className="icon" />
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     );
};

export default Register;
