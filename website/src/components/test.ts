import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

function runPythonScript(scriptPath: string, av: string): Promise<any> {
	return new Promise((resolve, reject) => {
		// Create a temporary file path
		const tempFilePath = path.join(os.tmpdir(), 'python_result.json');
		// Execute the Python script, passing the temporary file path as an argument
		exec(`python3.11 ${scriptPath} ${av} ${tempFilePath}`, (error) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return reject(error);
			}
			// Read the temporary file to get the result
			fs.readFile(tempFilePath, 'utf8', (err, data) => {
				if (err) {
					console.error(`Error reading temporary file: ${err}`);
					return reject(err);
				}
				try {
					// Parse the JSON data
					const output = JSON.parse(data);
					resolve(output);
				} catch (parseError) {
					console.error(`Error parsing JSON: ${parseError}`);
					reject(parseError);
				} finally {
					// Clean up the temporary file
					fs.unlink(tempFilePath, (err) => {
						if (err) console.error(`Error deleting temporary file: ${err}`);
					});
				}
			});
		});
	});
}

export default runPythonScript;

// // Example usage
// const scriptPath = './test.py'; // Path to your Python script
// runPythonScript(scriptPath)
// 	.then(output => {
// 		// Use the output in your JavaScript code
// 		console.log(output);
// 	})
// 	.catch(error => console.error(error));

