import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "../Pages/images/Notification.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { saveAs } from "file-saver";
import Navigation from "./Navigation";
import BarChart from "../BarChart";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Modal from "../Modal";

function Employeetask() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dates, setDates] = useState([new Date()]);
  const [advances, setAdvances] = useState([null]);
  const [paymentStatuses, setPaymentStatuses] = useState([null]);
  const [locations, setLocations] = useState([""]);
  const [totals, setTotals] = useState([null]);
  const [pendings, setPendings] = useState([null]);
  const [searchQuery, setSearchQuery] = useState("");
  const [names, setNames] = useState([""]);
  const [taskData, setTaskData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [searchName, setSearchName] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [formData, setFormData] = useState({});
  const [notificationDates, setNotificationDates] = useState([null]);
  const [receiveDates, setReceiveDates] = useState([null]);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleDropdownChange = (value, index, type) => {
    switch (type) {
      case "paymentStatus":
        const newStatuses = [...paymentStatuses];
        newStatuses[index] = value;
        setPaymentStatuses(newStatuses);

        // Set receive date when status changes to Successful
        if (value === "Successful") {
          const newReceiveDates = [...receiveDates];
          newReceiveDates[index] = new Date();
          setReceiveDates(newReceiveDates);
        }

        if (value === "Awaiting") {
          const newNotificationDates = [...notificationDates];
          newNotificationDates[index] = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          );
          setNotificationDates(newNotificationDates);
        }
        break;
      default:
        break;
    }
    setDropdownOpen(null);
  };

  const handleDateChange = (date, index) => {
    const newDates = [...dates];
    newDates[index] = date;
    setDates(newDates);
  };

  const handleNotificationDateChange = (date, index) => {
    const newNotificationDates = [...notificationDates];
    newNotificationDates[index] = date;
    setNotificationDates(newNotificationDates);
  };

  const downloadExcel = (id) => {
    axios
      .get(`http://localhost:5000/pending/getexcel/${id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "data.xlsx");
      })
      .catch((error) => {
        console.error("There was an error downloading the Excel file!", error);
      });
  };

  const handleAdvanceChange = (value, index) => {
    const newAdvances = [...advances];
    newAdvances[index] = value;
    setAdvances(newAdvances);
  };

  const handleLocationChange = (value, index) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const handleTotalChange = (value, index) => {
    const newTotals = [...totals];
    newTotals[index] = value;
    setTotals(newTotals);
  };

  const handlePendingChange = (value, index) => {
    const newPendings = [...pendings];
    newPendings[index] = value;
    setPendings(newPendings);
  };

  const handleSubmit = async () => {
    const formData = {
      names,
      dates,
      advances,
      paymentStatuses,
      locations,
      totals,
      pendings,
      notificationDates,
      receiveDates,
    };

    try {
      const result = await fetch(
        "http://localhost:5000/pending/post/E-pending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      fetchData();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/pending/get/E-pending"
      );
      const data = await response.json();
      setTaskData(data.rows);
      setFilteredData(data.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [dateFilter, searchName]);

  const resetFilters = () => {
    setDateFilter({ start: "", end: "" });
    setSearchName("");
    setFilteredData(taskData);
  };

  const filterData = () => {
    let data = taskData;

    if (dateFilter.start && dateFilter.end) {
      data = data.filter(
        (invoice) =>
          invoice.date >= dateFilter.start && invoice.date <= dateFilter.end
      );
    }

    if (searchName) {
      data = data.filter((invoice) =>
        invoice.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredData(data);
  };

  const checkPendingPayments = () => {
    const today = new Date();
    filteredData.forEach(async (pending) => {
      if (
        pending.payment_status === "Awaiting" &&
        new Date(pending.notificationDate) <= today
      ) {
        const updatedPending = {
          ...pending,
          payment_status: "Pending",
          date: today.toISOString().split("T")[0],
        };

        try {
          await fetch(`http://localhost:5000/pending/update/${pending.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPending),
          });
        } catch (error) {
          console.error("Error updating pending payment:", error);
        }
      }
    });

    fetchData();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(checkPendingPayments, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const chartLabels = filteredData.map((item) => item.date);
  const chartData = filteredData.map((item) => item.total);

  const handleEdit = (pending) => {
    setCurrentStatus(pending);
    setFormData(pending);
    setEditModalOpen(true);
  };

  const handleDelete = (pending) => {
    setCurrentStatus(pending);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/pending/delete/${currentStatus.id}`, {
        method: "DELETE",
      });
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Modify handleChange to handle receiveDate changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };

      // Update receive date when payment status changes to Successful
      if (name === "payment_status" && value === "Successful") {
        newData.receiveDate = new Date().toISOString().split("T")[0];
      }

      return newData;
    });
  };

  const handleSubmitChange = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:5000/pending/update/${currentStatus.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating customer data:", error);
    }
  };

  return (
    <div className="bg-gray-100 flex">
      <aside className="w-64 bg-white text-white flex-shrink-0 fixed h-full">
        <div className="p-6">
          <img className="w-24 h-24 text-white p-2" src={Logo} alt="Logo" />
          <Navigation />
        </div>
      </aside>
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow p-7 flex items-center">
          <h2 className="text-xl font-bold text-[#3d3d3d] flex-1">Pending</h2>
          <div className="flex-1 flex justify-center ml-60"></div>
          <div className="w-8 h-8 cursor-pointer hover:red-300">
            <img src={Notification} alt="icon" />
          </div>
          <button
            className="text-[#FFFF] bg-[#ea8732] ml-9 mr-9 border-0 py-1 px-2 w-28 focus:outline-none hover:bg-gray-200 rounded font-semibold text-sm"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </header>
        <div className="bg-white shadow p-10 flex items-center justify-center">
          <div className="filters">
            <input
              type="date"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={dateFilter.start}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, start: e.target.value })
              }
              placeholder="Start Date"
            />
            <input
              type="date"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={dateFilter.end}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, end: e.target.value })
              }
              placeholder="End Date"
            />
            <input
              type="text"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search Customer"
            />
            <button
              onClick={resetFilters}
              className="bg-[#ea8732] text-white px-6 py-1 rounded-md"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 flex justify-center overflow-y-auto h-screen">
          <div className="overflow-x-auto w-full max-w-4xl h-96">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-left">
                    Name
                  </th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-left">
                    Location
                  </th>
                  <th className="py-3 px-10 bg-gray-200 text-[#3d3d3d] text-center">
                    Date
                  </th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">
                    Advance
                  </th>
                  <th className="py-3 px-4 bg-gray-200 text-[#3d3d3d] text-center">
                    Pending
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Total
                  </th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">
                    Payment Status
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Notification Date
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Receive Date
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {names.map((name, index) => (
                  <tr key={index} className="text-[#3d3d3d] border-t">
                    <td className="py-3 px-4 text-left text-xs">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          const newNames = [...names];
                          newNames[index] = e.target.value;
                          setNames(newNames);
                        }}
                        className="w-full py-1 px-2 border rounded"
                        placeholder="Enter Name"
                      />
                    </td>
                    <td className="py-3 px-4 text-left text-xs">
                      <input
                        type="text"
                        value={locations[index]}
                        onChange={(e) =>
                          handleLocationChange(e.target.value, index)
                        }
                        className="w-full py-1 px-2 border rounded"
                        placeholder="Enter Location"
                      />
                    </td>
                    <td className="py-3 px-10 text-center text-xs">
                      <DatePicker
                        selected={dates[index]}
                        onChange={(date) => handleDateChange(date, index)}
                        className="w-full py-1 px-2 border rounded"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      <input
                        type="number"
                        value={advances[index] || ""}
                        onChange={(e) =>
                          handleAdvanceChange(e.target.value, index)
                        }
                        className="w-full py-1 px-2 border rounded"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      <input
                        type="number"
                        value={pendings[index] || ""}
                        onChange={(e) =>
                          handlePendingChange(e.target.value, index)
                        }
                        className="w-full py-1 px-2 border rounded"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      <input
                        type="number"
                        value={totals[index] || ""}
                        onChange={(e) =>
                          handleTotalChange(e.target.value, index)
                        }
                        className="w-full py-1 px-2 border rounded"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      <div className="relative inline-block">
                        <button
                          className="text-[#ea8732] bg-[#fef4eb] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#ffd7b5] font-medium rounded-full text-xs px-4 py-1.5 inline-flex items-center"
                          type="button"
                          onClick={() => toggleDropdown(index)}
                        >
                          {paymentStatuses[index] || "Choose Status"}
                          <svg
                            className="w-2.5 h-2.5 ml-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="m1 1 4 4 4-4"
                            />
                          </svg>
                        </button>
                        {dropdownOpen === index && (
                          <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-lg">
                            <ul className="list-none m-0 p-0">
                              {["Pending", "Awaiting", "Successful"].map(
                                (status, i) => (
                                  <li
                                    key={i}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                      handleDropdownChange(
                                        status,
                                        index,
                                        "paymentStatus"
                                      )
                                    }
                                  >
                                    {status}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      {paymentStatuses[index] === "Awaiting" && (
                        <DatePicker
                          selected={notificationDates[index]}
                          onChange={(date) =>
                            handleNotificationDateChange(date, index)
                          }
                          className="w-full py-1 px-2 border rounded"
                          placeholderText="Select notification date"
                        />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      {paymentStatuses[index] === "Successful" &&
                        receiveDates[index] &&
                        new Date(receiveDates[index])
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .replace(/\//g, "-")
                          .replace(",", "")}
                    </td>
                  </tr>
                ))}

                {filteredData.map((pending, index) => (
                  <tr key={`data-${index}`} className="border-t">
                    <td className="py-3 px-6 text-left text-xs">
                      {pending.name}
                    </td>
                    <td className="py-3 px-6 text-left text-xs">
                      {pending.location}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {new Date(pending.date)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                        .replace(/\//g, "-")
                        .replace(",", "")}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {pending.advance}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {pending.pending}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {pending.total}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {pending.payment_status}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {pending.notificationDate &&
                        new Date(pending.notificationDate)
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .replace(/\//g, "-")
                          .replace(",", "")}
                    </td>

                    <td className="py-3 px-6 text-center text-xs">
                      {pending.receiveDate &&
                        new Date(pending.receiveDate)
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .replace(/\//g, "-")
                          .replace(",", "")}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      <button
                        onClick={() => handleEdit(pending)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pending)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white shadow flex items-center justify-center">
          <BarChart chartData={chartData} chartLabels={chartLabels} />
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal show={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <div className="h-auto w-auto">
            <h2 className="text-lg font-bold mb-4">Edit Customer</h2>
            <form onSubmit={handleSubmitChange}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="mt-1 block p-2 h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Advance
                  </label>
                  <input
                    type="number"
                    name="advance"
                    required
                    value={formData.advance || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pending
                  </label>
                  <input
                    type="number"
                    required
                    name="pending"
                    value={formData.pending || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total
                  </label>
                  <input
                    type="number"
                    name="total"
                    required
                    value={formData.total || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {formData.payment_status === "Successful" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Receive Date
                    </label>
                    <input
                      type="date"
                      name="receiveDate"
                      value={formData.receiveDate || ""}
                      onChange={handleChange}
                      className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 block h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Payment Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Awaiting">Awaiting</option>
                  <option value="Successful">Successful</option>
                </select>
              </div>
              {formData.payment_status === "Awaiting" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notification Date
                  </label>
                  <input
                    type="date"
                    name="notificationDate"
                    value={formData.notificationDate || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this customer?</p>
        <div className="mt-4">
          <button
            onClick={handleConfirmDelete}
            className="bg-red-500 text-white py-2 px-4 rounded mr-2 hover:bg-red-600"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Employeetask;