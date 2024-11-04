const express = require("express");
const connectDB = require("../Config/db");
const exportexcel = require("../utils/excelexport");

exports.getcusterexcel = async (req, res) => {
  var userid = req.params.id;

  connectDB.query(
    "SELECT * FROM pending WHERE id = ?",
    userid,
    (err, rows, fields) => {
      if (err) {
        // Handle the error and respond accordingly
        console.error("Error executing query", err);
        return res.status(500).json({
          Message: "Internal Server Error",
        });
      }

      exportexcel(res, rows, "pending.xlsx");
    }
  );
};

exports.postdata = async (req, res) => {
  try {
    const {
      names,
      locations,
      dates,
      advances,
      pendings,
      totals,
      paymentStatuses,
      receiveDates,
    } = req.body;

    // Validate arrays have same length
    const arrayLength = names.length;
    if (
      ![
        locations,
        dates,
        advances,
        pendings,
        totals,
        paymentStatuses,
        receiveDates,
      ].every((arr) => Array.isArray(arr) && arr.length === arrayLength)
    ) {
      return res
        .status(400)
        .json({ Message: "All arrays must have the same length" });
    }

    // Prepare and execute multiple inserts
    const values = names.map((_, index) => [
      names[index],
      locations[index],
      dates[index],
      advances[index],
      pendings[index],
      totals[index],
      paymentStatuses[index],
      receiveDates[index],
    ]);

    const query = `
            INSERT INTO pending (
                name, location, date, advance, pending, total, payment_status, receiveDate
            ) VALUES ?
        `;

    await connectDB.query(query, [values]);

    res.json({ Message: "Data has been saved" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ Message: "Internal Server Error" });
  }
};

exports.getdata = async (req, res) => {
  connectDB.query("SELECT * FROM pending", (err, rows, fields) => {
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

  connectDB.query("DELETE FROM pending WHERE `id` = ?", id, (err, fields) => {
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
    location,
    date,
    advance,
    pending,
    total,
    payment_status,
    receiveDate,
  } = req.body;

  const query = `
            UPDATE pending
            SET 
                name = ?, 
                location = ?,  
                date = ?, 
                advance = ?, 
                pending = ?, 
                total = ?, 
                payment_status = ?,
                receiveDate = ?
            WHERE id = ?
        `;

  connectDB.query(
    query,
    [
      name,
      location,
      date,
      advance,
      pending,
      total,
      payment_status,
      receiveDate,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error executing query", err);
        return res.status(500).json({
          Message: "Internal Server Error",
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          Message: "Customer not found",
        });
      }

      res.json({
        Message: "Updated successfully",
      });
    }
  );
};
