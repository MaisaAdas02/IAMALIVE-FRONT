import { useMutation } from "@tanstack/react-query";
import "./SendCode.css";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Loadingcircle from "../../Components/Loadingcircle/Loadingcircle";

const SendCode = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [showForgetForm, setShowForgetForm] = useState(false)
    const [forgetData, setForgetData] = useState({
        newPassword: "",
        code: ""
    })

    const sendCodeMutation = useMutation({
        mutationFn: async () => {
            const { data } = await axios.patch('/auth/sendCode', {
                email
            })
            return data;
        },
        onSuccess: () => {
            toast.success('we sent code to your email, check your email!')
            setShowForgetForm(true)
        }
    })

    const forgetMutation = useMutation({
        mutationFn: async () => {
            const {data } = await axios.post('/auth/forgetPassword', forgetData, {
                headers: {
                    email
                }
            })
            return data;
        },
        onSuccess: () => {
            toast.success('done!')
            navigate('/')

        }

    })

    function handleSubmit1(e) {
        e.preventDefault()
        sendCodeMutation.mutate()
    }
    function handleSubmit2(e) {
        e.preventDefault()
        forgetMutation.mutate()
    }

    return (
        <div className="pageContainer">
            {!showForgetForm && (
                <form className="sendEmail" onSubmit={handleSubmit1}>
                    <h1>Enter your email</h1>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="example@gmail.com"
                    />

                    <button type="submit">
                        {sendCodeMutation.isPending ? (
                                <Loadingcircle color="black" size={20} />
                            ) : (
                                "Submit"
                            )}
                    </button>
                </form>
            )}

            {showForgetForm && (
                <>
                    
                    <form className="resetpassword" onSubmit={handleSubmit2}>
                        <h2>Enter the code & new password</h2>
                        <input
                            type="text"
                            onChange={(e) => setForgetData(prev => ({ ...prev, code: e.target.value }))}
                            value={forgetData.code}
                            placeholder="ABCD"
                        />
                        <input
                            type="password"
                            onChange={(e) => setForgetData(prev => ({ ...prev, newPassword: e.target.value }))}
                            value={forgetData.newPassword}
                            placeholder="*******"
                        />

                        <button type="submit">
                        {forgetMutation.isPending ? (
                                <Loadingcircle color="black" size={20} />
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default SendCode;
