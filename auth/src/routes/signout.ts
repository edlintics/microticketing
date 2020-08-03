import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  // to sign out, we need to empty all the cookies
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
