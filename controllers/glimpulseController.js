const Glimpulse = require("../models/master_glimpulses");
const { Validator } = require("node-input-validator");
const glimpulseServices = require("../services/master_glimpulseServices");
const { errorResponse, successResponse } = require("../common/response");
const constants = require("../common/constant");

/* for List Glimpulse */
exports.listGlimpulse = async (req, res, next) => {
  try {
    let glimpulse = await glimpulseServices.getAllGlimpulse();
    return res
      .status(200)
      .json(successResponse(constants.GLIMPULSE_LIST, glimpulse));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Create Glimpulse */
exports.createGlimpulse = async (req, res, next) => {
  try {
    let user_id = req.userId;
    req.body.created_by = user_id;
    let created_glim = await glimpulseServices.creatNewGlimpulse(req.body);
    if (created_glim) {
      return res
        .status(200)
        .json(
          successResponse(constants.GLIMPULSE_CREATE_SUCCESS, created_glim)
        );
    }
  } catch (errors) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Update Glimpulse */
exports.updateGlimpulse = async (req, res, next) => {
  try {
    const set = req.query.id;
    let user_id = req.userId;
    req.body.updated_by = user_id;

    const Cat = await Glimpulse.findOne({ _id: set });
    if (!Cat) {
      return res.status(400).json(errorResponse(constants.GLIMPULSE_NOT_FOUND));
    }

    let updated_glimpulse = await glimpulseServices.updateGlimpulse(
      set,
      req.body
    );
    if (updated_glimpulse) {
      return res
        .status(200)
        .json(
          successResponse(constants.GLIMPULSE_UPDATE_SUCCESS, updated_glimpulse)
        );
    }
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for get Glimpulse By Id */
exports.getById = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    let glimpulse = await glimpulseServices.getAllGlimpulseById(cat);
    if (!glimpulse) {
      return res.status(400).json(errorResponse(constants.GLIMPULSE_NOT_FOUND));
    }
    res.status(200).json(successResponse(constants.GLIMPULSE_BY_ID, glimpulse));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Delete Glimpulse */
exports.deleteGlimpulse = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    const Cat = await Glimpulse.findOne({ _id: cat });
    if (!Cat) {
      return res.status(404).json(errorResponse(constants.GLIMPULSE_NOT_FOUND));
    }

    await glimpulseServices.deleteGlimpulse(cat);
    res
      .status(200)
      .json(successResponse(constants.GLIMPULSE_DELETE_SUCCESS, Cat));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};
