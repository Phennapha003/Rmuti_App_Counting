// delete.js (assuming this is under "@/app/components/CLUD/delete")
export default async function deleteData(idfaculty) {
    try {
        const response = await fetch('/api/faculty', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idfaculty }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete faculty');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}