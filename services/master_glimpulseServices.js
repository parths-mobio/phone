const Glimpulse = require("../models/master_glimpulses");

/* -------------- MASTER Glimpulse MODULE ----------- */
/* get all Glimpulse */
exports.getAllGlimpulse = async () => {
  return await Glimpulse.find()
    .populate("created_by", "first_name")
    .populate("keywords", "name")
    .populate("category_id", "name url");
};

exports.creatNewGlimpulse = async (glim) => {
    return await Glimpulse.create(glim);
  };

  exports.getAllGlimpulseById = async (glim) => {
    return await Glimpulse.find({ _id: glim })
    .populate("created_by", "first_name")
    .populate("keywords", "name")
    .populate("category_id", "name url");
  };

  /* update Glimpulse */
exports.updateGlimpulse = async (glim_id, glim) => {
    let updated_glim;
    updated_glim = await Glimpulse.findOneAndUpdate(
      {
        _id: glim_id,
      },
      { $set: glim },
      { new: true }
    );
    return updated_glim;
  };

  /* delete Glimpulse */
exports.deleteGlimpulse = async (glim_id) => {
    return Glimpulse.deleteOne({ _id: glim_id });
  };
  