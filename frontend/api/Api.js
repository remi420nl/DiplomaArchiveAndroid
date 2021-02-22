import axios from "axios";

const ip = "http://192.168.163.252:8000";

export const GetAllCourses = async () => {
  return await axios.get(`${ip}/api/course/`);
};

export const SearchCourseByName = async (name, token) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(`${ip}/api/course/?name=${name}`, options);
};

export const GetCourseById = async (id, token) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(`${ip}/api/course/${id}`, options);
};

export const Login = async (context) => {
  return await axios.post(`${ip}/api/token/`, context);
};

export const RegisterGroups = async () => {
  return await axios.get(`${ip}/api/users/register2`);
};

export const Signup = async (user) => {
  return await axios.post(`${ip}/api/users/register2`, user);
};

export const UpdateUser = async (token, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.patch(`${ip}/api/users/updateprofile`, context, options);
};

export const UpdateUserPassword = async (token, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.patch(`${ip}/api/users/updatepassword`, context, options);
};

export const GetAllDiplomasByUser = async (token) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(`${ip}/api/diploma/byuser`, options);
};

export const GetAllDiplomas = async (token) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(`${ip}/api/diploma/`, options);
};

export const GetDiplomaById = async (id, token) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(`${ip}/api/diploma/diploma/?id=${id}`, options);
};

// export const FireBase = async () => {
//   var firebaseConfig = {
//     apiKey: "AIzaSyBoclY1HEjjt-Tz6Wn11W1amuRf4zgCsI8",
//     authDomain: "diplomaarchive.firebaseapp.com",
//     projectId: "diplomaarchive",
//     storageBucket: "diplomaarchive.appspot.com",
//     messagingSenderId: "838390795779",
//     appId: "1:838390795779:web:495582252e14f2ebb78836",
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
// };

export const CreateNewDiploma = (pdf, fields, token) => {
  const form = new FormData();

  pdf.forEach((pdf) =>
    form.append(pdf.field, {
      uri: pdf.uri,
      name: pdf.name,
      type: "image/jpeg",
    })
  );

  for (let field in fields) {
    form.append(field, fields[field]);
  }

  console.log(form);
  return axios.post(`${ip}/api/diploma/adddiploma`, form, {
    headers: {
      Authorization: token,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

export const CreateNewCourse = async (token, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.post(`${ip}/api/course/new`, context, options);
};

export const GetAllExemptions = async (token, courseId) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(
    `${ip}/api/competence/allexemptions/?course=${courseId}`,
    options
  );
};

export const GetApprovedExemptions = async (token) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(`${ip}/api/competence/approvedexemptions/`, options);
};

export const GetAllCompetences = async (token) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(`${ip}/api/competence/allcompetences/`, options);
};

export const GetExemptionById = async (exemptionId, token) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(
    `${ip}/api/competence/exemption/?id=${exemptionId}`,
    options
  );
};

export const UpdateExemptionById = async (exemptionId, token, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };

  return await axios.put(
    `${ip}/api/competence/exemption/?id=${exemptionId}`,

    context,
    options
  );
};

export const CreateNewExemption = async (token, courseId) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.post(
    `${ip}/api/competence/exemption/?course=${courseId}`,
    {},
    options
  );
};

export const GetCompetences = async (token, studentId, courseId, diplomaId) => {
  console.log(token);
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(
    `${ip}/api/competence/competences/?student=${studentId}&course=${courseId}&diploma=${diplomaId}`,
    options
  );
};

export const AddCompetencesForCourse = async (token, courseId, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.put(
    `${ip}/api/competence/updatecompetence/?&course=${courseId}`,

    context,
    options
  );
};

export const DeleteCompetencesForCourse = async (
  token,
  competenceId,
  courseId
) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.delete(
    `${ip}/api/competence/updatecompetence/?&course=${courseId}&competence=${competenceId}`,
    options
  );
};

export const DeleteDiploma = async (token, diplomaId) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.delete(
    `${ip}/api/diploma/diploma/?&id=${diplomaId}`,
    options
  );
};

export const AddeCompetencesForDiploma = async (token, diplomaId, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.put(
    `${ip}/api/competence/updatecompetence/?&diploma=${diplomaId}`,
    context,
    options
  );
};

export const CreateNewCompetence = async (token, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.post(
    `${ip}/api/competence/competences/`,
    context,
    options
  );
};

export const DeleteCompetence = async (token, competenceId) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.delete(
    `${ip}/api/competence/competences/?id=${competenceId}`,
    options
  );
};

export const UpdateCompetenceName = async (token, competenceId, name) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.put(
    `${ip}/api/competence/updatecompetence/?id=${competenceId}`,
    name,
    options
  );
};

export const GetKeywordsForCompetence = async (token, competenceId) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(
    `${ip}/api/competence/keywords/${competenceId}`,

    options
  );
};

export const AddKeywordsToCompetence = async (token, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.post(`${ip}/api/competence/keywords/0`, context, options);
};

export const DeleteKeyword = async (token, keywordId) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.delete(
    `${ip}/api/competence/keywords/${keywordId}`,

    options
  );
};

export const UpdateKeywords = async (token, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.put(`${ip}/api/competence/keywords/0`, context, options);
};

export const UpdateDiploma = async (token, diplomaId, context) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.put(
    `${ip}/api/diploma/diploma/?id=${diplomaId}`,
    context,
    options
  );
};

export const CheckKeywordsDiploma = async (token, diplomaId) => {
  const options = {
    headers: {
      Authorization: token,
    },
  };
  return await axios.get(
    `${ip}/api/diploma/readpdf/?id=${diplomaId}`,

    options
  );
};

export const SendContactEmail = async (context) => {
  return await axios.post(`${ip}/api/contact/`, context);
};
