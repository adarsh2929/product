import express from "express";
import {customError,notFound} from "../helper/errorHandler";
import productRoutes from "./productRoutes";

const router = express.Router();


router.use('/product',productRoutes);





router.use(notFound);
router.use(customError);





export default router;
