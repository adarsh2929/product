import express from "express";
import { productService } from "../service/productService";
import { productValidator } from "../helper/validator";
import multer from "multer";

const productRouter = express.Router();

// Use memory storage for multer
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});


productRouter.post('/create', upload.single('image'), productValidator, productService.createProduct);

productRouter.get('/products',productService.getAllProducts);

productRouter.put('/product', upload.single('image'), productValidator, productService.updateProduct);

productRouter.get('/image/:id', productService.getProductImage);

export default productRouter;
