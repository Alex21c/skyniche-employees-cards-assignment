import LetterAvatar from "../../Components/MUI/LetterAvatar/LetterAvatar";
import { getProjectName } from "../../Utils.mjs";
import profileImagePlaceholder from "../../Assests/Images/profileImagePlaceholder.png";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import apiUrls from "../../apiUrls.mjs";
import Modal from "@mui/material/Modal";
import validator from "validator";
import { useRef } from "react";
import CircularLoading from "../../Components/MUI/CircularLoading/CircularLoading";
import MuiSnackbar, {
  useSetInitialStateSnackbar,
  openTheSnackBar,
  showErrorMsg,
} from "../../Components/MUI/Snackbar/MuiSnackbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function UpdateEmployeeDetails() {
  const navigate = useNavigate();
  const { employeeId } = useParams("employeeId");
  let [stateIsApiCallBeingMade, setStateIsApiCallBeingMade] = useState(false);
  const [open, setOpen] = useSetInitialStateSnackbar();
  const [snackbarState, setSnackbarState] = useState({
    msg: "",
    successOrError: "error",
  });
  const [openMuiModal, setOpenMuiModal] = React.useState(false);
  const handleOpen = () => setOpenMuiModal(true);
  const handleClose = () => setOpenMuiModal(false);

  const refFirstName = useRef(null);
  const refLastName = useRef(null);
  const refEmail = useRef(null);
  const refDepartment = useRef(null);
  const refDesignation = useRef(null);
  const refDateOfJoining = useRef(null);
  const refSalary = useRef(null);
  const refImageFile = useRef(null);
  let [statePreviewImageSrc, setStatePreviewImageSrc] = useState(null);

  let [stateEmployeeObj, setStateEmployeeObj] = useState({});

  async function changeProfileImage(refImageFile) {
    await refImageFile.current.click();
  }

  function handleInputImageFileChange(refImageFile) {
    const file = refImageFile.current.files[0];
    // validation

    const allowedProfileImageSize =
      Number(process.env.REACT_APP_MAX_ALLOWED_PROFILE_IMAGE_SIZE_IN_KB) * 1000;

    if (file.size > allowedProfileImageSize) {
      refImageFile.current.value = "";
      setStatePreviewImageSrc(profileImagePlaceholder);
      return showErrorMsg(
        `image size is ${Math.floor(
          file.size / 1000
        )}KB which is too large, it should be less than ${
          process.env.REACT_APP_MAX_ALLOWED_PROFILE_IMAGE_SIZE_IN_KB
        }KB`,
        setSnackbarState,
        setOpen
      );
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStatePreviewImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function updateEmployeeDetails(event) {
    event.preventDefault();
    setStateIsApiCallBeingMade(true);

    const apiUrl = apiUrls?.employee["update-employee-details"];
    if (!apiUrl) {
      console.log(
        "failed to make api call,  Missing apiUrls?.employee[update-employee-details]"
      );
      showErrorMsg(
        "Failed to update employee details, kindly try again later",
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
        "Failed to update employee details, kindly try again later",
        setSnackbarState,
        setOpen
      );
      return;
    }
    const reqUrl = process.env.REACT_APP_SERVER_ROOT_URL + apiUrl;

    const prjName = getProjectName();
    try {
      const headers = {
        Authorization: localStorage.getItem(
          getProjectName() + "-Authorization"
        ),
      };
      if (
        refFirstName.current.value === "" ||
        refLastName.current.value === "" ||
        refEmail.current.value === "" ||
        refDepartment.current.value === "" ||
        refDesignation.current.value === "" ||
        refDateOfJoining.current.value === "" ||
        refSalary.current.value === ""
      ) {
        showErrorMsg(
          "All form fields are required, Kindly make sure form is filled properly",
          setSnackbarState,
          setOpen
        );
        return;
      }

      let profileImage = null;
      if (refImageFile?.current?.files[0]) {
        profileImage = refImageFile.current.files[0];
      }

      const formData = new FormData();
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      formData.append("employeeId", employeeId);
      formData.append("firstName", refFirstName.current.value);
      formData.append("lastName", refLastName.current.value);
      formData.append("email", refEmail.current.value);
      formData.append("department", refDepartment.current.value);
      formData.append("designation", refDesignation.current.value);
      formData.append("dateOfJoining", refDateOfJoining.current.value);
      formData.append("monthlySalary", refSalary.current.value);

      let response = await fetch(reqUrl, {
        method: "PATCH",
        headers,
        body: formData,
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
      // show success msg

      // navigate to homepage
      navigate("/");

      // now just refresh
    } catch (error) {
      showErrorMsg(error.message, setSnackbarState, setOpen);
    } finally {
      // hide the progress bar
      setStateIsApiCallBeingMade(false);
      // hide current modal window
      setOpenMuiModal(false);
    }
  }

  async function fetchEmployeeDetails(employeeId) {
    //safeguard
    if (!employeeId) {
      navigate("/");
    }

    const apiUrl = apiUrls?.employee["get-employee-by-id"] + `/${employeeId}`;
    if (!apiUrl) {
      console.log(
        "failed to make api call,  Missing apiUrls?.employee['get-employee-by-id']"
      );
      showErrorMsg(
        "Failed to Load employee Data, kindly try again later",
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
        "Failed to Load employee data, kindly try again later",
        setSnackbarState,
        setOpen
      );
      return;
    }
    const reqUrl = process.env.REACT_APP_SERVER_ROOT_URL + apiUrl;

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
      if (response?.data) {
        setStateEmployeeObj(response?.data);
        setStatePreviewImageSrc(response?.data?.profileImage?.url);
      }
      if (!response.success) {
        setTimeout(() => {
          // redirect user to homepage
          navigate("/");
        }, 1000);
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorMsg(error.message, setSnackbarState, setOpen);
    }
  }

  React.useEffect(() => {
    fetchEmployeeDetails(employeeId);
  }, []);
  return (
    <div>
      <MuiSnackbar
        open={open}
        setOpen={setOpen}
        snackbarState={snackbarState}
      />

      <div className="p-[1rem] flex flex-col gap-[1rem] ">
        <h2 className="text-[1.7rem] font-semibold">Update Employee Details</h2>
        <form
          className="flex flex-col gap-[.5rem] w-[25rem] "
          onSubmit={(event) => updateEmployeeDetails(event, navigate)}
        >
          <div className="justify-center relative w-[100%] flex gap-[.5rem] items-center">
            <div className="rounded-full w-[8rem] h-[8rem] border-green-300 border-[.2rem] overflow-hidden flex flex-col items-center justify-center">
              {statePreviewImageSrc ? (
                <img src={statePreviewImageSrc} />
              ) : (
                <LetterAvatar
                  personName={`${stateEmployeeObj.firstName} ${stateEmployeeObj.lastName}`}
                />
              )}
            </div>

            <div
              onClick={() => changeProfileImage(refImageFile)}
              className="cursor-poiner flex items-center gap-[.5rem] h-[3rem] border-[.15rem] border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-300 p-[.5rem] rounded-xl transition hover:bg-gradient-to-br hover:from-yellow-300 hover:to-yellow-100 font-medium select-none"
            >
              <i className="   fa-regular fa-pencil cursor-pointer text-stone-500 hover:text-blue-500 transition text-[1.5rem]"></i>
              <span className="text-[.9rem] font-normal">
                Choose Profile Image
              </span>
            </div>

            <input
              className="hidden"
              ref={refImageFile}
              type="file"
              accept="image/*"
              onChange={() => handleInputImageFileChange(refImageFile)}
            />
          </div>
          <div className="flex gap-[.2rem]">
            <input
              required
              type="text"
              name="firstName"
              ref={refFirstName}
              placeholder="firstName"
              defaultValue={stateEmployeeObj?.firstName}
              className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
            />
            <input
              required
              type="text"
              name="lastName"
              ref={refLastName}
              defaultValue={stateEmployeeObj?.lastName}
              placeholder="lastName"
              className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
            />
          </div>
          <input
            required
            type="email"
            name="email"
            ref={refEmail}
            defaultValue={stateEmployeeObj?.email}
            placeholder="email"
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />
          <input
            required
            type="text"
            name="department"
            ref={refDepartment}
            defaultValue={stateEmployeeObj?.department}
            placeholder="department"
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />
          <input
            required
            type="text"
            name="designation"
            ref={refDesignation}
            placeholder="designation"
            defaultValue={stateEmployeeObj?.designation}
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />
          <input
            required
            type="date"
            name="dateOfJoining"
            ref={refDateOfJoining}
            placeholder="Date Of Joining"
            defaultValue={
              stateEmployeeObj?.dateOfJoining
                ? new Date(stateEmployeeObj.dateOfJoining)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />
          <input
            required
            type="number"
            min="1"
            name="monthlySalary"
            ref={refSalary}
            defaultValue={stateEmployeeObj?.monthlySalary}
            placeholder="monthly Salary in ₹"
            className="p-[.5rem] rounded-md outline-none  focus:outline-blue-300"
          />
          {stateIsApiCallBeingMade ? (
            <CircularLoading />
          ) : (
            <button className="border-[.15rem] border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-300 p-[.5rem] rounded-xl transition hover:bg-gradient-to-br hover:from-yellow-300 hover:to-yellow-100 font-medium">
              Update Employee Details
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
