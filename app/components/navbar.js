"use client"
import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from "@/app/styles/navbar.module.css" // Adjust the path accordingly
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from "next-auth/react"

function Nav() {
    const [click, setClick] = useState(false);
    const handelClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <div className={styles.logoContainer}>
                        <Image className={styles.logo} src="/images/Logo2.png" width={400} height={105} alt='logo' />
                    </div>
                    <ul className={click ? `${styles.menu} ${styles.active}` : styles.menu}>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/">นับจำนวน</Link>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/faculty">คณะ</Link>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/round">แถว</Link>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/report">ภาพรวม</Link>
                        <button onClick={() => signOut({ callbackUrl: '/login' })}>Sign out</button>
                    </ul>
                    <div className={styles.mobileMenu} onClick={handelClick}>
                        {click ? <FiX /> : <FiMenu />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Nav;