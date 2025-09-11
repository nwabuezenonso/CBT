import React from 'react'
import { useState } from 'react';

const useSigninForm = () => {
 const [formData, setFormData] = useState({
    emailAddress: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.emailAddress.trim()) newErrors.emailAddress = "EmailAddress is required";
    else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) newErrors.emailAddress = "Please enter a valid emailAddress";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
     const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
      "Content-Type" : "application/json"
      },
      body: JSON.stringify(formData),
     });

     if(!res.ok){
      throw new Error( "signin failed. try do am again")
     }

     const data = await res.json();
     console.log("signin success", data)
     alert("successfully signin! welcome my friend!")
    } catch(error) {
      console.log(error)
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  return{
    handleSubmit,
    formData,
    setFormData,
    handleInputChange,
    errors,
    showPassword,
    setShowPassword,
    isLoading,
  }
}

export default useSigninForm