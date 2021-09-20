export const inspectDeliveryDate = (): DeliveryDateRange => {
  const d: Date = new Date();
  const from = d.getDate() + 3;
  const to = d.getDate() + 7;
  return {from: new Date(from), to: new Date(to)};
};

export type DeliveryDateRange = {from: Date; to: Date};
