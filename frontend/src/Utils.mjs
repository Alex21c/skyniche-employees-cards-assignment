import validator from "validator";
import apiUrls from "./apiUrls.mjs";
export function getProjectName() {
  return (
    process.env.REACT_APP_PROJECT_NAME ||
    "alex21c-skyniche-employees-cards-assignment"
  );
}

export function formatDate(dateString) {
  // Create a Date object
  const date = new Date(dateString);

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Format the date
  return `${date.getDate()}-${
    monthNames[date.getMonth()]
  }-${date.getFullYear()}`;
}

export async function handshakeHello() {
  function isTimeStamp10MinutesOlder(previousTimeStamp) {
    previousTimeStamp = new Date(previousTimeStamp);
    let currentTimestamp = new Date();
    let tenMinues = 10 * 60 * 1000;
    let difference = currentTimestamp - previousTimeStamp;
    // console.log(difference)
    if (difference > tenMinues) {
      return true;
    } else {
      return false;
    }
  }

  // check the local storage for handshake data
  // do not make the req if last handshake was performed 10 minutes earlier
  try {
    const dataFromLocalStorage = localStorage.getItem(
      getProjectName() + "-handshakeData"
    );
    if (dataFromLocalStorage) {
      const { timestamp } = JSON.parse(dataFromLocalStorage);

      if (timestamp && !isTimeStamp10MinutesOlder(timestamp)) {
        console.log("no need to perform handshake !");
        return null;
      }
    }
  } catch (error) {
    return console.info(getProjectName() + " CustomError: " + error.message);
  }

  try {
    console.log("making handshake with render server !"); // keep it

    const requestOptions = {
      method: "GET",
    };

    const apiUrl = apiUrls?.user["handshake-hello"];
    if (!apiUrl) {
      console.log("failed to make api call,  apiUrls?.user[handshake-hello]");
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
      return;
    }
    const reqUrl = process.env.REACT_APP_SERVER_ROOT_URL + apiUrl;

    let response = await fetch(reqUrl, requestOptions);
    if (response) {
      response = await response.json();
    }
    if (response?.success) {
      // then update localstorage with handshake info
      const handshakeInfo = {
        success: response.success,
        timestamp: Date.now(), //converting date into timestamp number
      };
      localStorage.setItem(
        getProjectName() + "-handshakeData",
        JSON.stringify(handshakeInfo)
      );
    } else {
      throw new Error("not successfull !");
    }
  } catch (error) {
    console.error(
      getProjectName() +
        "failed to make fetch req for handeshake hello, ERROR:  " +
        error.message
    );
  }
}
