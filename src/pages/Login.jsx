
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { RiChatPrivateFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../schemaValidator";


export default function Login() {
  
    const {login,isSignup,loginWithGoogle}=useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    login(data,"/profile")
  };

  return (
   
        <Layout className="min-h-[73vh]"> 
                
          <div className="bg-gradient-to-r from-green-50 to-cyan-500 shadow-sm shadow-gray-700 grid sm:grid-cols-2 mt-14 mb-20  px-8 py-10 rounded-md">
            <div>
             
              <RiChatPrivateFill className="hidden sm:block  sm:text-[16rem] md:text-[20rem] lg:text-[25rem] text-cyan-600" />
            </div>
            <div className="container w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="mb-8 text-2xl sm:text-3xl text-center text-cyan-900">
                  Login with creadentials
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
                <div className="relative">
                  <input
                    type="password"
                    className="block border border-grey-light w-full p-3 rounded mb-1 focus:outline-dotted"
                    name="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  <p className=" text-sm ml-1 mb-4 text-red-500">
                    {errors.password?.message}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full text-center py-3 rounded bg-cyan-600 shadow-sm shadow-black  my-1 font-medium uppercase"
                >
                  {isSignup ? (
                    <>
                      Loggin
                      <div className="w-5 h-5 rounded-full border-r-2 border-l-2 border-black animate-spin inline-block ml-2 "></div>
                    </>
                  ) : (
                    "login"
                  )}
                </button>
              </form>

              <Link className="text-right block text-red-500 " to="/forgot/password">Forgot Password?</Link>
              <button
              onClick={()=>loginWithGoogle()}
                  type="submit"
                  className="w-full text-center py-3 rounded bg-cyan-700 hover:bg-cyan-900 shadow-sm shadow-black text-white my-1 font-medium uppercase"
                ><FcGoogle className="inline-block text-2xl mr-2"/>sign in with google</button>
                <div className="text-center text-sm text-grey-dark mt-2">
                  By signing up, you agree to the
                  <a
                    className="no-underline border-b border-grey-dark text-grey-dark"
                    href="#"
                  >
                    Terms of Service
                  </a>
                  and
                  <a
                    className="no-underline border-b border-grey-dark text-grey-dark"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                </div>
              <div className="text-center">
                If don't have account?
                <Link
                  className="no-underline border-b border-blue text-blue text-red-500"
                  to="/register"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </Layout>
     
  );
}