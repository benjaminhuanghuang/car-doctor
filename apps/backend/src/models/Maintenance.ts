import { Schema, model, Types, HydratedDocument } from 'mongoose';

interface IMaintenance {
  carId: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  description: string;
  cost: number;
  mileage: number;
  date: Date;
  nextDueDate: Date;
  nextDueMileage: number;
  attachments: string[];
  notes: string;
}

const maintenanceSchema = new Schema<IMaintenance>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'oil_change',
        'tire_rotation',
        'brake_service',
        'battery_replacement',
        'air_filter',
        'fuel_filter',
        'transmission_fluid',
        'coolant_flush',
        'inspection',
        'other',
      ],
    },
    description: {
      type: String,
      required: false,
    },
    cost: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    mileage: {
      type: Number,
      required: false,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
    },
    nextDueMileage: {
      type: Number,
      min: 1000,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

// Index for querying maintenance records by car and user
maintenanceSchema.index({ carId: 1, userId: 1 });
maintenanceSchema.index({ date: -1 });

type MaintenanceDocument = HydratedDocument<IMaintenance>;
const Maintenance = model<IMaintenance>('Maintenance', maintenanceSchema);

export default Maintenance;
export { Maintenance, type IMaintenance, type MaintenanceDocument };
