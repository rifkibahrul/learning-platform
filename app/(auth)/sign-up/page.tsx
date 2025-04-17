"use client";

import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";
import React from "react";

const Signup = () => (
    <AuthForm
        type="SIGN_UP"
        schema={signUpSchema}
        defaultValues={{
            email: "",
            password: "",
            fullName: "",
            studentId: 0,
            studentCard: "",
        }}
        onSubmit={() => {}}
    />
);

export default Signup;
