
import { yupResolver } from "@hookform/resolvers/yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiChatPrivateFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import Layout from "../components/Layout";
import { auth } from "../firebase";

const loginSchema = yup
  .object({
    email: yup.string().email("Email is invalid").required("Email is required"),
  })
  .required();

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    const {email}=data
    setLoading(true)
    sendPasswordResetEmail(auth, email)
    .then((res) => {
    setLoading(false)
      toast.success("We send reset request in your email")
      
    })
    .catch((error) => {
        setLoading(false)
     console.log(error)
      // ..
    });
  };

  return (
   
        <Layout>     
          <div className="bg-gradient-to-r from-cyan-50 to-cyan-500 shadow-sm shadow-gray-700 grid sm:grid-cols-2 mt-14 mb-20  px-8 py-10 rounded-md">
            <div>
             
              <RiChatPrivateFill className="hidden sm:block  sm:text-[16rem] md:text-[20rem] lg:text-[25rem] text-cyan-600" />
            </div>
            <div className="container w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="mb-8 text-2xl sm:text-3xl text-center">
                  Forgot password
                </h1>

                <div>
                  <input
                    type="text"
                    className="block border border-grey-light w-full p-3 rounded mb-1 focus:outline-dotted"
                    name="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  <p className="text-sm ml-1 mb-4 text-red-500">{errors.email?.message}</p>
                </div>
                

                <button
                  type="submit"
                  className="w-full text-center py-3 rounded bg-cyan-600 shadow-sm shadow-black text-white  my-1 font-medium uppercase"
                >
                  {loading ? (
                    <>
                      submit
                      <div className="w-5 h-5 rounded-full border-r-2 border-l-2 border-white animate-spin inline-block ml-2 "></div>
                    </>
                  ) : (
                    "submit"
                  )}
                </button>
               
              </form>
              <div className="text-center">
              <Link
                  className="no-underline border-b border-blue text-blue text-red-500"
                  to="/login"
                >
                  Back to Login Page
                </Link>
                .
              </div>
            </div>
          </div>
        </Layout>
     
  );
}