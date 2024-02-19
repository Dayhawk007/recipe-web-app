'use client'
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import * as Yup from "yup";
import Link from "next/link";

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const SignUp: React.FC = () => {
    const [signUpData, setSignUpData] = useState<{ username: string; email: string; password: string }>({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignUpData({ ...signUpData, [name]: value });
        setErrors((prevErrors) => {
            return { ...prevErrors, [name]: '' }; // Reset the error for the field
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await validationSchema.validate(signUpData, { abortEarly: false });
            const response = await fetch("/api/user/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signUpData),
            });
            const data = await response.json();
            if (response.ok) {
                alert("User Signed up");
                Cookies.set("token", data.token); // Store the token in cookies
                router.push("/recipe-maker"); // Redirect to recipe maker page
            } else {
                alert("Error: "+data.message);
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                error.inner.forEach((e:any) => {
                    newErrors[e.path] = e.message;
                });
                setErrors(newErrors);
            }
        }
    };

    return (
        <div className="flex flex-col relative overflow-hidden h-screen w-screen justify-center z-10 items-center">
            <Image src="/images/login-bg.png" alt="Background Image" layout='fill' className="absolute top-0 left-0 -z-10" />
            <div className="flex flex-col bg-primary items-start space-y-6 md:px-40 md:py-12 px-12 py-8 md:w-5/12 w-3/4 rounded-2xl">
                <h4 className="text-3xl text-white">Sign Up</h4>
                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-col space-y-3">
                        <label htmlFor="username" className="text-sm font-medium text-dark-gray">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                            value={signUpData.username}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md text-black"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>
                    <div className="mb-4 flex flex-col space-y-3">
                        <label htmlFor="email" className="text-sm font-medium text-dark-gray">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            value={signUpData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md text-black"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="mb-6 flex flex-col space-y-3">
                        <label htmlFor="password" className="text-sm font-medium text-dark-gray">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter Password"
                            value={signUpData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm text-black focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-secondary text-primary py-2 px-4 rounded-md hover:bg-yellow-400 focus:outline-none focus:bg-yellow-400 font-medium"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="self-center text-sm font-medium text-dark-gray">Already have an account? <Link href="/login"><span className="text-secondary font-medium">Log In</span></Link></p>
            </div>
        </div>
    );
};

export default SignUp;
