// src/components/Dashboard/DashboardItem.jsx
import React from 'react';
import './DashboardItem.css'; // Crie este arquivo CSS depois

function DashboardItem({ title, description, icon, onClick }) {
  return (
    <div className="dashboard-item" onClick={onClick}>
      <i className={`${icon} dashboard-item-icon`}></i>
      <h3 className="dashboard-item-title">{title}</h3>
      <p className="dashboard-item-description">{description}</p>
    </div>
  );
}

export default DashboardItem;