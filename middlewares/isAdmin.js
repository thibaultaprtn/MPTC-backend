const isAdmin = async (req, res, next) => {
  //   console.log(req.headers.adminheader);
  //   console.log(process.env.ADMIN_ID);
  if (req.headers.adminheader === process.env.ADMIN_ID) {
    console.log("Valid Admin Token - Admin has been authentified");
    return next();
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized / Action limited to Admin" });
  }
};

module.exports = isAdmin;
