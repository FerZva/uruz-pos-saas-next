import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../../../components/ui/card";

interface CashRegisterCardProps {
  id: string;
  name: string;
  status: string;
  balance: number;
}

const CashRegisterCard: React.FC<CashRegisterCardProps> = ({
  id,
  name,
  status,
  balance,
}) => {
  return (
    <Card className="m-4 p-4 shadow-lg">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>ID: {id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Status: {status}</p>
        <p>Balance: ${balance.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

const CashRegisterList: React.FC<{ registers: CashRegisterCardProps[] }> = ({
  registers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {registers.map((register) => (
        <CashRegisterCard key={register.id} {...register} />
      ))}
    </div>
  );
};

export default CashRegisterList;
