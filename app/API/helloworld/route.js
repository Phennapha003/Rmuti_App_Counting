import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        return NextResponse.json({ message: 'hello world' })
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}