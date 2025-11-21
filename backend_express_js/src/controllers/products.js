const { productSchema } = require('../validation/schemas');
const productService = require('../services/product');

class ProductController {
  // PUBLIC_INTERFACE
  /**
   * Public list of products with optional filters.
   */
  async list(req, res, next) {
    try {
      const { category, q } = req.query;
      const products = await productService.listProducts({ category, q });
      res.json({ items: products });
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Public get product detail.
   */
  async detail(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid product id' });
      const product = await productService.getProductById(id);
      if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Admin create product.
   */
  async create(req, res, next) {
    try {
      const { error, value } = productSchema.validate(req.body, { abortEarly: false });
      if (error) return next(error);
      const created = await productService.createProduct(value);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Admin update product.
   */
  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid product id' });
      const { error, value } = productSchema.validate(req.body, { abortEarly: false });
      if (error) return next(error);
      const updated = await productService.updateProduct(id, value);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Product not found' });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Admin delete product.
   */
  async remove(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid product id' });
      await productService.deleteProduct(id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
