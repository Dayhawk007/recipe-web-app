'use client'
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import * as Yup from 'yup';
import Link from "next/link";

const Login: React.FC = () => {
    const [loginData, setLoginData] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form data
        const schema = Yup.object().shape({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        });

        try {
            await schema.validate(loginData, { abortEarly: false });
            // If validation passes, proceed with form submission
            const response = await fetch("/api/user/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (response.ok) {
                Cookies.set("token", data.token); // Store the token in cookies
                router.push("/recipe-maker"); // Redirect to recipe maker page
            } else {
                alert("Wrong Credentials or Invalid Request");
            }
        } catch (error) {
            // Handle validation errors
            if (error instanceof Yup.ValidationError) {
                const validationErrors: { [key: string]: string } = {};
                error.inner.forEach((e) => {
                    if (e.path) {
                        validationErrors[e.path] = e.message;
                    }
                });
                setErrors(validationErrors);
            }
        }
    };

    return (
        <div className="flex flex-col relative overflow-hidden h-screen w-screen justify-center z-10 items-center">
            <Image src="/images/login-bg.png" alt="Background Image" height={1200} width={1550} className="absolute top-0 left-0 -z-10" />
            <div className="flex flex-col bg-primary items-start space-y-6 md:px-40 md:py-12 px-12 py-8 md:w-5/12 w-3/4 rounded-2xl">
                <h4 className="text-3xl text-white">Log In</h4>
                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-col space-y-3">
                        <label htmlFor="email" className="text-sm font-medium text-dark-gray">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            value={loginData.email}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md text-black ${errors.email ? 'border-red-500' : ''}`}
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
                            value={loginData.password}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm text-black focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md ${errors.password ? 'border-red-500' : ''}`}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-secondary text-primary py-2 px-4 rounded-md hover:bg-yellow-400 focus:outline-none focus:bg-yellow-400 font-medium"
                    >
                        Sign in
                    </button>
                </form>
                <p className="self-center text-sm font-medium text-dark-gray">Don't have an account? <Link href={"/signup"} ><span className="text-secondary font-medium">Sign Up</span></Link></p>
            </div>
        </div>
    );
};

export default Login;
