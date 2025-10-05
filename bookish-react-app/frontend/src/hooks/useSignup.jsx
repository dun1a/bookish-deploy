import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const useSignup = ({setIsAuthenticated}) => {

    const [message, setMessage] = useState({ text: "", type: "" });
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirm: "",
    });

    // Generate random password
    const generatePassword = () => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let newPassword = "";
        for (let i = 0; i < 12; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setForm({ ...form, password: newPassword, confirm: newPassword });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirm) {
            setMessage({ text: "Passwords do not match!", type: "error" });
            return;
        }
        try {
            const response = await fetch('/api/users/signup', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                const user = await response.json();
                localStorage.setItem("user", JSON.stringify(user))
                setIsAuthenticated(true);
                setMessage({ text: `Account created for ${form.username}!`, type: "success" });
                setSubmitted(true); // hide form, show message
                navigate('/mainPage')
            } else {
                console.error("Wrong input by the user")
                setMessage({ text: "Signup failed. Try again later.", type: "error" });
            }
        } catch {
            console.error("server connectivity issue")
            setMessage({ text: "Server connectivity issue.", type: "error" });
        }
    }



    return {
    form,
    setForm,
    submitted,
    message,
    generatePassword,
    handleSubmit,

    }
}

export default useSignup;