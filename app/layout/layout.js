import styles from "../styles/loginlayout.module.css"
export default function Layout({ children }) {
    return (
        <div className={styles.backdrop}>
            <div className={styles.box}>
                <div className={styles.img}></div>
                <div className={styles.boxright}>
                    <div className={styles.text}>
                        {children}
                    </div>

                </div>
            </div>
        </div>
    )
}