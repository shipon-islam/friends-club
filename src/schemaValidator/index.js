import * as yup from "yup";
export const contactSchema = yup
  .object({
    name: yup.string().min(0).required("Name is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    message: yup.string().min(0).required("Message is required"),
    governorat: yup.string(),
  })
  .required();

export const loginSchema = yup
  .object({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

export const memberRegisterSchema = yup
  .object({
    firstname: yup.string().min(0).required("First name is required"),
    lastname: yup.string().min(0).required("Last name is required"),
    dob: yup.string().min(0).required("Date of birth is required"),
    phone: yup
      .string()
      .required("Phone is required")
      .min(11)
      .matches("^(?:\\+88|88)?(01[3-9]\\d{8})$", {
        message: "Please enter valid number.",
        excludeEmptyString: false,
      }),
    gender: yup.string().min(0).required("gender is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase"
      ),
  })
  .required();
