import { verifyAccessToken } from "../services/jwt.service.js";

const authorizeUser = (req, res, next) => {
  const { authorization } = req.headers;
  req.user = null;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next();
  }
  try {
    const t = verifyAccessToken(authorization.split(" ")[1]);
    req.user = t;
    if (!t) {
      return next();
    }
  } catch (err) {
    console.log("Invalid or Expired JWT ");
  }

  next();
};

const restrictTo = (roles = ["user", "admin"]) => {
  return (req, res, next) => {
    // console.log("req.user", req.user);
    // user is null means invalid access token (when user has not logged in)
    if (req.user == null) return res.sendResponse(403, "Forbidden");
    // default role: user
    const userRole = req.user?.role ?? "user";

    // Check if the user's role is in the allowed roles array
    if (roles.includes(userRole)) return next();

    return res.sendResponse(403, "Forbidden");
  };
};

export  {
  authorizeUser,
  restrictTo,
};
