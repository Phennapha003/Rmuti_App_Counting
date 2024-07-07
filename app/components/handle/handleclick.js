"use client"
import { useRouter } from 'next/navigation';

function Handle_Click({ path, buttonText, className }) {
    const router = useRouter();
    const handle_Click = () => {
        // Navigate to the next page
        router.push(path);
    };
    return (
        <>
            <button className={className} onClick={handle_Click}>{buttonText}</button>
        </>
    );
}
export default Handle_Click;
