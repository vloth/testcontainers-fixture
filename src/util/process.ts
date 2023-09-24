import { spawn } from 'child_process'

export const makeRun = ({out, err} =
{out: process.stdout.write, err: process.stderr.write}) =>
	(command: string[], env: Record<string, string> = {}) => {
		return new Promise((resolve) => {
			const [cmd, ...args] = command
			const child = spawn(cmd, args, { env })

			child.stdout.on('data', c => out(String(c)))
			child.stderr.on('data', c => err(String(c)))

			child.on('close', (code) => resolve(code))
		})
	}

