import { Schema, model } from 'mongoose';
import {handleMongooseError, preUpdate} from '../utils/helpers/handleMongooseError'

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
        name :{
            tepe: String,
            required: [true, 'Name is required'],
            maxLength: 32,
        },
        email: {
          type: String,
          match: emailRegexp,
          required: [true, 'Email is required'],
          unique: true,
        },
        password: {
            type: String,
            minLength: 8,
            maxLength: 48,
            required: [true, 'Set password for user'],
        },
        gender: {
          type: String,
          enum: ["mail", "femail"],
        //   default: "mail"
        },
        waterRate: {
          type: Number,
          required: [true, 'Set rate'],
          min: 0,
          max: 15000,
          default: 0,
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
        avatarURL: String,
        token: String,

},{ versionKey: false, timestamps: true })


userSchema.post('save', handleMongooseError );
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post('findOneAndUpdate', handleMongooseError );

const User = model('user', userSchema);

export default User