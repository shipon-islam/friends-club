import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaHouseUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { memberRegisterSchema } from "../schemaValidator";

export default function Register() {
  const { signup, isSignup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(memberRegisterSchema),
  });
  const onSubmit = (data) => {
    signup(data);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-cyan-50 to-cyan-500 shadow-sm shadow-gray-700 grid sm:grid-cols-[1fr_2fr] mt-14 mb-20  px-8 py-10 rounded-md items-center">
        <div>
          <FaHouseUser className="hidden sm:block  sm:text-[8rem] md:text-[18rem] lg:text-[20rem] text-cyan-600" />
        </div>
        <div className="container w-full">
          <h1 className="mb-8 text-2xl sm:text-3xl text-center text-cyan-800">
            Community Registration
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 gap-2">
              <div>
                <label
                  className="mb-1 inline-block ml-1 capitalize"
                  htmlFor="firstname"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  className="block border border-grey-light w-full px-3 py-2 rounded focus:outline-dotted"
                  name="firstname"
                  placeholder="Enter your first name"
                  {...register("firstname")}
                />
                <p className="text-sm ml-1 mb-2 text-red-500">
                  {errors.firstname?.message}
                </p>
              </div>
              <div>
                <label
                  className="mb-1 inline-block ml-1 capitalize"
                  htmlFor="lastname"
                >
                  last name:
                </label>
                <input
                  type="text"
                  className="block border border-grey-light w-full px-3 py-2 rounded focus:outline-dotted"
                  name="lastname"
                  placeholder="Enter your last name"
                  {...register("lastname")}
                />
                <p className="text-sm ml-1 mb-2 text-red-500">
                  {errors.lastname?.message}
                </p>
              </div>
              <div>
                <label
                  className="mb-1 inline-block ml-1 capitalize"
                  htmlFor="email"
                >
                  email:
                </label>
                <input
                  type="email"
                  className="block border border-grey-light w-full px-3 py-2 rounded focus:outline-dotted"
                  name="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                <p className="text-sm ml-1 mb-2 text-red-500">
                  {errors.email?.message}
                </p>
              </div>
              <div>
                <label
                  className="mb-1 inline-block ml-1 capitalize"
                  htmlFor="phone"
                >
                  phone:
                </label>
                <input
                  type="text"
                  className="block border border-grey-light w-full px-3 py-2 rounded focus:outline-dotted"
                  name="phone"
                  placeholder="Enter your number"
                  {...register("phone")}
                />
                <p className="text-sm ml-1 mb-2 text-red-500">
                  {errors.phone?.message}
                </p>
              </div>

              <div>
                <label
                  className="mb-1 inline-block ml-1 capitalize"
                  htmlFor="password"
                >
                  password:
                </label>
                <input
                  type="password"
                  className="block border border-grey-light w-full px-3 py-2 rounded focus:outline-dotted"
                  name="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <p className=" text-sm ml-1 mb-2 text-red-500">
                  {errors.password?.message}
                </p>
              </div>
              <div>
                <label
                  className="mb-1 inline-block ml-1 capitalize"
                  htmlFor="dob"
                >
                  date of birth:
                </label>
                <input
                  type="date"
                  className="block border border-grey-light w-full px-3 py-2 rounded focus:outline-dotted"
                  name="dob"
                  placeholder="dath of birth"
                  {...register("dob")}
                />
                <p className="text-sm ml-1 mb-2 text-red-500">
                  {errors.birthday?.message}
                </p>
              </div>

              <div className="">
                <label
                  className="mb-1 inline-block ml-1 capitalize"
                  htmlFor="gender"
                >
                  gender:
                </label>
                <select
                  className="block border border-grey-light w-full px-3 py-[0.7rem] rounded focus:outline-dotted"
                  name="gender"
                  {...register("gender")}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <p className="text-sm ml-1 mb-2 text-red-500">
                  {errors.gender?.message}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-fit text-center py-2 px-6 ml-auto rounded bg-cyan-600 shadow-sm shadow-black mt-6 sm:mt-0  my-1 font-medium uppercase block"
            >
              {isSignup ? (
                <>
                  Registering
                  <div className="w-5 h-5 rounded-full border-r-2 border-l-2 border-black animate-spin inline-block ml-2 "></div>
                </>
              ) : (
                "Register"
              )}
            </button>
            <div className="text-center text-sm text-grey-dark mt-4">
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
          </form>
          <div className="text-center">
            Already have an account?
            <Link
              className="no-underline border-b border-blue text-blue text-red-500"
              to="/login"
            >
              Log in
            </Link>
            .
          </div>
        </div>
      </div>
    </Layout>
  );
}
