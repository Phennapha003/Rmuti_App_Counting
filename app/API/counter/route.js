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

        // Fetch morning and afternoon rounds separately
        const morningQuery = "SELECT sum(total) as totalSum FROM counter.round WHERE idround IN (1, 2)";
        const afternoonQuery = "SELECT sum(total) as totalSum FROM counter.round WHERE idround IN (3, 4)";
        const [morningRows] = await connection.execute(morningQuery);
        const [afternoonRows] = await connection.execute(afternoonQuery);

        connection.release();

        return NextResponse.json({
            count: countRows,
            total: totalRows,
            morning: morningRows[0].totalSum,
            afternoon: afternoonRows[0].totalSum
        });

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { current } = body;

        if (current === undefined) {
            return NextResponse.json({ error: "Missing required field (current)" }, { status: 400 });
        }

        const connection = await pool.getConnection();
        const query = 'UPDATE counter SET current = ? WHERE idcounter = 1'; // Assuming you are updating the record with idcount = 1
        const [result] = await connection.execute(query, [current]);
        connection.release();

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: `Counter not found` }, { status: 404 });
        }

        return NextResponse.json({ message: `Counter updated successfully` });
    } catch (error) {
        console.error("Error updating counter:", error);
        return NextResponse.json({ error: "Failed to update counter" }, { status: 500 });
    }
}