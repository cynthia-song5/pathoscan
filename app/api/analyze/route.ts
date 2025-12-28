import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
    try {
        const { image, corners } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Remove the data:image/jpeg;base64, prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        // ROI corners as JSON string
        const cornersArg = corners ? JSON.stringify(corners) : "";

        const scriptsDir = path.join(process.cwd(), "scripts");
        const venvPython = path.join(process.cwd(), "venv", "bin", "python3");
        const scriptPath = path.join(scriptsDir, "analyze_strip.py");

        if (!fs.existsSync(scriptPath)) {
            return NextResponse.json({ error: "Analysis script not found" }, { status: 500 });
        }

        // Execute Python script
        // Note: For very large images, we might want to save to a temp file first
        // But for PathoStrips, base64 argument should be okay if not exceeding OS limits.
        // If it's too large, we should write to a temp file and pass path.

        return new Promise((resolve) => {
            const command = `"${venvPython}" "${scriptPath}" "${base64Data}" ${cornersArg ? `'${cornersArg}'` : ""}`;

            const pythonProcess = exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("Python Error:", stderr);
                    resolve(NextResponse.json({ error: "Failed to run analysis", details: stderr }, { status: 500 }));
                    return;
                }

                try {
                    const result = JSON.parse(stdout);
                    resolve(NextResponse.json(result));
                } catch (e) {
                    console.error("Parse Error:", stdout);
                    resolve(NextResponse.json({ error: "Failed to parse analysis results", details: stdout }, { status: 500 }));
                }
            });
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
