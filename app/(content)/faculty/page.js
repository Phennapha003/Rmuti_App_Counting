"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import Handle_Click from "@/app/components/handle/handleclick";
import getData from "@/app/components/CLUD/get";
import deleteData from "@/app/components/CLUD/delete";
import styles from '@/app/styles/faculty.module.css';

export default function Faculty() {
    const [facultys, setFacultys] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const param = "faculty";
            const data = await getData(param);
            if (data && data.faculty) {
                setFacultys(data.faculty); // ต้องมี rname ในข้อมูลที่ได้รับมา
            }
        } catch (error) {
            console.error("Error fetching faculty data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (idfaculty) => {
        try {
            setLoading(true);
            await deleteData(idfaculty);
            setFacultys(facultys.filter(faculty => faculty.idfaculty !== idfaculty));
        } catch (error) {
            console.error("Error deleting faculty:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.ContainerTopic} >รายชื่อหน่วยงาน</div>
                {loading ? (<div>Loading...</div>) :
                    (<div className={styles.containerTable}>
                        <table className={styles.table}>
                            <thead>
                                <tr className={styles.tr}>
                                    <th className={styles.th}>บัณฑิตศึกษา</th>
                                    <th className={styles.th}>จำนวน</th>
                                    <th className={styles.th}>รอบ</th>
                                    <th className={styles.th}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {facultys.map((faculty) => (
                                    <tr className={styles.tr} key={faculty.idfaculty}>
                                        <td className={styles.td}>{faculty.name}</td>
                                        <td className={styles.td}>{faculty.total} ราย</td>
                                        <td className={styles.td}>{faculty.rname}</td>
                                        <td className={styles.td}>
                                            <button className={styles.ButtonDelete} onClick={() => handleDelete(faculty.idfaculty)}>ลบ</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}
                <div className={styles.stylesButton}>
                    <Handle_Click path="/add_department" buttonText="เพิ่ม" /> &nbsp;
                    <Handle_Click path="/edit_add_department" buttonText="แก้ไข" />
                </div>
            </div>
            <Footer />
        </div>
    );
}