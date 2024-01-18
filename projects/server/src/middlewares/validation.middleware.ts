import { NextFunction, Request, Response } from 'express';
import { ContextRunner, body, validationResult } from 'express-validator';

export const ValidationMiddleware = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.array().length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
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

export const addressValidationMiddleware = () => {
  const validations = [
    body('userId').exists().withMessage('userId is required').isNumeric().withMessage('userId must be a number'),
    body('recepient')
      .exists()
      .withMessage('recepient is required')
      .isLength({ min: 4, max: 50 })
      .withMessage('recepient must be between 4 and 50 characters'),
    body('phone').exists().withMessage('phone is required').isLength({ min: 9, max: 15 }).withMessage('phone must be between 9 and 15 characters'),
    body('label').exists().withMessage('label is required').isLength({ min: 4, max: 15 }).withMessage('label must be between 3 and 15 characters'),
    body('cityId').exists().withMessage('cityId is required').isString().trim(),
    body('address').exists().withMessage('address is required').trim().isLength({ min: 3 }).withMessage('address must be at least 4 characters'),
    body('notes').optional(),
    body('isMain').exists().withMessage('isMain is required').isBoolean(),
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

    res.status(400).json({ errors: errors.array() });
  };
};
