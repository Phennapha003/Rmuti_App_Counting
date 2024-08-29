"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/count.module.css';
import Navber from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import getData from '@/app/components/CLUD/get';

async function updateCounter(current) {
    const postData = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ current })
    };

    const res = await fetch('http://localhost:3000/api/counter', postData);
    if (!res.ok) {
        throw new Error("Failed to update counter");
    }
    return res.json();
}

export default function Count() {
    const { data: session, status } = useSession();
    const [count, setCount] = useState(0);
    const [name, setName] = useState(0);
    const [morningTotal, setMorningTotal] = useState(0);
    const [afternoonTotal, setAfternoonTotal] = useState(0);
    const [totalGraduates, setTotalGraduates] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
        } else {
            fetchData();
        }
    }, [session, status, router]);

    async function fetchData() {
        try {
            const data = await getData('counter');
            if (data.count && data.count.length > 0) {
                setCount(data.count[0].current);
            }
            if (data.total) {
                setTotalGraduates(data.total[0].totalSum || 0);
                setMorningTotal(data.morning || 0);
                setAfternoonTotal(data.afternoon || 0);
                setName(data.total[0].totalSum - data.count[0].current || 0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function handleCountChange(event) {
        const newValue = parseInt(event.target.value, 10) || 0;
        setCount(newValue);
        try {
            await updateCounter(newValue);
        } catch (error) {
            console.error("Error updating counter:", error);
        }
    }

    async function handleNameChange(event) {
        const newValue = parseInt(event.target.value, 10) || 0;
        setName(newValue);
    }

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return null;
    }

    async function incrementCount() {
        const newCount = count + 1;
        setCount(newCount);
        setName(name - 1);
        try {
            await updateCounter(newCount);
        } catch (error) {
            console.error("Error updating counter:", error);
        }
    }

    async function decrementCount() {
        const newCount = count - 1;
        setCount(newCount);
        setName(name + 1);
        try {
            await updateCounter(newCount);
        } catch (error) {
            console.error("Error updating counter:", error);
        }
    }

    return (
        <>
            <Navber />
            <div className={styles.Container}>
                <div className={styles.BodyContainer}>
                    <label>นับบัณฑิตเข้ารับพระราชทานปริญญาบัตร</label>
                    <div className={styles.containerSum}>
                        <div className={styles.flex27}>
                            <div className={styles.flexBoxs}>
                                <div className={styles.innerBox}>
                                    <h3>จำนวนบัณฑิตทั้งหมด</h3>
                                    <div className={styles.numInnerBox}>
                                        <label>{totalGraduates}</label>
                                    </div>
                                </div>
                                <div className={styles.innerBox}>
                                    <h3>จำนวนบัณฑิตรอบเช้า</h3>
                                    <div className={styles.numInnerBox}>
                                        <label>{morningTotal}</label>
                                    </div>
                                </div>
                                <div className={styles.innerBox}>
                                    <h3>จำนวนบัณฑิตรอบบ่าย</h3>
                                    <div className={styles.numInnerBox}>
                                        <label>{afternoonTotal}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.flex73}>
                            <div className={styles.innerBoxFlex73}>
                                <h2>บัณฑิตที่รับแล้ว</h2>
                                <input type="number" value={count} onChange={handleCountChange} />
                            </div>
                            <div className={styles.innerBoxFlex73}>
                                <h2>บัณฑิตที่ยังไม่ได้รับ</h2>
                                <input type="number" value={name} onChange={handleNameChange} />
                            </div>

                            <div className={styles.innerBoxFlex73}>
                                <div className={styles.btnClick}>
                                    <button className={`${styles.btnPlus} ${styles.btnClick}`} onClick={incrementCount}>เพิ่มจำนวน</button>
                                    <button className={`${styles.btnDelete} ${styles.btnClick}`} onClick={decrementCount}>ลดจำนวน</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}