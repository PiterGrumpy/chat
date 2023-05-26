import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var MensajeSchema = new Schema({
  sala: { type: String, required: true },
  user: { type: String, required: true },
  avatar: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['humano', 'IA'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const Mensaje = mongoose.model("Mensaje", MensajeSchema);

export { Mensaje }