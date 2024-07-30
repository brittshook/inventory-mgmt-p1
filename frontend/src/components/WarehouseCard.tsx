type props = {
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  maxCapacity: number;
};

export const WarehouseCard = ({ name, city, state, maxCapacity }: props) => {
  return (
    <div>
      <p>Warehouse</p>
      <h2>{name}</h2>
      <p>{city}, {state}</p>
      <div className="utilization"></div>
    </div>
  );
};
