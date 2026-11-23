import { Schema, model, Document, Model, Types } from "mongoose";

// Entidad propia del TP: Auto.
// Tipos usados: texto (brand, modelName, description), numero (year, price, mileage),
// fecha (entryDate) y booleano (used, active).
export interface ICar {
  brand: string;
  modelName: string; // "model" no se puede usar: choca con Document.model() de Mongoose
  year: number;
  price: number;
  mileage: number;
  entryDate: Date;
  used: boolean;
  description: string;
  active: boolean; // baja logica: false = dado de baja (no se muestra en la vista publica)
}

export interface ICarDocument extends ICar, Document {
  _id: Types.ObjectId;
}

const currentYear = new Date().getFullYear();

const carSchema = new Schema<ICarDocument>(
  {
    brand: {
      type: String,
      required: [true, "La marca es obligatoria"],
      trim: true,
      maxlength: [60, "La marca no puede superar los 60 caracteres"],
    },
    modelName: {
      type: String,
      required: [true, "El modelo es obligatorio"],
      trim: true,
      maxlength: [80, "El modelo no puede superar los 80 caracteres"],
    },
    year: {
      type: Number,
      required: [true, "El año es obligatorio"],
      min: [1950, "El año minimo es 1950"],
      max: [currentYear + 1, `El año maximo es ${currentYear + 1}`],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    mileage: {
      type: Number,
      default: 0,
      min: [0, "El kilometraje no puede ser negativo"],
    },
    entryDate: {
      type: Date,
      required: [true, "La fecha de ingreso es obligatoria"],
    },
    used: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "La descripcion no puede superar los 500 caracteres"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Car: Model<ICarDocument> = model<ICarDocument>("Car", carSchema);

export default Car;
