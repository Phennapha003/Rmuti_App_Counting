"use client";

import { useState, useEffect } from "react";
import Navber from "@/app/components/navbar";
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
            <Navber />
            <div className={styles.container}>
                <div>รายชื่อหน่วยงาน</div>
                <Handle_Click path="/add_department" buttonText="เพิ่ม" /> &nbsp;
                <Handle_Click path="/edit_add_department" buttonText="แก้ไข" />
                {loading ? (<div>Loading...</div>) : (
                    facultys.map((faculty) => (
                        <div key={faculty.idfaculty}>
                            {faculty.name} : &nbsp;
                            {faculty.total} ราย | &nbsp;
                            {faculty.rname}
                            <button onClick={() => handleDelete(faculty.idfaculty)}>ลบ</button>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
}