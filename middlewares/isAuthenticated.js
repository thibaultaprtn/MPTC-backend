const admin = require("../config/firebase-config");

const isAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.email) {
    return res.status(401).json({ message: "Unauthorized access" });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token dans le isAuthenticated", token);
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      //   console.log("decodeValue dans le isAuthenticated", decodeValue);
      if (decodeValue) {
        req.decodeValue = decodeValue;
        return next();
      }
      return res.json({ message: "Unauthorized" });
    } catch (error) {
      return res.json({ message: error.message });
    }
  }
};

module.exports = isAuthenticated;
