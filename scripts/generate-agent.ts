import fs from 'fs'

const name = process.argv[2]
if (!name) throw new Error('Please specify agent name.')

const content = `export const ${name} = {
  id: "${name.toLowerCase()}",
  name: "${name}",
  ...
};`

fs.writeFileSync(`agents/${name.toLowerCase()}.ts`, content)
