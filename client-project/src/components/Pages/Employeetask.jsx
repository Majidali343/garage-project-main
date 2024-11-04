import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "./images/Notification.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { saveAs } from "file-saver";
import Navigation from "./Navigation";
import moment from "moment";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Modal from "../Modal";

function Employeetask() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskdata, setTaskdata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [searchName, setSearchName] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    company: "",
    task: "",
    work_hours: "",
    date: new Date(),
    charges: "",
    task_status: "",
  });

  const [form, setForm] = useState({});

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleWorkHoursChange = (hours) => {
    setFormData(prev => ({
      ...prev,
      work_hours: hours
    }));
    setDropdownOpen(null);
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        date: formData.date.toISOString().split('T')[0]
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
        throw new Error('Network response was not ok');
      }

      await fetchData();

      // Clear form after successful submission
      setFormData({
        name: "",
        location: "",
        company: "",
        task: "",
        work_hours: "",
        date: new Date(),
        charges: "",
        task_status: "",
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
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTaskdata(data.rows);
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
  }, [dateFilter, searchName, searchCompany, taskdata]);

  const resetFilters = () => {
    setDateFilter({ start: "", end: "" });
    setSearchName("");
    setSearchCompany("");
    setFilteredData(taskdata);
  };

  const filterData = () => {
    let data = taskdata;

    if (dateFilter.start && dateFilter.end) {
      data = data.filter(
        (task) =>
          task.date >= dateFilter.start && task.date <= dateFilter.end
      );
    }

    if (searchName) {
      data = data.filter((task) =>
        task.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchCompany) {
      data = data.filter((task) =>
        task.company.toLowerCase().includes(searchCompany.toLowerCase())
      );
    }

    setFilteredData(data);
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setForm(task);
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
        throw new Error('Network response was not ok');
      }

      setDeleteModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitChange = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://77.37.49.209:5000/employeetask/update/${currentTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setEditModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error updating task data:", error);
    }
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
            <h2 className="text-xl font-bold text-[#3d3d3d]">Employee Task</h2>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 cursor-pointer hover:bg-gray-200 rounded-full">
                <img src={Notification} alt="Notification Icon" />
              </div>
              <button
                className="text-[#FFFF] bg-[#ea8732] border-0 py-1 px-2 w-28 focus:outline-none hover:bg-gray-200 rounded font-semibold text-sm"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
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
              placeholder="Search Employee"
            />
            <input
              type="text"
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs mx-4"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              placeholder="Search company"
            />
            <button
              onClick={resetFilters}
              className="bg-[#ea8732] text-white px-6 py-1 rounded-md"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 flex justify-center overflow-y-auto">
          <div className="overflow-x-auto w-full max-w-4xl">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
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
                    Date
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-[#3d3d3d] text-center">
                    Charges
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-[#3d3d3d] border-t">
                  <td className="py-3 px-6 text-left text-xs">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Employee"
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="text"
                      name="company"
                      placeholder="Enter Company"
                      className="w-full py-1 px-2 border rounded"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Location"
                    />
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <input
                      type="text"
                      name="task"
                      value={formData.task}
                      onChange={handleInputChange}
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Task"
                    />
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <div className="relative inline-block">
                      <button
                        className="text-[#ea8732] bg-[#fef4eb] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#ffd7b5] font-medium rounded-full text-xs px-4 py-1.5 inline-flex items-center"
                        type="button"
                        onClick={() => toggleDropdown(0)}
                      >
                        {formData.work_hours || "Choose"}
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
                      {dropdownOpen === 0 && (
                        <div className="absolute mt-2 w-24 py-1 bg-white border border-gray-300 rounded shadow-lg">
                          {[
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                          ].map((hours) => (
                            <button
                              key={hours}
                              onClick={() => handleWorkHoursChange(hours)}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                            >
                              {hours} Hour{hours > 1 ? "s" : ""}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <DatePicker
                      selected={formData.date}
                      onChange={handleDateChange}
                      className="text-center bg-white border rounded w-full py-1 px-3"
                      dateFormat="dd/MM/yyyy"
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="text"
                      name="charges"
                      placeholder="Enter Charges"
                      className="w-full py-1 px-2 border rounded"
                      value={formData.charges}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>

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
                      {task.date}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {task.charges}
                    </td>
                    <td className=" text-center text-xs">
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
                    </td>
                  </tr>
                ))}

                {/* Adding 10 empty rows */}
                {Array.from({ length: 20 }).map((_, index) => (
                  <tr key={index + taskdata.length} className="border-t">
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                    <td className="py-3 px-6 text-center text-xs">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                  <select
                    name="work_hours"
                    value={form.work_hours || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8  w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Work Hours</option>
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="5">5 Hours</option>
                    <option value="6">6 Hours</option>
                    <option value="7">7 Hours</option>
                    <option value="8">8 Hours</option>
                    <option value="9">9 Hours</option>
                    <option value="10">10 Hours</option>
                    <option value="11">11 Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="13">13 Hours</option>
                    <option value="14">14 Hours</option>
                    <option value="15">15 Hours</option>
                  </select>
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
