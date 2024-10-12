// src/components/CreateCategory.js
import React, { useState } from 'react';
import { createCategory } from '../utils/api';

const CreateCategory = () => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory({ name });
            setName('');
            alert('Category created successfully!');
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create Category</h3>
            <div className="form-group">
                <label htmlFor="categoryName">Category Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    );
};

export default CreateCategory;
