import { NextResponse } from "next/server";
import pool from "@/app/lib/mysql";

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://count-project-eta.vercel.app', // Your allowed origin
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, total, rname } = body;

        if (!name || !total || !rname) {
            return NextResponse.json({ error: "Name, total, and rname are required" }, { status: 400, headers: corsHeaders });
        }

        const connection = await pool.getConnection();

        const selectRoundQuery = 'SELECT idround FROM round WHERE name = ? LIMIT 1';
        const [roundResult] = await connection.execute(selectRoundQuery, [rname]);

        if (roundResult.length === 0) {
            connection.release();
            return NextResponse.json({ error: "No round found with the given name", roundName: rname }, { status: 404, headers: corsHeaders });
        }

        const idround = roundResult[0].idround;

        const insertFacultyQuery = 'INSERT INTO faculty (name, total, idround) VALUES (?, ?, ?)';
        await connection.execute(insertFacultyQuery, [name, total, idround]);

        connection.release();

        return NextResponse.json({ message: 'Faculty data inserted successfully' }, { headers: corsHeaders });

    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}