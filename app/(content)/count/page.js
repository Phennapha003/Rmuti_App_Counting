"use client"
import { useState, useEffect } from 'react';
import styles from '@/app/styles/count.module.css'
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import getData from '@/app/components/CLUD/get';

export default function Count() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData(type = '') {
        try {
            const data = await getData('counter', type);
            if (data.count && data.count.length > 0) {
                setCount(data.count[0].current);
            }
            if (data.total && data.total.length > 0) {
                setName(data.total[0].totalSum || 0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function handleCountChange(event) {
        const newValue = parseInt(event.target.value, 10) || 0;
        setCount(newValue);
    }

    function handleNameChange(event) {
        const newValue = parseInt(event.target.value, 10) || 0;
        setName(newValue);
    }

    return (
        <>
            <Navbar />
            <div className={styles.Container}>
                <div className={styles.BodyContainer}>
                    <label>นับบัณฑิตเข้ารับพระราชทานปริญญาบัตร</label>
                    <div className={styles.ContainerContent}>
                        <h2>บัณฑิตที่รับแล้ว</h2>
                        <input type="number" value={count} onChange={handleCountChange} />
                        <h2>บัณฑิตที่ยังไม่ได้รับ</h2>
                        <input type="number" value={name} onChange={handleNameChange} />

                        <div className={styles.btnClick}>
                            <button className={`${styles.btnPlus} ${styles.btnClick}`} onClick={() => { setCount(count + 1); setName(name - 1); }}>เพิ่มจำนวน</button>
                            <button className={`${styles.btnDelete} ${styles.btnClick}`} onClick={() => { setCount(count - 1); setName(name + 1); }}>ลดจำนวน</button>
                        </div>
                        <div className={styles.btnClick}>
                            <button className={`${styles.btnMorning} ${styles.btnClick}`} onClick={() => fetchData('morning')}>เช้า</button>
                            <button className={`${styles.btnAfternoon} ${styles.btnClick}`} onClick={() => fetchData('afternoon')}>บ่าย</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}