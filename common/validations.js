/* validate website url */
exports.validateUrl = () => {
  return {
    notEmpty: false,
    custom: {
      options: (value) => {
        if (!value) {
          return true;
        }
        let regex =
          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        if (regex.exec(value) == null) {
          throw new Error("Invalid URL");
        }
        return true;
      },
    },
  };
};

/* validate password */
exports.validatePassword = () => {
  return {
    notEmpty: true,
    errorMessage: "Password cannot be empty",
    custom: {
      options: (value) => {
        let regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (regex.exec(value) == null) {
          throw new Error(
            "Password should be minimum eight characters, at least one letter,one Special Char and one number"
          );
        }
        return true;
      },
    },
  };
};

exports.categorySchema = {
  name: {
    notEmpty: true,
    errorMessage: "Name cannot be empty",
  },
  category_color: {
    notEmpty: true,
    errorMessage: "Category color cannot be empty",
  },
  url: this.validateUrl(),
};

exports.updatecategorySchema = {
  url: this.validateUrl(),
};

exports.glimpulseSchema = {
  title: {
    notEmpty: true,
    errorMessage: "Name cannot be empty",
  },
  url: this.validateUrl(),
  end_date: {
    notEmpty: false,
    custom: {
      options: (value, { req }) => {
        let start_date = req.body.start_date;
        if (start_date) {
          if (value === undefined) {
            throw new Error("Please enter End_date");
          }
        }
        if (value === undefined && start_date === undefined) {
          return true;
        }
        if (start_date === undefined) {
          throw new Error("Please enter Start_Date");
        }

        return true;
      },
    },
  },
};

exports.updateglimpulseSchema = {
  url: this.validateUrl(),
};

exports.userSchema = {
  first_name: {
    notEmpty: true,
    errorMessage: "First Name cannot be empty",
  },
  last_name: {
    notEmpty: true,
    errorMessage: "Last Name cannot be empty",
  },
  email: {
    notEmpty: false,
    isEmail: {
      bail: true,
      errorMessage: "Invalid email address",
    },
  },
  phone_number: {
    notEmpty: true,
    errorMessage: "Phone_number cannot be empty",
    isLength: {
      options: { min: 10, max: 15 },
    },
  },
  password: this.validatePassword(),
};

exports.changepasswordSchema = {
  old_password: this.validatePassword(),
  new_password: this.validatePassword(),
    
};


