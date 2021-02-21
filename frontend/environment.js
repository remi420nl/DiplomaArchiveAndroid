import Constants from "expo-constants";

const ENV = {
  dev: {
    api_key: "AIzaSyBoclY1HEjjt-Tz6Wn11W1amuRf4zgCsI8",
    auth_domain: "diplomaarchive.firebaseapp.com",
    database_url: "https://diplomaarchive-default-rtdb.firebaseio.com",
    project_id: "diplomaarchive",
    storage_bucket: "diplomaarchive.appspot.com",
    messenging_sender_id: "838390795779",
    api_id: "1:838390795779:web:d539b07190cb818cb78836",
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.

  return ENV.dev;
  if (__DEV__) {
    return ENV.dev;
  } else if (env === "staging") {
    return ENV.staging;
  } else if (env === "prod") {
    return ENV.prod;
  }
};

export default getEnvVars;
