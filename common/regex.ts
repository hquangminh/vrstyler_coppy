const regex = {
  usernameFormat: /^(?!_)(?!.*__)[a-zA-Z0-9_]{4,20}$/,
  passwordFormat: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
  notCharacter: /^[A-Za-zÀ-ȕ0-9\s]*$/, // Regex not contain special characters
  url: /^(ftp|http|https):\/\/[^ "]+$/i,
  emoji:
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
  space: /\s/,
  allCharacters: /^[^!@#$%^&*\/()]+$/,
};

export default regex;
