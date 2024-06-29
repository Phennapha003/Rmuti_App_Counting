"use client";

async function postData(endpoint, data) {
    try {
        const response = await fetch(`http://localhost:3000/API/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

export default postData;
