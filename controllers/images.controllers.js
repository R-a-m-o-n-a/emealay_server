/** logic for image routes */
import multer from 'multer';
import Image from "../models/image.model.js";
import fs from 'fs';

const uploadsFolder = '/uploads/';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('multer params', req.params);
    let uploadPath = '.' + uploadsFolder;
    if (req.params.folder) uploadPath += req.params.folder;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + '-' + file.originalname);
  }
});

const imageFileFilter = (req, file, cb) => {
  console.log("File in filter", file);
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

export const upload = multer({
  storage: storage,
  limits: {
    // Allow upload files under 10MB
    fileSize: 10485760,
  },
  fileFilter: imageFileFilter,
});

export const uploadSingleImage = async (req, res) => {
  const image = req.file;
  console.log('images file', image);
  let imagePath = uploadsFolder;
  if (req.params.folder) imagePath += req.params.folder + '/';
  imagePath += image.filename;
  const newImage = new Image({
    categoryName: req.body.category,
    categoryId: req.body.categoryId,
    name: image.filename,
    path: imagePath,
  });
  try {
    newImage.save().then(() => {
      console.log('added image ' + imagePath);
      res.status(201).json({ 'message': 'successfully added new Image', 'Image': newImage })
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const deleteSingleImage = async (req, res) => {
  let id = req.params.id;
  console.log('req body', req.body.path);
  let path = '.' + req.body.path;
  Image.findByIdAndDelete(id, {}, function (err, deletionResult) {
    if (err) {
      res.status(400).json({ 'info': `Deletion of image ${id} failed`, 'message': err.message });
    } else {
      fs.unlink(path, (err) => {
        if (err) {
          console.log('fs deletion failed', err);
        } else {
          console.log('successfully deleted', path);
        }
      });
      res.status(201).json({ 'info': 'image deleted, id: ' + id, deletionResult })
    }
  });
}

export const deleteAllImagesFromCategory = async (req, res) => {
  let category = req.params.category;
  let id = req.params.id;
  Image.find({ categoryName: category, categoryId: id }, function (err, foundImages) {
    if (err) {
      console.log('error in find', err);
    } else {
      foundImages.forEach(i => {
        fs.unlink('.' + i.path, function (err) {
          if (err) {
            console.log('fs deletion failed', err);
          } else {
            console.log('successfully deleted', i.path);
          }
        })
      });
    }
  }).then(() => {
    Image.deleteMany({ categoryName: category, categoryId: id }, {}, function (err, deletionResult) {
      if (err) {
        res.status(400).json({ 'info': `Deletion of images from ${category} ${id} failed`, 'message': err.message });
      } else {
        res.status(201).json({ 'info': `images from ${category} with ${id} deleted`, deletionResult })
      }
    });
  });
}
