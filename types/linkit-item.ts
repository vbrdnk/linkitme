export type LinkitItemSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type LinkitItemProps = {
  children: React.ReactNode;
  size?: LinkitItemSize;
  onSizeChange?: (size: LinkitItemSize) => void;
  onDelete?: () => void;
  className?: string;
  disabled?: boolean;
};
