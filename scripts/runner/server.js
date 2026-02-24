import express, { json } from 'express';
import cors from 'cors';
import { exec } from 'node:child_process';
import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

const app = express();
app.use(cors());
app.use(json({ limit: '50kb' }));

// The directory where temporary code files will be stored
const CODE_DIR = '/app/code';

// Security: Expected Auth Token (Read from environment, defaults to empty)
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

app.post('/execute', async (req, res) => {
    // 1. Authenticate Request
    const providedToken = req.headers['x-auth-token'] || req.headers['authorization'];
    if (AUTH_TOKEN && providedToken !== AUTH_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: 'Missing language or code' });
    }

    // 2. Prepare Sandbox Environment
    // Generate a unique ID for this execution run
    const runId = randomBytes(16).toString('hex');
    let fileName = '';
    let command = '';

    // Determine file extension and execution command based on language
    switch (language.toLowerCase()) {
        case 'python':
            fileName = `${runId}.py`;
            // Execute directly with python3
            command = `python3 ${CODE_DIR}/${fileName}`;
            break;
        case 'typescript':
        case 'ts':
            fileName = `${runId}.ts`;
            // Use ts-node for instant TypeScript execution
            command = `ts-node ${CODE_DIR}/${fileName}`;
            break;
        case 'rust':
            fileName = `${runId}.rs`;
            const exeName = `${runId}_bin`;
            // Rust requires compilation first, then execution
            command = `rustc ${CODE_DIR}/${fileName} -o ${CODE_DIR}/${exeName} && ${CODE_DIR}/${exeName}`;
            break;
        default:
            return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    const filePath = join(CODE_DIR, fileName);

    try {
        // 3. Write code to file
        // Base64 decode the incoming code (Vercel sends it encoded for safety)
        const decodedCode = Buffer.from(code, 'base64').toString('utf8');
        await writeFile(filePath, decodedCode, 'utf8');

        // 4. Execute Code (Sandboxed to restricted user 'runneruser')
        // We use a 3000ms timeout to prevent infinite loops from hanging the server
        exec(`su -c "${command}" runneruser`, { timeout: 3000 }, async (error, stdout, stderr) => {
            
            // 5. Cleanup temporary files immediately
            try {
                await unlink(filePath);
                if (language === 'rust') {
                    await unlink(join(CODE_DIR, `${runId}_bin`)).catch(() => {});
                }
            } catch (cleanupErr) {
                console.error("Cleanup error:", cleanupErr);
            }

            // 6. Return response matching the expected format of our Next.js backend
            // Encode stdout and stderr back to base64 for safe transport to Vercel
            const safeStdout = Buffer.from(stdout || '').toString('base64');
            let safeStderr = '';
            
            if (error) {
                if (error.killed) {
                    safeStderr = Buffer.from("Execution Timed Out (3 seconds max)").toString('base64');
                } else {
                    safeStderr = Buffer.from(stderr || error.message || '').toString('base64');
                }
                return res.json({ success: false, stdout: safeStdout, stderr: safeStderr, compile_output: null, message: null, status: { id: 4, description: 'Error' } });
            }

            safeStderr = Buffer.from(stderr || '').toString('base64');
            return res.json({ success: true, stdout: safeStdout, stderr: safeStderr, compile_output: null, message: null, status: { id: 3, description: 'Accepted' } });
        });

    } catch (err) {
        return res.status(500).json({ error: 'Failed to process execution', details: err.message });
    }
});

// Simple healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = 2358;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CodeAlchemist Zero-Bloat Runner started on port ${PORT}`);
});