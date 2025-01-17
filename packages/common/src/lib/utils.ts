export function convertToKebabCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // Insert hyphen between lowercase letter or number and uppercase letter
    .toLowerCase() // Convert the entire string to lowercase
}