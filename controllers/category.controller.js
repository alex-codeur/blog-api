const CategoryModel = require('../models/category.model');
const paginate = require("express-paginate");


module.exports.getAllCategories = async (req, res) => {
    try {
        // const categories = await CategoryModel.find({});
        const [results, itemCount] = await Promise.all([
            CategoryModel.find({})
                .sort({ createdAt: -1 })
                .limit(req.query.limit)
                .skip(req.skip)
                .lean()
                .exec(),
            CategoryModel.count({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);

        // res.status(200).json(categories);
        return res.status(201).json({
            object: "list",
            has_more: paginate.hasNextPages(req)(pageCount),
            data: results,
            pageCount,
            itemCount,
            currentPage: req.query.page,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.getSingleCategory = async (req, res) => {
    try {
        const category = await CategoryModel.findById(req.params.id);

        // res.status(200).json(category);
        if (category) {
            res.status(200).json(category);
        }
        return res.status(404).json({
            message: "Item not found",
            success: false,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.createCategory = async (req, res) => {
    const newCategory = new CategoryModel({
        ...req.body,
        createdBy: req.user._id,
    });

    try {
        const savedCategory = await newCategory.save();

        return res.status(201).json({
            message: "Item successfully created",
            success: true,
            category: savedCategory
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        return res.status(201).json({
            message: "Item successfully updated",
            success: true,
            category: updatedCategory
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.deleteCategory = async (req, res) => {
    try {
        await CategoryModel.deleteOne();

        // res.status(200).json("Category has been deleted...");
        return res.status(201).json({
            message: "Category has been deleted...",
            success: true,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};