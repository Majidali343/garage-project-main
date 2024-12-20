const express = require("express");
const connectDB = require("../Config/db");

const exportpdf = require("../utils/pdfexport");

exports.getcusterpdf = async (req, res) => {
  var userid = req.params.id;

  connectDB.query(
    "SELECT * FROM invoice WHERE id = ?",
    userid,
    (err, rows, fields) => {
      if (err) {
        // Handle the error and respond accordingly
        console.error("Error executing query", err);
        return res.status(500).json({
          Message: "Internal Server Error",
        });
      }

      // Export as PDF instead of Excel
      exportpdf(res, rows, "invoice.pdf");
    }
  );
};

exports.postdata = async (req, res) => {
  try {
    const {
      names,
      vehicles,
      descriptions,
      location,
      dates,
      amounts,
      advances,
      pendings,
      projectStatuses,
      invoices_num,
    } = req.body;

    // Ensure all required fields are present
    if (
      !names ||
      !vehicles ||
      !descriptions ||
      !location ||
      !dates ||
      !amounts ||
      !advances ||
      !pendings ||
      !projectStatuses||
      !invoices_num
    ) {
      return res.status(400).json({ Message: "All fields are required" });
    }

    // Execute the query
    const query =
      " INSERT INTO `invoice`(`name`, `vehicle`, `description`,`location` ,`date`, `amount`,`advance`, `pending`, `invoices_num`, `project_status`)  VALUES (?,?,?,?,?,?,?,?,?,?)";
    await connectDB.query(query, [
      names,
      vehicles,
      descriptions,
      location,
      dates,
      amounts,
      advances,
      pendings,
      projectStatuses,
      invoices_num,
    ]);

    // Send success response
    res.json({ Message: "Data has been saved" });
  } catch (error) {
    // Handle errors
    console.error("Error inserting data:", error);
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

exports.getdata = async (req, res) => {
  connectDB.query("SELECT * FROM invoice", (err, rows, fields) => {
    if (err) {
      // Handle the error and respond accordingly
      console.error("Error executing query", err);
      return res.status(500).json({
        Message: "Internal Server Error",
      });
    }

    // Respond with the rows from the database
    res.json({
      rows,
    });
  });
};

exports.deletedata = async (req, res) => {
  const id = req.params.id;

  connectDB.query("DELETE FROM invoice WHERE `id` = ?", id, (err, fields) => {
    if (err) {
      // Handle the error and respond accordingly
      console.error("Error executing query", err);
      return res.status(500).json({
        Message: "Internal Server Error",
      });
    }

    // Respond with the rows from the database
    res.json({
      Message: "deleted sucessfully",
    });
  });
};

exports.updatedata = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    vehicle,
    description,
    Location,
    date,
    amount,
    advance,
    pending,
    project_status,
    invoices_num,
  } = req.body;

  const query = `
            UPDATE invoice
            SET name = ?, vehicle = ?, description = ?, Location = ?, date = ?, amount = ?, advance = ?, pending = ? , project_status = ?, invoices_num = ?
            WHERE id = ?
        `;

  connectDB.query(
    query,
    [
      name,
      vehicle,
      description,
      Location,
      date,
      amount,
      advance,
      pending,
      project_status,
      invoices_num,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).json({
          Message: "Internal Server Error",
        });
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        return res.status(404).json({
          Message: "Customer not found",
        });
      }

      // Respond with a success message
      res.json({
        Message: "Updated successfully",
      });
    }
  );
};
