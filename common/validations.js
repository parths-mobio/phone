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
              "Password should be minimum eight characters, at least one letter and one number"
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
    url:this.validateUrl(),
  };

  exports.updatecategorySchema = {
  
    url:this.validateUrl(),
  };

  exports.glimpulseSchema = {
    title: {
      notEmpty: true,
      errorMessage: "Name cannot be empty",
    },
    url:this.validateUrl(),
  };

  exports.updateglimpulseSchema = {
  
    url:this.validateUrl(),
  };

  