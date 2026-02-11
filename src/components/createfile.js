import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const componentName = process.argv[2]
if (!componentName) {
  console.error('Usage: node create-component.js MyComponent')
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filePath = path.join(__dirname, `${componentName}.vue`)

const template = `
<template>
  <div class="${componentName}">
    <h2>${componentName} Component</h2>
  </div>
</template>

<script setup lang="ts">
export default {
  name: "${componentName}"
};
</script>

<style scoped>
.${componentName} {
  padding: 1rem;
}
</style>
`

fs.writeFileSync(filePath, template.trim())
console.log(`Component ${componentName}.vue created at ${filePath}`)
