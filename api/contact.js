import nodemailer from "nodemailer";

export default async (req, res) => {
  try {
    // 1. Parse the JSON (getting the data from the FE)
    const data = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error("Invalid JSON"));
        }
      });
      req.on("error", reject);
    });

    console.log(data);
    // Validate
    // if () {}
  } catch (error) {}
};
