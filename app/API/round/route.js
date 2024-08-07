import { NextResponse } from "next/server";
import pool from "@/app/lib/mysql";

export async function GET(request) {
    try {
        const connection = await pool.getConnection();
        const query = `
            SELECT round.idround, round.name, COALESCE(SUM(faculty.total), 0) as total
            FROM round
            LEFT JOIN faculty ON round.idround = faculty.idround
            GROUP BY round.idround, round.name
        `;
        const [rows] = await connection.execute(query);
        connection.release();
        return NextResponse.json({ round: rows });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, name, total } = body;

        if (!id || !name || total === undefined) {
            return NextResponse.json({ error: "Missing required fields (id, name, total)" }, { status: 400 });
        }

        const connection = await pool.getConnection();
        const query = 'UPDATE round SET name = ?, total = ? WHERE idround = ?';
        const [result] = await connection.execute(query, [name, total, id]);
        connection.release();

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: `Round with ID ${id} not found` }, { status: 404 });
        }

        return NextResponse.json({ message: `Round with ID ${id} updated successfully` });
    } catch (error) {
        console.error("Error updating round:", error);
        return NextResponse.json({ error: "Failed to update round" }, { status: 500 });
    }
}