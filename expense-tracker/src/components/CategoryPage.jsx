import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { deleteExpense, getCategories, getCategoryById, getExpensesByCategory, updateExpense } from '../utils/api';

const CategoryPage = () => {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [categories, setCategories] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchCategoryAndExpenses = async () => {
            try {
                const categoryResponse = await getCategoryById(id);
                setCategory(categoryResponse.data);

                const expensesResponse = await getExpensesByCategory(id);
                setExpenses(expensesResponse.data);
            } catch (err) {
                setError('Failed to fetch category or expenses');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategoryAndExpenses();
        fetchCategories();
    }, [id]);

    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        setShowEditModal(true);
    };

    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await deleteExpense(expenseId);
                setExpenses(expenses.filter(expense => expense.id !== expenseId));
                setSuccessMessage('Expense deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 5000); // Clear message after 5 seconds
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    const handleUpdateExpense = async (updatedExpenses) => {
        try {
            await updateExpense(updatedExpenses.id, updatedExpenses);
            setExpenses(expenses.map(expense => 
                expense.id === updatedExpenses.id ? updatedExpenses : expense
            ));
            setShowEditModal(false);
            setSuccessMessage('Expense updated successfully!');
            setTimeout(() => setSuccessMessage(''), 5000); // Clear message after 5 seconds
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="container mt-5">
                    <h1>{category?.name} Expenses</h1>
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {expenses.length > 0 ? (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(expense => (
                                    <tr key={expense.id}>
                                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                                        <td>{expense.description}</td>
                                        <td>{expense.amount}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => handleEditExpense(expense)}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDeleteExpense(expense.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No expenses found for this category.</p>
                    )}
                </div>
            )}

            {/* Edit Expense Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedExpense && (
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateExpense(selectedExpense);
                        }}>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedExpense.description}
                                    onChange={(e) => setSelectedExpense({ ...selectedExpense, description: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedExpense.amount}
                                    onChange={(e) => setSelectedExpense({ ...selectedExpense, amount: parseFloat(e.target.value) })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={new Date(selectedExpense.date).toISOString().split('T')[0]}
                                    onChange={(e) => setSelectedExpense({ ...selectedExpense, date: new Date(e.target.value).toISOString() })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedExpense.categoryId}
                                    onChange={(e) => setSelectedExpense({ ...selectedExpense, categoryId: parseInt(e.target.value) })}
                                    required
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Update Expense
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CategoryPage;
