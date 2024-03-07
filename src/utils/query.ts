export const validStrQuery = (
  item: unknown,
  { minLength, maxLength }: { minLength: number; maxLength: number }
): item is string => {
  return Boolean(
    item &&
      typeof item === "string" &&
      item.trim().length >= minLength &&
      item.trim().length <= maxLength
  );
};

export const validNumberQuery = (
  item: unknown,
  { min, max }: { min: number; max: number }
): item is string => {
  if (typeof item === "string") {
    const parsed = parseInt(item);
    if (isNaN(parsed)) return false;
    if (parsed < min || parsed > max) return false;
    return true;
  }
  return false;
};

export const validOrderQuery = (order: unknown) => {
  return order === "asc" ? 1 : -1;
};

export const validEnumQuery = (
  item: unknown,
  list: string[]
): item is string => {
  return list.includes(item as string);
};

export const rangeQuery = (
  minValue: unknown,
  maxValue: unknown,
  { min, max }: { min: number; max: number },
  fieldName: string,
  filter: any
) => {
  const validMin = validNumberQuery(minValue, { min, max });
  const validMax = validNumberQuery(maxValue, { min, max });
  if (validMin || validMax) {
    if (validMin && validMax)
      if (parseInt(minValue) > parseInt(maxValue)) return;
    filter[fieldName] = {};
    if (validMin) filter[fieldName]["$gte"] = parseInt(minValue);
    if (validMax) filter[fieldName]["$lte"] = parseInt(maxValue);
  }
};

export const rangeDateQuery = (
  minDate: unknown,
  maxDate: unknown,
  fieldName: string,
  filter: any
) => {
  const min = new Date(minDate as string);
  const max = new Date(maxDate as string);
  if (!isNaN(min.valueOf()) || !isNaN(max.valueOf())) {
    if (!isNaN(min.valueOf()) && !isNaN(max.valueOf())) if (min > max) return;
    filter[fieldName] = {};
    if (!isNaN(min.valueOf())) filter[fieldName]["$gte"] = minDate;
    if (!isNaN(max.valueOf())) filter[fieldName]["$lte"] = maxDate;
  }
};
