const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	},
});

const Note = require("../models/notes");

router.get("/", checkAuth, (req, res, next) => {
	Note.find()
		.select("title value owner ")
		.exec()
		.then((docs) => {
			const response = {
				count: docs.length,
				products: docs.map((doc) => {
					return {
						title: doc.title,
						value: doc.value,
						owner: doc.owner,
						_id: doc._id,
						request: {
							type: "GET",
							url: "http://localhost:3000/products/" + doc._id,
						},
					};
				}),
			};
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.post("/", checkAuth, (req, res, next) => {
	const ownerId = req.params.authorization;
	console.log(ownerId);
	const note = new Note({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		value: req.body.value,
		owner: req.headers.authorization,
	});
	note
		.save()
		.then((result) => {
			res.status(201).json({
				message: "Created note successfully",
				createdNote: {
					title: result.title,
					value: result.value,
					_id: result._id,
					request: {
						type: "GET",
						url: "http://localhost:3000/products/" + result._id,
						owner: result.owner,
					},
				},
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.get("/:productId", (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.select("name price _id productImage")
		.exec()
		.then((doc) => {
			console.log("From database", doc);
			if (doc) {
				res.status(200).json({
					product: doc,
					request: {
						type: "GET",
						url: "http://localhost:3000/products",
					},
				});
			} else {
				res
					.status(404)
					.json({ message: "No valid entry found for provided ID" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.patch("/:productId", checkAuth, (req, res, next) => {
	const id = req.params.productId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Product.update({ _id: id }, { $set: updateOps })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Product updated",
				request: {
					type: "GET",
					url: "http://localhost:3000/products/" + id,
				},
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

router.delete("/:productId", checkAuth, (req, res, next) => {
	const id = req.params.productId;
	Product.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Product deleted",
				request: {
					type: "POST",
					url: "http://localhost:3000/products",
					body: { name: "String", price: "Number" },
				},
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
});

module.exports = router;
