const connection = require("../db/db");
const jwt = require("jsonwebtoken");

const getUserRequests = (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const userid = decoded.id;
    connection.query("SELECT r.*,u.name,u.lastname FROM requests r INNER JOIN users u ON r.id_user = u.id WHERE id_user = ? ORDER BY r.created_at DESC", [userid], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Errore nel recupero delle richieste" });
      }
      const requests = results.map((request) => {
        return {
          ...request,
          date: new Date(request.date).toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" }),
          created_at: new Date(request.created_at).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
          update_at: new Date(request.update_at).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
        };
      });
      return res.status(200).json(requests);
    });
  });
};

const getCrewRequests = (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const userid = decoded.id;
    const role = decoded.role;
    if (role === "manager" || role === "director") {
      connection.query(`SELECT r.*,u.name,u.lastname FROM requests r INNER JOIN users u ON r.id_user = u.id WHERE u.role = "crew" ORDER BY r.created_at DESC`, (err, results) => {
        if (err) {
          res.status(500).json({ message: "Errore nel recupero delle richieste" });
        } else {
          const requests = results.map((request) => {
            return {
              ...request,
              date: new Date(request.date).toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" }),
              created_at: new Date(request.created_at).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
              update_at: new Date(request.update_at).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
            };
          });
          res.status(200).json(requests);
        }
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
};

const getManagerRequests = (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const userid = decoded.id;
    const role = decoded.role;
    if (role === "director") {
      connection.query("SELECT r.*,u.name,u.lastname FROM requests r INNER JOIN users u ON r.id_user = u.id WHERE u.role = 'manager' ORDER BY r.created_at DESC", (err, results) => {
        if (err) {
          res.status(500).json({ message: "Errore nel recupero delle richieste" });
        } else {
          const requests = results.map((request) => {
            return {
              ...request,
              date: new Date(request.date).toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" }),
              created_at: new Date(request.created_at).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
              update_at: new Date(request.update_at).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
            };
          });
          res.status(200).json(requests);
        }
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
};

const createRequest = (req, res) => {
  let { type, motivo, date, dateEnd, options, time } = req.body;
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    if (type === "oraria") {
      dateEnd = null;
    } else if (type === "ferie") {
      options = null;
      time = null;
    } else if (type === "permesso") {
      dateEnd = null;
      options = null;
      time = null;
    }

    const userid = decoded.id;
    connection.query(
      "INSERT INTO requests (id_user, type, description, date, dateend, options, time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userid, type, motivo, date, dateEnd, options, time, "pending"],
      (err, results) => {
        if (err) {
          res.status(500).json({ message: "Errore nella creazione della richiesta", error: err });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
};

const updateRequest = (req, res) => {
  const { id, status } = req.body;
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const userid = decoded.id;
    const role = decoded.role;
    if (role === "manager" || role === "director") {
      connection.query("UPDATE requests SET status = ?, update_at = NOW(), approved_by = ? WHERE id = ?", [status, userid, id], (err, results) => {
        if (err) {
          res.status(500).json({ message: "Errore nell'aggiornamento della richiesta", error: err });
        } else {
          res.status(200).json(results);
        }
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });
};

const getRequest = (req, res) => {
  const { id } = req.params;
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }
    const userid = decoded.id;
    connection.query("SELECT r.*,u.name,u.lastname FROM requests r INNER JOIN users u ON r.id_user = u.id WHERE r.id = ?", [id], (err, results) => {
      if (err) {
        res.status(500).json({ message: "Errore nel recupero della richiesta" });
      } else {
        const request = results.map((request) => {
          return {
            ...request,
            date: new Date(request.date).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
            dateend: new Date(request.dateend).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
            created_at: new Date(request.created_at).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
            update_at: new Date(request.update_at).toLocaleDateString("it-IT", { timeZone: "Europe/Rome" }),
          };
        });
        res.status(200).json(request);
      }
    });
  });
};
module.exports = { getUserRequests, getCrewRequests, getManagerRequests, createRequest, updateRequest, getRequest };
