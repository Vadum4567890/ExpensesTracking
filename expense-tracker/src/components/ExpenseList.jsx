import React, { useEffect, useState } from 'react';
import { getExpenses } from '../utils/api';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await getExpenses();
                setExpenses(response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };
        fetchExpenses();
    }, []);

    // Sort expenses by date and take the last 5
    const recentExpenses = expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); 

    return (
        <div>
            <h3>Recent Expenses</h3>
            <ul className="list-group">
                {recentExpenses.map(expense => (
                   <li key={expense.id} className="list-group-item">
                   {expense.description} - {expense.amount} - {new Date(expense.date).toLocaleDateString()}
               </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;
