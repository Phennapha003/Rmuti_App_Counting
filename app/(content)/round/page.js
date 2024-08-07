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
            const response = await fetch('/api/round');
            if (!response.ok) {
                throw new Error('Failed to fetch rounds');
            }
            const data = await response.json();
            const updatedRounds = data.round.map(round => ({
                ...round,
                total: round.total !== null ? round.total : 0,
            }));
            setRounds({ round: updatedRounds });
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
            updatedRounds[index].total = parseInt(value, 10) || 0;
            return { round: updatedRounds };
        });
    };

    const saveRounds = async () => {
        try {
            for (let roundToUpdate of rounds.round) {
                const response = await fetch('/api/round', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: roundToUpdate.idround,
                        name: roundToUpdate.name,
                        total: roundToUpdate.total,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update round with ID ${roundToUpdate.idround}`);
                }
            }

            console.log('Rounds updated successfully');
            fetchRounds();
            alert("บันทึกข้อมูลเสร็จสิ้นเรียบร้อย");
        } catch (error) {
            console.error('Error updating rounds:', error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.ContainerAll}>
                <div className={styles.ContainerHeadRound}>รอบเข้ารับ</div>
                <div className={styles.container}>
                    {rounds.round.map((round, index) => (
                        <div key={index} className={styles.Content1}>
                            รอบ : <input type="text" value={round.name} onChange={(e) => handleNameChange(index, e.target.value)} /> &nbsp;
                            จำนวนเข้ารับ : <input type="number" value={round.total} onChange={(e) => handleTotalChange(index, e.target.value)} /> &nbsp;
                        </div>
                    ))}
                </div>
                <button onClick={saveRounds}>บันทึก</button>
            </div>
            <Footer />
        </div>
    );
}