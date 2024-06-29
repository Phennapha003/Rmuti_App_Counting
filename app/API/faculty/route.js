import { NextResponse } from "next/server";
import pool from "@/app/lib/mysql";

export async function GET(request) {
    try {
        const connection = await pool.getConnection();
        const query = `
            SELECT faculty.idfaculty, faculty.name, faculty.total, round.name AS rname
            FROM faculty
            JOIN round ON round.idround = faculty.idround
        `;
        const [rows] = await connection.execute(query);
        connection.release();
        return NextResponse.json({ faculty: rows });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { idfaculty } = await request.json();
        if (!idfaculty) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const connection = await pool.getConnection();
        const query = 'DELETE FROM faculty WHERE idfaculty = ?';
        const [result] = await connection.execute(query, [idfaculty]);
        connection.release();

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "No faculty member found with the given ID" }, { status: 404 });
        }

        return NextResponse.json({ message: "Faculty member deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function PUT(request) {
    try {
        const body = await request.json();
        console.log('Received update request:', body);

        const { id, name, total, rname } = body;
        if (!id || !name || !total || !rname) {
            return NextResponse.json({ error: "ID, name, total, and rname are required" }, { status: 400 });
        }

        const connection = await pool.getConnection();

        // Retrieve the specific idround based on the provided rname
        const selectRoundQuery = 'SELECT idround FROM round WHERE name = ? LIMIT 1';
        const [roundResult] = await connection.execute(selectRoundQuery, [rname]);

        if (roundResult.length === 0) {
            return NextResponse.json({ error: "No round found with the given name" }, { status: 404 });
        }

        const idround = roundResult[0].idround;

        // Update faculty using the selected idround
        const updateFacultyQuery = 'UPDATE faculty SET name = ?, total = ?, idround = ? WHERE idfaculty = ?';
        const [result] = await connection.execute(updateFacultyQuery, [name, total, idround, id]);
        connection.release();

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "No faculty member found with the given ID" }, { status: 404 });
        }

        return NextResponse.json({ message: "Faculty updated successfully" });

    } catch (error) {
        console.error('Error in PUT request:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}