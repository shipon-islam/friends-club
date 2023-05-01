import { yupResolver } from "@hookform/resolvers/yup";
import { updatePassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiChatPrivateFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import Layout from "../components/Layout";
import { auth } from "../firebase";

const schema = yup
  .object({
    oldPassword: yup.string().required("Old password is required"),
    newPassword: yup.string().required("new password is required"),
  })
  .required();

export default function ChangePassword() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate=useNavigate()


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setIsSignup(true)
    const { newPassword } = data;
    const user =auth.currentUser
    updatePassword(user,newPassword)
      .then(() => {
        toast.success("changed successfuly",{autoClose:700});        
        setIsSignup(false)
        navigate("/profile")
      })
      .catch((error) => {
        toast.error(error.message,{autoClose:700});
        console.log(error);
        setIsSignup(false)
      });
  };

  return (
    <Layout className="min-h-[73vh]">

      <div className="bg-gradient-to-r from-cyan-50 to-cyan-500 shadow-sm shadow-gray-700 grid sm:grid-cols-2 mt-14 mb-20  px-8 py-10 rounded-md">
        <div>
          <RiChatPrivateFill className="hidden sm:block  sm:text-[16rem] md:text-[20rem] lg:text-[25rem] text-cyan-600" />
        </div>
        <div className="container w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="mb-8 text-2xl sm:text-3xl text-center">
              Change password
            </h1>
            <div className="relative">
              <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-1 focus:outline-dotted"
                name="oldPassword"
                placeholder="Old password"
                {...register("oldPassword")}
              />
              <p className=" text-sm ml-1 mb-4">
                {errors.oldPassword?.message}
              </p>
            </div>
            <div className="relative">
              <input
                type="password"
                className="block border border-grey-light w-full p-3 rounded mb-1 focus:outline-dotted"
                name="newPassword"
                placeholder="New password"
                {...register("newPassword")}
              />
              <p className=" text-sm ml-1 mb-4">
                {errors.newPassword?.message}
              </p>
            </div>

            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-cyan-600 shadow-sm shadow-black  my-1 font-medium uppercase"
            >
              {isSignup ? (
                <>
                  changing
                  <div className="w-5 h-5 rounded-full border-r-2 border-l-2 border-gray-50 animate-spin inline-block ml-2 "></div>
                </>
              ) : (
                "change"
              )}
            </button>
          </form>
          <div className="text-center">
            If you do not want change?
            <Link
              className="no-underline border-b border-blue text-blue text-red-500"
              to="/profile"
            >
              Return back
            </Link>
            .
          </div>
        </div>
      </div>
    </Layout>
  );
}
