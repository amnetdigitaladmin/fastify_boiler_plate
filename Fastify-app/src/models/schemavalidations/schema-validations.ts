import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().alphanum().min(3).max(30).required(),
  mobile: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
  type: Joi.string().required(),
});