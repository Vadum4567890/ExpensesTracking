import React, { useEffect, useState } from 'react';
import { getCategories, deleteCategory, updateCategory } from '../utils/api'; // Import API functions
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setNewCategoryName(category.name); // Set the current name for editing
        setShowEditModal(true); // Show the edit modal
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(categoryId); // Delete category via API
                setCategories(categories.filter(category => category.id !== categoryId)); // Remove from state
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleUpdateCategory = async () => {
        if (selectedCategory) {
            try {
                await updateCategory(selectedCategory.id, { id: selectedCategory.id,name: newCategoryName }); // Update category name via API
                setCategories(categories.map(category => 
                    category.id === selectedCategory.id ? { ...category, name: newCategoryName } : category
                ));
                setShowEditModal(false); // Close modal
            } catch (error) {
                console.error('Error updating category:', error);
            }
        }
    };

    return (
        <div>
            <h3>Categories</h3>
            <ul className="list-group">
                {categories.map(category => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <Link to={`/category/${category.id}`}>{category.name}</Link>
                        <div>
                            <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(category)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                            <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(category.id)} style={{ cursor: 'pointer', color: 'red' }} />
                        </div>
                    </li>
                ))}
            </ul>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formCategoryName">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateCategory}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoryList;
