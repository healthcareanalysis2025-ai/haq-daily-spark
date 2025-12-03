export const getCurrentDate = () =>
    new Date().toLocaleDateString("en-CA");
  
  export const getCurrentTime = () =>
    new Date().toLocaleTimeString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  