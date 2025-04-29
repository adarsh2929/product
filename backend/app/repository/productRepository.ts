import { prisma } from "../client/prisma";

const createProduct = async (productData: any) => {
    try {
        const { name, price, imageData, imageMimeType, attributes } = productData;

        // Create the product with basic details
        const product = await prisma.product.create({
            data: {
                name,
                price,
                imageData,
                imageMimeType,
                image: null
            },
        });

        // Handle attributes if provided
        if (attributes && attributes.length > 0) {
            // Process each attribute
            for (const attr of attributes) {
                // Get or create the attribute
                let productAttribute = await prisma.productAttribute.findUnique({
                    where: { name: attr.key },
                });

                if (!productAttribute) {
                    productAttribute = await prisma.productAttribute.create({
                        data: { name: attr.key },
                    });
                }

                // Process each value in the attribute
                for (const val of attr.values) {
                    // Get or create the attribute value
                    let attributeValue = await prisma.productAttributeValue.findUnique({
                        where: {
                            value_attributeId: {
                                value: val,
                                attributeId: productAttribute.id,
                            },
                        },
                    });

                    if (!attributeValue) {
                        attributeValue = await prisma.productAttributeValue.create({
                            data: {
                                value: val,
                                attributeId: productAttribute.id,
                            },
                        });
                    }

                    let productAttributeAssignment = await prisma.productAttributeAssignment.findUnique({
                        where: {
                            productId_attributeValueId: {
                                productId: product.id,
                                attributeValueId: attributeValue.id,
                            },
                        },
                    });

                    if(!productAttributeAssignment){

                    // Create the product-attribute assignment
                    await prisma.productAttributeAssignment.create({
                        data: {
                            productId: product.id,
                            attributeValueId: attributeValue.id,
                        },
                    });
                }
            }
        }
    }

        // Return the created product with its attributes
        const result = await prisma.product.findUnique({
            where: { id: product.id },
            include: {
                attributes: {
                    include: {
                        attributeValue: {
                            include: {
                                attribute: true,
                            },
                        },
                    },
                },
            }
        });

        if (result) {
            const { imageData, ...productWithoutBinaryData } = result;
            return productWithoutBinaryData;
        }
        
    } catch (error) {
        console.log("Error in createProduct",error);
        throw error;
    }
}

const getAllProducts = async (filters: any) => {
    try {
        const {
            startDate,
            endDate,
            sortOrder = 'desc',
            name,
            page,
            pageSize
        } = filters;

        // Calculate pagination params
        const skip = page && pageSize ? (page - 1) * pageSize : undefined;
        const take = pageSize;

        // Build where conditions
        const whereConditions: any = {};
        
        // Add date range filter if provided
        if (startDate || endDate) {
            whereConditions.createdAt = {};
            
            if (startDate) {
                whereConditions.createdAt.gte = new Date(startDate);
            }
            
            if (endDate) {
                whereConditions.createdAt.lte = new Date(endDate);
            }
        }
        
        // Add name search if provided
        if (name) {
            whereConditions.name = {
                contains: name,
                mode: 'insensitive'
            };
        }

        // Get total count
        const totalPromise = prisma.product.count({
            where: whereConditions
        });

        // Get paginated products
        const productsPromise = prisma.product.findMany({
            where: whereConditions,
            include: {
                attributes: {
                    include: {
                        attributeValue: {
                            include: {
                                attribute: true
                            }
                        }
                    }
                }
            },
            skip,
            take,
            orderBy: {
                createdAt: sortOrder === 'asc' ? 'asc' : 'desc'
            }
        });

        // Run both queries in a transaction
        const [total, products] = await prisma.$transaction([
            totalPromise,
            productsPromise
        ]);

        const formattedProducts = products.map(product => {
            // Destructure to remove imageData from the response
            const { imageData, ...productWithoutBinaryData } = product;
            
            return {
                ...productWithoutBinaryData,
                attributes: product.attributes.map(attr => ({
                    attributeValue: attr.attributeValue
                }))
            };
        });

        return {
            data: formattedProducts,
            total
        };
    } catch (error) {
        throw error;
    }
}

const updateProduct = async (productId: string, productData: any) => {
    try {
        const { name, price, imageData, imageMime, attributes } = productData;

        // Update the product basic details
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                price,
                ...(imageData ? { imageData, imageMime, image: null } : {}),
            },
        });

        // Delete existing attribute assignments for this product
        await prisma.productAttributeAssignment.deleteMany({
            where: { productId }
        });

        // Handle attributes if provided
        if (attributes && attributes.length > 0) {
            // Process each attribute
            for (const attr of attributes) {
                // Get or create the attribute
                let productAttribute = await prisma.productAttribute.findUnique({
                    where: { name: attr.key },
                });

                if (!productAttribute) {
                    productAttribute = await prisma.productAttribute.create({
                        data: { name: attr.key },
                    });
                }

                // Process each value in the attribute
                for (const val of attr.values) {
                    // Get or create the attribute value
                    let attributeValue = await prisma.productAttributeValue.findUnique({
                        where: {
                            value_attributeId: {
                                value: val,
                                attributeId: productAttribute.id,
                            },
                        },
                    });

                    if (!attributeValue) {
                        attributeValue = await prisma.productAttributeValue.create({
                            data: {
                                value: val,
                                attributeId: productAttribute.id,
                            },
                        });
                    }

                    // Create the product-attribute assignment
                    await prisma.productAttributeAssignment.create({
                        data: {
                            productId: updatedProduct.id,
                            attributeValueId: attributeValue.id,
                        },
                    });
                }
            }
        }

        // Return the updated product with its attributes
        const result = await prisma.product.findUnique({
            where: { id: updatedProduct.id },
            include: {
                attributes: {
                    include: {
                        attributeValue: {
                            include: {
                                attribute: true,
                            },
                        },
                    },
                },
            },
        });

        if (result) {
            const { imageData, ...productWithoutBinaryData } = result;
            return productWithoutBinaryData;
        }
    } catch (error) {
        console.log("Error in updateProduct", error);
        throw error;
    }
};


const getProductById = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                attributes: {
                    include: {
                        attributeValue: {
                            include: {
                                attribute: true
                            }
                        }
                    }
                }
            }
        });

        return product;
    } catch (error) {
        console.log("Error in getProductById", error);
        throw error;
    }
};









export const productRepository = {
    createProduct,
    getAllProducts,
    updateProduct,
    getProductById
}