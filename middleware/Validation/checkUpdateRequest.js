const { z } = require("zod");

const checkUpdateRequest = async (req, res, next) => {
  const { id, status } = req.body;

  const schema = z.object({
    id: z.number().min(1),
    status: z.enum(["pending", "approved", "rejected"]),
  });

  const { error } = schema.safeParse({ id, status });
  if (error) {
    return res.status(400).json({ error: error.issues });
  } else {
    next();
  }
};

module.exports = { checkUpdateRequest };
