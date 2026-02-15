import { Schema, model, HydratedDocument } from 'mongoose';

interface ICar {
  userId: string;
  // licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
}

const carSchema = new Schema<ICar>({
  userId: { type: String, required: true },
  // licensePlate: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: String,
});

// Add mongoose document methods to the ICar interface
type CarDocument = HydratedDocument<ICar>;
// Create the Car model
const Car = model<ICar>('Car', carSchema);

export { Car, type CarDocument, type ICar };
