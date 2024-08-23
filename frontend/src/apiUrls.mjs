const apiUrls = {
  user: {
    registerNewUser: "/api/v1/user/registerNewUser",
    login: "/api/v1/user/login",
  },
  employee: {
    "get-all-the-employees": "/api/v1/employee/get-all-the-employees",
    "delete-employee": "/api/v1/employee/delete-employee",
    "register-new-employee": "/api/v1/employee/register-new-employee",
    "get-employee-by-id": "/api/v1/employee/get-employee-by-id",
    "update-employee-details": "/api/v1/employee/update-employee-details",
    "get-employees-based-on-custom-filters":
      "/api/v1/employee/get-employees-based-on-custom-filters",
  },
};

export default apiUrls;
