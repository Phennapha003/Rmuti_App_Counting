import { NextResponse } from "next/server";
import pool from "@/app/lib/mysql";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, total, rname } = body;

        if (!name || !total || !rname) {
            return NextResponse.json({ error: "Name, total, and rname are required" }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // Check if round with the given rname exists
        const selectRoundQuery = 'SELECT idround FROM round WHERE name = ? LIMIT 1';
        const [roundResult] = await connection.execute(selectRoundQuery, [rname]);

        if (roundResult.length === 0) {
            connection.release();
            return NextResponse.json({ error: "No round found with the given name", roundName: rname }, { status: 404 });
        }

        const idround = roundResult[0].idround;

        // Insert faculty data with idround
        const insertFacultyQuery = 'INSERT INTO faculty (name, total, idround) VALUES (?, ?, ?)';
        await connection.execute(insertFacultyQuery, [name, total, idround]);

        connection.release();

        return NextResponse.json({ message: 'Faculty data inserted successfully' });

    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}