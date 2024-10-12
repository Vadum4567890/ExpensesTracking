import React from 'react';
import CreateCategory from '../components/CreateCategory';
import CategoryList from '../components/CategoryList';
import ExpenseList from '../components/ExpenseList';

const HomePage = () => {
    return (
        <div className="container mt-5">
            <h1>Expense Tracker</h1>
            <CreateCategory />
            <CategoryList />
            <ExpenseList />
        </div>
    );
};

export default HomePage;
