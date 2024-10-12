import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createExpense } from '../utils/api';

const CreateExpenseModal = ({ show, onHide, categories, onExpenseCreated }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(''); 
    const [error, setError] = useState('');

    const validateForm = () => {
        if (!amount || parseFloat(amount) <= 0) {
            return 'Amount must be a positive number.';
        }
        if (!description) {
            return 'Description is required.';
        }
        if (!categoryId) {
            return 'Please select a category.';
        }
        if (!date) {
            return 'Date is required.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const expenseData = {
            amount: parseFloat(amount),
            description,
            categoryId: parseInt(categoryId),
            date: new Date(date).toISOString().split('T')[0],
        };

        try {
            const response = await createExpense(expenseData); 
            onExpenseCreated(response.data);
            onHide();
        } catch (err) {
            console.error("Error creating expense:", err);
            setError('Failed to create expense: ' + (err.response?.data || 'Unknown error'));
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Create Expense
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateExpenseModal;
