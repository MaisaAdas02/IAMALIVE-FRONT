import React, { useState } from "react";
import "./Register.css";
import "../../App.css";
import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { BsShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { MdMarkEmailRead, MdLocationCity } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
// import our assets
import video from "../../assets/video.mp4";
import logo from "../../assets/iamalive.png";
//import  InputBox&Loadingcircle from our components
import InputBox from "../../Components/InputBox/InputBox";
import Loadingcircle from "../../Components/Loadingcircle/Loadingcircle";

const Register = () => {
     const [formdata, setFormdata] = useState({
          name: "",
          email: "",
          city: "",
          password: "",
          cPassword: "",
          practiceImage: null,
     });
     const inputs = [
          {
               name: "name",
               type: "text",
               icon: FaUserShield,
               placeholder: "John Doe",
               value: formdata.name,
          },
          {
               name: "email",
               type: "email",
               icon: MdMarkEmailRead,
               placeholder: "name@example.com",
               value: formdata.email,
          },
          {
               name: "city",
               type: "text",
               icon: MdLocationCity,
               placeholder: "Palestine",
               value: formdata.city,
          },

          {
               name: "password",
               type: "password",
               icon: BsShieldLockFill,
               placeholder: "******",
               value: formdata.password,
          },
          {
               name: "cPassword",
               type: "password",
               icon: BsShieldLockFill,
               placeholder: "******",
               value: formdata.cPassword,
          },
     ];
     function handleChange(e) {
          const { value, name } = e.target;
          setFormdata((prev) => ({
               ...prev,
               [name]: value,
          }));
     }

     const { mutate: signup, isPending } = useMutation({
          mutationFn: async (signupData) => {
               const { data } = await axios.post("/auth/signup", {
                    name: signupData.name,
                    email: signupData.email,
                    city: signupData.city,
                    password: signupData.password,
               });
               return data;
          },
          onSuccess: (data) => {
               toast.success(data.message);
          },
     });

     const handleSubmit = (e) => {
          e.preventDefault();
          if (formdata.cPassword !== formdata.password) {
               toast.error("Passwords not match");
               return;
          }
          signup(formdata);
     };

     return (
          <div className="registerPage flex">
               <div className="container flex">
                    <div className="videoDiv">
                         <video src={video} autoPlay muted loop></video>
                         <div className="textDiv">
                              <h2 className="title">I Am Alive</h2>
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

                         <form className="form grid" onSubmit={handleSubmit}>
                              {inputs.map((input) => (
                                   <InputBox
                                        key={input.name}
                                        input={input}
                                        handleChange={handleChange}
                                   />
                              ))}
                              <button
                                   type="submit"
                                   className="btn flex"
                                   disabled={isPending}
                              >
                                   <span>
                                        {isPending ? <Loadingcircle /> : "Register"}
                                   </span>
                                   <AiOutlineSwapRight className="icon" />
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     );
};

export default Register;
