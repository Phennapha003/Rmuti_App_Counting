"use client"
import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from "@/app/styles/navbar.module.css";
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from "next-auth/react";

function Nav() {
    const { data: session } = useSession();
    const [click, setClick] = useState(false);
    const handelClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);



    const handleSignOut = async () => {
        await signOut({
            callbackUrl: '/login',
            redirect: true,
        });
    };

    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <div className={styles.logoContainer}>
                        <Image className={styles.logo} src="/images/Logo2.png" width={400} height={105} alt='logo' priority />
                    </div>
                    <ul className={click ? `${styles.menu} ${styles.active}` : styles.menu}>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/count">นับจำนวน</Link>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/faculty">คณะ</Link>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/round">รอบ</Link>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/report">ภาพรวม</Link>
                        <Link className={styles.menuLink} onClick={closeMobileMenu} href="/sendnotify" target="_blank">sendNotify</Link>
                        <div className={styles.signOutContainer}>
                            {session && <span className={styles.username}>{session.user.name} </span>}
                            <button className={styles.button} onClick={handleSignOut}>Sign out</button>
                        </div>
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