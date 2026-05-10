// One-time script: removes background from Anthony_Profile.jpg
// Run: node scripts/remove-bg.js
// Output: public/Anthony_Profile_cutout.png (transparent PNG, commit this file)

import { removeBackground } from '@imgly/background-removal-node'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const input = path.resolve(__dirname, '../public/Anthony_Profile.jpg')
const output = path.resolve(__dirname, '../public/Anthony_Profile_cutout.png')

console.log('Removing background (downloading model weights on first run)...')

const blob = await removeBackground(input)
const arrayBuffer = await blob.arrayBuffer()
fs.writeFileSync(output, Buffer.from(arrayBuffer))

console.log(`✓ ${output}`)
