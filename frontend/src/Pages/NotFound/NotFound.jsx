import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function NotFound() {
  const navigate = useNavigate();
  const error = useRouteError();
  return (
    <div className="bg-white flex flex-col gap-[.5rem] p-[1rem] max-w-[30rem] rounded-md m-[auto] mt-[2rem]">
      <span className="text-red-300">
        Error: {error.status}, {error.statusText} !
      </span>
      <a
        onClick={() => navigate("/")}
        className="cursor-pointer underline text-blue-300"
      >
        Click here to go back to Homepage !
      </a>
    </div>
  );
}
