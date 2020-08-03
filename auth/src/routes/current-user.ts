import express from "express";

import { currentUser } from "@edticketing/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  // use middleware function to check if user have the cookie that contain auth jwt token {currentUser}
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
