exports.successResponse = (message, data) => {
    return {
      status: true,
      message: message,
      data: data ? data : null,
    };
  };
  
  exports.errorResponse = (message, data) => {
    return {
      status: false,
      message: message ? message : "Something went wrong",
      data: data ? data : null,
    };
  };