// kebab-case（短横线）转 camelCased（驼峰）
export function toHump(str: string) {
  return str.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

// camelCased（驼峰）转 kebab-case（短横线）
export function toLine(str: string) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .slice(1)
}
