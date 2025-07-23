const { z } = require("zod");

const checkPasswordEquals = async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  const schemaPassword = z
    .string()
    .min(1)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    });

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Password and confirm password do not match" });
  } else {
    const schema = z.object({
      password: schemaPassword,
      confirmPassword: schemaPassword,
    });

    const { error } = schema.safeParse({ password, confirmPassword });
    if (error) {
      const errorMessagePassword = error.issues?.filter((issue) => issue.path[0] === "password")[0]?.message;
      const errorMessageConfirmPassword = error.issues?.filter((issue) => issue.path[0] === "confirmPassword")[0]?.message;
      return res.status(400).json({ error: { password: errorMessagePassword, confirmPassword: errorMessageConfirmPassword } });
    } else {
      next();
    }
  }
};

module.exports = { checkPasswordEquals };
