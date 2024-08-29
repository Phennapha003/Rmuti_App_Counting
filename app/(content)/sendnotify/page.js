/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from 'react';
import MetaRefresh from '@/app/components/meta_refresh';
import getData from '@/app/components/CLUD/get';

export default function SendNotification() {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [notificationSent, setNotificationSent] = useState(false); // ตัวแปรสถานะใหม่

    const fetchDataAndSendNotification = async () => {
        try {
            const counterData = await getData('counter');
            const faculty = await getData('faculty');

            let current = 0;
            let morning = 0;
            let afternoon = 0;
            let totalSum = 0;
            let facultyData = [];

            if (counterData.count && counterData.count.length > 0) {
                current = counterData.count[0].current;
                morning = counterData.morning || 0;
                afternoon = counterData.afternoon || 0;
                totalSum = counterData.total[0].totalSum || 0;
            }

            if (faculty && faculty.faculty) {
                facultyData = faculty.faculty.map((f, index) => {
                    const previousTotal = faculty.faculty.slice(0, index).reduce((acc, f) => acc + f.total, 0);
                    const isPreviousComplete = current >= previousTotal;
                    const received = isPreviousComplete ? Math.min(f.total, current - previousTotal) : 0;
                    const remaining = f.total - received;
                    const percentage = f.total > 0 ? Math.round((received / f.total) * 100) : 0;

                    return {
                        ...f,
                        received,
                        remaining,
                        percentage
                    };
                });
            }

            const remainingMorning = Math.max(morning - current, 0);
            const remainingAfternoon = Math.max(afternoon - Math.max(current - morning, 0), 0);

            const overviewPercentage = totalSum > 0 ? Math.round((current / totalSum) * 100) : 100;
            const morningPercentage = morning > 0 ? (current >= morning ? 100 : Math.round((current / morning) * 100)) : 100;
            const afternoonReceived = current >= morning ? Math.max(current - morning, 0) : 0;
            const afternoonPercentage = afternoon > 0 ? (afternoonReceived >= afternoon ? 100 : Math.round((afternoonReceived / afternoon) * 100)) : 0;

            // ตรวจสอบว่ามีการส่ง Notification แล้วหรือยัง
            if (!notificationSent) {
                const res = await fetch('/api/notify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: 'Page refreshed',
                        reportData: {
                            current,
                            totalSum,
                            overviewPercentage,
                            morning,
                            remainingMorning,
                            morningPercentage,
                            afternoon,
                            remainingAfternoon,
                            afternoonPercentage,
                            facultyData,
                        }
                    }),
                });
                const result = await res.json();
                if (res.ok) {
                    setResponse(result.message);
                    setError(null);
                    setNotificationSent(true); // ตั้งค่าให้ Notification ถูกส่งแล้ว
                } else {
                    setResponse(null);
                    setError(result.error);
                }
            }
        } catch (err) {
            setResponse(null);
            setError('Failed to send notification');
        }
    };

    useEffect(() => {
        fetchDataAndSendNotification();
        const interval = setInterval(() => {
            setNotificationSent(false); // Reset ค่าสถานะเมื่อครบเวลา 3 นาที
            fetchDataAndSendNotification();
        }, 180000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <MetaRefresh interval="180" />
            <h1>Send Notification</h1>
            {response && <p>Notification sent successfully!</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}