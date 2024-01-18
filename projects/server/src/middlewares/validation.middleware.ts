import { NextFunction, Request, Response } from 'express';
import { ValidationChain, body, validationResult } from 'express-validator';

export const ValidationMiddleware = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.array.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ message: errors.array()[0].msg });
  };
};

export const isProductExist = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.product) {
    try {
      req.body.product = JSON.parse(req.body.product);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid product format' });
    }
  }
  next();
};

export const ProductValidationMiddleware = () => {
  const validations = [
    body('product.name')
      .exists()
      .withMessage('Product name is required')
      .isLength({ min: 2, max: 70 })
      .withMessage('Product name must be between 2 and 70 characters long'),
    body('product.categoryId').exists().withMessage('Product Category is required').isNumeric().withMessage('Product Category Id must be a number'),
    body('product.size').exists().withMessage('Product Size required'),
    body('product.price').exists().withMessage('Product Price is required').isNumeric().withMessage('Product Price must be a number'),
    body('product.weight').exists().withMessage('Product Weight is required').isNumeric().withMessage('Product Weight must be a number'),
    body('product.description')
      .exists()
      .withMessage('Product description is required')
      .isLength({ min: 80, max: 2000 })
      .withMessage('Product description must be between 80 and 2000 characters long'),
  ];
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.array().length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ message: errors.array()[0].msg });
  };
};
