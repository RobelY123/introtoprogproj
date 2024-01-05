const axios = require("axios");
const parseString = require("xml2js").parseString;

const getGradebook = (username, password, urlSubdomain) => {
  const apiUrl = `https://wa-nor-psv.edupoint.com/Service/PXPCommunication.asmx/ProcessWebServiceRequest`;
  const data = {
    userID: username,
    password: password,
    skipLoginLog: "true",
    parent: "false",
    webServiceHandleName: "PXPWebServices",
    methodName: "Gradebook",
    paramStr: `<Parms><ChildIntID>0</ChildIntID><ReportPeriod>1</ReportPeriod></Parms>`,
  };

  return axios
    .post(apiUrl, data)
    .then((response) => {
      return new Promise((resolve, reject) => {
        // Ensure that you are passing the correct XML string to the parser
        parseString(response.data.d, (err, result) => {
          if (err) {
            reject(err);
          } else {
            // Process the parsed XML data
            resolve(result);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

module.exports = { getGradebook };
