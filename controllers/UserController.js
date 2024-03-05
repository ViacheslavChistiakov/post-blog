import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModule from '../models/User.js';



export const login = async (req, res) => {
    try {
        const user = await UserModule.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'User is not found'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(404).json({
                message: 'Login or password is not correct'
            });   
        }

        const token =  jwt.sign({
            _id: user._id,
        }, 
        'secret123',
        {
            expiresIn: '30d',
        }
        );

        const {passwordHash, ...userData} = user._doc;
    
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not made authorizate '
        })
    }
}

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)
    
        const doc = new UserModule({
            email: req.body.email,
            fullName: req.body.fullName,
            avatartUrl: req.body.avatartUrl,
            passwordHash: hash,
        });
    
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 
        'secret123',
        {
            expiresIn: '30d',
        }
        );

        const {passwordHash, ...userData} = user._doc;
    
        res.json({
            ...userData,
            token,
        });
    
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Could not made register '
        })
    }

}

export const authorization = async (req, res) => {
    try {
            const user = await UserModule.findById(req.userId)

            if (!user) {
                return res.status(404).json({
                    message: 'User is not found'
                })
            }
            const {passwordHash, ...userData} = user._doc;
    
            res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Do not have an access'
        })
    }
}

