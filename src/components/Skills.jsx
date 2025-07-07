import React, { useState, useEffect } from "react";
import { getSkills } from "../services/api";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const data = await getSkills();
        setSkills(data || []);
        setError(null);
      } catch (err) {
        setError(
          "Failed to fetch skills. Please check the console for more details."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) return <div>Loading Skills...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <section id="skills">
      <h2>My Skills</h2>
      <div className="skills-container">
        {skills && skills.length > 0 ? (
          skills.map((skill) => (
            <div key={skill.id} className="skill-item">
              {/* This assumes your skill object has 'id' and 'name' properties. */}
              {skill.name}
            </div>
          ))
        ) : (
          <p>No skills to display at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default Skills;
