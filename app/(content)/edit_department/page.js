'use client';

import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Handle_Click from "@/app/components/handle/handleclick";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getData from "@/app/components/CLUD/get";
import styles from "@/app/styles/edit_department.module.css"

export default function EditAddDepartment() {
    const [facultys, setFacultys] = useState([]);
    const roundOptions = ["รอบเช้าช่วง 1", "รอบเช้าช่วง 2", "รอบบ่ายช่วง 1", "รอบบ่ายช่วง 2"];  // Define your dropdown options here
    const router = useRouter();

    useEffect(() => {
        async function fetchFaculty() {
            try {
                const data = await getData('faculty');
                setFacultys(data.faculty || []);
            } catch (error) {
                console.error("Error fetching faculty:", error);
            }
        }

        fetchFaculty();
    }, []);

    const handleNameChange = (index, value) => {
        const updatedFacultys = [...facultys];
        updatedFacultys[index].name = value;
        setFacultys(updatedFacultys);
    };

    const handleTotalChange = (index, value) => {
        const updatedFacultys = [...facultys];
        updatedFacultys[index].total = value;
        setFacultys(updatedFacultys);
    };

    const handleRoundChange = (index, value) => {
        const updatedFacultys = [...facultys];
        updatedFacultys[index].rname = value;  // Update rname based on dropdown selection
        setFacultys(updatedFacultys);  // Update state
    };

    const handleSave = async () => {
        try {
            for (let index = 0; index < facultys.length; index++) {
                const updatedFaculty = facultys[index];

                if (!updatedFaculty) {
                    console.error(`No updated data found for index ${index}`);
                    continue;
                }

                const facultyId = updatedFaculty.idfaculty;

                if (!facultyId) {
                    console.error(`Faculty ID is undefined for index ${index}`);
                    continue;
                }

                // Ensure name and total are not empty or undefined
                if (!updatedFaculty.name || !updatedFaculty.total) {
                    console.error(`Name and total are required for index ${index}`);
                    continue;
                }

                const body = JSON.stringify({ id: facultyId, name: updatedFaculty.name, total: updatedFaculty.total, rname: updatedFaculty.rname });

                const response = await fetch('http://localhost:3000/api/faculty', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body,
                });

                if (!response.ok) {
                    const errorDetails = await response.json();
                    throw new Error(`Failed to update faculty: ${errorDetails.error}`);
                }

                console.log(`Faculty with ID ${facultyId} updated successfully`);
            }
            // Fetch the updated facultys after saving
            const updatedData = getData('faculty');
            setFacultys(updatedData.faculty || []);
        } catch (error) {
            console.error('Error updating faculty:', error.message);
        }
        router.push("/faculty")
    };

    return (
        <div >
            <Navbar />
            <div className={styles.container}>
                <p className={styles.BodyContainer}>แก้ไขหน่วยงาน</p>
                <div className={styles.Containers}>
                    {facultys.map((faculty, index) => (
                        <div key={faculty.idfaculty} className={styles.Table1}>

                            หน่วยงาน: <input className={styles.inputField} type="text" value={faculty.name} onChange={(e) => handleNameChange(index, e.target.value)} />&nbsp;
                            จำนวนเข้ารับ: <input className={styles.inputField} type="text" value={faculty.total} onChange={(e) => handleTotalChange(index, e.target.value)} />&nbsp;
                            รอบ:
                            <select className={styles.formselect} value={faculty.rname} onChange={(e) => handleRoundChange(index, e.target.value)}>
                                {roundOptions.map((option, i) => (
                                    <option key={i} value={option}>{option}</option>
                                ))}
                            </select>&nbsp;
                        </div>
                    ))}
                </div>

                <div className={styles.ContainerDown}>
                    <Handle_Click className={styles.buttonBack} path="/faculty" buttonText="ย้อนกลับ" />
                    <button className={styles.buttonSave} onClick={handleSave}>บันทึก</button>
                </div>
            </div>
            <Footer />
        </div>)
}