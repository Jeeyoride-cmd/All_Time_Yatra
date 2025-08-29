import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { BASE_URL } from './config';

function Add_City() {
    const [city, setCity] = useState('');
    const [message, setMessage] = useState('');
    const [isActive, setIsActive] = useState(true);

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/add_city`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: city }),
            });

            const result = await response.json();
            setMessage(result.message);

            if (result.status === 'success') {
                setCity('');
            }
            setTimeout(() => {
            setMessage('');
        }, 3000);
        } catch (error) {
            console.error('Error submitting city:', error);
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <>
            <Sidebar isActive={isActive} handleToggle={handleToggle} />
            <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
                <div className="driver-card-body cardcitymain">
                    <div className="chckout-card cardcity">
                        <div className="citycard-wrapper">
                            <div className="citycard">
                                <h4 className="text-xl font-bold mb-4 text-white">Add City</h4>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input type="text"  placeholder="City Name" required/>
                                    <button type="submit" className="addcitybtn">Add City</button>
                                </form>
                                {message && <p className="mt-2 text-sm text-white">{message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Add_City;
