// api/round/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/lib/mysql";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        const connection = await pool.getConnection();

        let totalQuery = "";
        if (type === 'morning') {
            totalQuery = "SELECT 'morning', sum(total) as totalSum FROM counter.round WHERE idround IN (1, 2)";
        } else if (type === 'afternoon') {
            totalQuery = "SELECT 'after', sum(total) as totalSum FROM counter.round WHERE idround IN (3, 4)";
        } else {
            totalQuery = "SELECT 'all', sum(total) as totalSum FROM counter.round";
        }
        const [totalRows] = await connection.execute(totalQuery);

        const countQuery = 'SELECT current FROM counter';
        const [countRows] = await connection.execute(countQuery);

        connection.release();

        return NextResponse.json({ count: countRows, total: totalRows });

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}