import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// import Helmet from "react-helmet-async";
import signUp from '../../../assets/login2.png'
import { useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../../../Components/Shared/SocialLogin";




const SignUp = () => {
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const result = await createUser(data.email, data.password);
            const loggedUser = result.user;

            // Update user profile
            await updateUserProfile(data.name, data.photoURL);

            // Save user data in the database
            const userInfo = {
                name: data.name,
                email: data.email,
                image: data.photoURL,
                role: data.type,
            };

            const response = await axiosPublic.post("/users", userInfo);

            if (response.data.insertedId) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "User created successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset();
                navigate("/");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Something went wrong!",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* <Helmet>
                <title>ParcelTrackr | Sign Up</title>
            </Helmet> */}
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-center">
                        <h1 className="text-4xl font-bold">Sign up now!</h1>
                        <img src={signUp} alt="Sign Up" className="m-3" />
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("name", { required: true })}
                                    placeholder="Name"
                                    className="input input-bordered"
                                />
                                {errors.name && <span className="text-red-600">Name is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Photo URL</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("photoURL", { required: true })}
                                    placeholder="Photo URL"
                                    className="input input-bordered"
                                />
                                {errors.photoURL && <span className="text-red-600">Photo URL is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    placeholder="Email"
                                    className="input input-bordered"
                                />
                                {errors.email && <span className="text-red-600">Email is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text pr-3">User Type :</span>
                                </label>
                                <select
                                    {...register("type", { required: true })}
                                    className="p-2 border rounded-lg"
                                >
                                    <option value="">Select User Type</option>
                                    <option value="User">User</option>
                                    <option value="DeliveryMen">DeliveryMen</option>
                                </select>
                                {errors.type && <span className="text-red-600">User Type is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                        maxLength: 20,
                                        pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                                    })}
                                    placeholder="Password"
                                    className="input input-bordered"
                                />
                                {errors.password?.type === "required" && (
                                    <p className="text-red-600">Password is required</p>
                                )}
                                {errors.password?.type === "minLength" && (
                                    <p className="text-red-600">Password must be at least 6 characters</p>
                                )}
                                {errors.password?.type === "maxLength" && (
                                    <p className="text-red-600">Password must be less than 20 characters</p>
                                )}
                                {errors.password?.type === "pattern" && (
                                    <p className="text-red-600">
                                        Password must include uppercase, lowercase, number, and special character
                                    </p>
                                )}
                            </div>
                            <div className="form-control mt-6">
                                <button
                                    type="submit"
                                    className={`btn btn-primary rounded-xl ${loading ? "loading" : ""}`}
                                    disabled={loading}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                        <p className="form-control pl-6">
                            <small>
                                Already have an account <span className="text-blue-500">?</span> <Link className="hover:text-red-800" to="/login">Login</Link>
                            </small>
                        </p>
                        <SocialLogin />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
