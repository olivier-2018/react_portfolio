import React, { useState, useEffect } from "react";
import { getFeedbacks } from "../services/api";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getFeedbacks();
        setFeedbacks(data || []);
        setError(null);
      } catch (err) {
        setError(
          "Failed to fetch feedback. Please check the console for more details."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <div>Loading Feedback...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <section id="feedback">
      <h2>Feedback</h2>
      <div className="feedback-container">
        {feedbacks.map((item) => (
          <div key={item.id} className="feedback-card">
            <p>"{item.quote}"</p>
            <footer>- {item.author}</footer>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feedback;
