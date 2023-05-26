import { Product } from '../models/product.js';

const test = (req, res, next) => {
  try {
    req.result = { 'test': 'Texto de prueba' }
    next()
  } catch (error) {
    console.error(`Error getting all: ${error}`);
  }
};

const list = async (req, res, next) => {
  try {
    await Product.find(function (error, data) {
      req.result = data
    }).sort({ _id: -1 });
    next()
  } catch (error) {
    console.error(`Error getting all: ${error}`);
  }
};

export { test, list }