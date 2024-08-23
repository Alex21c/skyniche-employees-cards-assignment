import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularLoading() {
  return (
    <Box
      sx={{ display: "flex" }}
      className="items-center justify-center gap-[1rem] text-stone-500 bg-stone-100 p-[.5rem] "
    >
      <CircularProgress />
      <span>Yours Request being processed, Please wait... </span>
    </Box>
  );
}
