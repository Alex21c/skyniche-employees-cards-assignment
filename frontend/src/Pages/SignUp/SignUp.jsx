import "./SignUp.css";
import validator from "validator";
import apiUrls from "../../apiUrls.mjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiSnackbar, {
  useSetInitialStateSnackbar,
  openTheSnackBar,
  showErrorMsg,
} from "../../Components/MUI/Snackbar/MuiSnackbar";

export default function SignUp() {
  const navigate = useNavigate();
  const [open, setOpen] = useSetInitialStateSnackbar();
  const [snackbarState, setSnackbarState] = useState({
    msg: "",
    successOrError: "error",
  });

  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const refFirstName = useRef(null);
  const refLastName = useRef(null);
  const refEmail = useRef(null);
  const refMobile = useRef(null);

  useEffect(() => {
    refUsername.current.focus();
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    const apiUrl = apiUrls?.user?.registerNewUser;
    if (!apiUrl) {
      console.log(
        "failed to make api call,  Missing apiUrls?.user?.registerNewUser"
      );
      showErrorMsg(
        "Failed to SignUp, kindly try again later",
        setSnackbarState,
        setOpen
      );
      return;
    }

    //make an api call to the backend
    if (
      !validator.isURL(process.env.REACT_APP_SERVER_ROOT_URL, {
        require_tld: false,
      })
    ) {
      console.log(
        `failed to make api call, kindly make sure .env contains valid url, process.env.REACT_APP_SERVER_ROOT_URL, ${process.env.REACT_APP_SERVER_ROOT_URL}`
      );
      showErrorMsg(
        "Failed to SignUp, kindly try again later",
        setSnackbarState,
        setOpen
      );
      return;
    }
    const reqUrl = process.env.REACT_APP_SERVER_ROOT_URL + apiUrl;

    console.log();
    const prjName =
      process.env.REACT_APP_PROJECT_NAME ||
      "alex21c-skyniche-employees-cards-assignment";
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (
        refUsername.current.value === "" ||
        refPassword.current.value === "" ||
        refFirstName.current.value === "" ||
        refLastName.current.value === "" ||
        refEmail.current.value === "" ||
        refMobile.current.value === ""
      ) {
        showErrorMsg(
          "All form fileds are required, Kindly make sure form is filled properly",
          setSnackbarState,
          setOpen
        );
        return;
      }

      const data = {
        username: refUsername.current.value,
        password: refPassword.current.value,
        firstName: refFirstName.current.value,
        lastName: refLastName.current.value,
        email: refEmail.current.value,
        mobile: refMobile.current.value,
      };

      let response = await fetch(reqUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error(
          "Failed to Make Req. with Server! please try again later..."
        );
      }
      response = await response.json();
      if (!response.success) {
        throw new Error(response.message);
      }
      localStorage.setItem(prjName + "-Authorization", response?.Authorization);
      // redirect user to homepage
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      showErrorMsg(error.message, setSnackbarState, setOpen);
    }

    // if success, save the auth token to local storage and then return user to the homepage
    // otherwise show failure message
  }

  return (
    <div className="flex flex-col items-center text-stone-700">
      <MuiSnackbar
        open={open}
        setOpen={setOpen}
        snackbarState={snackbarState}
      />
      <div className="p-[1rem] flex flex-col gap-[1rem]">
        <h2 className="text-[1.7rem] font-semibold">Create a New Account </h2>
        <form
          id="signUp"
          className="flex flex-col gap-[.5rem] w-[25rem]"
          onSubmit={handleFormSubmit}
        >
          <input
            required
            type="text"
            name="username"
            ref={refUsername}
            placeholder="username"
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />
          <input
            required
            type="password"
            name="password"
            ref={refPassword}
            placeholder="password"
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />
          <div className="wrapperFirstAndLastName flex gap-[.2rem]">
            <input
              required
              type="text"
              name="firstName"
              ref={refFirstName}
              placeholder="firstName"
              className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
            />
            <input
              required
              type="text"
              name="lastName"
              ref={refLastName}
              placeholder="lastName"
              className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
            />
          </div>
          <input
            required
            type="email"
            name="email"
            ref={refEmail}
            placeholder="email"
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />
          <input
            required
            type="mobile"
            name="mobile"
            ref={refMobile}
            placeholder="mobile"
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />

          <button className="border-[.15rem] border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-300 p-[.5rem] rounded-xl transition hover:bg-gradient-to-br hover:from-yellow-300 hover:to-yellow-100 font-medium">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
