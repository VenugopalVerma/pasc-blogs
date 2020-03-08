const express = require('express')
const mongoose = require('mongoose');
const userSchema = require('./user');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const blogSchema = new mongoose.Schema({
    // user_id: mongoose.Types.ObjectId,
    approve: Boolean,
    author: {
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'    
        },
        author_name: String
    },
    category: String,
    content: String,
    date: Date,
    heading: String,
    // id: String,
    image: String,
    subHeading: String

});

const Blog = mongoose.model('Blog',blogSchema);


const validateBlog = (data) => {
    const schema = Joi.object( {
        // author: string,
        author: Joi.object({
            author_id: Joi.objectId().required(),
            author_name: Joi.string(),
        }),
        approve: Joi.boolean(),
        category: Joi.string(),
        content: Joi.string(),
        data: Joi.date(),
        heading: Joi.string(),
        // blog_id: Joi.objectId(),
        image: Joi.string(),
        subheading: Joi.string(),
        // email: Joi.string()
    });

    return schema.validate(data);
}

// async function setData(array){
//     for (let index = 0; index < array.length; index++) {
//         const element = array[index];
//         const blog = new Blog({user_id: element.id, name: element.name});
//         try {
//             const result = await blog.save();
//             console.log(result);    
//         } catch (error) {
//             console.error(error);
//         }
//     }
// }

module.exports.Blog = Blog;
module.exports.validateBlog = validateBlog;