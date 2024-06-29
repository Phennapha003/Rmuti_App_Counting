
import styles from "@/app/styles/report.module.css"
import Navbar from "@/app/components/navbar"
import Footer from "@/app/components/footer"

export default function gustUser() {

    return (
        <>
            {/* <div className={styles.ConHead}>
                <header className={styles.headers}>
                    <img src="images\header.png" height={90} alt="header" />
                </header>
            </div> */}
            <Navbar />
            <div className={styles.bg}>
                <div className={styles.ContainRow0}>
                    <div className={styles.Overview}>
                        <div>ภาพรวม</div>
                    </div>
                    <div className={styles.row_0}>
                        <h>รับแล้ว(คน)</h>
                        <h>คงเหลือ(คน)</h>
                        <div>2831
                            <per1>100%</per1>
                        </div>
                        <div>0
                            <per1>100%</per1>
                        </div>
                    </div>
                </div>

                <div className={styles.Container}>
                    <div className={styles.ContainAll}>
                        <div className={styles.TimeGnGfnTest}>
                            <div>รอบเช้า</div>
                        </div>
                        <div className={styles.row_1}>
                            <h>จำนวน</h>
                            <h_remain>คงเหลือ</h_remain>
                            <div>1728
                                <per>100%</per>
                            </div>
                            <div>0
                                <per>100%</per>
                            </div>
                        </div>
                    </div>

                    <div className={styles.ContainAll}>
                        <div className={styles.TimeGnGfnTest}>
                            <div>รอบบ่าย</div>
                        </div>
                        <div className={styles.row_1}>
                            <h>จำนวน</h>
                            <h_remain>คงเหลือ</h_remain>
                            <div>1758
                                <per>100%</per>
                            </div>
                            <div>0
                                <per>100%</per>
                            </div>
                        </div>
                    </div>

                    <div className={styles.containFacultyName}>
                        <div className={styles.FacultyName}>
                            <h>คณะ</h>
                            <div>วิทยาศาสตร์และศิลปศาสตร์</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
