import axios from "axios";

export const GetCourses = async () => {
  console.log("api call");
  return await axios
    .get("http://192.168.169.252:8000/api/course/"
    )
};

export const GetCourses2 = async () => {
  return fetch("http://127.0.0.1:8000/api/course", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((bla) => console.log(bla));
};

export const LogIn = async (context) => {
  console.log("login api call");
  return await axios
    .post("http://192.168.169.252:8000/api/token/",context
    )
}