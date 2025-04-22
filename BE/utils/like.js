const db = require("../models");
const { Feedback, PostExperience, Article } = db;

const getTargetModel = (type) => {
  const models = {
    feedback: Feedback,
    postExperience: PostExperience,
    article: Article,
  };
  return models[type] || null;
};

const validateTarget = async (target_id, target_type) => {
  const model = getTargetModel(target_type);
  if (!model) return { valid: false, message: "target_type không hợp lệ" };

  const record = await model.findByPk(target_id);
  if (!record) return { valid: false, message: "target_id không hợp lệ" };

  return { valid: true };
};

module.exports = { getTargetModel, validateTarget };
