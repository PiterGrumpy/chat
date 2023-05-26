import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: { type: String, required: true },
});

const Product = mongoose.model("Product", ProductSchema);

export { Product }