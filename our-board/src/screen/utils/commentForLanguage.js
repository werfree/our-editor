export const commentForLanguage = (language) => {
  if (language === "python" || language === "dockerfile") {
    return "# Write Your code \n";
  } else if (language === "lua") {
    return "-- Write Your code \n";
  } else if (language === "html") {
    return "<!-- Write Your code -->\n";
  } else if (language === "plaintext") {
    return "-- Write below -- ";
  } else {
    return "/* Write your code */ \n";
  }
};
