import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Fo2 = () => {
  const [formData, setFormData] = useState({
    cdlNumber: "",
    mcNumber: "",
    gstNumber: "",
    panNumber: "",
    vehicleCert: null,
    insuranceCert: null,
    panCard: null,
    transportLicense: null,
    cdlDocument: null,
    mcDocument: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormData({ ...formData, [id]: files[0] });
  };

  const validateForm = () => {
    const requiredFields = [
      "cdlNumber",
      "mcNumber",
      "gstNumber",
      "panNumber",
      "vehicleCert",
      "insuranceCert",
      "panCard",
      "transportLicense",
      "cdlDocument",
      "mcDocument",
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^\w/, (c) => c.toUpperCase())} is required.`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch("http://localhost:5000/api/documents", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        setTimeout(() => {
          navigate("/login"); // Redirect to the next page
        }, 1500);
        setFormData({
          cdlNumber: "",
          mcNumber: "",
          gstNumber: "",
          panNumber: "",
          vehicleCert: null,
          insuranceCert: null,
          panCard: null,
          transportLicense: null,
          cdlDocument: null,
          mcDocument: null,
        });
      } else {
        alert(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="mt-16 h-[130vh] w-[80vw] bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Truck_map_concept.png/800px-Truck_map_concept.png")',
        backgroundBlendMode: "darken",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full h-full max-w-4xl bg-opacity-50 p-5 rounded-md space-y-6 flex flex-col justify-between"
      >
        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {["cdlNumber", "mcNumber", "gstNumber", "panNumber"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-white text-lg font-semibold mb-2"
              >
                {field.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) =>
                  c.toUpperCase()
                )}{" "}
                *
              </label>
              <input
                type="text"
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="w-full p-3 text-black rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          {[
            { id: "vehicleCert", label: "Vehicle Registration Certificate" },
            { id: "insuranceCert", label: "Insurance Certificate" },
            { id: "panCard", label: "PAN Card" },
            { id: "transportLicense", label: "Transport Business License" },
            { id: "cdlDocument", label: "CDL Document" },
            { id: "mcDocument", label: "MC Document" },
          ].map(({ id, label }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block text-white text-lg font-semibold mb-2"
              >
                {label} *
              </label>
              <input
                type="file"
                id={id}
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor={id}
                className="border-2 border-dashed border-gray-300 p-14 rounded-lg text-center text-white cursor-pointer"
              >
                {formData[id] ? formData[id].name : "Drop or click to upload"}
                <p className="text-sm">Max size: 5GB</p>
              </label>
              {errors[id] && (
                <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
            } text-white font-bold text-lg py-3 rounded-md`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Fo2;