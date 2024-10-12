// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../utils/api';
import CreateExpenseModal from './CreateExpenseModal';
import ReportButton from './ReportButton';

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [, setExpenses] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleClose = () => {
        setShowModal(false);
    };
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getCategories();
            setCategories(response.data);
        };
        fetchCategories();
    }, []);

    

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleExpenseCreated = (newExpense) => {
        setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
        setSuccessMessage('Expense created successfully!'); // Set success message
        setTimeout(() => {
            setSuccessMessage(''); // Clear success message after 5 seconds
        }, 5000);
    };
    return (
       
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Expense Tracker</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>

                    <li>
                        <button variant="primary" onClick={handleShowModal}>
                            Create Expense
                        </button>
                        <CreateExpenseModal 
                            show={showModal} 
                            handleClose={handleCloseModal} 
                            categories={categories} 
                            onExpenseCreated={handleExpenseCreated}
                            onHide={handleClose}
                        />
                    </li>
                </ul>
            </div>
            {successMessage && (
                <div className="alert alert-success position-absolute" style={{ 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    top: '10%', 
                    zIndex: 1000, 
                    width: 'auto', 
                    textAlign: 'center' 
                }}>
                    {successMessage}
                </div>
            )}
             <ReportButton />
                    
        </nav>
    );
};

export default Navbar;