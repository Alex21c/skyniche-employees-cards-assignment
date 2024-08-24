import { handshakeHello } from "../../Utils.mjs";
import "./Home.css";
import { useRef } from "react";
import { getProjectName } from "../../Utils.mjs";
import { useEffect } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import SimpleModal from "../../Components/MUI/SimpleModal/SimpleModal";
import EmployeeCard from "../../Components/EmployeeCard/EmployeeCard";
import { useState } from "react";
import apiUrls from "../../apiUrls.mjs";

import MuiSnackbar, {
  useSetInitialStateSnackbar,
  openTheSnackBar,
  showErrorMsg,
} from "../../Components/MUI/Snackbar/MuiSnackbar";

function handleAddEmployee() {}

export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useSetInitialStateSnackbar();
  const [snackbarState, setSnackbarState] = useState({
    msg: "",
    successOrError: "error",
  });

  let [stateEmployees, setStateEmployees] = useState([]);
  function handleLogOut() {
    // delete authorization token
    const prjName =
      process.env.REACT_APP_PROJECT_NAME ||
      "alex21c-skyniche-employees-cards-assignment";
    localStorage.removeItem(prjName + "-Authorization");
    // redirect to sign in
    setTimeout(() => {
      navigate("/sign-in");
    }, 1000);
  }
  async function getAllTheEmployees() {
    const apiUrl = apiUrls?.employee["get-all-the-employees"];
    if (!apiUrl) {
      console.log(
        "failed to make api call,  apiUrls?.employee['get-all-the-employees']"
      );
      showErrorMsg(
        "Failed to Load employees data, kindly try again later",
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

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(
          getProjectName() + "-Authorization"
        ),
      };

      let response = await fetch(reqUrl, {
        method: "GET",
        headers,
      });
      if (!response) {
        throw new Error(
          "Failed to Make Req. with Server! please try again later..."
        );
      }
      // if unauthorized return to sign in
      if (response?.status === 401 || response?.statusText === "Unauthorized") {
        navigate("/sign-in");
      }

      response = await response.json();
      if (!response.success) {
        throw new Error(response.message);
      }
      setStateEmployees([...response.data]);

      // redirect user to homepage
    } catch (error) {
      showErrorMsg(error.message, setSnackbarState, setOpen);
    }
  }

  useEffect(() => {
    getAllTheEmployees();
    handshakeHello();
  }, []);
  const refSearchQuery = useRef(null);

  const search = () => {
    let timeoutId = null;
    return function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(async () => {
        if (refSearchQuery.current.value === "") {
          return getAllTheEmployees();
        }

        const apiUrl =
          apiUrls?.employee["get-employees-based-on-custom-filters"];
        if (!apiUrl) {
          console.log(
            "failed to make api call,  Missing apiUrls?.employee['get-employees-based-on-custom-filters']"
          );
          showErrorMsg(
            "Failed to search employee, kindly try again later",
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
            "Failed to search employee, kindly try again later",
            setSnackbarState,
            setOpen
          );
          return;
        }
        const reqUrl =
          process.env.REACT_APP_SERVER_ROOT_URL +
          apiUrl +
          `?firstName=${refSearchQuery.current.value}&lastName=${refSearchQuery.current.value}`;

        const prjName = getProjectName();
        try {
          const headers = {
            Authorization: localStorage.getItem(
              getProjectName() + "-Authorization"
            ),
          };

          let response = await fetch(reqUrl, {
            method: "GET",
            headers,
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
          setStateEmployees(response?.data);
        } catch (error) {
          setStateEmployees([]);
          showErrorMsg(error.message, setSnackbarState, setOpen);
        }

        // if success, save the auth token to local storage and then return user to the homepage
        // otherwise show failure message
      }, 1000);
    };
  };
  const debouncedSearch = search();
  return (
    <div className="p-[1rem] flex flex-col gap-[.5rem] max-w-[90rem] m-[auto] ">
      <div className="flex   justify-between items-center" id="kindOfHeader">
        <SimpleModal getAllTheEmployees={getAllTheEmployees} />
        <div id="wrapperSearch" className="relative w-[25rem]">
          <input
            required
            type="search"
            onChange={debouncedSearch}
            ref={refSearchQuery}
            placeholder="Search Employee..."
            className="w-[100%] p-[.5rem] pl-[2rem] rounded-md outline-none  focus:outline-blue-300"
          />
          <i className="absolute left-0 top-[.5rem] pl-[.5rem] text-stone-500 fa-regular fa-magnifying-glass"></i>
        </div>
        <button
          onClick={handleLogOut}
          className="h-[2.5rem] flex gap-[.5rem] border-[.15rem] border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-300 p-[.5rem] rounded-xl transition hover:bg-gradient-to-br hover:from-yellow-300 hover:to-yellow-100 font-medium w-[6rem] text-stone-700"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
      <h2 className="text-[1.7rem] text-stone-500 font-medium">Employees</h2>
      <ul
        id="employeesGrid"
        className="grid grid-cols-3  max-w-[83rem] gap-[1rem] "
      >
        {stateEmployees.map((employeeObj) => {
          return (
            <li key={employeeObj?._id}>
              <EmployeeCard
                employeeObj={employeeObj}
                setSnackbarState={setSnackbarState}
                setOpen={setOpen}
                showErrorMsg={showErrorMsg}
                getAllTheEmployees={getAllTheEmployees}
                navigate={navigate}
              />
            </li>
          );
        })}
      </ul>
      <MuiSnackbar
        open={open}
        setOpen={setOpen}
        snackbarState={snackbarState}
      />
    </div>
  );
}
