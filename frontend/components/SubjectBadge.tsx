// components/SubjectBadge.tsx

import { X } from "lucide-react"; // Example icon

interface SubjectBadgeProps {
  subject: string;
  onClick?: () => void;
  isRemovable?: boolean; // Optional prop to show a remove icon
}

const SubjectBadge = ({
  subject,
  onClick,
  isRemovable = false,
}: SubjectBadgeProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center h-fit gap-1.5 cursor-pointer rounded-full px-3 py-1 text-sm font-semibold transition-colors
        ${
          isRemovable
            ? "bg-black text-white hover:bg-black/80"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
    >
      {subject}
      {isRemovable && <X className="h-3 w-3" />}
    </button>
  );
};

export default SubjectBadge;
