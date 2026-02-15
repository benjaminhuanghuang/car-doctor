import { Schema, model, HydratedDocument } from 'mongoose';

interface IUser {
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }, // createdAt & updatedAt
);
// Create an index on the email field for faster lookups and to enforce uniqueness
userSchema.index({ email: 1 }, { unique: true });

type UserDocument = HydratedDocument<IUser>;
const User = model<IUser>('User', userSchema);

export { User, type IUser, type UserDocument };
