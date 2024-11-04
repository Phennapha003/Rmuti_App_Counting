"use client";
import { useEffect, useState } from 'react';
import Head from "next/head";
import Layout from "../layout/layout";
import styles from "../styles/login.module.css";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (session) {
            router.push('/faculty');
        }
    }, [session, status, router]);

    const handleLogin = async () => {
        setLoading(true);

        try {
            await signOut({ redirect: false }); // ทำการ sign out ก่อน

            await signIn("google", {
                callbackUrl: "/faculty",
                prompt: "select_account",
            });
        } catch (error) {
            console.error("Unexpected error occurred during sign in:", error);
            router.push('/unauthorized');
        } finally {
            setLoading(false);
        }
    };


    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <Head>
                <title>Login</title>
            </Head>
            <div className={styles.logo}>
                <Image src="/logoRmuti.png" width={130} height={250} alt="RMUTI logo" />
            </div>
            <section className={styles.group}>
                <div className={styles.title}>
                    <h1 className={styles.message_title}>Login</h1>
                    <p>Welcome to Royal Graduation Ceremony Rajamangala University Of Technology Isan</p>
                </div>
                {error === 'AccessDenied' && (
                    <div className={styles.error}>
                        <p>คุณไม่มีสิทธิ์ในการเข้าถึง กรุณากรอกอีเมลใหม่</p>
                    </div>
                )}
                {error && error !== 'AccessDenied' && (
                    <div className={styles.error}>
                        <p>การเข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง</p>
                    </div>
                )}
                <div>
                    <button
                        className={styles.google}
                        type="button"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        <Image src="/google.png" width={30} height={20} alt="Google Logo" />
                        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย Google"}
                    </button>
                </div>
            </section>
        </Layout>
    );
}