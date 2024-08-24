import { handshakeHello } from "../../Utils.mjs";
import "./SignIn.css";
import { getProjectName } from "../../Utils.mjs";
import validator from "validator";
import apiUrls from "../../apiUrls.mjs";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiSnackbar, {
  useSetInitialStateSnackbar,
  openTheSnackBar,
  showErrorMsg,
} from "../../Components/MUI/Snackbar/MuiSnackbar";

export default function SignIn() {
  const navigate = useNavigate();
  const [open, setOpen] = useSetInitialStateSnackbar();
  const [snackbarState, setSnackbarState] = useState({
    msg: "",
    successOrError: "error",
  });

  const refUsernameOrEmailOrMobile = useRef(null);
  const refPassword = useRef(null);

  useEffect(() => {
    refUsernameOrEmailOrMobile.current.focus();
    handshakeHello();
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    const apiUrl = apiUrls?.user?.login;
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

    const prjName = getProjectName();
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (
        refUsernameOrEmailOrMobile.current.value === "" ||
        refPassword.current.value === ""
      ) {
        showErrorMsg(
          "All form fileds are required, Kindly make sure form is filled properly",
          setSnackbarState,
          setOpen
        );
        return;
      }

      const data = {
        usernameOrEmailOrMobile: refUsernameOrEmailOrMobile.current.value,
        password: refPassword.current.value,
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
      <div className="p-[1rem] flex flex-col gap-[1rem] pb-[0]">
        <h2 className="text-[1.7rem] font-semibold">Sign In </h2>
        <form
          id="theForm"
          className="flex flex-col gap-[.5rem] w-[25rem]"
          onSubmit={handleFormSubmit}
        >
          <input
            required
            type="text"
            name="username"
            ref={refUsernameOrEmailOrMobile}
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

          <button className="border-[.15rem] border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-300 p-[.5rem] rounded-xl transition hover:bg-gradient-to-br hover:from-yellow-300 hover:to-yellow-100 font-medium">
            Sign In
          </button>
        </form>
      </div>
      <div
        id="wrapperOr"
        className=" w-[25rem] flex flex-col gap-[.5rem] items-center"
      >
        <div className=" border-b-[.1rem] relative h-[1rem] mb-[1rem] border-stone-700 w-[100%]">
          <span className="absolute  top-[.2rem] left-[42%] w-[3rem] text-center bg-stone-300">
            or
          </span>
        </div>
        <a
          onClick={() => navigate("/sign-up")}
          className="cursor-pointer text-center mt-[.7rem] underline text-[1.2rem] font-medium text-blue-500 "
        >
          Create a new account
        </a>
      </div>
    </div>
  );
}
