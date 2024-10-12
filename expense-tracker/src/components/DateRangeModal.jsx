import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const DateRangeModal = ({ show, onHide, onDownload }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = () => {
        onDownload(startDate, endDate);
        onHide(); 
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Select Date Range</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit} 
                    disabled={!startDate || !endDate}
                >
                    Download Report
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DateRangeModal;
