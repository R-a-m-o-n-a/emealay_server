// logic for tracking routes

import Tracking from "../models/tracking.model.js";

export const addTrackingData = async (req, res) => {
  const givenTrackingData = req.body;
  const newTrackingData = new Tracking(givenTrackingData);
  try {
    await newTrackingData.save();
    res.status(201).json({ 'message': 'successfully added new tracking data', 'trackingData': newTrackingData });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

