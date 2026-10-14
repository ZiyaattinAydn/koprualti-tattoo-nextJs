// Node interaction tests need class names, not the browser's compiled CSS.
export async function load(url, context, nextLoad) {
  if (url.endsWith(".module.css")) {
    return {
      format: "module",
      shortCircuit: true,
      source: "export default new Proxy({}, { get: (_, name) => name });",
    };
  }
  return nextLoad(url, context);
}
