const { z } = require("zod");

const checkRegister = async (req, res, next) => {
  const { name, lastname, email, username } = req.body;
  const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    lastname: z.string().min(1, { message: "Lastname is required" }),
    email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .regex(/^[a-zA-Z0-9]+$/, { message: "Username must contain only letters and numbers" }),
  });

  const { error } = schema.safeParse(req.body);
  if (error) {
    const errorMessageName = error.issues?.filter((issue) => issue.path[0] === "name")[0]?.message;
    const errorMessageLastname = error.issues?.filter((issue) => issue.path[0] === "lastname")[0]?.message;
    const errorMessageEmail = error.issues?.filter((issue) => issue.path[0] === "email")[0]?.message;
    const errorMessageUsername = error.issues?.filter((issue) => issue.path[0] === "username")[0]?.message;
    return res.status(400).json({ error: { name: errorMessageName, lastname: errorMessageLastname, email: errorMessageEmail, username: errorMessageUsername } });
  } else {
    next();
  }
};

module.exports = { checkRegister };
