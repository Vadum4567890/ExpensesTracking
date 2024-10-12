// src/components/ReportButton.jsx
import React, { useState } from 'react';
import { downloadReport } from '../utils/api';
import DateRangeModal from './DateRangeModal';

const ReportButton = () => {
    const [showModal, setShowModal] = useState(false);

    const handleDownload = async (startDate, endDate) => {
        try {
            const response = await downloadReport(startDate, endDate);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ExpenseReport.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    return (
        <div>
            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
                Download Report
            </button>
            <DateRangeModal 
                show={showModal} 
                onHide={() => setShowModal(false)} 
                onDownload={handleDownload} 
            />
        </div>
    );
};

export default ReportButton;
