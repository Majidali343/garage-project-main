import React, { useState, useEffect } from "react";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "./images/Notification.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navigation from "./Navigation";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Modal from "../Modal";
import BarChart from "../BarChart";
import TaskMetricsChart from "./TaskMetricChart";

function Employeetask() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [taskdata, setTaskdata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [searchName, setSearchName] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [incomeDropdownOpen, setIncomeDropdownOpen] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Choose Status");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    company: "",
    task: "",
    work_hours: "",
    bill_number: "",
    date: new Date(),
    charges: "",
    task_status: "",
    income_status: "",
  });

  const [form, setForm] = useState({});

  const toggleIncomeDropdown = () => {
    setIncomeDropdownOpen(!incomeDropdownOpen);
  };

  useEffect(() => {
    const pending = filteredData.filter(
      (task) => task.income_status === "Pending" && task.charges
    );
    setPendingPayments(pending);
  }, [filteredData]);

  const handleWorkHoursChange = (hours) => {
    setFormData((prev) => ({
      ...prev,
      work_hours: hours,
    }));
    setDropdownOpen(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For work_hours, ensure only numbers and decimal points are entered
    if (name === "work_hours") {
      const regex = /^\d*\.?\d*$/;
      if (regex.test(value) || value === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDropdownChange = (value) => {
    setPaymentStatus(value);
    setFormData((prev) => ({
      ...prev,
      income_status: value,
    }));
    setIncomeDropdownOpen(false);
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        date: formData.date.toISOString().split("T")[0],
        work_hours: parseFloat(formData.work_hours) || 0, // Convert to number and handle empty input
      };

      const response = await fetch(
        "http://77.37.49.209:5000/employeetask/post/Etask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await fetchData();

      // Clear form after successful submission
      setFormData({
        name: "",
        location: "",
        company: "",
        task: "",
        work_hours: "",
        bill_number: "",
        date: new Date(),
        charges: "",
        task_status: "",
        income_status: "",
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://77.37.49.209:5000/employeetask/get/Etask"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Only show received payments
      const receivedPayments = data.rows.filter(
        (task) => task.income_status === "Received"
      );
      setTaskdata(receivedPayments);
      setFilteredData(receivedPayments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [dateFilter, searchName, searchCompany, taskdata, statusFilter]);

  const resetFilters = () => {
    setDateFilter({ start: "", end: "" });
    setSearchName("");
    setSearchCompany("");
    setStatusFilter("all");
    setFilteredData(taskdata);
  };

  const filterData = () => {
    let data = taskdata;

    // Apply date filter
    if (dateFilter.start && dateFilter.end) {
      data = data.filter(
        (task) => task.date >= dateFilter.start && task.date <= dateFilter.end
      );
    }

    // Apply name filter
    if (searchName) {
      data = data.filter((task) =>
        task.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Apply company filter
    if (searchCompany) {
      data = data.filter((task) =>
        task.company.toLowerCase().includes(searchCompany.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      data = data.filter((task) => task.income_status === statusFilter);
    }

    setFilteredData(data);
  };

  const chartLabels = filteredData.map((item) => item.name);
  const chartData = filteredData.map((item) => item.task);

  const handleEdit = (task) => {
    const editableTask = {
      ...task,
      date: task.date || "", // Ensure date is not null
      income_status: task.income_status || "", // Ensure income_status is not null
    };
    setCurrentTask(editableTask);
    setForm(editableTask);
    setEditModalOpen(true);
  };

  const handleDelete = (task) => {
    setCurrentTask(task);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://77.37.49.209:5000/employeetask/delete/${currentTask.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setDeleteModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "work_hours") {
      const regex = /^\d*\.?\d*$/;
      if (regex.test(value) || value === "") {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitChange = async (e) => {
    e.preventDefault();

    try {
      // Create a copy of the form data to clean up before sending
      const updatedData = {
        ...form,
        // Ensure all required fields are included and properly formatted
        income_status: form.income_status || currentTask.income_status, // Use existing status if not changed
        work_hours: parseFloat(form.work_hours) || form.work_hours, // Convert to number if possible
        date: form.date || currentTask.date, // Use existing date if not changed
      };

      const response = await fetch(
        `http://77.37.49.209:5000/employeetask/update/${currentTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setEditModalOpen(false);
      await fetchData(); // Refresh the data after successful update
    } catch (error) {
      console.error("Error updating task data:", error);
    }
  };

  const renderNotifications = () => {
    if (!showNotifications || pendingPayments.length === 0) return null;

    return (
      <div className="absolute right-0 mt-2 w-96 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {pendingPayments.map((payment, index) => (
            <div
              key={index}
              className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <img src={Notification} alt="" className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-3 w-full">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900">
                      Pending Payment
                    </p>
                    <p className="text-sm text-gray-500">{payment.date}</p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">
                      {payment.company} has a pending payment
                    </p>
                    <div className="mt-1 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Task: {payment.task}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        ${payment.charges}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 h-screen flex">
      <aside className="w-64 bg-white text-white flex-shrink-0 fixed h-full">
        <div className="p-6">
          <img className="w-24 h-24 text-white p-2" src={Logo} alt="Logo" />
          <Navigation />
        </div>
      </aside>

      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow p-7">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#3d3d3d]">Income</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div
                  className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full flex items-center justify-center"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <img
                    src={Notification}
                    alt="Notification Icon"
                    className="w-6 h-6"
                  />
                  {pendingPayments.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {pendingPayments.length}
                    </span>
                  )}
                </div>
                {renderNotifications()}
              </div>
            </div>
          </div>
        </header>
        <div className="bg-white shadow p-10 flex flex-col items-center justify-center space-y-4">
          <div className="filters flex items-center justify-center w-full">
            <input
              type="date"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs space-x-4 ms-3"
              value={dateFilter.start}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, start: e.target.value })
              }
              placeholder="Start Date"
            />
            <input
              type="date"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs space-x-4 ms-3"
              value={dateFilter.end}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, end: e.target.value })
              }
              placeholder="End Date"
            />
            <input
              type="text"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs space-x-4 ms-3"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search Employee"
            />
            <input
              type="text"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs space-x-4 ms-3"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              placeholder="Search company"
            />
            <button
              onClick={resetFilters}
              className="bg-[#ea8732] text-white px-6 py-1 rounded-md space-x-4 ms-3"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Table Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-left">
                    Employee
                  </th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-left">
                    Company
                  </th>
                  <th className="py-3 px-10 bg-gray-200 text-[#3d3d3d] text-center">
                    Location
                  </th>
                  <th className="py-3 px-12 bg-gray-200 text-[#3d3d3d] text-center">
                    Task
                  </th>
                  <th className="py-3 px-8 bg-gray-200 text-[#3d3d3d] text-center">
                    Work Hours
                  </th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">
                    Bill Number
                  </th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">
                    Date
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-[#3d3d3d] text-center">
                    Charges
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-[#3d3d3d] text-center">
                    Payment Status
                  </th>
                  {/* <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {/* Existing task data rows */}
                {filteredData.map((task, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-center text-xs">
                      {task.name}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.company}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.location}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.task}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.work_hours}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.bill_number}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.date}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.charges}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.income_status}
                    </td>
                    {/* <td className=" text-center text-xs">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-500  hover:text-blue-700"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        className="text-black-500 hover:text-red-700 ml-2"
                      >
                        <MdDelete className="h-5 w-6" />
                      </button>
                    </td> */}
                  </tr>
                ))}

                {/* Adding 10 empty rows */}
                {Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index + taskdata.length} className="border-t">
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredData.length > 0 && (
            <div className=" shadow rounded-lg p-4">
              <div className="h-96">
                <TaskMetricsChart data={filteredData} />
              </div>
            </div>
          )}
        </div>
      </div>
      {editModalOpen && (
        <Modal show={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <div className="h-auto w-auto">
            <h2 className="text-lg font-bold">Edit Task</h2>
            <form onSubmit={handleSubmitChange}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block p-2 h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task
                  </label>
                  <input
                    type="text"
                    name="task"
                    value={form.task || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Working Hour
                  </label>
                  <input
                    type="text"
                    name="work_hours"
                    value={form.work_hours || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter Hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bill Number
                  </label>
                  <input
                    type="text"
                    name="bill_number"
                    value={form.bill_number || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter Bill Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Charges
                  </label>

                  <input
                    type="text"
                    name="charges"
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={form.charges || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Income Status
                  </label>
                  <select
                    name="income_status"
                    value={form.income_status || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Income Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Received">Received</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        </Modal>
      )}

      <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2 className="text-lg font-bold">Confirm Delete</h2>
        <p>Are you sure you want to delete this customer?</p>
        <button
          onClick={handleConfirmDelete}
          className="bg-red-500 text-white py-2  px-4 rounded mt-4"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setDeleteModalOpen(false)}
          className="bg-gray-500 text-white py-2 px-4 rounded mt-4 ml-2"
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
}

export default Employeetask;
