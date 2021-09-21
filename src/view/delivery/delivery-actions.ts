export const inspectDeliveryDate = (): DeliveryDateRange => {
  const now: Date = new Date();
  const from = new Date();
  const to = new Date();
  from.setDate(now.getDate() + 3);
  to.setDate(now.getDate() + 7);
  return {from: new Date(from), to: new Date(to)};
};

export type DeliveryDateRange = {from: Date; to: Date};
