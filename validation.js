import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'not correct format of mail').isEmail(),
    body('password', 'password should be more longer than 5 leets').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'not correct format of mail').isEmail(),
    body('password', 'password should be more longer than 5 leets').isLength({ min: 5 }),
    body('fullName', 'Name should be more longer than 3 leets').isLength({ min: 3 }),
    body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Type title of post').isLength({ min: 3 }),
    body('text', 'Type text of post').isLength({ min: 10 }).isString(),
    body('tags', 'Not correct format of tags (defin array)').optional().isString(),
    body('imageUrl', 'Not correct link on an Image').optional().isString(),
];