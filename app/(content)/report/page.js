"use client";
import styles from "@/app/styles/report.module.css";
import Navber from "@/app/components/navbar_report";
import Footer from "@/app/components/footer_report";
import getData from '@/app/components/CLUD/get';
import { useState, useEffect } from 'react';

export default function GuestUser() {
    const [R_current, setCurrent] = useState(0);
    const [R_totalSum, setTotal] = useState(0);
    const [R_morning, setMorning] = useState(0);
    const [R_afternoon, setAfternoon] = useState(0);
    const [isMorningComplete, setIsMorningComplete] = useState(false);
    const [initialMorning, setInitialMorning] = useState(0);
    const [initialAfternoon, setInitialAfternoon] = useState(0);
    const [facultyData, setFacultyData] = useState([]);

    useEffect(() => {
        fetchData();  // Fetch data initially
        const interval = setInterval(fetchData, 100);  // Fetch data every 5 seconds

        return () => clearInterval(interval);  // Clean up the interval on component unmount
    }, []);

    async function fetchData() {
        try {
            const counterData = await getData('counter');
            const faculty = await getData('faculty'); // Fetch faculty data

            if (counterData.count && counterData.count.length > 0) {
                const current = counterData.count[0].current;
                const morning = counterData.morning || 0;
                const afternoon = counterData.afternoon || 0;
                const totalSum = counterData.total[0].totalSum || 0;

                setInitialMorning(morning);  // Set initial morning value
                setInitialAfternoon(afternoon);  // Set initial afternoon value
                setCurrent(current);
                setTotal(totalSum - current);

                if (current >= morning) {
                    setMorning(0);
                    setIsMorningComplete(true);
                } else {
                    setMorning(morning - current);
                    setIsMorningComplete(false);
                }

                setAfternoon(afternoon);
            }

            if (faculty && faculty.faculty) {
                setFacultyData(faculty.faculty);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // ค่าเปอร์เซ็นต์ของรอบเช้า
    const morningTotal = initialMorning === 0 ? R_current : initialMorning;
    const morningPercentage = isMorningComplete ? 100 : Math.round((R_current / morningTotal) * 100);

    // ค่าเปอร์เซ็นต์ของรอบบ่าย
    const afternoonReceived = isMorningComplete ? R_current - initialMorning : 0;
    const isAfternoonComplete = afternoonReceived >= initialAfternoon;
    const afternoonRemaining = isAfternoonComplete ? 0 : R_afternoon - afternoonReceived;
    const afternoonTotal = initialAfternoon;
    const afternoonPercentage = isAfternoonComplete ? 100 : (afternoonTotal > 0 ? Math.round((afternoonReceived / afternoonTotal) * 100) : 0);

    return (
        <>
            <Navber />
            <div className={styles.container}>
                <div className={styles.bg}>
                    <div className={styles.ContainRow0}>
                        <div className={styles.Overview}>
                            <div>ภาพรวม</div>
                        </div>
                        <div className={styles.row_0}>
                            <h>รับแล้ว(คน)</h>
                            <h>คงเหลือ(คน)</h>
                            <div>
                                {R_current}
                                <per1>{R_totalSum > 0 ? Math.round((R_current / (R_current + R_totalSum)) * 100) : 100}%</per1>
                            </div>
                            <div>
                                {R_totalSum}
                                <per1>{R_totalSum > 0 ? Math.round((R_totalSum / (R_current + R_totalSum)) * 100) : 0}%</per1>
                            </div>
                        </div>
                    </div>

                    <div className={styles.Container}>
                        <div className={styles.ContainAll}>
                            <div className={styles.TimeGnGfnTest}>
                                <div>รอบเช้า</div>
                            </div>
                            <div className={styles.row_1}>
                                <h>รับแล้ว</h>
                                <h_remain>คงเหลือ</h_remain>
                                <div>
                                    {isMorningComplete ? initialMorning : R_current}
                                    <per>{morningPercentage}%</per>
                                </div>
                                <div>
                                    {isMorningComplete ? 0 : R_morning}
                                    <per>{morningTotal > 0 ? Math.round((R_morning / morningTotal) * 100) : 0}%</per>
                                </div>
                            </div>
                        </div>

                        <div className={styles.ContainAll}>
                            <div className={styles.TimeGnGfnTest}>
                                <div>รอบบ่าย</div>
                            </div>
                            <div className={styles.row_1}>
                                <h>รับแล้ว</h>
                                <h_remain>คงเหลือ</h_remain>
                                <div>
                                    {isAfternoonComplete ? initialAfternoon : afternoonReceived}
                                    <per>{afternoonPercentage}%</per>
                                </div>
                                <div>
                                    {afternoonRemaining}
                                    <per>{afternoonTotal > 0 ? Math.round((afternoonRemaining / afternoonTotal) * 100) : 0}%</per>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* New Table for Faculty */}
                    <div className={styles.facultyTableContainer}>
                        <table className={styles.facultyTable}>
                            <thead>
                                <tr>
                                    <th>คณะ</th>
                                    <th>รับแล้ว</th>
                                    <th>คงเหลือ</th>
                                    <th className={styles.percentageGreen}>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facultyData.map((faculty, index) => {
                                    // คำนวณคณะก่อนหน้าทั้งหมด
                                    const previousTotal = facultyData.slice(0, index).reduce((acc, f) => acc + f.total, 0);
                                    const isPreviousComplete = R_current >= previousTotal;

                                    const received = isPreviousComplete ? Math.min(faculty.total, R_current - previousTotal) : 0;
                                    const remaining = faculty.total - received;
                                    const percentage = faculty.total > 0 ? Math.round((received / faculty.total) * 100) : 0;

                                    return (
                                        <tr key={faculty.idfaculty}>
                                            <td className={styles.dataFaculty}>{faculty.name}</td>
                                            <td className={styles.dataFaculty}>{received}</td>
                                            <td className={styles.dataFaculty}>{remaining}</td>
                                            <td className={styles.percentageGreen} >{percentage}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}