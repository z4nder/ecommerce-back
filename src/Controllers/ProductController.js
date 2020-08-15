const Product = require('../Models/Product')
const { errorHandler } = require('../Helpers/dbErrorHandler')
const formidable = require('formidable')
const _ = require('lodash')
const fs  = require('fs')

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    //Manter extenção
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Image could not be uploaded'})
        }
        //check for all fields
        const { name, description, price, category, quantity, shipping } = fields
        if (!name || !description || !price || !category || !quantity || !shipping){           
            return res.status(400).json({ error: 'All fields are required'})           
        }
            
        let product = new Product(fields)

        // 1kb = 1000
        // 1mb = 1000000

        //Populate photo
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({ error: 'Image shold be less than 1mb in size'})
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: errorHandler(err)})
            }
            res.json(result)
        })
    })

}