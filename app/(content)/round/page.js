"use client";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import styles from "@/app/styles/round.module.css"
import React, { useState, useEffect } from 'react';

export default function Round() {
    const [rounds, setRounds] = useState({ round: [] });

    useEffect(() => {
        fetchRounds();
    }, []);

    const fetchRounds = async () => {
        try {
            const response = await fetch('/API/round');
            if (!response.ok) {
                throw new Error('Failed to fetch rounds');
            }
            const data = await response.json();
            setRounds(data);
        } catch (error) {
            console.error("Error fetching rounds:", error);
        }
    };

    const handleNameChange = (index, value) => {
        setRounds(prevState => {
            const updatedRounds = [...prevState.round];
            updatedRounds[index].name = value;
            return { round: updatedRounds };
        });
    };

    const handleTotalChange = (index, value) => {
        setRounds(prevState => {
            const updatedRounds = [...prevState.round];
            updatedRounds[index].total = value;
            return { round: updatedRounds };
        });
    };

    const saveRound = async (roundToUpdate) => {
        console.log('Saving round:', roundToUpdate);

        try {
            const response = await fetch('/API/round', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: roundToUpdate.idround,  // Ensure the field name matches the backend
                    name: roundToUpdate.name,
                    total: roundToUpdate.total
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update round');
            }

            console.log('Round updated successfully');
            // Update local state after successful update
            setRounds(prevState => {
                const updatedRounds = prevState.round.map(r => {
                    if (r.idround === roundToUpdate.idround) {
                        return { ...r, name: roundToUpdate.name, total: roundToUpdate.total };
                    }
                    return r;
                });
                return { round: updatedRounds };
            });

        } catch (error) {
            console.error('Error updating round:', error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.ContainerAll}>
                <div className={styles.ContainerHeadRound}>Round</div>
                {rounds.round.map((round, index) => (
                    <div key={index} className={styles.Content1}>
                        รอบ : <input type="text" value={round.name} onChange={(e) => handleNameChange(index, e.target.value)} /> &nbsp;
                        จำนวนเข้ารับ : <input type="text" value={round.total} onChange={(e) => handleTotalChange(index, e.target.value)} /> &nbsp;
                        
                    </div>
                ))}
                <button onClick={() => saveRound(round)}>บันทึก</button>
            </div>
            
            <Footer />
        </div>
    );
}