import { body } from "express-validator";


export const productValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required'),
    body('image').notEmpty().withMessage('Image is required'),
]

export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}
