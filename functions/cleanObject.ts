export default function cleanObject(obj: Object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => !(value === null || value === undefined))
  );
}
