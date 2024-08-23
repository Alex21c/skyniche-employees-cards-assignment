import CircularLoading from "../MUI/CircularLoading/CircularLoading";
import { useState } from "react";
import { getProjectName } from "../../Utils.mjs";
import { formatDate } from "../../Utils.mjs";
import apiUrls from "../../apiUrls.mjs";
import validator from "validator";
import LetterAvatar from "../MUI/LetterAvatar/LetterAvatar";

export default function EmployeeCard({
  employeeObj = null,
  setSnackbarState = null,
  setOpen = null,
  showErrorMsg = null,
  getAllTheEmployees = null,
  navigate = null,
}) {
  let [stateIsApiCallBeingMade, setStateIsApiCallBeingMade] = useState(false);
  if (!employeeObj || !setSnackbarState || !setOpen || !showErrorMsg) {
    return console.log("Employee Card returning, required data missing.");
  }

  async function deleteEmployee(employeeId = null) {
    if (!employeeId) {
      return console.log("employeeId missing !");
    }

    let apiUrl = apiUrls?.employee["delete-employee"];

    if (!apiUrl) {
      console.log(
        "failed to make api call,  apiUrls?.employee['delete-employee']"
      );
      showErrorMsg(
        "Failed to delete employee data, kindly try again later",
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

    const prjName =
      process.env.REACT_APP_PROJECT_NAME ||
      "alex21c-skyniche-employees-cards-assignment";
    try {
      setStateIsApiCallBeingMade(true);
      const prjName = getProjectName();
      const headers = {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(prjName + "-Authorization"),
      };

      const data = {
        employeeId: employeeId,
      };

      let response = await fetch(reqUrl, {
        method: "DELETE",
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
      getAllTheEmployees();
    } catch (error) {
      showErrorMsg(error.message, setSnackbarState, setOpen);
    } finally {
      setStateIsApiCallBeingMade(false);
    }
  }

  return (
    <div className="employeeCard bg-stone-100 w-[27rem] flex flex-col gap-[1rem] items-center p-[1rem] relative rounded-md">
      <div className="rounded-full w-[8rem] h-[8rem] border-green-300 border-[.2rem] overflow-hidden flex flex-col items-center justify-center">
        {employeeObj?.profileImage?.url ? (
          <img
            src={employeeObj?.profileImage?.url}
            className="object-cover w[100%] h-[100%]"
          />
        ) : (
          <LetterAvatar
            personName={`${employeeObj.firstName} ${employeeObj.lastName}`}
          />
        )}
      </div>
      <div>
        <h2>
          {employeeObj.firstName} {employeeObj.lastName}
        </h2>
        <div className="text-stone-400">admin@alex21c.com</div>
      </div>

      <div className="employeeDetails grid grid-cols-2 gap-[.5rem] w-[20rem]">
        <div className="flex flex-col">
          <span>{employeeObj.department}</span>
          <span className="text-stone-400"> Department</span>
        </div>
        <div className="flex flex-col">
          <span>{employeeObj.designation}</span>
          <span className="text-stone-400"> Designation</span>
        </div>
        <div className="flex flex-col">
          <span>{formatDate(employeeObj?.dateOfJoining)}</span>
          <span className="text-stone-400"> Date of Joining</span>
        </div>
        <div className="flex flex-col">
          <span>
            {employeeObj.salaryCurrency}
            {employeeObj.monthlySalary}/-
          </span>
          <span className="text-stone-400">Monthly Salary</span>
        </div>
      </div>
      <div className="text-[1.5rem] flex flex-col gap-[.2rem] absolute top-[1rem] right-[1rem]">
        <i
          title="Edit Empoyee Details"
          onClick={() => {
            navigate(`/update-employee-details/${employeeObj?._id}`);
          }}
          className="fa-regular fa-pencil cursor-pointer text-stone-500 hover:text-blue-500 transition"
        ></i>
        {stateIsApiCallBeingMade ? (
          <CircularLoading />
        ) : (
          <i
            title="Delete Empoyee"
            onClick={() => deleteEmployee(employeeObj?._id)}
            className="fa-sharp fa-solid fa-trash cursor-pointer text-stone-500 hover:text-red-700 transition"
          ></i>
        )}
      </div>
    </div>
  );
}
