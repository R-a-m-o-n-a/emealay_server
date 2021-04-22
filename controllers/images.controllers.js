/** logic for image routes */
import multer from 'multer';
import Image from "../models/image.model.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import DatauriParser from 'datauri/parser.js';

dotenv.config();
const dUri = new DatauriParser();
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

/*
const imageFileFilter = (req, file, cb) => {
  console.log("File in filter", file);
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}*/

export const upload = multer({
  storage: storage,
  limits: {
    // Allow upload files under 10MB
    fileSize: 10485760,
  },
  // fileFilter: imageFileFilter,
});

export const uploadSingleImage = async (req, res) => {
  const image = dataUri(req).content;
  const { category, categoryId, tags, name } = req.body;

  const folderName = category && categoryId ? category + '/' + categoryId : req.params.folder;
  const uploadOptions = {
    folder: folderName,
    tags: tags || [],
  };
  if (category === 'userProfile') {
    uploadOptions.folder = category;
    uploadOptions.public_id = categoryId;
    uploadOptions.overwrite = true;
    uploadOptions.transformation = { aspect_ratio: 1, gravity: "faces", crop: "fill" };
  }
  cloudinary.uploader.upload(image, uploadOptions).then((cloudinaryImage) => {
    // console.log('upload successful');
    const { public_id, secure_url, url } = cloudinaryImage;
    const newImage = new Image({
      categoryName: category,
      categoryId,
      url: secure_url || url,
      cloudinaryPublicId: public_id,
      name,
    });
    try {
      newImage.save().then(() => {
        // console.log('added image to ' + folderName, public_id, name);
        res.status(201).json({ 'message': 'successfully added new Image', 'Image': newImage })
      });
    } catch (error) {
      res.status(409).json({ message: error.message, errorDetails: 'upload successful, but database storage failed' });
    }
  }).catch((error) => {
    res.status(409).json({ message: error.message, errorDetails: 'upload failed' });
  });
}

async function copySingleImage(image, category, newId) {
  let returnImage = null;
  if (image.url) {
    await cloudinary.uploader.upload(image.url, { folder: category + '/' + newId }).then(async (cloudinaryImage) => {
      // console.log('upload successful');
      const { public_id, secure_url, url } = cloudinaryImage;
      const newImage = new Image({
        categoryName: category,
        categoryId: newId,
        url: secure_url || url,
        cloudinaryPublicId: public_id,
        name: image.name,
      });
      await newImage.save().then((savedImage) => {
        returnImage = savedImage;
      }).catch((error) => {
        console.log('upload of copied image successful, but database storage failed', 'error:', error.message);
      });
    }).catch((error) => {
      console.log('image upload failed because ', error);
    });
  }
  return returnImage;
}

export const copyImagesForCategory = async (req, res) => {
  let { category, oldId, newId } = req.params;

  let newImages = [];

  await Image.find({ categoryName: category, categoryId: oldId }, async function (err, foundImages) {
    if (err) {
      console.log('error in find', err);
    } else {
      if (foundImages && foundImages.length > 0) {
        newImages = await Promise.all(foundImages.map(async (i) => {
          return await copySingleImage(i, 'mealImages', newId)
        }));
        if (newImages.length > 0) {
          res.status(201).json({ 'message': 'successfully copied Images', newImages });
        } else {
          res.status(400).json({ 'info': `copying images failed. Check log for more info` });
        }
      } else {
        res.status(200).json({ 'message': 'no images had to be copied' });
      }
    }
  });
}

export const deleteSingleImage = async (req, res) => {
  const image = req.body;
  Image.findByIdAndDelete(image._id, {}, function (err, deletionResult) {
    if (err) {
      res.status(400).json({ 'info': `Deletion of image ${image._id} failed`, 'message': err.message });
    } else {
      cloudinary.uploader.destroy(image.cloudinaryPublicId).then((result) => {
        res.status(201).json({ 'info': 'image deleted', deletionResult, cloudinaryResult: result });
      }).catch(error => {
        console.log('image deleted from database but not from cloudinary: ', image, 'reason', error);
        res.status(201).json({ 'info': 'image deleted from database but not from cloudinary', 'cloudinaryError': error });
      });
    }
  });
}

export const deleteAllImagesFromCategory = async (req, res) => {
  let category = req.params.category;
  let id = req.params.id;
  // console.log('delete all images from ', category, id);
  await Image.find({ categoryName: category, categoryId: id }, async function (err, foundImages) {
    if (err) {
      console.log('error in find', err);
    } else {
      await Promise.all(foundImages.map(async (i) => {
        await cloudinary.uploader.destroy(i.cloudinaryPublicId).catch(error => {
          console.log('deletion of ' + i.name + ' from cloudinary failed because', error);
        });
      }));
      cloudinary.api.delete_folder(category + '/' + id).catch(err => {
        console.log('error on delete folder', err);
      }).finally(() => {
        Image.deleteMany({ categoryName: category, categoryId: id }, {}, function (err, deletionResult) {
          if (err) {
            res.status(400).json({ 'info': `Deletion of images from ${category} ${id} failed`, 'message': err.message });
          } else {
            res.status(201).json({ 'info': `images from ${category} with ${id} deleted`, deletionResult })
          }
        });
      });
    }
  })
}
