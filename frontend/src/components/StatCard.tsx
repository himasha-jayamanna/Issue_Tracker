interface Props {
  title: string;
  count: number;
  color: "blue" | "yellow" | "green";
}

const StatCard = ({ title, count, color }: Props) => {
  const colorMap = {
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    green: "text-green-600",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <p className="text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>
        {count}
      </p>
    </div>
  );
};

export default StatCard;
