import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

interface User extends Document {
  username: string;
  email: string;
  password: string;
  tokens: string[];
  generateAuthToken: ()=>string;
}

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: {
    type: [String],
    default: []
  }
});

// Hash password before saving
userSchema.pre<User>('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY || "recipe");
  this.tokens.push(token);
  return token;
};

const UserModel: Model<User> = mongoose.model('User', userSchema);

export default UserModel;
