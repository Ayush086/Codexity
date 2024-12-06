// to add categorys during course creation --> used to determine course's category
const { Mongoose } = require('mongoose');
const Category = require('../models/Category');

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// create category
exports.createCategory = async (req, res) => {
	try {

		// fetch data: from req.body
		const { name, description } = req.body;

		// validation
		// empty check
		if (!name) {
			return res.status(400).json({
				success: false,
				message: "all fields are required. please check your input"
			});
		}

		// create category entry in db
		const categoryDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log('category details: ', categoryDetails);

		// return response
		return res.status(200).json({
			success: true,
			message: "category creation successful",
		})

	} catch (error) {
		console.log("error occurred while creating category (Category.js) ");
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


// get all categories
exports.showAllCategories = async (req, res) => {
	try {
		console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.categoryPageDetails = async (req, res) => {
	try {

		// get category
		const { categoryId } = req.body;
		console.log("category id: ", categoryId);

		// get courses for specified category
		const selectedCategory = await Category.findById(categoryId)
			.populate({
				path: "courses",
				match: { status: "Published" },
				populate: "ratingAndReviews",
			})
			.exec()

		console.log("selected category courses: ", selectedCategory);

		// validation
		// when category doesn't exist
		if (!selectedCategory) {
			console.log("Category not found");
			return res.status(404).json({
				success: false,
				message: "category not found"
			});
		}

		// when category doesn't contain any courses
		// if (selectedCategory?.courses?.length === 0) {
		// 	console.log("no courses found for the selected category");
		// 	return res.status(404).json({
		// 		success: false,
		// 		message: "no courses found for the selected category"
		// 	});
		// }

		// const selectedCourses = selectedCategory.courses;

		// get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId }
		})
		console.log(categoriesExceptSelected);

		let differentCategory = await Category.findOne(
			categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
		)
			.populate({
				path: 'courses',
				match: { status: "Published" },
			})
			.exec();

		console.log("Different categories:.........", differentCategory);

		const allCategories = await Category.find()
			.populate({
				path: 'courses',
				match: { status: "Published" },
				populate: {
					path: 'instructor',
				}
			})
			.exec();

		console.log("All categories:.........", allCategories);

		const allCourses = allCategories.flatMap((category) => category.courses)

		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10)

		// return response
		res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				differentCategory,
				mostSellingCourses,
			}
		});

	} catch (error) {
		console.log("error occuered in category page details (Category.js)");
		console.log(error.message);
		return res.status(500).json({
			succss: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};