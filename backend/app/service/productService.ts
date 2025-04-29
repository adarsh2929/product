import { Request, Response, NextFunction } from "express";
import { productRepository } from "../repository/productRepository";
import { DefaultResponse } from "../helper/defaultResponse";
import { CustomError } from "../helper/customError";
import { isValidDate } from "../helper/validator";

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price,  attributes } = req.body;
        let attributesData:any;
        if (attributes && typeof attributes === 'string') {
            attributesData = JSON.parse(attributes);
        }
        
        const imageData = req.file ? req.file.buffer : null;
        const imageMime = req.file ? req.file.mimetype : null;
        
        
        // Validate attributes format if provided
        if (attributesData && !Array.isArray(attributesData)) {
            throw new CustomError(400,"Attributes must be an array");
        }

        // Validate each attribute has key and values
        if (attributesData) {
            for (const attr of attributesData) {
                if (!attr.key || !attr.values || !Array.isArray(attr.values) || attr.values.length === 0) {
                    throw new CustomError(400,"Each attribute must have a key and at least one value");
                }
            }
        }

        // Create product with the repository
        const product = await productRepository.createProduct({
            name,
            price: parseFloat(price),
            imageData,
            imageMime,
            attributes:attributesData
        });

        // Return success response
        return DefaultResponse(res, 200,"Product created successfully", product)

    } catch (error) {
        next(error);
    }
}

// Add new endpoint to serve images
const getProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        const product = await productRepository.getProductById(id);
        
        if (!product || !product.imageData) {
            throw new CustomError(404, "Image not found");
        }
        
        res.contentType(product.imageMimeType || 'image/jpeg');
        res.send(product.imageData);
    } catch (error) {
        next(error);
    }
}



const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            startDate, 
            endDate, 
            sortOrder,
            name,
            page,
            pageSize
        } = req.query;

        
        if (startDate && !isValidDate(startDate as string)) {
            throw new CustomError(400, "Invalid start date format. Use YYYY-MM-DD");
        }

        if (endDate && !isValidDate(endDate as string)) {
            throw new CustomError(400, "Invalid end date format. Use YYYY-MM-DD");
        }

      

        
        const result = await productRepository.getAllProducts({
            startDate,
            endDate,
            sortOrder,
            name,
            page: page ? parseInt(page as string) : 1,
            pageSize: pageSize ? parseInt(pageSize as string) : 10
        });

        return DefaultResponse(res, 200, "Products retrieved successfully", result);
    } catch (error) {
        next(error);
    }
}


const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { id,name, price,  attributes } = req.body;
        let attributesData:any;
        if (attributes && typeof attributes === 'string') {
            attributesData = JSON.parse(attributes);
        }


        const imageData = req.file ? req.file.buffer : null;
        const imageMime = req.file ? req.file.mimetype : null;
        
        // Check if product exists
        const existingProduct = await productRepository.getProductById(id);
        
        if (!existingProduct) {
            throw new CustomError(404, "Product not found");
        }
        
        // Validate attributes format if provided
        if (attributesData && !Array.isArray(attributesData)) {
            throw new CustomError(400, "Attributes must be an array");
        }

        // Validate each attribute has key and values
        if (attributesData) {
            for (const attr of attributesData) {
                if (!attr.key || !attr.values || !Array.isArray(attr.values) || attr.values.length === 0) {
                    throw new CustomError(400, "Each attribute must have a key and at least one value");
                }
            }
        }

        // Update product with the repository
        const updatedProduct = await productRepository.updateProduct(id, {
            name,
            price: parseFloat(price),
            ...(imageData && { imageData, imageMime }),
            attributes:attributesData
        });

        // Return success response
        return DefaultResponse(res, 200, "Product updated successfully", updatedProduct);

    } catch (error) {
        next(error);
    }
};








export const productService = {
    createProduct,
    getAllProducts,
    updateProduct,
    getProductImage
}