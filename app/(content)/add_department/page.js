'use client'
    ; import { useState } from 'react';
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import postData from "@/app/components/CLUD/post";
import Handle_Click from "@/app/components/handle/handleclick";
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/add_department.module.css';

export default function AddDepartment() {
    const [name, setName] = useState('');
    const [total, setTotal] = useState('');
    const [rname, setRname] = useState('');
    const roundOptions = ["เช้า ช่วง 1", "เช้า ช่วง 2", "บ่าย ช่วง 1", "บ่าย ช่วง 2"];
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const departmentData = { name, total, rname };
        console.log('Department data:', departmentData); // ตรวจสอบค่า rname ที่ถูกส่งไปยัง API

        try {
            const result = await postData('add_department', departmentData);
            console.log('Department added successfully:', result);
            // Optionally reset form fields or handle success
            setName('');
            setTotal('');
            setRname('');
        } catch (error) {
            console.error('Error adding department:', error);
            // Handle error case
        }
        router.push("/faculty");
    };


    return (
        <div>
            <Navbar />
            <div className={styles.BodyContainer}>
                <h1>เพิ่มหน่วยงาน</h1>
                <form onSubmit={handleSubmit} className={styles.containerForm}>
                        <div className={styles.nameFaculty}>
                            หน่วยงาน : &nbsp;
                            <input className={styles.input}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.number}>
                            จำนวนเข้ารับ : &nbsp;
                            <input
                                type="number"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.round}>
                            รอบ : &nbsp;
                            <select value={rname} onChange={(e) => setRname(e.target.value)} required>
                                <option value="">เลือกรอบ</option>
                                {roundOptions.map((option, i) => (
                                    <option key={i} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit">บันทึก</button>

                    </form>
                
                <Handle_Click path="/faculty" buttonText="ย้อนกลับ" />
            </div>
            <Footer />
        </div>
    );
}