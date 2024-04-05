export default function sortArrayByObjectKey<T>(arr: T, key: string): T {
  if (Array.isArray(arr))
    return arr.sort((a, b) => {
      const nameA = a[key].toUpperCase();
      const nameB = b[key].toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  return arr;
}
