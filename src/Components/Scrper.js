import React, { useState } from "react";

export default function Scrper() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch courses");
    }
  };
  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter course name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search Courses</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {courses.map((course, index) => (
            <li key={index}>{course}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
