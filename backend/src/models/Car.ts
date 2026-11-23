import { Schema, model, Document, Model, Types } from "mongoose";

// Valores permitidos de los campos con opciones fijas (se reusan en los schemas de Zod).
export const TRANSMISSIONS = ["manual", "automatica"] as const;
export const FUELS = ["nafta", "diesel", "hibrido", "electrico", "gnc"] as const;
export const BODY_TYPES = ["sedan", "hatchback", "suv", "pickup", "coupe", "utilitario"] as const;
export const TRACTIONS = ["4x2", "4x4"] as const;

export type Transmission = (typeof TRANSMISSIONS)[number];
export type Fuel = (typeof FUELS)[number];
export type BodyType = (typeof BODY_TYPES)[number];
export type Traction = (typeof TRACTIONS)[number];

// Entidad propia del TP: Auto.
// Tipos usados: texto (brand, modelName, engine, color, description), numero (year, price, mileage,
// horsepower, doors), fecha (entryDate), booleano (used, active) y lista de textos (features).
export interface ICar {
  brand: string;
  modelName: string; // "model" no se puede usar: choca con Document.model() de Mongoose
  year: number;
  price: number;
  mileage: number;
  entryDate: Date;
  used: boolean;
  // Ficha tecnica
  engine: string; // ej: "2.0 16V Dual VVT-i"
  horsepower: number; // CV
  transmission: Transmission;
  fuel: Fuel;
  bodyType: BodyType;
  traction: Traction;
  doors: number;
  color: string;
  features: string[]; // equipamiento destacado
  description: string;
  imageUrl: string; // opcional: URL o ruta de una foto del auto
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
    engine: {
      type: String,
      trim: true,
      default: "",
      maxlength: [60, "El motor no puede superar los 60 caracteres"],
    },
    horsepower: {
      type: Number,
      default: 0,
      min: [0, "La potencia no puede ser negativa"],
      max: [2000, "La potencia maxima es 2000 CV"],
    },
    transmission: {
      type: String,
      enum: { values: TRANSMISSIONS, message: "Transmision no valida" },
      default: "manual",
    },
    fuel: {
      type: String,
      enum: { values: FUELS, message: "Combustible no valido" },
      default: "nafta",
    },
    bodyType: {
      type: String,
      enum: { values: BODY_TYPES, message: "Tipo de carroceria no valido" },
      default: "sedan",
    },
    traction: {
      type: String,
      enum: { values: TRACTIONS, message: "Traccion no valida" },
      default: "4x2",
    },
    doors: {
      type: Number,
      default: 4,
      min: [2, "Minimo 2 puertas"],
      max: [5, "Maximo 5 puertas"],
    },
    color: {
      type: String,
      trim: true,
      default: "",
      maxlength: [40, "El color no puede superar los 40 caracteres"],
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: (list: string[]) => list.length <= 20,
        message: "Maximo 20 items de equipamiento",
      },
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "La descripcion no puede superar los 500 caracteres"],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "La URL de la imagen no puede superar los 500 caracteres"],
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
