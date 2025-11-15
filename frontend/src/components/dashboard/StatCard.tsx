import { Card, CardContent } from "../ui/card";
import { useThemeStore } from "../../stores/theme";

type StatCardProps = {
  title: string;
  value: string;
  description?: string;
};

const StatCard = ({ title, value, description }: StatCardProps) => {
  const { theme } = useThemeStore();
  
  return (
    <Card className={`hover:border-neon-purple/50 ${
      theme === "dark"
        ? "border-neon-cyan/30 bg-[#1A1A2E]"
        : "border-gray-200 bg-white"
    }`}>
      <CardContent className="p-5 sm:p-6">
        <p className={`text-base sm:text-sm font-semibold mb-3 sm:mb-2 ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>{title}</p>
        <p className="text-4xl sm:text-3xl font-black gradient-text leading-none">{value}</p>
        {description ? (
          <p className={`mt-3 sm:mt-2 text-sm sm:text-xs font-medium ${
            theme === "dark" ? "text-gray-500" : "text-gray-600"
          }`}>{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default StatCard;
