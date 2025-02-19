import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserControllers } from "./user.controller";
import multer, { memoryStorage } from "multer";
import { uploadToS3 } from "../../constant/s3";
import { UserValidations } from "./userValidation";
import validateRequest from "../../middlewares/validateRequest";
const storage = memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/all-users", auth("ADMIN"), UserControllers.getAllUser);
router.get("/profile", auth("ADMIN", "CSR", "CUSTOMER"), UserControllers.getProfile);
router.get("/single-user/:userId", auth("ADMIN"), UserControllers.getSingleUser);
router.get("/csr-id", auth("CUSTOMER"), UserControllers.getCsrId);
router.post(
  "/send-mail",
  validateRequest(UserValidations.sendMailIntoAdminValidation),
  UserControllers.sendMailIntoAdmin,
);

router.patch(
  "/update-profile",
  auth("ADMIN", "CSR", "CUSTOMER"),
  upload.single("profilePicture"),
  async (req, res, next) => {
    try {
      if (req.file) {
        const profilePicture = await uploadToS3({
          file: req.file,
          fileName: `united-threads/users/${Math.floor(100000 + Math.random() * 900000)}`,
        });
        if (req.body?.data) {
          req.body = UserValidations.updateUserValidation.parse({
            ...JSON.parse(req?.body?.data),
            profilePicture,
          });
        } else {
          req.body = UserValidations.updateUserValidation.parse({ profilePicture });
        }
      } else {
        if (req.body?.data) {
          req.body = UserValidations.updateUserValidation.parse(JSON.parse(req?.body?.data));
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  UserControllers.updateProfile,
);

router.patch("/update-user/:id", auth("ADMIN", "CSR"), UserControllers.updateUser);
router.delete("/delete-user/:id", auth("ADMIN"), UserControllers.deleteUser);
router.delete("/delete-my-profile", auth("CUSTOMER"), UserControllers.deleteMyProfile);

export const UserRoutes = router;
