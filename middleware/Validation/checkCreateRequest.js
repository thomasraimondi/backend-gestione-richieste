const { z } = require("zod");

const checkCreateRequest = async (req, res, next) => {
  const { type, description, date, dateend, options, time } = req.body;

  const nDay = new Date().getDay();
  let addDays = new Date();
  let minDate = "";
  if (nDay === 1) {
    addDays = new Date(addDays.setDate(addDays.getDate() + 14));
    minDate = addDays.toISOString().split("T")[0];
  } else if (nDay === 2) {
    addDays = new Date(addDays.setDate(addDays.getDate() + 20));
    minDate = addDays.toISOString().split("T")[0];
  } else if (nDay === 3) {
    addDays = new Date(addDays.setDate(addDays.getDate() + 19));
    minDate = addDays.toISOString().split("T")[0];
  } else if (nDay === 4) {
    addDays = new Date(addDays.setDate(addDays.getDate() + 18));
    minDate = addDays.toISOString().split("T")[0];
  } else if (nDay === 5) {
    addDays = new Date(addDays.setDate(addDays.getDate() + 17));
    minDate = addDays.toISOString().split("T")[0];
  } else if (nDay === 6) {
    addDays = new Date(addDays.setDate(addDays.getDate() + 16));
    minDate = addDays.toISOString().split("T")[0];
  } else if (nDay === 0) {
    addDays = new Date(addDays.setDate(addDays.getDate() + 15));
    minDate = addDays.toISOString().split("T")[0];
  }

  let schema;

  if (type === "oraria") {
    schema = z.object({
      type: z.enum(["oraria"]),
      date: z
        .string()
        .min(1)
        .refine((date) => date >= minDate, { message: `La data deve essere a partire da ${minDate}` }),
      options: z.enum(["inizia-il-turno-dalle-ore", "termina-il-turno-entro-le-ore"]),
      time: z.string().min(1),
    });
  }
  if (type === "ferie") {
    schema = z.object({
      type: z.enum(["ferie"]),
      date: z
        .string()
        .min(1)
        .refine((d) => d >= minDate, { message: `La data di inizio deve essere a partire da ${minDate}` }),
      dateend: z
        .string()
        .min(1)
        .refine((d) => d >= date, { message: "La data di fine deve essere dopo la data di inizio" }),
    });
  }
  if (type === "permesso") {
    schema = z.object({
      type: z.enum(["permesso"]),
      date: z
        .string()
        .min(1)
        .refine((date) => date >= minDate, { message: `La data deve essere a partire da ${minDate}` }),
    });
  }

  const { error } = schema.safeParse({ type, date, dateend, options, time });
  if (error) {
    return res.status(400).json({ error: error.issues });
  } else {
    next();
  }
};

module.exports = { checkCreateRequest };
