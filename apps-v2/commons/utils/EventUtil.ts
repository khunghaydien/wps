export default function dispatchEvent(
  name: string,
  properties: Record<string, any> = {}
) {
  const event = new CustomEvent(name, properties);
  window.dispatchEvent(event);
}
