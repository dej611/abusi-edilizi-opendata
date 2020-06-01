const express = require("express");
const path = require("path");

module.exports = {
  start: () => {
    // Export a start function so we can start the web server on demand.
    return new Promise((resolve, reject) => {
      const app = express();

      const staticFilesPath = path.join(__dirname, "../build"); // Make our 'public' sub-directory accessible via HTTP.
      const staticFilesMiddleWare = express.static(staticFilesPath);
      app.use("/", staticFilesMiddleWare);

      const server = app.listen(3000, (err) => {
        // Start the web server!
        if (err) {
          reject(err); // Error occurred while starting web server.
        } else {
          resolve(server); // Web server started ok.
        }
      });
    });
  },
};
