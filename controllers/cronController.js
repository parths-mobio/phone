const moment = require("moment");
const masterGlimpulseService = require("../services/master_glimpulseServices");

/* set glimpulse of the day */
exports.setGlimpleOfTheDay = async (req, res) => {
  try {
    const glimpulses = await masterGlimpulseService.getAllGlimpulse();
    const today = moment().format("YYYY-MM-DD");
    const index = glimpulses.findIndex((data) => {
      if (data.start_date && data.end_date) {
        const start_date = moment(data.start_date).format("YYYY-MM-DD");
        const end_date = moment(data.end_date).format("YYYY-MM-DD");
        return (
          moment(today).isSame(start_date) ||
          moment(today).isBetween(start_date, end_date, undefined, "[]")
        );
      }
    });

    const glimpulse = glimpulses[index];
    await masterGlimpulseService.setGlimpleOfTheDay(glimpulse._id);
    return res
      .status(200)
      .json({ status: true, message: "Glimple of the day", glimpulse });
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};
