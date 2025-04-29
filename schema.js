const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().optional(), // changed from object to string
    price: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required()
  }).required()
});



const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      "any.required": "Rating is required",
      "number.base": "Rating must be a number",
    }),
    comment: Joi.string().required().messages({
      "string.empty": "Comment cannot be empty",
    }),
  }).required()
});

// ✅ Export both schemas
module.exports = { listingSchema, reviewSchema };
