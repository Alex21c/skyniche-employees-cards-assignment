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
