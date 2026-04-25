import { spawn } from 'node:child_process'

const args = ['--model=gemini-3.1-pro-preview', '--prompt=hello world']

// Thử 1: shell: true
const p1 = spawn('gemini', args, { shell: true, windowsHide: true })
p1.stdout.on('data', d => console.log('p1 stdout:', d.toString()))
p1.stderr.on('data', d => console.log('p1 stderr:', d.toString()))
p1.on('close', code => console.log('p1 close:', code))

// Thử 2: shell: powershell.exe
const p2 = spawn('powershell.exe', ['-NoProfile', '-Command', 'gemini', ...args.map(a => `'${a.replace(/'/g, "''")}'`)], { shell: false, windowsHide: true })
p2.stdout.on('data', d => console.log('p2 stdout:', d.toString()))
p2.stderr.on('data', d => console.log('p2 stderr:', d.toString()))
p2.on('close', code => console.log('p2 close:', code))
