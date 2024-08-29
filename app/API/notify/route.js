import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { message, reportData } = await request.json();
        const token = process.env.LINE_NOTIFY_TOKEN;

        if (!message || !reportData) {
            return NextResponse.json({ error: "Missing required fields (message or reportData)" }, { status: 400 });
        }

        const facultyDetails = reportData.facultyData.map(f =>
            `${f.name}:\nรับแล้ว: ${f.received}, คงเหลือ: ${f.remaining}, ${f.percentage}%`
        ).join('\n');

        const notificationMessage =
            `${message}\n\n` +
            `ภาพรวม\nรับแล้ว: ${reportData.current}\n` +
            `คงเหลือ: ${reportData.totalSum - reportData.current}\n` +
            `เปอร์เซ็นต์: ${reportData.overviewPercentage}%\n` +
            `----------------------\n` +
            `รอบเช้า\nรับแล้ว: ${reportData.current >= reportData.morning ? reportData.morning : Math.max(reportData.current, 0)}\n` +
            `คงเหลือ: ${reportData.remainingMorning}\n` +
            `เปอร์เซ็นต์: ${reportData.morningPercentage}%\n` +
            `----------------------\n` +
            `รอบบ่าย\nรับแล้ว: ${reportData.current >= reportData.morning ? Math.max(reportData.current - reportData.morning, 0) : 0}\n` +
            `คงเหลือ: ${reportData.remainingAfternoon}\n` +
            `เปอร์เซ็นต์: ${reportData.afternoonPercentage}%\n` +
            `----------------------\n` +
            `คณะ\n${facultyDetails}`;

        const response = await fetch('https://notify-api.line.me/api/notify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ message: notificationMessage })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to send notification: ${errorData.message}`);
        }

        return NextResponse.json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}